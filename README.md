# FairShift — AI-Powered Decent Work Platform

> **Prompt Wars 2026 × SRM ACM Student Chapter**  
> Aligned with **UN Sustainable Development Goal 8: Decent Work and Economic Growth**

---

## 1. Problem Statement & Mission

Informal labor, construction daily-wage earners, and campus support staff (housekeeping, security, facility maintenance) face systemic vulnerabilities:
1. **Wage Theft & Opacity**: Arbitrary deductions, unrecorded overtime hours, and lack of verifiable digital payslips.
2. **Hazardous Environments & Whistleblower Fear**: Inadequate reporting of structural, electrical, and fall hazards with fear of employer retaliation.
3. **Chronic Fatigue & Scheduling Abuse**: Excessive shifts exceeding 12+ hours with insufficient rest windows (<11 hours) leading to preventable fatal workplace injuries.
4. **Lack of Verifiable Career Equity**: Daily-wage workers possess master trade skills (bar bending, masonry, high-altitude rigging, chemical sanitation) but have no portable digital proof of competency.

**FairShift** bridges this divide by providing an intelligent, bilingual (English & தமிழ்), role-based platform that enforces fair compensation, objective safety reporting, tamper-evident shift logging, and digital skill passporting.

---

## 2. Core Features

### A. Worker Portal
- **Verifiable Shift Time Clock**: Interactive punch-in/out with simulated QR terminal scanner, elapsed shift timers, and geofence verification. Automatically prevents duplicate check-ins and invalid check-outs.
- **Transparent Salary & Wage Calculator**: Line-item breakdown of regular hours, statutory 1.5× overtime multiplier, site hazard allowances, and PF/ESI deductions. Explains every rupee earned in plain language with voice read-aloud support.
- **Printable Digital Payslip**: Generates official payslips with unique audit numbers, employer verification seals, and tamper-evident QR validation.
- **Workplace Safety & Whistleblower Reporting**: Fast hazard logging with category selection (electrical, fall hazards, unsafe machinery, sanitation, missing PPE), severity indicators, simulated photo evidence, and Web Speech voice input. Includes an immediate 112/108 emergency dialer for life-threatening hazards.
- **Strictly Anonymous Feedback**: Identity-decoupled feedback submission allowing workers to voice concerns about working conditions, water access, and supervisor conduct with zero risk of retaliation.
- **Digital Skill Passport**: Portable, tamper-proof record of trade certifications, NSQF-aligned mastery tiers, and logged on-the-job hours.
- **Fatigue & Overtime Alerts**: Proactive notifications when shifts exceed 10.5 hours or when rest periods between consecutive shifts fall below the mandatory 11-hour ILO threshold.

### B. Employer & Admin Operations Portal
- **Workforce Analytics Dashboard**: Real-time KPIs covering total staff, active shifts, punctuality rate, overtime volume, open safety hazards, and workforce fatigue index with responsive Recharts visualizations.
- **Worker Management & Wage Configuration**: Directory of registered personnel, inline hourly rate adjustments, department filters, and active/leave toggles.
- **Attendance & Shift Audit**: Ledger of check-in timestamps, verification tokens, and algorithmic detection of overlapping shifts or suspicious duplicate punches.
- **End-to-End Payroll Management**: Automated wage computation, administrator review and approval workflow, and 1-click CSV export.
- **Safety Complaint Investigation**: Triage workflow allowing managers to assign certified inspectors, update investigation stages (Submitted → Under Review → In Progress → Resolved), and log corrective audit notes.
- **Anonymous Feedback Analytics**: Aggregated sentiment trends and AI thematic clustering without exposing any worker metadata.
- **AI Workforce Insights**: Fact-grounded summaries generated via Google Gemini 3.8 Flash (or deterministic rule-engine fallback) highlighting overtime concentrations, unresolved hazards, and SDG 8 compliance suggestions.

### C. Multi-Industry Support
Supports two foundational sectors out of the box:
1. **Construction Sites & Infrastructure Projects**: Heavy civil, masonry, steel fixing, scaffolding, and tower crane operations.
2. **Colleges & Universities**: Campus housekeeping, vigilance/security, HVAC engineering, and eco-waste management.
*Extensible to hospitals and manufacturing factories.*

### D. FairShift AI Assistant
Accessible from both portals with strict Role-Based Access Control (RBAC):
- Workers can inquire about their personal payslip formulas, overtime rights, safety guidelines, and request Tamil translations.
- Employers can query attendance summaries, unresolved high-priority complaints, and fatigue mitigation strategies.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Visual Analytics**: Recharts
- **Accessibility & Voice**: Browser Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Backend**: Express on Node.js (Full-stack TypeScript via `tsx`)
- **AI Engine**: Google Gemini API (`@google/genai` with `gemini-3.8-flash`) through secure server-side proxy routes
- **Database Architecture**: Cloud Firestore schemas with hardened `firestore.rules` (and browser local persistence for hackathon evaluation)

---

## 4. System Architecture & Security

```
Browser Client (React 19 + TypeScript)
       │
       ├── Web Speech Recognition / SpeechSynthesis (Tamil & English)
       ├── Recharts Workforce Visualizations
       ├── Role-Based Access Control (Worker vs Employer Views)
       │
       ▼ (HTTP Proxy /api/*)
Express Backend Server (server.ts)
       │
       ├── /api/ai/chat (Gemini 3.8 Flash with Role & Context Guardrails)
       ├── /api/ai/workforce-insights (Factual Grounding on Active Logs)
       ├── /api/ai/translate (English <-> Tamil Workplace Notice Translation)
       └── Server-side GEMINI_API_KEY (Never exposed to client bundles)
       │
       ▼
Cloud Firestore / Storage Layer
       └── firestore.rules (Strict RBAC, Owner-Only Read, Decoupled Anonymous Feedback)
```

---

## 5. UN SDG 8 Impact Matrix

| UN SDG 8 Target | FairShift Feature & Implementation |
|---|---|
| **Target 8.5**: Full & Productive Employment with Equal Pay | Transparent salary calculator, automatic 1.5× overtime multiplier, line-item statutory deduction clarity in English and Tamil. |
| **Target 8.8**: Safe & Secure Working Environments | Anonymous hazard reporting, 112/108 emergency dialer, and ILO 11-hour mandatory rest period fatigue monitoring. |
| **Target 8.6**: Youth Technical Skills & Training | Digital Skill Passport tracking NSQF/OSHA certifications and verified trade hours for career mobility. |
| **Target 8.2**: High Economic Productivity | Grounded AI workforce analytics helping employers allocate shifts ethically without burning out workers. |

---

## 6. Setup & Execution Instructions

### Local Development
```bash
# 1. Clone the repository and navigate into project folder
cd fairshift

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for live Gemini)
cp .env.example .env

# 4. Start full-stack development server (Express + Vite)
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Resetting Demo Data
Judges can test live data modifications (check-ins, safety complaints, wage edits) and click **"Reset Demo Data"** in the top navigation bar at any time to restore the original seed dataset.
