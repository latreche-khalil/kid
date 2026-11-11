import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';

interface SpeakButtonProps {
  text: string;
  labelAr?: string;
  className?: string;
}

/**
 * Kid-friendly Arabic text-to-speech button using browser SpeechSynthesis API.
 * Lets younger students (ages 7-10) listen to stories and explanations.
 */
export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  labelAr = 'اسمع الشرح',
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const handleToggleSpeak = () => {
    soundFx.playClick();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
        isSpeaking
          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
          : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-300 shadow-sm'
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>إيقاف الصوت</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
          <span>{labelAr}</span>
        </>
      )}
    </button>
  );
};

