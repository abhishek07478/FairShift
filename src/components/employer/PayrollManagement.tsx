import React, { useState } from 'react';
import { 
  DollarSign, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PayrollManagement: React.FC = () => {
  const { 
    industry, 
    workers, 
    payrollRecords, 
    approvePayroll, 
    wageConfigs, 
    updateWageConfig, 
    generatePayrollForWorker,
    language 
  } = useApp();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [multiplierInput, setMultiplierInput] = useState(
    wageConfigs[industry]?.overtimeMultiplier || 1.5
  );
  const [hazardInput, setHazardInput] = useState(
    wageConfigs[industry]?.hazardPayDaily || (industry === 'construction' ? 150 : 100)
  );

  const industryWorkers = workers.filter(w => w.industry === industry);

  // Compute or gather current payroll per worker
  const activePayrolls = industryWorkers.map(w => {
    const existing = payrollRecords.find(p => p.workerId === w.id);
    return existing || generatePayrollForWorker(w.id);
  });

  const totalGross = activePayrolls.reduce((acc, p) => acc + p.grossPay, 0);
  const totalNet = activePayrolls.reduce((acc, p) => acc + p.netPay, 0);
  const totalOvertimePayout = activePayrolls.reduce((acc, p) => acc + p.overtimePay, 0);
  const totalDeductions = activePayrolls.reduce(
    (acc, p) => acc + p.deductions.providentFund + p.deductions.employeeStateInsurance, 0
  );

  const handleSaveConfig = () => {
    updateWageConfig(industry, {
      overtimeMultiplier: Number(multiplierInput),
      hazardPayDaily: Number(hazardInput),
    });
    setIsConfigOpen(false);
    // Recalculate for active workers
    industryWorkers.forEach(w => generatePayrollForWorker(w.id));
  };

  const handleExportCsv = () => {
    const headers = [
      'Worker ID', 'Worker Name', 'Period Start', 'Period End',
      'Regular Hours', 'Regular Rate', 'Regular Pay',
      'Overtime Hours', 'Overtime Rate', 'Overtime Pay',
      'Hazard Allowance', 'Gross Pay', 'PF (6%)', 'ESI (1.5%)',
      'Net Pay', 'Status'
    ];

    const rows = activePayrolls.map(p => [
      p.workerId,
      `"${p.workerName}"`,
      p.periodStart,
      p.periodEnd,
      p.regularHours,
      p.regularRate,
      p.regularPay,
      p.overtimeHours,
      p.overtimeRate,
      p.overtimePay,
      p.hazardAllowance,
      p.grossPay,
      p.deductions.providentFund,
      p.deductions.employeeStateInsurance,
      p.netPay,
      p.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FairShift_Payroll_${industry}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-teal-400" />
            <span>{language === 'ta' ? 'ஊதிய & சம்பள மேலாண்மை' : 'Payroll Management & Wage Audit'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            Transparently compute, review, and approve workforce earnings according to recorded hours and statutory overtime standards.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>Configure Wage Rules</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Config Drawer / Section (if opened) */}
      {isConfigOpen && (
        <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Wage Configuration: {industry === 'construction' ? 'Construction Sites' : 'Campus Facilities'}</span>
            </h3>
            <button
              onClick={() => setIsConfigOpen(false)}
              className="text-slate-400 hover:text-white font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Overtime Multiplier Factor:
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={multiplierInput}
                onChange={(e) => setMultiplierInput(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard under ILO: 1.5× base hourly rate.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Daily Site / Hazard Allowance (₹/day):
              </label>
              <input
                type="number"
                value={hazardInput}
                onChange={(e) => setHazardInput(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Paid to staff operating in certified hazard or heavy sanitation zones.
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-4 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Save & Recalculate Payroll
            </button>
          </div>
        </div>
      )}

      {/* Aggregate Payroll Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Total Net Payable</span>
          <div className="text-2xl font-black text-white mt-1">₹{totalNet.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-teal-400 mt-1">For {activePayrolls.length} Registered Staff</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-amber-400">Total Overtime Pay</span>
          <div className="text-2xl font-black text-amber-300 mt-1">₹{totalOvertimePayout.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-amber-400 mt-1">Calculated at 1.5× rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Gross Total Wages</span>
          <div className="text-2xl font-black text-white mt-1">₹{totalGross.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-1">Before statutory deductions</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Total Statutory Deductions</span>
          <div className="text-2xl font-black text-red-400 mt-1">-₹{totalDeductions.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-1">PF (6%) & ESI (1.5%) Escrow</div>
        </div>
      </div>

      {/* Payroll Approval Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">Current Period Payroll Ledger</h2>
          </div>
          <span className="text-xs text-slate-400">
            Notice: Amounts unapproved are marked as <span className="text-amber-400 font-semibold">Estimates</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Worker</th>
                <th className="pb-3 px-3">Regular Hrs</th>
                <th className="pb-3 px-3">Overtime (1.5×)</th>
                <th className="pb-3 px-3">Allowances</th>
                <th className="pb-3 px-3">Deductions</th>
                <th className="pb-3 px-3">Net Take-Home</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {activePayrolls.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-bold text-white">
                    <div>{p.workerName}</div>
                    <div className="text-[10px] font-mono text-slate-500">₹{p.regularRate}/hr</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-200">{p.regularHours}h</span>
                    <div className="text-[10px] text-slate-400">₹{p.regularPay}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-amber-400">+{p.overtimeHours}h</span>
                    <div className="text-[10px] text-amber-300 font-mono">₹{p.overtimePay}</div>
                  </td>
                  <td className="py-3 px-3 text-cyan-300">
                    ₹{p.hazardAllowance}
                  </td>
                  <td className="py-3 px-3 text-red-400">
                    -₹{p.deductions.providentFund + p.deductions.employeeStateInsurance}
                  </td>
                  <td className="py-3 px-3 font-bold text-white text-sm">
                    ₹{p.netPay.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {p.status === 'estimated' ? (
                      <button
                        onClick={() => approvePayroll(p.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Approve Wage
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
