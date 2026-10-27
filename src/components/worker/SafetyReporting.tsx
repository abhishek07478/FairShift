import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Camera, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  FileText, 
  Upload, 
  ChevronRight,
  Info,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafetyCategory, SafetySeverity } from '../../types';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { EmergencyAlertModal } from '../common/EmergencyAlertModal';

export const SafetyReporting: React.FC = () => {
  const { 
    currentWorker, 
    safetyReports, 
    submitSafetyReport, 
    language, 
    t 
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SafetyCategory>('fall_hazard');
  const [severity, setSeverity] = useState<SafetySeverity>('high');
  const [location, setLocation] = useState(
    currentWorker.industry === 'construction' ? 'Tower 2 - East Elevation Scaffold' : 'Science Block B - Room 204'
  );
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [submittedSuccessId, setSubmittedSuccessId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories: { key: SafetyCategory; label: string; labelTamil: string }[] = [
    { key: 'fall_hazard', label: 'Fall Hazard & Scaffolding', labelTamil: 'உயரத்திலிருந்து விழும் ஆபத்து & சாரக்கட்டு' },
    { key: 'electrical', label: 'Electrical & Exposed Cables', labelTamil: 'மின்சார ஆபத்து & திறந்த கேபிள்கள்' },
    { key: 'unsafe_equipment', label: 'Unsafe Machinery & Tools', labelTamil: 'பாதுகாப்பற்ற இயந்திரங்கள் & கருவிகள்' },
    { key: 'missing_ppe', label: 'Missing Safety PPE / Boots', labelTamil: 'பாதுகாப்பு உபகரணங்கள் இல்லாமை' },
    { key: 'sanitation', label: 'Sanitation & Chemical Vapors', labelTamil: 'சுகாதாரம் & ரசாயன புகைகள்' },
    { key: 'heat_exhaustion', label: 'Extreme Heat & Dehydration', labelTamil: 'அதிக வெப்பம் & நீரிழப்பு' },
    { key: 'other', label: 'Other Hazard', labelTamil: 'இதர ஆபத்துகள்' },
  ];

  const handleVoiceTranscript = (text: string) => {
    setDescription(prev => (prev ? `${prev} ${text}` : text));
  };

  const handleSimulatePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop&q=80'
    ];
    setPhotoUrl(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the hazard summary and description.');
      return;
    }

    const report = submitSafetyReport({
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      industry: currentWorker.industry,
      department: currentWorker.department,
      category,
      severity,
      title,
      description,
      location,
      photoUrl,
    });

    setSubmittedSuccessId(report.id);
    setTitle('');
    setDescription('');
    setPhotoUrl(undefined);
  };

  const myReports = safetyReports.filter(r => r.workerId === currentWorker.id);
  const filteredReports = filterCategory === 'all' 
    ? myReports 
    : myReports.filter(r => r.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-red-400" />
            <span>{language === 'ta' ? 'பணியிட பாதுகாப்பு மற்றும் அபாய அறிக்கை' : 'Workplace Safety & Hazard Reporting'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            {language === 'ta'
              ? 'பயமின்றி அபாயங்களை உடனே புகாரளிக்கவும். பாதுகாப்பு என்பது உங்கள் அடிப்படை தொழிலாளர் உரிமை (UN SDG 8.8).'
              : 'Report hazardous conditions immediately. Whistleblower protection and audit transparency guaranteed.'}
          </p>
        </div>

        {/* Emergency Trigger Button */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition animate-pulse cursor-pointer self-start sm:self-auto"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{language === 'ta' ? 'உடனடி ஆபத்து அவசர அழைப்பு (112)' : 'Life Danger Emergency Help (112)'}</span>
        </button>
      </div>

      {/* Immediate Danger Warning Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-l-4 border-red-500 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <div className="text-sm font-bold text-red-200">
              {language === 'ta' ? 'உடனடி விபத்து அல்லது உயிருக்கு ஆபத்தா?' : 'Immediate Life Safety Emergency?'}
            </div>
            <p className="text-xs text-slate-300">
              {language === 'ta'
                ? 'தீ, மின் கசிவு அல்லது இடிந்து விழும் நிலையில் உள்ள இடங்களில் உடனே வெளியேறி 112 அல்லது 108 ஐ தொடர்பு கொள்ளவும்.'
                : 'Do not wait for a digital ticket if someone is trapped or exposed to live current. Evacuate immediately and dial 112.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-lg whitespace-nowrap transition cursor-pointer"
        >
          View Emergency Contacts
        </button>
      </div>

      {submittedSuccessId && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-bold">Safety Hazard Logged Successfully!</div>
              <div className="text-xs text-emerald-300">
                Your report ID is <strong className="font-mono text-white">{submittedSuccessId}</strong>. It has been routed to the Site Safety In-charge.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSubmittedSuccessId(null)}
            className="text-emerald-400 hover:text-white font-bold text-sm px-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Grid: Form on Left, Tracking on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Report Hazard Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>{language === 'ta' ? 'புதிய பாதுகாப்பு அபாயத்தை பதிவு செய்' : 'Log New Hazard Incident'}</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'ta' ? 'அபாய சுருக்கம் (Title):' : 'Brief Hazard Summary:'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'ta' ? 'எ.கா: 3வது தளத்தில் தளர்வான சாரக்கட்டு பலகை' : 'e.g., Unsecured wooden plank on Tier 3 scaffold'}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            {/* Category & Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ta' ? 'அபாய வகை (Category):' : 'Hazard Category:'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SafetyCategory)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  {categories.map(c => (
                    <option key={c.key} value={c.key}>
                      {language === 'ta' ? c.labelTamil : c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ta' ? 'அபாய தீவிரம் (Severity):' : 'Severity Level:'}
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as SafetySeverity)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="low">Low (Minor inspection item)</option>
                  <option value="medium">Medium (Requires attention today)</option>
                  <option value="high">High (Stop work in zone)</option>
                  <option value="critical_emergency">Critical / Emergency (Immediate Danger)</option>
                </select>
              </div>
            </div>

            {/* Specific Location */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'ta' ? 'குறிப்பிட்ட இடம் (Location on Site):' : 'Precise Location:'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Specific room, pillar, elevation, or gate"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* Detailed Description with Voice Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  {language === 'ta' ? 'விளக்கம் (பேச மைக் பயன்படுத்தலாம்):' : 'Detailed Description:'}
                </label>
                <VoiceInputButton onTranscript={handleVoiceTranscript} size="sm" />
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'ta' ? 'அபாயத்தை விரிவாக விவரிக்கவும் அல்லது குரல் உள்ளீடு பொத்தானை கிளிக் செய்து பேசவும்...' : 'Explain the risk, who is exposed, and what equipment is involved. You can also click Voice Input to speak...'}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            {/* Photo Attachment (Simulated) */}
            <div className="border border-dashed border-slate-700 rounded-xl p-3 bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Camera className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold">
                    {language === 'ta' ? 'புகைப்பட ஆதாரம் இணைக்கவும்' : 'Photo Evidence Attachment'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSimulatePhoto}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  {photoUrl ? 'Change Photo' : 'Simulate Site Photo'}
                </button>
              </div>

              {photoUrl && (
                <div className="mt-2 relative inline-block">
                  <img
                    src={photoUrl}
                    alt="Hazard evidence"
                    className="w-32 h-20 object-cover rounded-lg border border-teal-500/40 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(undefined)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{language === 'ta' ? 'அபாய புகாரை சமர்ப்பிக்கவும்' : 'Submit Safety Report'}</span>
            </button>
          </form>
        </div>

        {/* Status Tracker & History on Right */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{language === 'ta' ? 'எனது பாதுகாப்பு புகார்கள்' : 'My Reported Hazards'}</span>
              </h2>
              <span className="text-xs text-slate-400">{myReports.length} Total</span>
            </div>

            {myReports.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No active safety reports submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myReports.map(report => (
                  <div
                    key={report.id}
                    className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2 text-xs transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-teal-400 font-bold">{report.id}</span>
                        <h4 className="font-bold text-white text-xs mt-0.5">{report.title}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        report.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : report.status === 'in_progress'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {report.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                      <span>{new Date(report.submittedAt).toLocaleDateString()}</span>
                      <span className="text-slate-400 font-medium">{report.location}</span>
                    </div>

                    {report.resolutionNotes && (
                      <div className="bg-slate-900 border border-teal-500/30 rounded-lg p-2 text-[10px] text-teal-300">
                        <strong className="text-teal-200">Safety Officer Note:</strong> {report.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <EmergencyAlertModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
      />
    </div>
  );
};
