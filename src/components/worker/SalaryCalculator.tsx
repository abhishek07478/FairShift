import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  HelpCircle, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle, 
  Calendar, 
  ArrowUpRight, 
  Info,
  Building,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TextToSpeechButton } from '../common/TextToSpeechButton';

export const SalaryCalculator: React.FC = () => {
  const { 
    currentWorker, 
    attendance, 
    wageConfigs, 
    payrollRecords, 
    generatePayrollForWorker,
    language, 
    t 
  } = useApp();

  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [showSlipModal, setShowSlipModal] = useState(false);

  const config = wageConfigs[currentWorker.industry] || {
    regularHourlyRate: currentWorker.hourlyRate,
    overtimeMultiplier: 1.5,
    hazardPayDaily: 150,
    standardWorkDayHours: 8,
    weeklyOvertimeThreshold: 48,
  };

  // Find or calculate current payroll record
  const currentPayroll = payrollRecords.find(p => p.workerId === currentWorker.id) || generatePayrollForWorker(currentWorker.id);

  // Timeframe multipliers for display
  const multiplier = timeframe === 'daily' ? 0.2 : timeframe === 'weekly' ? 1.0 : 4.33;

  const regularHours = Math.round(currentPayroll.regularHours * multiplier * 10) / 10;
  const regularRate = currentPayroll.regularRate;
  const regularPay = Math.round(regularHours * regularRate);

  const otHours = Math.round(currentPayroll.overtimeHours * multiplier * 10) / 10;
  const otRate = Math.round(regularRate * config.overtimeMultiplier);
  const otPay = Math.round(otHours * otRate);

  const hazardAllowance = Math.round(currentPayroll.hazardAllowance * multiplier);
  const grossPay = regularPay + otPay + hazardAllowance;

  const pfDeduction = Math.round(currentPayroll.deductions.providentFund * multiplier);
  const esiDeduction = Math.round(currentPayroll.deductions.employeeStateInsurance * multiplier);
  const totalDeductions = pfDeduction + esiDeduction;

  const netPay = grossPay - totalDeductions;

  const plainExplanation = language === 'ta'
    ? `உங்கள் சம்பள கணக்கீடு: ${regularHours} மணிநேரம் சாதாரண பணி @ ₹${regularRate} = ₹${regularPay}. ${otHours} மணிநேரம் கூடுதல் பணி @ 1.5 மடங்கு (₹${otRate}) = ₹${otPay}. தள கடினப் படி: ₹${hazardAllowance}. பிடித்தங்கள்: PF ₹${pfDeduction} மற்றும் ESI ₹${esiDeduction}. உங்களுக்கு கிடைக்க வேண்டிய நிகர ஊதியம்: ₹${netPay}.`
    : `Salary Calculation: ${regularHours} regular hours at ₹${regularRate}/hr = ₹${regularPay}. ${otHours} overtime hours at 1.5× rate (₹${otRate}/hr) = ₹${otPay}. Site allowance: ₹${hazardAllowance}. Deductions: PF ₹${pfDeduction} and ESI ₹${esiDeduction}. Net take-home pay: ₹${netPay}.`;

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-teal-400" />
            <span>{language === 'ta' ? 'வெளிப்படையான சம்பளக் கணக்கீடு' : 'Transparent Salary & Wage Calculator'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            {language === 'ta'
              ? 'உங்கள் ஒவ்வொரு ரூபாயும் எவ்வாறு கணக்கிடப்பட்டது என்பது வெளிப்படையாக விளக்கப்பட்டுள்ளது.'
              : 'Every rupee earned is explained clearly without hidden charges or unauthorized cuts.'}
          </p>
        </div>

        {/* View Range Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'ta' 
                ? (tf === 'daily' ? 'தினசரி' : tf === 'weekly' ? 'வாராந்திர' : 'மாதாந்திர') 
                : tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Net Take-Home Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/60 to-slate-900 border-2 border-teal-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>{timeframe.toUpperCase()} {language === 'ta' ? 'உத்தேச நிகர ஊதியம்' : 'Estimated Net Take-Home Pay'}</span>
            </div>
            <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              ₹{netPay.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold">Gross: ₹{grossPay.toLocaleString('en-IN')}</span>
              <span>•</span>
              <span className="text-red-300">Statutory Deductions: -₹{totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowSlipModal(true)}
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ta' ? 'டிஜிட்டல் சம்பளச் சீட்டு' : 'Generate Digital Payslip'}</span>
            </button>
          </div>
        </div>

        {/* Audio explainer widget */}
        <div className="mt-6 pt-4 border-t border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{plainExplanation}</span>
          </div>
          <TextToSpeechButton text={plainExplanation} label={language === 'ta' ? 'கேளுங்கள்' : 'Listen'} />
        </div>
      </div>

      {/* Transparent Line-Item Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Regular Hours Pay */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Regular Wages</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{regularPay.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
            <div>Hours: <strong className="text-slate-200">{regularHours} hrs</strong></div>
            <div>Base Rate: <strong className="text-slate-200">₹{regularRate}/hr</strong></div>
            <div className="text-teal-400 font-mono text-[10px]">Formula: {regularHours} × ₹{regularRate}</div>
          </div>
        </div>

        {/* Overtime Pay (1.5x) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">Overtime Pay (1.5×)</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            ₹{otPay.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
            <div>OT Hours: <strong className="text-amber-200">{otHours} hrs</strong></div>
            <div>OT Rate: <strong className="text-amber-200">₹{otRate}/hr</strong> (1.5×)</div>
            <div className="text-amber-400 font-mono text-[10px]">Formula: {otHours} × (₹{regularRate} × 1.5)</div>
          </div>
        </div>

        {/* Allowances */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">Hazard / Site Allowance</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            ₹{hazardAllowance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
            <div>Site Allowance: <strong className="text-slate-200">₹{config.hazardPayDaily}/day</strong></div>
            <div>Safety Compliance: <strong className="text-emerald-400">100%</strong></div>
            <div className="text-cyan-400 font-mono text-[10px]">UN SDG 8 Hazard Protection</div>
          </div>
        </div>

        {/* Statutory Deductions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400">Statutory Deductions</span>
            <HelpCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">
            -₹{totalDeductions.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
            <div>Provident Fund (PF 6%): <strong className="text-slate-200">₹{pfDeduction}</strong></div>
            <div>Health Ins. (ESI 1.5%): <strong className="text-slate-200">₹{esiDeduction}</strong></div>
            <div className="text-emerald-400 font-mono text-[10px]">Zero hidden employer deductions</div>
          </div>
        </div>
      </div>

      {/* Printable Digital Payslip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 print:shadow-none print:max-w-none print:w-full print:rounded-none">
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <span>Verified FairShift Payslip</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSlip}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Payslip Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-black text-slate-950 tracking-tight">
                  Fair<span className="text-teal-600">Shift</span> Digital Payslip
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Aligned with UN SDG 8 Decent Work & Equal Remuneration Framework
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Organization: <strong className="text-slate-900">{currentWorker.industry === 'construction' ? 'Metro Rail Infrastructure Project' : 'SRM Campus Facilities & Services'}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold uppercase text-slate-400">Payslip No.</div>
                <div className="text-sm font-mono font-bold text-slate-900">{currentPayroll.id}</div>
                <div className="text-xs text-slate-500 mt-1">Period: Oct 19 - Oct 25, 2026</div>
              </div>
            </div>

            {/* Employee Details Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 block">Worker Name:</span>
                <strong className="text-slate-900">{currentWorker.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Badge ID:</span>
                <strong className="text-slate-900">{currentWorker.badgeNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Department:</span>
                <strong className="text-slate-900">{currentWorker.department}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Base Hourly Rate:</span>
                <strong className="text-teal-700">₹{currentWorker.hourlyRate}/hr</strong>
              </div>
            </div>

            {/* Earnings & Deductions Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Earnings */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 flex justify-between">
                  <span>Earnings Component</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span>Regular Hours ({regularHours}h @ ₹{regularRate})</span>
                    <span className="font-semibold text-slate-900">₹{regularPay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overtime ({otHours}h @ 1.5× = ₹{otRate})</span>
                    <span className="font-semibold text-teal-700">₹{otPay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hazard / Site Allowance</span>
                    <span className="font-semibold text-slate-900">₹{hazardAllowance}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                    <span>Total Gross Pay</span>
                    <span>₹{grossPay}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 flex justify-between">
                  <span>Statutory Deductions</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span>Provident Fund (Employee 6%)</span>
                    <span className="font-semibold text-slate-900">₹{pfDeduction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Insurance (ESI 1.5%)</span>
                    <span className="font-semibold text-slate-900">₹{esiDeduction}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Salary Advance Deduction</span>
                    <span>₹0</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-red-600">
                    <span>Total Deductions</span>
                    <span>₹{totalDeductions}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Amount Highlight */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-teal-800">Net Take-Home Pay</span>
                <div className="text-2xl font-black text-teal-900">₹{netPay.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right text-xs text-teal-700">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" /> Direct Bank Transfer
                </span>
                <div className="text-[11px] text-slate-500 mt-1">Processed via FairShift Decent Work Escrow</div>
              </div>
            </div>

            {/* Verification Stamp & QR Code */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center font-mono text-[9px] text-slate-400 text-center leading-tight">
                  FAIR<br />SHIFT<br />QR
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Verified Decent Work Digital Stamp</div>
                  <div className="text-[11px]">Audit Hash: 9f8a2-c34d-881e-sdg8</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">Authorized Signatory</div>
                <div className="text-[11px] text-slate-500">FairShift Workforce Protocol</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
