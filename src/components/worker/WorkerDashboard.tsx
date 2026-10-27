import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Square, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { TextToSpeechButton } from '../common/TextToSpeechButton';

export const WorkerDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { 
    currentWorker, 
    activeShift, 
    clockIn, 
    clockOut, 
    attendance, 
    safetyReports, 
    fatigueAlerts,
    language, 
    t 
  } = useApp();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [clockActionMsg, setClockActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Active shift live timer
  useEffect(() => {
    let interval: any = null;
    if (activeShift) {
      const [h, m] = activeShift.checkInTime.split(':').map(Number);
      const now = new Date();
      const startMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0).getTime();
      
      const updateTimer = () => {
        const diff = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        setElapsedSeconds(diff);
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeShift]);

  // Format elapsed seconds HH:MM:SS
  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Compute this week's hours and estimated earnings
  const workerAttendance = attendance.filter(a => a.workerId === currentWorker.id);
  const totalRegularHrs = workerAttendance.reduce((acc, a) => acc + (a.status === 'completed' ? a.regularHours : 0), 0);
  const totalOtHrs = workerAttendance.reduce((acc, a) => acc + (a.status === 'completed' ? a.overtimeHours : 0), 0);
  const totalWeeklyHrs = Math.round((totalRegularHrs + totalOtHrs) * 10) / 10;
  
  // Weekly earnings estimation
  const estEarnings = Math.round(
    (totalRegularHrs * currentWorker.hourlyRate) + 
    (totalOtHrs * currentWorker.hourlyRate * 1.5) +
    (workerAttendance.filter(a => a.status === 'completed').length * (currentWorker.industry === 'construction' ? 150 : 100))
  );

  const pendingSafetyCount = safetyReports.filter(
    r => r.workerId === currentWorker.id && r.status !== 'resolved'
  ).length;

  const activeFatigue = fatigueAlerts.find(f => f.workerId === currentWorker.id);

  // Weekly attendance chart data
  const chartData = [
    { day: language === 'ta' ? 'திங்கள்' : 'Mon', hours: 8, overtime: 0 },
    { day: language === 'ta' ? 'செவ்வாய்' : 'Tue', hours: 8, overtime: 1.5 },
    { day: language === 'ta' ? 'புதன்' : 'Wed', hours: 8, overtime: 2.0 },
    { day: language === 'ta' ? 'வியாழன்' : 'Thu', hours: 8, overtime: 0 },
    { day: language === 'ta' ? 'வெள்ளி' : 'Fri', hours: 7.5, overtime: 0 },
    { day: language === 'ta' ? 'சனி' : 'Sat', hours: 4, overtime: 0 },
  ];

  const handleQuickClock = () => {
    if (activeShift) {
      const res = clockOut('Shift completed on schedule');
      setClockActionMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    } else {
      const res = clockIn('qr');
      setClockActionMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    }
    setTimeout(() => setClockActionMsg(null), 4000);
  };

  const rightsNotice = language === 'ta'
    ? 'கண்ணியமான வேலை உரிமை: 8 மணி நேரத்திற்கு மேல் பணிபுரியும் ஒவ்வொரு மணிநேரத்திற்கும் 1.5 மடங்கு கூடுதல் ஊதியம் உத்தரவாதம் செய்யப்படுகிறது. தொடர் பணிக்கு இடையே 11 மணிநேர ஓய்வு கட்டாயமாகும்.'
    : 'Decent Work Guarantee (UN SDG 8): Overtime is compensated at 1.5× your base hourly rate. You are legally entitled to mandatory rest breaks and a hazard-free work environment.';

  return (
    <div className="space-y-6">
      {/* Top Banner / Worker Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950/60 border border-slate-700/60 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/50 shadow-md shadow-teal-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {language === 'ta' && currentWorker.nameTamil ? currentWorker.nameTamil : currentWorker.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {currentWorker.badgeNumber}
                </span>
              </div>
              <p className="text-sm text-slate-300">
                {language === 'ta' && currentWorker.roleTamil ? currentWorker.roleTamil : currentWorker.role} •{' '}
                <span className="text-teal-400 font-medium">{currentWorker.department}</span>
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span>Base Rate: <strong className="text-slate-200">₹{currentWorker.hourlyRate}/hr</strong> (OT: ₹{currentWorker.hourlyRate * 1.5}/hr)</span>
              </div>
            </div>
          </div>

          {/* Quick Shift Status Punch Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {activeShift ? (
              <div className="w-full sm:w-auto bg-slate-950/80 border border-emerald-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between sm:justify-start gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {language === 'ta' ? 'பணியில் உள்ளார்' : 'Shift in Progress'}
                  </div>
                  <div className="text-xl font-mono font-black text-white tracking-wider">
                    {formatTimer(elapsedSeconds)}
                  </div>
                </div>
                <button
                  onClick={handleQuickClock}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'ta' ? 'பணி முடி' : 'Clock Out'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleQuickClock}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{language === 'ta' ? 'பணியைத் தொடங்குக (Clock In)' : 'Punch In (Start Shift)'}</span>
              </button>
            )}
          </div>
        </div>

        {clockActionMsg && (
          <div className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            clockActionMsg.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/70 border-red-500/50 text-red-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{clockActionMsg.text}</span>
          </div>
        )}
      </div>

      {/* Fatigue Warning Banner (if triggered) */}
      {activeFatigue && (
        <div className="bg-gradient-to-r from-amber-950/80 to-slate-900 border-l-4 border-amber-500 rounded-xl p-4 flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <div className="text-sm font-bold text-amber-200">
                {language === 'ta' ? 'களைப்பு மற்றும் ஓய்வு எச்சரிக்கை' : 'Workforce Fatigue Advisory'}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'ta' && activeFatigue.reasonTamil ? activeFatigue.reasonTamil : activeFatigue.reason}.{' '}
                {language === 'ta' && activeFatigue.recommendationTamil ? activeFatigue.recommendationTamil : activeFatigue.recommendation}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('fatigue')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 whitespace-nowrap"
          >
            {language === 'ta' ? 'விவரங்கள்' : 'View Policy'} →
          </button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Earnings */}
        <div 
          onClick={() => onNavigate('salary')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-4 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'ta' ? 'இந்த வார உத்தேச வருவாய்' : 'Est. Weekly Pay'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            ₹{estEarnings.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-teal-400">
            <span>{totalOtHrs}h Overtime @ 1.5×</span>
            <span className="group-hover:translate-x-1 transition-transform">Payslip →</span>
          </div>
        </div>

        {/* Hours Worked */}
        <div 
          onClick={() => onNavigate('shifts')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'ta' ? 'பணிபுரிந்த மணிநேரம்' : 'Logged Hours (Week)'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {totalWeeklyHrs} <span className="text-sm font-normal text-slate-400">hrs</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Target: 40 hrs / week</span>
            <span className="text-cyan-400">Log →</span>
          </div>
        </div>

        {/* Pending Safety Reports */}
        <div 
          onClick={() => onNavigate('safety')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'ta' ? 'பாதுகாப்பு புகார்கள்' : 'My Safety Reports'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {pendingSafetyCount} <span className="text-sm font-normal text-slate-400">active</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-400 flex items-center justify-between">
            <span>Zero retaliation protection</span>
            <span>Track →</span>
          </div>
        </div>

        {/* Digital Skill Passport */}
        <div 
          onClick={() => onNavigate('skills')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'ta' ? 'டிஜிட்டல் திறன் பாஸ்போர்ட்' : 'Skill Passport'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            Level 4 <span className="text-sm font-normal text-slate-400">Certified</span>
          </div>
          <div className="mt-1 text-[11px] text-purple-400 flex items-center justify-between">
            <span>Verified Trade Record</span>
            <span>View →</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Hours Chart & Next Shift / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Attendance Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">
                {language === 'ta' ? 'வாராந்திர பணி நேரம் & கூடுதல் நேரம்' : 'Weekly Attendance & Overtime'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ta' ? 'தினசரி பதிவு செய்யப்பட்ட வேலை நேர விவரம்' : 'Visual breakdown of regular vs overtime hours this week'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" />
                <span className="text-slate-300">Regular</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span className="text-slate-300">Overtime (1.5×)</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 12]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="hours" name="Regular Hours" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overtime" name="Overtime Hours" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Next Shift Card & Quick Actions */}
        <div className="space-y-4">
          {/* Next Shift Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>{language === 'ta' ? 'அடுத்த பணி முறை' : 'Next Scheduled Shift'}</span>
            </div>
            <div className="text-lg font-black text-white">
              Tomorrow: 08:00 AM – 05:00 PM
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                {currentWorker.industry === 'construction'
                  ? 'Metro Rail Elevated Pier 14, Zone B'
                  : 'Main Campus Admin Block & East Gate'}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Rest Window: 15h (Optimal)</span>
              <span className="text-emerald-400 font-medium">Rest Verified ✓</span>
            </div>
          </div>

          {/* Decent Work Rights Reminder with Text-to-speech */}
          <div className="bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                UN SDG 8 Rights Assurance
              </span>
              <TextToSpeechButton text={rightsNotice} label={language === 'ta' ? 'கேளுங்கள்' : 'Listen'} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {rightsNotice}
            </p>
          </div>

          {/* Quick Nav Shortcuts */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate('salary')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition text-xs font-semibold text-slate-200 flex flex-col gap-1 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>{language === 'ta' ? 'சம்பள சீட்டு' : 'View Payslip'}</span>
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition text-xs font-semibold text-slate-200 flex flex-col gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{language === 'ta' ? 'பாதுகாப்பு புகார்' : 'Report Hazard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
