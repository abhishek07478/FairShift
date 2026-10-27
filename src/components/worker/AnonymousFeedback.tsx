import React, { useState } from 'react';
import { 
  EyeOff, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Lock, 
  MessageSquare, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeedbackCategory, FeedbackSentiment } from '../../types';

export const AnonymousFeedback: React.FC = () => {
  const { 
    currentWorker, 
    anonymousFeedback, 
    submitAnonymousFeedback, 
    language, 
    t 
  } = useApp();

  const [text, setText] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('working_conditions');
  const [sentiment, setSentiment] = useState<FeedbackSentiment>('concern');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories: { key: FeedbackCategory; label: string; labelTamil: string }[] = [
    { key: 'working_conditions', label: 'Working Conditions & Water/Rest', labelTamil: 'வேலை சூழல் & குடிநீர்/ஓய்வு' },
    { key: 'workload', label: 'Workload & Unreasonable Overtime', labelTamil: 'பணிச்சுமை & அதிகப்படியான வேலை' },
    { key: 'management_behavior', label: 'Supervisor Treatment & Respect', labelTamil: 'மேற்பார்வையாளர் நடத்தை & மரியாதை' },
    { key: 'safety_culture', label: 'Safety Training & PPE Quality', labelTamil: 'பாதுகாப்பு பயிற்சி & உபகரண தரம்' },
    { key: 'fair_pay', label: 'Timely Pay & Allowance Inquiries', labelTamil: 'நேரத்திற்கு சம்பளம் & படி விசாரணைகள்' },
  ];

  const sentiments: { key: FeedbackSentiment; label: string; icon: any; color: string }[] = [
    { key: 'positive', label: 'Positive', icon: Smile, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { key: 'neutral', label: 'Neutral', icon: Meh, color: 'text-slate-300 border-slate-700 bg-slate-800' },
    { key: 'concern', label: 'Concern', icon: Frown, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { key: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'text-red-400 border-red-500/40 bg-red-500/10' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    submitAnonymousFeedback(text, category, sentiment);
    setIsSubmitted(true);
    setText('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const industryFeedback = anonymousFeedback.filter(f => f.industry === currentWorker.industry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <EyeOff className="w-7 h-7 text-teal-400" />
          <span>{language === 'ta' ? 'ரகசிய தொழிலாளர் பின்னூட்டம்' : 'Anonymous Worker Voice & Feedback'}</span>
        </h1>
        <p className="text-sm text-slate-400">
          {language === 'ta'
            ? 'பணியிட சூழல் மற்றும் மேற்பார்வையாளர் நடத்தை குறித்து உங்கள் உண்மையான கருத்துக்களை வெளிப்படையாக பகிரவும்.'
            : 'Speak freely about site conditions, workload, and fairness. No identifying metadata is stored.'}
        </p>
      </div>

      {/* Strict Anonymity Guarantee Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
          <Lock className="w-4 h-4 text-teal-400" />
          <span>{language === 'ta' ? 'முழுமையான ரகசிய உத்தரவாதம் (Strict Anonymity)' : 'Strict Anonymity Guarantee'}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'ta'
            ? 'FairShift உங்கள் பெயர், தொலைபேசி எண் அல்லது ஊழியர் அடையாளத்தை நீக்கிய பிறகே இந்த தகவலை சேமிக்கிறது. நிர்வாகம் அல்லது முதலாளி உங்கள் அடையாளத்தை ஒருபோதும் பார்க்க முடியாது. ஐ.நா SDG 8 கண்ணியமான வேலை கொள்கையின்படி தொழிலாளர் குரல் பாதுகாக்கப்படும்.'
            : 'FairShift strips your employee ID, device IP, and credentials before writing to the database. Employers can only view aggregated sentiment trends. Retaliation is strictly impossible.'}
        </p>
      </div>

      {isSubmitted && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">
            Thank you! Your feedback has been cryptographically sanitized and anonymously submitted to the site welfare committee.
          </div>
        </div>
      )}

      {/* Main Grid: Form on Left, Aggregate Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submit Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span>{language === 'ta' ? 'ரகசிய பின்னூட்டம் சமர்ப்பிக்கவும்' : 'Submit Anonymous Thought'}</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Category */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'ta' ? 'கருத்துப் பகுதி (Category):' : 'Topic Area:'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
              >
                {categories.map(c => (
                  <option key={c.key} value={c.key}>
                    {language === 'ta' ? c.labelTamil : c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sentiment Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                {language === 'ta' ? 'உங்கள் அனுபவ உணர்வு (Sentiment):' : 'Your Sentiment:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sentiments.map(s => {
                  const Icon = s.icon;
                  const isSelected = sentiment === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSentiment(s.key)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        isSelected 
                          ? `${s.color} ring-2 ring-teal-500/40 shadow-sm` 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Content */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'ta' ? 'உங்கள் கருத்துக்கள் (Open Feedback):' : 'Your Candid Feedback:'}
              </label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={language === 'ta'
                  ? 'எ.கா: "மதியம் 4வது தளத்தில் சுத்தமான குடிநீர் தீர்ந்துவிடுகிறது", அல்லது "மேற்பார்வையாளர் நல்ல முறையில் பாதுகாப்பு பயிற்சி அளித்தார்"...'
                  : 'Write your thoughts honestly. Example: "Water coolers are empty by noon on Floor 3", or "Supervisor provided excellent harness training this morning".'}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ta' ? 'ரகசியமாக சமர்ப்பிக்கவும்' : 'Send Anonymous Feedback'}</span>
            </button>
          </form>
        </div>

        {/* Aggregated Anonymous Feed on Right */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{language === 'ta' ? 'தொழிலாளர் குரல் பதிவுகள்' : 'Recent Anonymous Feed (Sanitized)'}</span>
            </h2>
            <span className="text-[11px] text-teal-400 font-medium">100% Identity-Free</span>
          </div>

          <div className="space-y-3">
            {industryFeedback.map(item => (
              <div 
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-teal-300 border border-slate-700">
                    {item.department}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed italic">
                  "{item.feedbackText}"
                </p>

                {item.aiThematicTag && (
                  <div className="text-[10px] text-teal-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Tag: {item.aiThematicTag}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
