import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Plus, 
  Briefcase, 
  ShieldCheck, 
  Download, 
  Sparkles,
  Calendar,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DigitalSkillPassport: React.FC = () => {
  const { 
    currentWorker, 
    skillPassports, 
    addSkillToPassport, 
    addCertificationToPassport,
    language, 
    t 
  } = useApp();

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Master'>('Intermediate');
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');

  const passport = skillPassports[currentWorker.id] || {
    workerId: currentWorker.id,
    workerName: currentWorker.name,
    industry: currentWorker.industry,
    primaryTrade: currentWorker.role,
    totalVerifiedWorkHours: 2500,
    skills: [
      { name: 'Core Trade Competency', level: 'Master', hoursLogged: 800, verifiedBySupervisor: true },
      { name: 'Workplace Safety Protocol', level: 'Intermediate', hoursLogged: 320, verifiedBySupervisor: true },
    ],
    certifications: [
      { id: 'c1', title: 'National Occupational Safety Standard 2024', issuer: 'National Skills Authority', issueDate: '2024-03-10', verified: true }
    ],
    experience: [
      { role: currentWorker.role, organization: currentWorker.department, period: '2023 - Present', highlights: 'Demonstrated high craftsmanship with zero safety violations.' }
    ]
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    addSkillToPassport(currentWorker.id, skillName, skillLevel);
    setSkillName('');
    setShowAddSkillModal(false);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;
    addCertificationToPassport(currentWorker.id, { title: certTitle, issuer: certIssuer });
    setCertTitle('');
    setCertIssuer('');
    setShowAddCertModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-7 h-7 text-purple-400" />
            <span>{language === 'ta' ? 'டிஜிட்டல் திறன் பாஸ்போர்ட்' : 'Digital Skill Passport'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            {language === 'ta'
              ? 'உங்கள் தொழில் திறன்கள், சான்றிதழ்கள் மற்றும் நீங்கள் ஆற்றிய மணிநேரங்களின் நம்பகமான மின்னணு பதிவு.'
              : 'Verifiable, portable digital credentials recognizing your real on-the-job mastery (UN SDG 8.6).'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-teal-400" />
            <span>Print Passport</span>
          </button>
          <button
            onClick={() => setShowAddSkillModal(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Hero Passport Badge Card */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-400/50 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">
                  {language === 'ta' && currentWorker.nameTamil ? currentWorker.nameTamil : currentWorker.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Passport ID: {currentWorker.badgeNumber}
                </span>
              </div>
              <p className="text-sm text-purple-200 font-medium">
                {passport.primaryTrade}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Employer Audit
                </span>
                <span>•</span>
                <span className="text-slate-400">{passport.totalVerifiedWorkHours} Verified Hours</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 text-center min-w-[160px]">
            <div className="text-[10px] text-purple-300 uppercase tracking-widest font-bold">
              Mastery Tier
            </div>
            <div className="text-2xl font-black text-white mt-1">Level 4 Lead</div>
            <div className="text-[11px] text-teal-400 mt-1 font-mono">NSQF Compliant</div>
          </div>
        </div>
      </div>

      {/* Skills Matrix & Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified Skills */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>{language === 'ta' ? 'சான்றளிக்கப்பட்ட திறன்கள்' : 'Verified Trade Competencies'}</span>
            </h2>
            <button
              onClick={() => setShowAddSkillModal(true)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add New
            </button>
          </div>

          <div className="space-y-3">
            {passport.skills.map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">
                    {language === 'ta' && s.nameTamil ? s.nameTamil : s.name}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Logged practice: <strong className="text-slate-200">{s.hoursLogged} hours</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    s.level === 'Master'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : s.level === 'Intermediate'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {s.level}
                  </span>
                  {s.verifiedBySupervisor && (
                    <span title="Supervisor Verified">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Formal Qualifications */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>{language === 'ta' ? 'பாதுகாப்பு & தொழில்நுட்ப சான்றிதழ்கள்' : 'Certifications & Credentials'}</span>
            </h2>
            <button
              onClick={() => setShowAddCertModal(true)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Cert
            </button>
          </div>

          <div className="space-y-3">
            {passport.certifications.map(c => (
              <div
                key={c.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-sm">{c.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">{c.issuer}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>Issued: {c.issueDate}</span>
                  <span className="text-teal-400 font-mono">Digital Signature Valid ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-teal-400" />
          <span>{language === 'ta' ? 'பணி அனுபவ வரலாறு' : 'Verified Employment & Project Timeline'}</span>
        </h2>

        <div className="space-y-4 border-l-2 border-teal-500/30 pl-4 ml-2">
          {passport.experience.map((exp, idx) => (
            <div key={idx} className="relative space-y-1 text-xs">
              <span className="w-3 h-3 rounded-full bg-teal-400 absolute -left-[23px] top-1 ring-4 ring-slate-900" />
              <div className="font-bold text-white text-sm">{exp.role}</div>
              <div className="text-teal-400 font-medium">{exp.organization} • {exp.period}</div>
              <p className="text-slate-300 text-xs mt-1">{exp.highlights}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white">Add Trade Skill to Passport</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Skill Name:</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g., Heavy Scaffolding Assembly"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Proficiency Level:</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value="Beginner">Beginner (&lt;100 logged hours)</option>
                  <option value="Intermediate">Intermediate (100 - 500 hours)</option>
                  <option value="Master">Master (500+ hours / Lead)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cert Modal */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-white">Add Certification</h3>
            <form onSubmit={handleAddCert} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Certificate Title:</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g., First Aid & High-Altitude Rigging Safety"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Issuing Body / Institute:</label>
                <input
                  type="text"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g., National Skills Authority / L&T Academy"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCertModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  Add Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
