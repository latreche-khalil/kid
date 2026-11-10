import React from 'react';
import { CharacterAvatar } from './CharacterAvatars';

interface CharacterSpeechBubbleProps {
  character: 'robo' | 'brainy' | 'sparky' | 'buggy' | 'glitch';
  speakerNameAr: string;
  badgeTextAr?: string;
  speechTextAr: string | string[];
  expression?: 'happy' | 'thinking' | 'excited' | 'warning';
  className?: string;
  actionButton?: {
    labelAr: string;
    onClick: () => void;
  };
}

export const CharacterSpeechBubble: React.FC<CharacterSpeechBubbleProps> = ({
  character,
  speakerNameAr,
  badgeTextAr,
  speechTextAr,
  expression = 'happy',
  className = '',
  actionButton,
}) => {
  const paragraphs = Array.isArray(speechTextAr) ? speechTextAr : [speechTextAr];

  // Character theme styling
  const themeMap = {
    robo: {
      border: 'border-blue-100',
      bg: 'bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30',
      badge: 'bg-blue-600 text-white',
      accent: 'text-blue-700',
    },
    brainy: {
      border: 'border-indigo-100',
      bg: 'bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/30',
      badge: 'bg-indigo-600 text-white',
      accent: 'text-indigo-700',
    },
    sparky: {
      border: 'border-amber-100',
      bg: 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30',
      badge: 'bg-amber-500 text-white',
      accent: 'text-amber-800',
    },
    buggy: {
      border: 'border-emerald-100',
      bg: 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30',
      badge: 'bg-emerald-600 text-white',
      accent: 'text-emerald-700',
    },
    glitch: {
      border: 'border-pink-200',
      bg: 'bg-gradient-to-br from-pink-50/80 via-white to-rose-50/30',
      badge: 'bg-pink-600 text-white',
      accent: 'text-pink-700',
    },
  }[character];

  return (
    <div className={`relative flex flex-col md:flex-row items-start gap-4 p-5 md:p-6 rounded-3xl border ${themeMap.border} ${themeMap.bg} shadow-card transition-card ${className}`}>
      {/* Sparkle badge decoration */}
      <div className="shrink-0 flex flex-col items-center">
        <CharacterAvatar character={character} size="lg" expression={expression} />
        <span className={`mt-2 px-3 py-0.5 text-xs font-bold rounded-full ${themeMap.badge} shadow-sm`}>
          {speakerNameAr}
        </span>
      </div>

      {/* Bubble Content */}
      <div className="flex-1 w-full space-y-3">
        {badgeTextAr && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700 shadow-sm border border-gray-100">
            <span className="text-amber-500">✦</span>
            <span>{badgeTextAr}</span>
          </div>
        )}

        <div className="space-y-2 text-gray-800 leading-relaxed text-base md:text-lg font-medium">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {actionButton && (
          <div className="pt-2">
            <button
              onClick={actionButton.onClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[#FF5B5A] hover:bg-[#E84A5F] active:scale-95 shadow-coral-glow transition-all text-sm"
            >
              <span>{actionButton.labelAr}</span>
              <span>←</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

