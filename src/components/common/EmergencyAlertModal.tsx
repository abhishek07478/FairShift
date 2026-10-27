import React from 'react';
import { AlertTriangle, Phone, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-red-950/90 to-slate-900 border-2 border-red-500 rounded-2xl shadow-2xl p-6 text-white animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-600 rounded-xl animate-pulse">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-200">
              {language === 'ta' ? 'அவசர ஆபத்து உதவி மையம்' : 'Immediate Danger Emergency Alert'}
            </h3>
            <p className="text-xs text-red-300">
              {language === 'ta' ? 'உயிருக்கு உடனடி ஆபத்து ஏற்பட்டால் தாமதிக்காமல் அழையுங்கள்' : 'If life, health, or safety is in immediate jeopardy, act now!'}
            </p>
          </div>
        </div>

        <div className="space-y-4 my-4">
          <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-red-400" />
              <div>
                <div className="text-sm font-semibold text-white">National Emergency Service</div>
                <div className="text-xs text-slate-300">Police / Fire / Disaster Response</div>
              </div>
            </div>
            <a 
              href="tel:112"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm transition"
            >
              Call 112
            </a>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <div>
                <div className="text-sm font-semibold text-white">Emergency Medical & Ambulance</div>
                <div className="text-xs text-slate-300">Rapid Medical Evacuation</div>
              </div>
            </div>
            <a 
              href="tel:108"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-sm transition"
            >
              Call 108
            </a>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <div className="text-sm font-semibold text-teal-300 mb-1">
              {language === 'ta' ? 'தள பாதுகாப்பு அதிகாரி அவசர எண்' : 'On-Site Safety Officer Direct Line'}
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Metro Rail Line Site Safety Booth: +91 44 2841 9000 (Ext. 4)<br />
              Campus Facilities Central Command: +91 44 2745 5555
            </p>
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-700/50">
              {language === 'ta'
                ? 'குறிப்பு: FairShift செயலியில் புகார் பதிவு செய்தாலும், உடனடி ஆபத்து உள்ள போது முதலில் அவசர எண்ணை அழைத்து பாதுகாப்பான இடத்திற்கு செல்லவும்.'
                : 'Notice: Logging a safety issue in FairShift records the audit trail, but immediate physical danger requires contacting emergency teams and evacuating the hazardous zone.'}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition"
          >
            {language === 'ta' ? 'மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
