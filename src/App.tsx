/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { ShiftTracker } from './components/worker/ShiftTracker';
import { SalaryCalculator } from './components/worker/SalaryCalculator';
import { SafetyReporting } from './components/worker/SafetyReporting';
import { AnonymousFeedback } from './components/worker/AnonymousFeedback';
import { DigitalSkillPassport } from './components/worker/DigitalSkillPassport';
import { FatigueAlertBanner } from './components/worker/FatigueAlertBanner';
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { WorkerManagement } from './components/employer/WorkerManagement';
import { ShiftManagement } from './components/employer/ShiftManagement';
import { PayrollManagement } from './components/employer/PayrollManagement';
import { SafetyComplaintManagement } from './components/employer/SafetyComplaintManagement';
import { AnonymousFeedbackAnalytics } from './components/employer/AnonymousFeedbackAnalytics';
import { AiWorkforceInsights } from './components/employer/AiWorkforceInsights';
import { AiChatAssistant } from './components/ai/AiChatAssistant';
import { SystemDocsModal } from './components/docs/SystemDocsModal';
import { 
  LayoutDashboard, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  EyeOff, 
  Award, 
  AlertTriangle,
  Users,
  CalendarCheck,
  Sparkles,
  BarChart3,
  BookOpen,
  Building2,
  GraduationCap
} from 'lucide-react';

function FairShiftApp() {
  const { role, setRole, industry, setIndustry, language, t } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Tab definitions for Worker Portal
  const workerTabs = [
    { id: 'dashboard', label: language === 'ta' ? 'முகப்பு' : 'Dashboard', icon: LayoutDashboard },
    { id: 'shifts', label: language === 'ta' ? 'பணி நேரம்' : 'Shift Clock', icon: Clock },
    { id: 'salary', label: language === 'ta' ? 'சம்பளம்' : 'Salary Calc', icon: DollarSign },
    { id: 'safety', label: language === 'ta' ? 'பாதுகாப்பு' : 'Report Hazard', icon: ShieldAlert },
    { id: 'feedback', label: language === 'ta' ? 'ரகசிய பின்னூட்டம்' : 'Feedback', icon: EyeOff },
    { id: 'skills', label: language === 'ta' ? 'திறன் பாஸ்போர்ட்' : 'Skill Passport', icon: Award },
    { id: 'fatigue', label: language === 'ta' ? 'களைப்பு எச்சரிக்கை' : 'Fatigue Alerts', icon: AlertTriangle },
  ];

  // Tab definitions for Employer Portal
  const employerTabs = [
    { id: 'dashboard', label: language === 'ta' ? 'பணிப்படை முகப்பு' : 'Dashboard', icon: LayoutDashboard },
    { id: 'workers', label: language === 'ta' ? 'தொழிலாளர் பட்டியல்' : 'Workers Roster', icon: Users },
    { id: 'attendance', label: language === 'ta' ? 'வருகை தணிக்கை' : 'Shift Audit', icon: CalendarCheck },
    { id: 'payroll', label: language === 'ta' ? 'சம்பள கணக்கீடு' : 'Payroll Admin', icon: DollarSign },
    { id: 'safety-admin', label: language === 'ta' ? 'பாதுகாப்பு மேலாண்மை' : 'Hazards & Audit', icon: ShieldAlert },
    { id: 'feedback-admin', label: language === 'ta' ? 'பின்னூட்ட பகுப்பாய்வு' : 'Sentiment Analytics', icon: EyeOff },
    { id: 'insights', label: language === 'ta' ? 'AI நுண்ணறிவு' : 'AI Insights', icon: Sparkles },
  ];

  const currentTabs = role === 'worker' ? workerTabs : employerTabs;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navbar with multi-industry & role toggles */}
      <Navbar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-800 no-scrollbar">
          {currentTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? role === 'worker'
                      ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Render */}
        <main className="flex-1">
          {role === 'worker' ? (
            <>
              {activeTab === 'dashboard' && <WorkerDashboard onNavigate={setActiveTab} />}
              {activeTab === 'shifts' && <ShiftTracker />}
              {activeTab === 'salary' && <SalaryCalculator />}
              {activeTab === 'safety' && <SafetyReporting />}
              {activeTab === 'feedback' && <AnonymousFeedback />}
              {activeTab === 'skills' && <DigitalSkillPassport />}
              {activeTab === 'fatigue' && <FatigueAlertBanner />}
            </>
          ) : (
            <>
              {activeTab === 'dashboard' && <EmployerDashboard onNavigate={setActiveTab} />}
              {activeTab === 'workers' && (
                <WorkerManagement 
                  onSelectWorkerPassport={(id) => {
                    setRole('worker');
                    setActiveTab('skills');
                  }} 
                />
              )}
              {activeTab === 'attendance' && <ShiftManagement />}
              {activeTab === 'payroll' && <PayrollManagement />}
              {activeTab === 'safety-admin' && <SafetyComplaintManagement />}
              {activeTab === 'feedback-admin' && <AnonymousFeedbackAnalytics />}
              {activeTab === 'insights' && <AiWorkforceInsights />}
            </>
          )}
        </main>
      </div>

      {/* Floating AI Chat Assistant */}
      <AiChatAssistant />

      {/* System Documentation Modal */}
      <SystemDocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/90 text-slate-500 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">FairShift</span>
            <span>•</span>
            <span>AI-Powered Decent Work Platform aligned with UN SDG 8</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>System Docs & Security Rules</span>
            </button>
            <span>•</span>
            <span>Prompt Wars 2026 × SRM ACM Student Chapter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FairShiftApp />
    </AppProvider>
  );
}
