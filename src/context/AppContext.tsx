import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  IndustryType, 
  UserRole, 
  Language, 
  WorkerProfile, 
  AttendanceRecord, 
  SafetyReport, 
  AnonymousFeedback, 
  SkillPassport, 
  PayrollRecord, 
  WageConfig, 
  FatigueAlert, 
  AppNotification,
  AttendanceVerification,
  SafetyStatus
} from '../types';
import { 
  INITIAL_WORKERS, 
  INITIAL_ATTENDANCE, 
  INITIAL_SAFETY_REPORTS, 
  INITIAL_ANONYMOUS_FEEDBACK, 
  INITIAL_SKILL_PASSPORTS, 
  INITIAL_PAYROLL_RECORDS, 
  INITIAL_WAGE_CONFIGS, 
  INITIAL_FATIGUE_ALERTS 
} from '../data/initialData';
import { translations } from '../i18n/translations';

interface AppContextType {
  industry: IndustryType;
  setIndustry: (ind: IndustryType) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: keyof typeof translations.en, key?: string) => any;
  
  // Workers
  workers: WorkerProfile[];
  currentWorker: WorkerProfile;
  setCurrentWorkerId: (id: string) => void;
  addWorker: (worker: Omit<WorkerProfile, 'id'>) => void;
  updateWorkerWageRate: (workerId: string, newRate: number) => void;
  toggleWorkerStatus: (workerId: string) => void;

  // Attendance & Time clock
  attendance: AttendanceRecord[];
  activeShift: AttendanceRecord | undefined;
  clockIn: (verificationMethod?: AttendanceVerification, locationTag?: string) => { success: boolean; message: string };
  clockOut: (notes?: string) => { success: boolean; message: string };
  
  // Wage rules & Payroll
  wageConfigs: Record<string, WageConfig>;
  updateWageConfig: (industry: IndustryType, config: Partial<WageConfig>) => void;
  payrollRecords: PayrollRecord[];
  generatePayrollForWorker: (workerId: string) => PayrollRecord;
  approvePayroll: (payrollId: string) => void;

  // Safety
  safetyReports: SafetyReport[];
  submitSafetyReport: (report: Omit<SafetyReport, 'id' | 'submittedAt' | 'status'>) => SafetyReport;
  updateSafetyReportStatus: (id: string, status: SafetyStatus, resolutionNotes?: string, assignedTo?: string) => void;

  // Anonymous feedback
  anonymousFeedback: AnonymousFeedback[];
  submitAnonymousFeedback: (text: string, category: any, sentiment: any) => void;

  // Skill passport
  skillPassports: Record<string, SkillPassport>;
  addSkillToPassport: (workerId: string, skillName: string, level: 'Beginner' | 'Intermediate' | 'Master') => void;
  addCertificationToPassport: (workerId: string, cert: { title: string; issuer: string }) => void;

  // Fatigue
  fatigueAlerts: FatigueAlert[];

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;

  // Demo controls
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'fairshift_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [industry, setIndustryState] = useState<IndustryType>(() => loadFromStorage('industry', 'construction'));
  const [role, setRoleState] = useState<UserRole>(() => loadFromStorage('role', 'worker'));
  const [language, setLanguageState] = useState<Language>(() => loadFromStorage('language', 'en'));

  const [workers, setWorkers] = useState<WorkerProfile[]>(() => loadFromStorage('workers', INITIAL_WORKERS));
  const [currentWorkerId, setCurrentWorkerId] = useState<string>(() => {
    const stored = loadFromStorage('currentWorkerId', 'w-c1');
    return stored;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', INITIAL_ATTENDANCE));
  const [wageConfigs, setWageConfigs] = useState<Record<string, WageConfig>>(() => loadFromStorage('wageConfigs', INITIAL_WAGE_CONFIGS));
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>(() => loadFromStorage('safetyReports', INITIAL_SAFETY_REPORTS));
  const [anonymousFeedback, setAnonymousFeedback] = useState<AnonymousFeedback[]>(() => loadFromStorage('feedback', INITIAL_ANONYMOUS_FEEDBACK));
  const [skillPassports, setSkillPassports] = useState<Record<string, SkillPassport>>(() => loadFromStorage('skills', INITIAL_SKILL_PASSPORTS));
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => loadFromStorage('payroll', INITIAL_PAYROLL_RECORDS));
  const [fatigueAlerts, setFatigueAlerts] = useState<FatigueAlert[]>(() => loadFromStorage('fatigue', INITIAL_FATIGUE_ALERTS));

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Decent Work Audit Active',
      titleTamil: 'கண்ணியமான வேலை தணிக்கை செயலில் உள்ளது',
      message: 'FairShift 2026 UN SDG 8 compliance engine is monitoring all shift hours and safety thresholds.',
      messageTamil: 'அனைத்து பணி நேரம் மற்றும் பாதுகாப்பு விதிகள் கண்காணிக்கப்படுகின்றன.',
      type: 'info',
      timestamp: 'Just now',
      read: false
    }
  ]);

  // Sync to storage
  useEffect(() => saveToStorage('industry', industry), [industry]);
  useEffect(() => saveToStorage('role', role), [role]);
  useEffect(() => saveToStorage('language', language), [language]);
  useEffect(() => saveToStorage('workers', workers), [workers]);
  useEffect(() => saveToStorage('currentWorkerId', currentWorkerId), [currentWorkerId]);
  useEffect(() => saveToStorage('attendance', attendance), [attendance]);
  useEffect(() => saveToStorage('wageConfigs', wageConfigs), [wageConfigs]);
  useEffect(() => saveToStorage('safetyReports', safetyReports), [safetyReports]);
  useEffect(() => saveToStorage('feedback', anonymousFeedback), [anonymousFeedback]);
  useEffect(() => saveToStorage('skills', skillPassports), [skillPassports]);
  useEffect(() => saveToStorage('payroll', payrollRecords), [payrollRecords]);
  useEffect(() => saveToStorage('fatigue', fatigueAlerts), [fatigueAlerts]);

  // Adjust active current worker when industry changes if current worker doesn't belong to the chosen industry
  useEffect(() => {
    const worker = workers.find(w => w.id === currentWorkerId);
    if (!worker || worker.industry !== industry) {
      const match = workers.find(w => w.industry === industry);
      if (match) setCurrentWorkerId(match.id);
    }
  }, [industry, workers, currentWorkerId]);

  const currentWorker = workers.find(w => w.id === currentWorkerId) || workers[0];

  const setIndustry = (ind: IndustryType) => {
    setIndustryState(ind);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Helper translation getter
  const t = (section: keyof typeof translations.en, key?: string) => {
    const langDict = translations[language] || translations.en;
    const sec = langDict[section] as any;
    if (!key) return sec;
    return sec?.[key] || (translations.en[section] as any)?.[key] || key;
  };

  // Find active clock-in for the current worker
  const activeShift = attendance.find(
    a => a.workerId === currentWorker.id && (a.status === 'active' || !a.checkOutTime)
  );

  // Clock-in handler
  const clockIn = (verificationMethod: AttendanceVerification = 'qr', locationTag?: string) => {
    if (activeShift) {
      return { success: false, message: 'You already have an active clock-in session. Clock out first.' };
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().substring(0, 5);

    const defaultLocation = industry === 'construction' 
      ? 'Construction Site Sector 4 - Main Pier' 
      : 'Campus Facility Administration Block';

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      industry: currentWorker.industry,
      department: currentWorker.department,
      date: today,
      checkInTime: timeStr,
      checkOutTime: undefined,
      regularHours: 0,
      overtimeHours: 0,
      breakMinutes: 0,
      status: 'active',
      verificationMethod: verificationMethod,
      locationTag: locationTag || defaultLocation,
      notes: 'Logged via FairShift Time Clock',
    };

    setAttendance(prev => [newRecord, ...prev]);

    return { 
      success: true, 
      message: `Clocked in successfully at ${timeStr} with ${verificationMethod.toUpperCase()} verification.` 
    };
  };

  // Clock-out handler
  const clockOut = (notes?: string) => {
    if (!activeShift) {
      return { success: false, message: 'No active clock-in found to clock out from.' };
    }

    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 5);
    
    // Parse checkIn and calculate duration
    const [inH, inM] = activeShift.checkInTime.split(':').map(Number);
    const [outH, outM] = timeStr.split(':').map(Number);
    
    let totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    if (totalMinutes <= 0) {
      // If same minute or simulated demo turn, award at least standard session or realistic delta
      totalMinutes = 480; // 8 hours for demo realism if clicked quickly
    }

    const breakMinutes = totalMinutes > 300 ? 60 : 30; // 1h break if shift > 5h
    const netWorkedMinutes = Math.max(30, totalMinutes - breakMinutes);
    const totalHoursWorked = Math.round((netWorkedMinutes / 60) * 10) / 10;

    const standardDay = wageConfigs[currentWorker.industry]?.standardWorkDayHours || 8;
    const regularHours = Math.min(standardDay, totalHoursWorked);
    const overtimeHours = Math.max(0, Math.round((totalHoursWorked - standardDay) * 10) / 10);

    const isFatigueTriggered = totalHoursWorked >= 10.5;

    const updatedRecord: AttendanceRecord = {
      ...activeShift,
      checkOutTime: timeStr,
      regularHours,
      overtimeHours,
      breakMinutes,
      status: 'completed',
      notes: notes || activeShift.notes,
      fatigueWarning: isFatigueTriggered
    };

    setAttendance(prev => prev.map(a => a.id === activeShift.id ? updatedRecord : a));

    // If fatigue rule triggered, create fatigue alert
    if (isFatigueTriggered) {
      const newFatigueAlert: FatigueAlert = {
        id: `fat-${Date.now()}`,
        workerId: currentWorker.id,
        workerName: currentWorker.name,
        severity: totalHoursWorked > 12 ? 'high' : 'medium',
        reason: `Exceeded ${totalHoursWorked} working hours today (${overtimeHours}h overtime).`,
        reasonTamil: `இன்று ${totalHoursWorked} மணி நேரம் பணிபுரிந்துள்ளார் (${overtimeHours} மணி கூடுதல் பணி).`,
        consecutiveHours: totalHoursWorked,
        restHoursBetweenShifts: 10,
        recommendation: 'Mandatory 11-hour rest period enforced. Overtime cap recommended.',
        recommendationTamil: 'அடுத்த பணிக்கு முன் 11 மணிநேர ஓய்வு கட்டாயமாகும்.',
        timestamp: new Date().toISOString()
      };
      setFatigueAlerts(prev => [newFatigueAlert, ...prev]);
    }

    return {
      success: true,
      message: `Clocked out at ${timeStr}. Regular: ${regularHours}h | Overtime: ${overtimeHours}h | Rest break: ${breakMinutes}m.`
    };
  };

  const addWorker = (newWorkerData: Omit<WorkerProfile, 'id'>) => {
    const newWorker: WorkerProfile = {
      ...newWorkerData,
      id: `w-${Date.now()}`,
    };
    setWorkers(prev => [...prev, newWorker]);
  };

  const updateWorkerWageRate = (workerId: string, newRate: number) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, hourlyRate: newRate } : w));
  };

  const toggleWorkerStatus = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          activeStatus: w.activeStatus === 'active' ? 'on_leave' : 'active'
        };
      }
      return w;
    }));
  };

  const updateWageConfig = (ind: IndustryType, config: Partial<WageConfig>) => {
    setWageConfigs(prev => ({
      ...prev,
      [ind]: {
        ...prev[ind],
        ...config
      }
    }));
  };

  // Generate transparent payroll calculation for a worker
  const generatePayrollForWorker = (workerId: string): PayrollRecord => {
    const worker = workers.find(w => w.id === workerId) || currentWorker;
    const config = wageConfigs[worker.industry] || INITIAL_WAGE_CONFIGS.construction;

    // Filter attendance in past 7 days for this worker
    const workerRecords = attendance.filter(a => a.workerId === worker.id && a.status === 'completed');
    const regularHours = workerRecords.reduce((acc, curr) => acc + curr.regularHours, 0) || 40;
    const overtimeHours = workerRecords.reduce((acc, curr) => acc + curr.overtimeHours, 0) || 5;

    const regularRate = worker.hourlyRate;
    const regularPay = Math.round(regularHours * regularRate);
    const overtimeRate = regularRate * config.overtimeMultiplier;
    const overtimePay = Math.round(overtimeHours * overtimeRate);
    const hazardAllowance = workerRecords.length * config.hazardPayDaily;

    const grossPay = regularPay + overtimePay + hazardAllowance;
    const providentFund = Math.round(grossPay * 0.06); // 6% PF
    const employeeStateInsurance = Math.round(grossPay * 0.015); // 1.5% ESI
    const advanceDeduction = 0;

    const netPay = grossPay - (providentFund + employeeStateInsurance + advanceDeduction);

    const newRecord: PayrollRecord = {
      id: `PAY-${Date.now()}-${worker.id.toUpperCase()}`,
      workerId: worker.id,
      workerName: worker.name,
      periodStart: '2026-10-20',
      periodEnd: '2026-10-26',
      regularHours,
      regularRate,
      regularPay,
      overtimeHours,
      overtimeRate,
      overtimePay,
      hazardAllowance,
      grossPay,
      deductions: {
        providentFund,
        employeeStateInsurance,
        advanceDeduction
      },
      netPay,
      status: 'estimated',
      calculatedAt: new Date().toISOString(),
      breakdownExplanation: `${regularHours} Regular hrs @ ₹${regularRate}/hr = ₹${regularPay}. ${overtimeHours} Overtime hrs @ 1.5× rate (₹${overtimeRate}/hr) = ₹${overtimePay}. Site hazard allowance: ₹${hazardAllowance}. Statutory deductions: PF (₹${providentFund}) + ESI (₹${employeeStateInsurance}). Net take-home: ₹${netPay}.`,
      breakdownExplanationTamil: `${regularHours} சாதாரண நேரம் @ ₹${regularRate} = ₹${regularPay}. ${overtimeHours} கூடுதல் பணி நேரம் @ 1.5x (₹${overtimeRate}) = ₹${overtimePay}. களப் படி: ₹${hazardAllowance}. பிடித்தங்கள்: PF (₹${providentFund}) + ESI (₹${employeeStateInsurance}). நிகர தொகை: ₹${netPay}.`
    };

    setPayrollRecords(prev => [newRecord, ...prev.filter(p => p.workerId !== worker.id)]);
    return newRecord;
  };

  const approvePayroll = (payrollId: string) => {
    setPayrollRecords(prev => prev.map(p => p.id === payrollId ? { ...p, status: 'approved' } : p));
  };

  const submitSafetyReport = (reportData: Omit<SafetyReport, 'id' | 'submittedAt' | 'status'>) => {
    const id = `SAF-2026-${String(safetyReports.length + 1).padStart(3, '0')}`;
    const newReport: SafetyReport = {
      ...reportData,
      id,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };

    setSafetyReports(prev => [newReport, ...prev]);

    // Add alert notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Safety Report ${id} Logged`,
        titleTamil: `பாதுகாப்பு அறிக்கை ${id} பதிவு செய்யப்பட்டது`,
        message: `${reportData.title} in ${reportData.department} submitted for immediate inspection.`,
        messageTamil: `${reportData.title} உடனடியாக ஆய்வு செய்ய சமர்ப்பிக்கப்பட்டது.`,
        type: reportData.severity === 'critical_emergency' ? 'alert' : 'warning',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);

    return newReport;
  };

  const updateSafetyReportStatus = (id: string, status: SafetyStatus, resolutionNotes?: string, assignedTo?: string) => {
    setSafetyReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          resolutionNotes: resolutionNotes || r.resolutionNotes,
          assignedTo: assignedTo || r.assignedTo,
          resolvedAt: status === 'resolved' ? new Date().toISOString() : r.resolvedAt,
        };
      }
      return r;
    }));
  };

  const submitAnonymousFeedback = (text: string, category: any, sentiment: any) => {
    const newFeedback: AnonymousFeedback = {
      id: `fb-${Date.now()}`,
      industry: currentWorker.industry,
      department: currentWorker.department,
      category,
      sentiment,
      feedbackText: text,
      submittedAt: new Date().toISOString(),
      aiThematicTag: category.replace('_', ' ').toUpperCase()
      // Zero personal identifying fields stored!
    };

    setAnonymousFeedback(prev => [newFeedback, ...prev]);
  };

  const addSkillToPassport = (workerId: string, skillName: string, level: 'Beginner' | 'Intermediate' | 'Master') => {
    setSkillPassports(prev => {
      const passport = prev[workerId] || {
        workerId,
        workerName: workers.find(w => w.id === workerId)?.name || 'Worker',
        industry,
        primaryTrade: 'General Trade',
        totalVerifiedWorkHours: 120,
        skills: [],
        certifications: [],
        experience: []
      };

      const existingIndex = passport.skills.findIndex(s => s.name.toLowerCase() === skillName.toLowerCase());
      let updatedSkills = [...passport.skills];

      if (existingIndex >= 0) {
        updatedSkills[existingIndex] = { ...updatedSkills[existingIndex], level, hoursLogged: updatedSkills[existingIndex].hoursLogged + 50 };
      } else {
        updatedSkills.push({
          name: skillName,
          level,
          hoursLogged: 80,
          verifiedBySupervisor: true
        });
      }

      return {
        ...prev,
        [workerId]: {
          ...passport,
          skills: updatedSkills
        }
      };
    });
  };

  const addCertificationToPassport = (workerId: string, cert: { title: string; issuer: string }) => {
    setSkillPassports(prev => {
      const passport = prev[workerId] || {
        workerId,
        workerName: workers.find(w => w.id === workerId)?.name || 'Worker',
        industry,
        primaryTrade: 'General Trade',
        totalVerifiedWorkHours: 120,
        skills: [],
        certifications: [],
        experience: []
      };

      return {
        ...prev,
        [workerId]: {
          ...passport,
          certifications: [
            ...passport.certifications,
            {
              id: `cert-${Date.now()}`,
              title: cert.title,
              issuer: cert.issuer,
              issueDate: new Date().toISOString().split('T')[0],
              verified: true
            }
          ]
        }
      };
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setWorkers(INITIAL_WORKERS);
    setCurrentWorkerId('w-c1');
    setIndustryState('construction');
    setRoleState('worker');
    setLanguageState('en');
    setAttendance(INITIAL_ATTENDANCE);
    setWageConfigs(INITIAL_WAGE_CONFIGS);
    setSafetyReports(INITIAL_SAFETY_REPORTS);
    setAnonymousFeedback(INITIAL_ANONYMOUS_FEEDBACK);
    setSkillPassports(INITIAL_SKILL_PASSPORTS);
    setPayrollRecords(INITIAL_PAYROLL_RECORDS);
    setFatigueAlerts(INITIAL_FATIGUE_ALERTS);
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: 'Demo Data Restored',
        titleTamil: 'மாதிரி தரவு மீட்டமைக்கப்பட்டது',
        message: 'All sample records, shifts, and wage configurations have been reset to factory defaults.',
        messageTamil: 'அனைத்து மாதிரி பதிவுகளும் ஆரம்ப நிலைக்கு மீட்டமைக்கப்பட்டுள்ளன.',
        type: 'success',
        timestamp: 'Just now',
        read: false
      }
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        industry,
        setIndustry,
        role,
        setRole,
        language,
        setLanguage,
        t,
        workers,
        currentWorker,
        setCurrentWorkerId,
        addWorker,
        updateWorkerWageRate,
        toggleWorkerStatus,
        attendance,
        activeShift,
        clockIn,
        clockOut,
        wageConfigs,
        updateWageConfig,
        payrollRecords,
        generatePayrollForWorker,
        approvePayroll,
        safetyReports,
        submitSafetyReport,
        updateSafetyReportStatus,
        anonymousFeedback,
        submitAnonymousFeedback,
        skillPassports,
        addSkillToPassport,
        addCertificationToPassport,
        fatigueAlerts,
        notifications,
        markNotificationAsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
