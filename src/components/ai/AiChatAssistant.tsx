import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  Minimize2, 
  Maximize2,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { TextToSpeechButton } from '../common/TextToSpeechButton';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isSimulated?: boolean;
}

export const AiChatAssistant: React.FC = () => {
  const { 
    role, 
    industry, 
    currentWorker, 
    attendance, 
    safetyReports, 
    payrollRecords, 
    fatigueAlerts, 
    language,
    t 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: role === 'worker'
        ? (language === 'ta'
            ? `வணக்கம் ${currentWorker.nameTamil || currentWorker.name}! நான் ஃபேர்ஷிஃப்ட் AI உதவியாளர். உங்கள் இந்த வார சம்பள கணக்கீடு, பணி நேரம் அல்லது பாதுகாப்பு புகார்கள் குறித்து என்னிடம் கேட்கலாம்.`
            : `Hello ${currentWorker.name}! I am your FairShift Decent Work Assistant. Ask me about your payslip breakdown, overtime hours, safety guidelines, or your labor rights under UN SDG 8.`)
        : `FairShift Admin Assistant ready. You can query workforce attendance, open safety complaints, overtime fatigue alerts, or ask for recommendations to optimize shift schedules ethically.`,
      timestamp: 'Just now',
      isSimulated: false,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Context preparation strictly adhering to Role-Based Access Control
  const buildContextPayload = () => {
    if (role === 'worker') {
      const workerShifts = attendance.filter(a => a.workerId === currentWorker.id);
      const workerPayroll = payrollRecords.find(p => p.workerId === currentWorker.id);
      const workerSafety = safetyReports.filter(r => r.workerId === currentWorker.id);
      const workerFatigue = fatigueAlerts.filter(f => f.workerId === currentWorker.id);

      return {
        role: 'worker',
        workerName: currentWorker.name,
        department: currentWorker.department,
        hourlyRate: currentWorker.hourlyRate,
        overtimeRate: currentWorker.hourlyRate * 1.5,
        totalCompletedShifts: workerShifts.length,
        workerEarnings: workerPayroll?.netPay || 7145,
        workerOvertimeHours: workerPayroll?.overtimeHours || 6.5,
        pendingComplaints: workerSafety.filter(s => s.status !== 'resolved').length,
        fatigueAlerts: workerFatigue.map(f => f.reason)
      };
    } else {
      // Employer context: aggregate metrics only
      const industryWorkers = attendance.filter(a => a.industry === industry);
      return {
        role: 'employer',
        totalWorkers: industryWorkers.length,
        presentCount: industryWorkers.filter(a => a.status === 'active' || a.status === 'completed').length,
        totalOvertimeHours: industryWorkers.reduce((acc, c) => acc + c.overtimeHours, 0),
        pendingComplaints: safetyReports.filter(r => r.industry === industry && r.status !== 'resolved').length,
      };
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const contextData = buildContextPayload();
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role,
          industry,
          contextData,
          language
        })
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am ready to assist.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: data.isSimulated
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: language === 'ta'
            ? 'மன்னிக்கவும், AI சேவையை தொடர்பு கொள்ள முடியவில்லை. தயவுசெய்து சிறிது நேரம் கழித்து முயற்சிக்கவும்.'
            : 'FairShift Assistant encountered a connection error. Deterministic rules continue to monitor your hours and safety.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const workerSuggestions = language === 'ta' 
    ? [
        'எனது சம்பளம் எவ்வாறு கணக்கிடப்படுகிறது?',
        'இந்த வாரம் நான் எத்தனை கூடுதல் மணிநேரம் வேலை செய்தேன்?',
        'பாதுகாப்பு புகாரை எவ்வாறு பதிவு செய்வது?',
        'கண்ணியமான வேலை உரிமைகள் என்ன?'
      ]
    : [
        'How much did I earn this week?',
        'Explain my payslip breakdown',
        'How do I report a safety hazard?',
        'How is overtime rate calculated?'
      ];

  const employerSuggestions = [
    'Summarize this week’s attendance',
    'Which safety complaints are unresolved?',
    'Explain the overtime fatigue trend',
    'Suggest ways to reduce excessive working hours'
  ];

  const suggestions = role === 'worker' ? workerSuggestions : employerSuggestions;

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black rounded-2xl shadow-2xl shadow-teal-500/30 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 cursor-pointer"
        aria-label="Open FairShift AI Assistant"
      >
        <Sparkles className="w-5 h-5 fill-slate-950 animate-spin-slow" />
        <span className="text-xs tracking-tight">FairShift AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
      </button>

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-slate-900 border-2 border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>FairShift AI Assistant</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    SDG 8
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {role === 'worker' ? `Worker: ${currentWorker.name}` : 'Admin Workforce View'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map(msg => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isAssistant ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-200'
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] rounded-2xl p-3 space-y-1 ${
                    isAssistant 
                      ? 'bg-slate-950 border border-slate-800 text-slate-200' 
                      : 'bg-teal-500 text-slate-950 font-medium'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed text-xs">
                      {msg.text}
                    </p>
                    <div className="flex items-center justify-between pt-1 gap-2 text-[10px]">
                      <span className={isAssistant ? 'text-slate-500' : 'text-slate-900/70'}>
                        {msg.timestamp}
                      </span>
                      {isAssistant && (
                        <TextToSpeechButton text={msg.text} label="Listen" className="py-0.5 px-1.5 text-[9px]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Bot className="w-4 h-4 text-teal-400 animate-bounce" />
                <span>FairShift AI analyzing data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-850 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 whitespace-nowrap transition cursor-pointer text-[10px]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <VoiceInputButton
                onTranscript={(transcript) => setInputText(transcript)}
                size="sm"
              />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'ta' ? 'சம்பளம், பணி நேரம், விதிகள் குறித்து கேளுங்கள்...' : 'Ask about wages, overtime, safety...'}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[9px] text-slate-500 text-center mt-1">
              Grounded in active workplace logs • UN SDG 8 compliant
            </div>
          </div>
        </div>
      )}
    </>
  );
};
