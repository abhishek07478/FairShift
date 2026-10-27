import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  User, 
  Briefcase, 
  Languages, 
  RotateCcw, 
  PhoneCall, 
  ChevronDown,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyAlertModal } from './EmergencyAlertModal';

export const Navbar: React.FC<{ activeTab: string; onSelectTab: (tab: string) => void }> = ({ 
  activeTab, 
  onSelectTab 
}) => {
  const { 
    industry, 
    setIndustry, 
    role, 
    setRole, 
    language, 
    setLanguage, 
    currentWorker, 
    setCurrentWorkerId, 
    workers,
    resetDemoData,
    t
  } = useApp();

  const [isWorkerDropdownOpen, setIsWorkerDropdownOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const industryWorkers = workers.filter(w => w.industry === industry);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
        {/* Top utility banner */}
        <div className="bg-gradient-to-r from-slate-950 via-teal-950/40 to-slate-950 border-b border-teal-900/30 px-4 py-1.5 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 font-medium text-[11px] border border-teal-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                UN SDG 8: Decent Work & Economic Growth
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-slate-400 text-[11px]">
                SRM ACM Prompt Wars 2026 Edition
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Emergency button */}
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/30 transition text-[11px] font-semibold cursor-pointer"
              >
                <PhoneCall className="w-3 h-3 text-red-400 animate-pulse" />
                <span>{language === 'ta' ? 'அவசர உதவி (112)' : 'Emergency Help (112)'}</span>
              </button>

              {/* Reset demo data */}
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-teal-300 transition cursor-pointer"
                title="Reset local changes back to original seed data"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden md:inline">{language === 'ta' ? 'டெமோ மீட்டமை' : 'Reset Demo Data'}</span>
              </button>

              {/* Language toggle */}
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700/60">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                    language === 'en' 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                    language === 'ta' 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onSelectTab('dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white">
                    Fair<span className="text-teal-400">Shift</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    SDG 8
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-none">
                  {language === 'ta' ? 'கண்ணியமான வேலை தளம்' : 'Ethical Workforce Platform'}
                </div>
              </div>
            </div>
          </div>

          {/* Switchers & Role Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Industry selector toggle */}
            <div className="hidden lg:flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/60 shadow-inner">
              <button
                onClick={() => setIndustry('construction')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  industry === 'construction'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'கட்டுமானம்' : 'Construction'}</span>
              </button>
              <button
                onClick={() => setIndustry('college')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  industry === 'college'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'கல்லூரி பணியகம்' : 'Campus Staff'}</span>
              </button>
            </div>

            {/* Role switch toggle (Worker <-> Employer) */}
            <div className="flex items-center bg-slate-950/90 rounded-xl p-1 border border-slate-800 shadow-inner">
              <button
                onClick={() => setRole('worker')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  role === 'worker'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'தொழிலாளர்' : 'Worker'}</span>
              </button>
              <button
                onClick={() => setRole('employer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  role === 'employer'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'முதலாளி / Admin' : 'Employer'}</span>
              </button>
            </div>

            {/* Active user badge & profile switcher (especially when in Worker role) */}
            {role === 'worker' ? (
              <div className="relative">
                <button
                  onClick={() => setIsWorkerDropdownOpen(!isWorkerDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer text-left"
                >
                  <img
                    src={currentWorker.avatar}
                    alt={currentWorker.name}
                    className="w-7 h-7 rounded-lg object-cover border border-teal-500/40"
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-200 leading-tight">
                      {language === 'ta' && currentWorker.nameTamil ? currentWorker.nameTamil : currentWorker.name}
                    </div>
                    <div className="text-[10px] text-teal-400 font-mono">
                      ₹{currentWorker.hourlyRate}/hr
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isWorkerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      {language === 'ta' ? 'மாதிரி தொழிலாளரை தேர்வு செய்' : 'Select Sample Worker'}
                    </div>
                    <div className="mt-1 space-y-1">
                      {industryWorkers.map(w => (
                        <button
                          key={w.id}
                          onClick={() => {
                            setCurrentWorkerId(w.id);
                            setIsWorkerDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                            w.id === currentWorker.id
                              ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={w.avatar} alt={w.name} className="w-7 h-7 rounded-lg object-cover" />
                            <div>
                              <div className="text-xs font-semibold text-white">
                                {language === 'ta' && w.nameTamil ? w.nameTamil : w.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                {w.role}
                              </div>
                            </div>
                          </div>
                          {w.id === currentWorker.id && <Check className="w-4 h-4 text-teal-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/50 border border-indigo-700/40 text-indigo-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin Roster View</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Industry Quick Switch */}
        <div className="lg:hidden px-4 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">{language === 'ta' ? 'துறை:' : 'Industry:'}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIndustry('construction')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                industry === 'construction' ? 'bg-amber-600 text-white' : 'text-slate-400'
              }`}
            >
              {language === 'ta' ? 'கட்டுமானம்' : 'Construction'}
            </button>
            <button
              onClick={() => setIndustry('college')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                industry === 'college' ? 'bg-teal-600 text-white' : 'text-slate-400'
              }`}
            >
              {language === 'ta' ? 'கல்லூரி பணியகம்' : 'College Staff'}
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Modal */}
      <EmergencyAlertModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
      />

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Reset Demo Dataset?</h3>
            </div>
            <p className="text-sm text-slate-300 mb-6">
              This will restore all sample shifts, workers, safety reports, and feedback to the initial hackathon state. Your local changes will be cleared.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
