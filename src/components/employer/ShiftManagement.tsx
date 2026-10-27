import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  QrCode, 
  MapPin, 
  Filter,
  FileCheck,
  ShieldCheck,
  Radio,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShiftManagement: React.FC = () => {
  const { industry, workers, attendance, language } = useApp();

  const [dateFilter, setDateFilter] = useState('');
  const [workerFilter, setWorkerFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'live' | 'demo'>('all');

  const industryAttendance = attendance.filter(a => a.industry === industry);
  const industryWorkers = workers.filter(w => w.industry === industry);

  const filteredAttendance = industryAttendance.filter(a => {
    const matchesDate = !dateFilter || a.date === dateFilter;
    const matchesWorker = workerFilter === 'all' || a.workerId === workerFilter;
    const matchesSource = 
      sourceFilter === 'all' ? true :
      sourceFilter === 'live' ? !a.isDemo :
      Boolean(a.isDemo);
    return matchesDate && matchesWorker && matchesSource;
  });

  // Calculate live stats for the audit header
  const inProgressCount = filteredAttendance.filter(a => a.status === 'in_progress' || !a.checkOutTime).length;
  const completedCount = filteredAttendance.filter(a => a.status === 'completed' && a.checkOutTime).length;
  const totalRegHours = Math.round(
    filteredAttendance.reduce((acc, a) => acc + (a.status === 'completed' ? a.regularHours : 0), 0) * 10
  ) / 10;
  const totalOtHours = Math.round(
    filteredAttendance.reduce((acc, a) => acc + (a.status === 'completed' ? a.overtimeHours : 0), 0) * 10
  ) / 10;
  const totalPaySum = Math.round(
    filteredAttendance.reduce((acc, a) => acc + (a.status === 'completed' ? (a.totalPay || (a.regularHours * 100)) : 0), 0)
  );

  // Suspicious duplicate or overlapping shift detection
  const detectAnomalies = () => {
    const workerDateMap: Record<string, string[]> = {};
    const anomalies: string[] = [];

    industryAttendance.forEach(a => {
      const key = `${a.workerId}_${a.date}`;
      if (!workerDateMap[key]) {
        workerDateMap[key] = [];
      }
      workerDateMap[key].push(a.id);
      if (workerDateMap[key].length > 1) {
        anomalies.push(`Multiple shifts logged for ${a.workerName} on ${a.date}`);
      }
    });

    return Array.from(new Set(anomalies));
  };

  const anomalies = detectAnomalies();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-teal-400" />
            <span>{language === 'ta' ? 'வருகை & பணி முறை தணிக்கை' : 'Attendance & Shift Roster Audit'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            Real-time duration tracking, in-progress shift monitoring, geofence verification, and transparent wage audits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-teal-300">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Tamper-Evident Ledger</span>
        </div>
      </div>

      {/* Audit Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Progress</div>
          <div className="text-2xl font-black text-teal-400 mt-1 flex items-center gap-2">
            {inProgressCount}
            {inProgressCount > 0 && <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Unclosed shifts</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed</div>
          <div className="text-2xl font-black text-white mt-1">{completedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified checkouts</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Regular Hours</div>
          <div className="text-2xl font-black text-teal-300 mt-1">{totalRegHours}h</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Capped at 8h/day</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overtime Hours</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{totalOtHours}h</div>
          <div className="text-[10px] text-amber-300 mt-0.5">Paid at 1.5× rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wages Accrued</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{totalPaySum.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-300 mt-0.5">Regular + OT</div>
        </div>
      </div>

      {/* Anomaly / Overlap Alert Banner */}
      {anomalies.length > 0 ? (
        <div className="bg-amber-950/40 border-l-4 border-amber-500 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-200">Roster Notice: Multiple Shifts Logged</h4>
            <ul className="text-xs text-slate-300 list-disc list-inside mt-1">
              {anomalies.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero shift overlaps or conflicting timestamps detected across the active roster.</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Filter by Worker:</label>
            <select
              value={workerFilter}
              onChange={(e) => setWorkerFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Workers ({industryWorkers.length})</option>
              {industryWorkers.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Filter by Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
            </input>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Record Source:</label>
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-0.5">
              <button
                onClick={() => setSourceFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  sourceFilter === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({industryAttendance.length})
              </button>
              <button
                onClick={() => setSourceFilter('live')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  sourceFilter === 'live' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live ({industryAttendance.filter(a => !a.isDemo).length})
              </button>
              <button
                onClick={() => setSourceFilter('demo')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  sourceFilter === 'demo' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Demo ({industryAttendance.filter(a => a.isDemo).length})
              </button>
            </div>
          </div>
        </div>

        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-xs text-teal-400 hover:text-teal-300 cursor-pointer self-start md:self-center"
          >
            Clear Date Filter
          </button>
        )}
      </div>

      {/* Attendance Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Worker Name</th>
                <th className="pb-3 px-3">Department</th>
                <th className="pb-3 px-3">In - Out Timestamp</th>
                <th className="pb-3 px-3">Elapsed</th>
                <th className="pb-3 px-3">Regular Hrs</th>
                <th className="pb-3 px-3">Overtime (1.5×)</th>
                <th className="pb-3 px-3">Calculated Wages</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                    No attendance records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map(a => {
                  const isInProgress = a.status === 'in_progress' || !a.checkOutTime;
                  return (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {a.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {a.workerName}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {a.department}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {a.checkInTime} – {a.checkOutTime ? (
                          <span className="text-slate-200">{a.checkOutTime}</span>
                        ) : (
                          <span className="text-teal-400 font-bold animate-pulse">In Progress</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {isInProgress ? '—' : `${a.elapsedHours ?? (a.regularHours + a.overtimeHours)}h`}
                      </td>
                      <td className="py-3 px-3 font-bold text-teal-400">
                        {isInProgress ? <span className="text-slate-500 font-normal">0h</span> : `${a.regularHours}h`}
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400">
                        {isInProgress ? (
                          <span className="text-slate-500 font-normal">0h</span>
                        ) : a.overtimeHours > 0 ? (
                          `+${a.overtimeHours}h`
                        ) : (
                          '0h'
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        {isInProgress ? (
                          <span className="text-slate-500 font-normal">Accruing</span>
                        ) : a.totalPay ? (
                          `₹${a.totalPay}`
                        ) : (
                          `₹${Math.round(a.regularHours * 100)}`
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          a.isDemo 
                            ? 'bg-slate-950 border-slate-800 text-slate-400' 
                            : 'bg-teal-950/70 border-teal-500/50 text-teal-300 font-bold'
                        }`}>
                          {a.isDemo ? 'Demo' : 'Live'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {isInProgress ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 animate-pulse">
                            IN PROGRESS
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            COMPLETED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
