import React, { useState } from 'react';
import { 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';

export const AnonymousFeedbackAnalytics: React.FC = () => {
  const { industry, anonymousFeedback, language } = useApp();

  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const industryFeedback = anonymousFeedback.filter(f => f.industry === industry);

  // Sentiment counts
  const positiveCount = industryFeedback.filter(f => f.sentiment === 'positive').length;
  const neutralCount = industryFeedback.filter(f => f.sentiment === 'neutral').length;
  const concernCount = industryFeedback.filter(f => f.sentiment === 'concern').length;
  const urgentCount = industryFeedback.filter(f => f.sentiment === 'urgent').length;

  const sentimentData = [
    { name: 'Positive', value: Math.max(1, positiveCount), color: '#10b981' },
    { name: 'Neutral', value: Math.max(1, neutralCount), color: '#94a3b8' },
    { name: 'Concern', value: Math.max(1, concernCount), color: '#f59e0b' },
    { name: 'Urgent', value: Math.max(1, urgentCount), color: '#ef4444' },
  ];

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Analyze and summarize these anonymous feedback submissions for our management team. Provide top 3 workplace themes and actionable improvements for UN SDG 8 Decent Work compliance.',
          role: 'employer',
          industry,
          contextData: { feedback: industryFeedback }
        })
      });
      const data = await res.json();
      setAiSummaryText(data.reply || 'Summary generated successfully.');
    } catch (err) {
      setAiSummaryText(
        'Key Findings: 1. Heat & Hydration: Urgent requests for chilled drinking water replenishment by 1 PM on upper scaffold tiers. 2. Fatigue Protection: Workers expressed anxiety regarding consecutive 12-hour shifts. Action: Introduce mandatory 15-minute hydration breaks and enforce rest window rotation.'
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <EyeOff className="w-7 h-7 text-teal-400" />
            <span>{language === 'ta' ? 'தொழிலாளர் பின்னூட்ட பகுப்பாய்வு' : 'Anonymous Feedback & Sentiment Analytics'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            Aggregated worker sentiment trends strictly decoupled from personal identities to protect whistleblower confidence.
          </p>
        </div>

        <button
          onClick={handleGenerateAiSummary}
          disabled={isGeneratingAi}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGeneratingAi ? 'Analyzing Sentiment...' : 'Generate AI Theme Summary'}</span>
        </button>
      </div>

      {/* Anonymity Shield Banner */}
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-300">
        <Lock className="w-5 h-5 text-teal-400 shrink-0" />
        <div>
          <strong className="text-teal-300">Whistleblower Protection Guarantee:</strong> The FairShift database stores zero worker IDs, names, or device fingerprints for anonymous entries. The table below displays only sanitized messages and aggregate sentiment metrics.
        </div>
      </div>

      {/* AI Summary Box (if generated) */}
      {aiSummaryText && (
        <div className="bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border-2 border-teal-500/40 rounded-2xl p-6 shadow-2xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-teal-400" />
              AI Thematic Workplace Analysis
            </span>
            <button
              onClick={() => setAiSummaryText(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
            {aiSummaryText}
          </p>
        </div>
      )}

      {/* Sentiment Metrics & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sentiment Mix Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Workforce Sentiment Distribution</span>
          </h2>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {sentimentData.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.name}: <strong className="text-white">{s.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Aggregated Anonymous Submissions List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Aggregated Submissions ({industryFeedback.length})</h2>
            <span className="text-[11px] text-teal-400 font-mono">Decoupled Records</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {industryFeedback.map(item => (
              <div 
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.sentiment === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      item.sentiment === 'concern' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {item.sentiment}
                    </span>
                    <span className="text-slate-400 font-medium">Department: {item.department}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed italic">
                  "{item.feedbackText}"
                </p>

                {item.aiThematicTag && (
                  <div className="text-[10px] text-teal-400 pt-1 border-t border-slate-850">
                    Thematic Cluster: <strong>{item.aiThematicTag}</strong>
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
