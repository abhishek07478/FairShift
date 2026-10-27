import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ 
  text, 
  className = '',
  label 
}) => {
  const { language } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 0.95; // slightly slower for maximum clarity

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
        isPlaying 
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' 
          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
      } ${className}`}
      title={isPlaying ? 'Click to stop audio' : 'Listen to this text read aloud'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-teal-400" />
          <span>{label || (language === 'ta' ? 'கேளுங்கள்' : 'Read Aloud')}</span>
        </>
      )}
    </button>
  );
};
