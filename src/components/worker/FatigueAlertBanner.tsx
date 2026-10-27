import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Moon, 
  HeartHandshake, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FatigueAlertBanner: React.FC = () => {
  const { currentWorker, fatigueAlerts, language, t } = useApp();

  const workerAlerts = fatigueAlerts.filter(f => f.workerId === currentWorker.id);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Clock className="w-7 h-7 text-amber-400" />
          <span>{language === 'ta' ? 'களைப்பு மற்றும் ஓய்வு நேர கண்காணிப்பு' : 'Fatigue & Ethical Rest Monitor'}</span>
        </h1>
        <p className="text-sm text-slate-400">
          {language === 'ta'
            ? 'அளவுக்கு அதிகமான தொடர் வேலை மற்றும் ஓய்வின்மையால் விபத்துக்கள் ஏற்படுவதைத் தடுக்கும் எச்சரிக்கை அமைப்பு.'
            : 'Objective scheduling safety thresholds aligned with ILO Decent Work standards to prevent fatigue-related incidents.'}
        </p>
      </div>

      {/* ILO Standard Rest Rule Card */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Moon className="w-5 h-5 text-amber-400" />
          <span>Statutory 11-Hour Daily Rest Window Protocol</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Under UN SDG 8 and the Factories Act Framework, consecutive shifts must provide at least <strong>11 uninterrupted hours of rest</strong>. Shift assignments violating this window increase cognitive error rates by over 30% and are systematically flagged by FairShift.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Max Daily Cap:</span>
            <strong className="text-white text-sm">10.5 Total Hours</strong>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Mandatory Rest:</span>
            <strong className="text-teal-400 text-sm">11 Hours Between Shifts</strong>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Consecutive Days Cap:</span>
            <strong className="text-amber-400 text-sm">6 Days Maximum</strong>
          </div>
        </div>
      </div>

      {/* Active Worker Alerts List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{language === 'ta' ? 'உங்கள் செயலில் உள்ள களைப்பு எச்சரிக்கைகள்' : 'Active Fatigue & Over-strain Advisories'}</span>
        </h2>

        {workerAlerts.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Optimal Rest Rhythm</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your logged shifts comply with all healthy rest window rules. No excessive consecutive shifts or truncated turnarounds detected.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workerAlerts.map(alert => (
              <div
                key={alert.id}
                className={`border rounded-2xl p-5 shadow-lg space-y-2 ${
                  alert.severity === 'high'
                    ? 'bg-red-950/40 border-red-500/50'
                    : 'bg-amber-950/40 border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      alert.severity === 'high' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {alert.severity} Risk
                    </span>
                    <span className="text-xs text-slate-400">
                      Detected: {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    Logged: {alert.consecutiveHours}h | Rest: {alert.restHoursBetweenShifts}h
                  </span>
                </div>

                <div className="text-sm font-bold text-white">
                  {language === 'ta' && alert.reasonTamil ? alert.reasonTamil : alert.reason}
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <strong className="text-teal-300">Prescribed Mitigation:</strong>{' '}
                  {language === 'ta' && alert.recommendationTamil ? alert.recommendationTamil : alert.recommendation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
