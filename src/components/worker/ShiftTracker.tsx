import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  QrCode, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Square, 
  Scan, 
  History, 
  Calendar, 
  Camera, 
  ShieldCheck,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShiftTracker: React.FC = () => {
  const { 
    currentWorker, 
    activeShift, 
    clockIn, 
    clockOut, 
    attendance, 
    wageConfigs,
    language, 
    t 
  } = useApp();

  const [showQrModal, setShowQrModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSimulatedQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowQrModal(false);
      const location = currentWorker.industry === 'construction'
        ? 'Construction Site Sector 4 - QR Terminal #02 (Simulated)'
        : 'Campus Main Facility Turnstile - QR Terminal #01 (Simulated)';
      
      const res = clockIn('qr', location);
      setMessage({ text: res.message, type: res.success ? 'success' : 'error' });
      setTimeout(() => setMessage(null), 4000);
    }, 1500);
  };

  const handleClockOut = () => {
    const res = clockOut(notesInput || 'Normal shift completion');
    setMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    setNotesInput('');
    setTimeout(() => setMessage(null), 4000);
  };

  const workerShifts = attendance.filter(a => a.workerId === currentWorker.id);
  const totalRegular = workerShifts.reduce((acc, s) => acc + (s.status === 'completed' ? s.regularHours : 0), 0);
  const totalOt = workerShifts.reduce((acc, s) => acc + (s.status === 'completed' ? s.overtimeHours : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">
            {language === 'ta' ? 'பணி வருகை மற்றும் நேரக் கண்காணிப்பு' : 'Shift Tracking & Time Clock'}
          </h1>
          <p className="text-sm text-slate-400">
            {language === 'ta'
              ? 'வெளிப்படையான மற்றும் துல்லியமான நேரப் பதிவு. கூடுதல் பணி நேரம் தானாக 1.5x ஆக கணக்கிடப்படும்.'
              : 'Verifiable time clocking with automatic 1.5× overtime calculation under UN SDG 8 standards.'}
          </p>
        </div>

        {/* Location Notice Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>
            {language === 'ta' ? 'இருப்பிடம் சரிபார்ப்பு: மாதிரி Geofence [சரி]' : 'Location Verification: Simulated Geofence [OK]'}
          </span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 border ${
          message.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' 
            : 'bg-red-950/80 border-red-500/50 text-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Punch Clock Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Shift Timer & Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              <span>{language === 'ta' ? 'நடப்பு பணி நிலை' : 'Current Shift Status'}</span>
            </div>

            {activeShift ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-sm font-bold text-emerald-400">
                    {language === 'ta' ? 'பணியில் உள்ளார் (Clocked In)' : 'Actively On Shift'}
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-wider">
                  {formatTimer(elapsedSeconds)}
                </div>
                <div className="text-xs text-slate-400">
                  {language === 'ta' ? 'தொடங்கிய நேரம்:' : 'Punch In Time:'}{' '}
                  <strong className="text-slate-200">{activeShift.checkInTime}</strong> • {activeShift.locationTag}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-bold text-slate-300">
                  {language === 'ta' ? 'நீங்கள் தற்போது பணியில் இல்லை' : 'Ready for Next Shift'}
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-black text-slate-600 tracking-wider">
                  00:00:00
                </div>
                <div className="text-xs text-slate-400">
                  {language === 'ta'
                    ? 'பணியைத் தொடங்க கீழே உள்ள பொத்தானை அல்லது QR குறியீட்டைப் பயன்படுத்தவும்.'
                    : 'Punch in below or scan the site QR terminal to log your start timestamp.'}
                </div>
              </div>
            )}

            {/* Overtime & Rest Rules Explainer */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Configured Shift Rules:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                <li>Standard Day: <strong>8.0 hours</strong></li>
                <li>Overtime Premium: <strong>1.5× rate</strong> (₹{currentWorker.hourlyRate * 1.5}/hr)</li>
                <li>Mandatory Break: <strong>30-60 minutes</strong> automatically scheduled</li>
                <li>Fatigue Limit: Warning generated if shift &gt; 10.5 hrs</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Clock Actions */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            {activeShift ? (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white">
                  {language === 'ta' ? 'பணியை முடிக்கவும் (Punch Out)' : 'Complete & End Active Shift'}
                </h2>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    {language === 'ta' ? 'பணி குறிப்புகள் (விருப்பத்தேர்வு):' : 'Shift Notes (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder={language === 'ta' ? 'எ.கா: பிரிவு 4 கான்கிரீட் பணி முடிந்தது' : 'e.g., Completed Pier 14 shuttering work safely'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={handleClockOut}
                  className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>{language === 'ta' ? 'பணியை முடி (Clock Out)' : 'Clock Out (End Shift)'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white">
                  {language === 'ta' ? 'வருகை பதிவு முறை' : 'Choose Check-In Method'}
                </h2>
                
                <button
                  onClick={() => setShowQrModal(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{language === 'ta' ? 'தள QR குறியீட்டை ஸ்கேன் செய்' : 'Scan Site Terminal QR'}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-950 px-2 text-[10px] text-slate-500 uppercase">or</span>
                </div>

                <button
                  onClick={() => {
                    const res = clockIn('manual', 'Manual Site Check-in (Verified by Supervisor)');
                    setMessage({ text: res.message, type: res.success ? 'success' : 'error' });
                    setTimeout(() => setMessage(null), 4000);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-teal-400 fill-current" />
                  <span>{language === 'ta' ? 'நேரடி வருகை (Manual Punch)' : 'Instant One-Tap Punch In'}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  * Location verification uses simulated workplace geofencing for hackathon demo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily & Weekly Hours Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Regular Hours Logged</div>
          <div className="text-2xl font-black text-white mt-1">{totalRegular} <span className="text-xs font-normal text-slate-400">hrs</span></div>
          <div className="text-[11px] text-teal-400 mt-1">Paid at ₹{currentWorker.hourlyRate}/hr</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Overtime Hours Logged</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{totalOt} <span className="text-xs font-normal text-slate-400">hrs</span></div>
          <div className="text-[11px] text-amber-400 mt-1">Paid at 1.5× (₹{currentWorker.hourlyRate * 1.5}/hr)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Work Time</div>
          <div className="text-2xl font-black text-white mt-1">{Math.round((totalRegular + totalOt) * 10) / 10} <span className="text-xs font-normal text-slate-400">hrs</span></div>
          <div className="text-[11px] text-emerald-400 mt-1">100% Transparently Documented</div>
        </div>
      </div>

      {/* Recent Attendance History Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-400" />
            <h2 className="text-base font-bold text-white">
              {language === 'ta' ? 'சமீபத்திய பணி வருகை வரலாறு' : 'Recent Shift Attendance Log'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">{workerShifts.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">In - Out</th>
                <th className="pb-3 px-3">Regular Hrs</th>
                <th className="pb-3 px-3">Overtime (1.5×)</th>
                <th className="pb-3 px-3">Verification</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {workerShifts.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-medium text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{s.date}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {s.checkInTime} – {s.checkOutTime || <span className="text-emerald-400 font-bold animate-pulse">In Progress</span>}
                  </td>
                  <td className="py-3 px-3 font-bold text-teal-300">
                    {s.regularHours}h
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-400">
                    {s.overtimeHours > 0 ? `+${s.overtimeHours}h` : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {s.verificationMethod === 'qr' && <QrCode className="w-3 h-3 text-teal-400" />}
                      {s.verificationMethod === 'geofence_simulated' && <MapPin className="w-3 h-3 text-cyan-400" />}
                      {s.verificationMethod.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 truncate max-w-[160px]">
                    {s.locationTag}
                  </td>
                  <td className="py-3 px-3">
                    {s.status === 'completed' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Completed
                      </span>
                    )}
                    {s.status === 'active' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 animate-pulse">
                        Clocked In
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated QR Check-in Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                {language === 'ta' ? 'தள QR ஸ்கேனர் (மாதிரி)' : 'Simulated QR Scanner'}
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
              >
                Cancel
              </button>
            </div>

            {/* Camera Viewport Simulation */}
            <div className="relative w-64 h-64 mx-auto rounded-2xl bg-slate-950 border-2 border-teal-500/50 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              {/* Scan Reticle */}
              <div className="relative w-44 h-44 border-2 border-dashed border-teal-400 rounded-xl flex items-center justify-center">
                {isScanning ? (
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-400 animate-pulse" />
                ) : (
                  <Scan className="w-16 h-16 text-teal-400/80" />
                )}
              </div>

              <div className="absolute bottom-2 px-3 py-1 rounded-full bg-slate-900/90 text-[10px] text-teal-300 border border-teal-500/30">
                {isScanning ? 'Decoding Workplace QR Token...' : 'Point camera at Terminal QR'}
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'ta'
                ? 'ஹேக்கத்தான் மாதிரி சோதனைக் கருவி. கீழே உள்ள பொத்தானை கிளிக் செய்து உடனடி சரிபார்ப்பை உருவகப்படுத்தவும்.'
                : 'Click below to simulate scanning the high-security QR terminal at the project gate.'}
            </p>

            <button
              onClick={handleSimulatedQrScan}
              disabled={isScanning}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-teal-500/25 cursor-pointer disabled:opacity-50"
            >
              {isScanning ? 'Verifying Coordinates...' : 'Simulate Instant QR Check-In'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
