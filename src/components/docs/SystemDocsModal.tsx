import React, { useState } from 'react';
import { 
  FileCode, 
  ShieldCheck, 
  Server, 
  Flame, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';

export const SystemDocsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'sdg8' | 'rules' | 'architecture' | 'env'>('sdg8');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isEmployer() { 
      return isAuthenticated() && (request.auth.token.role == 'employer' || request.auth.token.role == 'admin'); 
    }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }

    // Worker Profiles: Read own profile or Employer read all
    match /workerProfiles/{workerId} {
      allow read: if isOwner(workerId) || isEmployer();
      allow write: if isEmployer();
    }

    // Attendance & Shifts
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated() && (resource.data.workerId == request.auth.uid || isEmployer());
      allow create: if isAuthenticated() && request.resource.data.workerId == request.auth.uid;
      allow update: if isEmployer() || (isAuthenticated() && resource.data.workerId == request.auth.uid);
      allow delete: if isEmployer();
    }

    // Transparent Payroll: Worker reads own; Employer manages
    match /payroll/{payrollId} {
      allow read: if isAuthenticated() && (resource.data.workerId == request.auth.uid || isEmployer());
      allow write: if isEmployer();
    }

    // Anonymous Feedback: Decoupled write; aggregate read
    match /anonymousFeedback/{feedbackId} {
      allow create: if true; // Untraceable submission
      allow read, write: if isEmployer();
    }
  }
}`;

  const envSample = `# GEMINI_API_KEY: Configured in AI Studio Secrets panel
GEMINI_API_KEY="your-gemini-api-key"

# APP_URL: Injected automatically by Google Cloud Run
APP_URL="https://ais-dev-...run.app"

# PORT: Default Express runtime port
PORT=3000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                FairShift Architecture & SDG 8 Dossier
              </h2>
              <p className="text-xs text-slate-400">
                Prompt Wars 2026 × SRM ACM Student Chapter Technical Specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('sdg8')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'sdg8' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            UN SDG 8 Impact
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'rules' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Firestore Security Rules
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'architecture' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'env' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Environment & Setup
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
          {activeTab === 'sdg8' && (
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <div className="bg-teal-950/40 border border-teal-500/30 rounded-2xl p-4 space-y-2">
                <div className="text-teal-300 font-bold text-sm flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-400" />
                  <span>UN Sustainable Development Goal 8: Decent Work and Economic Growth</span>
                </div>
                <p>
                  FairShift directly targets the exploitation, wage opacity, and hazardous conditions that disproportionately affect daily-wage construction workers and campus support staff in India and the Global South.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
                  <strong className="text-white text-sm block">Target 8.5: Equal Pay & Decent Work</strong>
                  <p className="text-[11px] text-slate-400">
                    Eliminates wage theft through tamper-proof punch clocking and transparent payslips with statutory 1.5× overtime multiplier and line-item deduction explanations in Tamil and English.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
                  <strong className="text-white text-sm block">Target 8.8: Safe & Secure Work Environments</strong>
                  <p className="text-[11px] text-slate-400">
                    Voice-enabled hazard reporting, 112/108 emergency dialers, and an ILO-aligned 11-hour rest window alert system preventing catastrophic on-site accidents.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
                  <strong className="text-white text-sm block">Target 8.6: Youth & Technical Upskilling</strong>
                  <p className="text-[11px] text-slate-400">
                    Portable Digital Skill Passports providing NSQF/OSHA-aligned credentialing so daily-wage earners build verifiable career equity.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
                  <strong className="text-white text-sm block">Target 8.2: Economic Productivity</strong>
                  <p className="text-[11px] text-slate-400">
                    Grounded AI workforce insights assist employers in optimizing shift rosters while safeguarding human dignity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hardened Role-Based Security Rules (`firestore.rules`):</span>
                <button
                  onClick={() => copyToClipboard(sampleRules, 'rules')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copied === 'rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'rules' ? 'Copied' : 'Copy Rules'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-teal-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                {sampleRules}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <span className="text-teal-400 font-bold uppercase text-[10px] tracking-wider">Frontend</span>
                  <div className="font-bold text-white text-sm">React 19 + TypeScript + Tailwind</div>
                  <p className="text-[11px] text-slate-400">
                    Mobile-first responsive UI, Web Speech API audio capture, SpeechSynthesis text-to-speech, and Recharts workforce analytics.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider">Backend & AI</span>
                  <div className="font-bold text-white text-sm">Express + Google GenAI SDK</div>
                  <p className="text-[11px] text-slate-400">
                    Secure server-side proxy routes for Gemini 3.8 Flash (`/api/ai/*`) preventing any API key leakage into client bundles.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <span className="text-purple-400 font-bold uppercase text-[10px] tracking-wider">Storage & Demo</span>
                  <div className="font-bold text-white text-sm">Firestore Schema + Offline Sync</div>
                  <p className="text-[11px] text-slate-400">
                    Full browser persistence with realistic multi-industry demo datasets and 1-click Reset Demo Data restore.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Environment Variables Template (`.env.example`):</span>
                <button
                  onClick={() => copyToClipboard(envSample, 'env')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copied === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'env' ? 'Copied' : 'Copy .env'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-teal-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                {envSample}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>SRM ACM Prompt Wars 2026 Submission</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
