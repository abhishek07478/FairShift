export type IndustryType = 'construction' | 'college';
export type UserRole = 'worker' | 'employer';
export type Language = 'en' | 'ta';

export interface WorkerProfile {
  id: string;
  name: string;
  nameTamil?: string;
  role: string;
  roleTamil?: string;
  industry: IndustryType;
  department: string;
  departmentTamil?: string;
  phone: string;
  avatar: string;
  hourlyRate: number; // in INR ₹
  joinedDate: string;
  activeStatus: 'active' | 'on_leave' | 'inactive';
  dailyTargetHours: number; // default 8
  badgeNumber: string;
}

export type AttendanceVerification = 'qr' | 'geofence_simulated' | 'manual';
export type AttendanceStatus = 'present' | 'active' | 'in_progress' | 'completed' | 'flagged' | 'absent';

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  industry: IndustryType;
  department: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm or ISO
  checkOutTime?: string | null; // HH:mm or ISO or null for in-progress
  elapsedHours?: number; // Total duration before breaks
  regularHours: number; // Max 8 hours
  overtimeHours: number; // Working time beyond 8 hours
  breakMinutes: number; // Deducted break time
  regularPay?: number; // Regular Hours * Hourly Rate
  overtimePay?: number; // Overtime Hours * Hourly Rate * 1.5
  totalPay?: number; // Regular Pay + Overtime Pay
  status: AttendanceStatus;
  verificationMethod: AttendanceVerification;
  locationTag: string;
  notes?: string;
  fatigueWarning?: boolean;
  isDemo?: boolean; // Distinguish demo seed data from live user attendance
}

export type SafetyCategory = 
  | 'electrical' 
  | 'unsafe_equipment' 
  | 'sanitation' 
  | 'missing_ppe' 
  | 'fall_hazard' 
  | 'heat_exhaustion'
  | 'other';

export type SafetySeverity = 'low' | 'medium' | 'high' | 'critical_emergency';
export type SafetyStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved';

export interface SafetyReport {
  id: string;
  workerId: string;
  workerName: string;
  industry: IndustryType;
  department: string;
  category: SafetyCategory;
  severity: SafetySeverity;
  title: string;
  description: string;
  photoUrl?: string;
  audioTranscript?: string;
  status: SafetyStatus;
  submittedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  location: string;
}

export type FeedbackCategory = 
  | 'working_conditions' 
  | 'workload' 
  | 'management_behavior' 
  | 'safety_culture' 
  | 'fair_pay';

export type FeedbackSentiment = 'positive' | 'neutral' | 'concern' | 'urgent';

export interface AnonymousFeedback {
  id: string;
  industry: IndustryType;
  department: string;
  category: FeedbackCategory;
  sentiment: FeedbackSentiment;
  feedbackText: string;
  submittedAt: string;
  aiThematicTag?: string;
  // Intentionally NO workerId or name attached to preserve true anonymity
}

export interface SkillItem {
  name: string;
  nameTamil?: string;
  level: 'Beginner' | 'Intermediate' | 'Master';
  hoursLogged: number;
  verifiedBySupervisor: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
  credentialUrl?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  highlights: string;
}

export interface SkillPassport {
  workerId: string;
  workerName: string;
  industry: IndustryType;
  primaryTrade: string;
  skills: SkillItem[];
  certifications: CertificateItem[];
  experience: ExperienceItem[];
  totalVerifiedWorkHours: number;
}

export interface PayrollRecord {
  id: string;
  workerId: string;
  workerName: string;
  periodStart: string;
  periodEnd: string;
  regularHours: number;
  regularRate: number; // ₹ / hr
  regularPay: number;
  overtimeHours: number;
  overtimeRate: number; // 1.5x regular
  overtimePay: number;
  hazardAllowance: number;
  grossPay: number;
  deductions: {
    providentFund: number;
    employeeStateInsurance: number;
    advanceDeduction: number;
  };
  netPay: number;
  status: 'estimated' | 'approved' | 'paid';
  calculatedAt: string;
  breakdownExplanation: string;
  breakdownExplanationTamil?: string;
}

export interface WageConfig {
  industry: IndustryType;
  regularHourlyRate: number; // Default base rate
  overtimeMultiplier: number; // e.g. 1.5
  hazardPayDaily: number; // e.g. 150
  standardWorkDayHours: number; // 8 hours
  weeklyOvertimeThreshold: number; // 48 hours
}

export interface FatigueAlert {
  id: string;
  workerId: string;
  workerName: string;
  severity: 'low' | 'medium' | 'high';
  reason: string;
  reasonTamil?: string;
  consecutiveHours: number;
  restHoursBetweenShifts: number;
  recommendation: string;
  recommendationTamil?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleTamil?: string;
  message: string;
  messageTamil?: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
