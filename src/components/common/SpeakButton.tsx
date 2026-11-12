import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';

interface SpeakButtonProps {
  text: string;
  labelAr?: string;
  compact?: boolean;
  className?: string;
}

/**
 * Kid-friendly Arabic text-to-speech button using browser SpeechSynthesis API.
 * Supports compact icon-only mode for clean uncluttered UI.
 */
export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  labelAr = 'اسمع الشرح',
  compact = false,
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
    const cleanText = text.replace(/`/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
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
      title={isSpeaking ? 'إيقاف الصوت' : labelAr}
      aria-label={isSpeaking ? 'إيقاف الصوت' : labelAr}
      className={`inline-flex items-center justify-center gap-1.5 ${
        compact ? 'w-8 h-8 rounded-full' : 'px-3 py-1.5 rounded-xl text-xs font-bold'
      } transition-all border shrink-0 ${
        isSpeaking
          ? 'bg-[#F47C62]/15 text-[#F47C62] border-[#F47C62]/40 animate-pulse'
          : 'bg-white hover:bg-[#30A89A]/10 text-[#203447] border-slate-200 hover:border-[#30A89A]/40 shadow-2xs'
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current" />
          {!compact && <span>إيقاف</span>}
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#30A89A]" />
          {!compact && <span>{labelAr}</span>}
        </>
      )}
    </button>
  );
};

