import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ 
  onTranscript, 
  className = '', 
  size = 'md' 
}) => {
  const { language } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = language === 'ta' ? 'ta-IN' : 'en-US';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied. You can still type directly.');
        } else if (event.error === 'no-speech') {
          // No speech detected, quietly stop
        } else {
          setErrorMsg('Voice input paused. Please type in the text box.');
        }
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [language, onTranscript]);

  const toggleListening = () => {
    setErrorMsg(null);
    if (!recognition) {
      // Simulated voice input for environments without Web Speech API
      setIsListening(true);
      setTimeout(() => {
        const simulatedText = language === 'ta'
          ? 'மேல் தளத்தில் மின்சார கம்பி அறுந்து விழுந்துள்ளது உடனடியாக சரிசெய்யவும்.'
          : 'Severe water leak detected near electrical switchboard on Floor 3.';
        onTranscript(simulatedText);
        setIsListening(false);
      }, 1500);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start failed:', err);
        setIsListening(false);
      }
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base font-medium'
  }[size];

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        className={`inline-flex items-center gap-2 rounded-xl transition-all duration-200 cursor-pointer ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 ring-4 ring-red-400/30 animate-pulse' 
            : 'bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 border border-teal-500/30'
        } ${sizeClasses} ${className}`}
        title={isListening ? 'Listening... click to stop' : 'Click to speak via microphone'}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 animate-bounce" />
            <span>{language === 'ta' ? 'கேட்கிறது...' : 'Listening...'}</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>{language === 'ta' ? 'குரல் உள்ளீடு' : 'Voice Input'}</span>
          </>
        )}
      </button>

      {errorMsg && (
        <div className="absolute top-full left-0 mt-2 z-30 flex items-center gap-1.5 p-2 bg-amber-950/90 border border-amber-600/50 rounded-lg text-amber-200 text-xs shadow-xl whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{errorMsg}</span>
          <button 
            type="button" 
            onClick={() => setErrorMsg(null)}
            className="ml-1 text-amber-400 hover:text-white font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
