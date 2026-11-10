import React from 'react';

interface CharacterAvatarProps {
  character: 'robo' | 'brainy' | 'sparky' | 'buggy' | 'glitch';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'warning';
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-36 h-36',
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  size = 'md',
  className = '',
  expression = 'happy',
}) => {
  const sizeClass = sizeClasses[size];

  switch (character) {
    case 'robo':
      // The Hero Robot: Blue/Cyan/White friendly bot
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Antenna */}
            <line x1="50" y1="20" x2="50" y2="8" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="7" r="5" fill="#EF4444" className="animate-pulse" />
            
            {/* Robot Head */}
            <rect x="22" y="20" width="56" height="50" rx="16" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />
            
            {/* Head Face Screen */}
            <rect x="28" y="28" width="44" height="34" rx="10" fill="#0F172A" />
            
            {/* Visor / Eyes */}
            {expression === 'thinking' ? (
              <path d="M35 44 Q42 40 45 44 M55 44 Q58 40 65 44" stroke="#38BDF8" strokeWidth="4" fill="none" strokeLinecap="round" />
            ) : expression === 'excited' ? (
              <>
                <polygon points="34,48 40,38 46,48" fill="#38BDF8" />
                <polygon points="54,48 60,38 66,48" fill="#38BDF8" />
              </>
            ) : (
              <>
                <circle cx="40" cy="42" r="5" fill="#38BDF8" />
                <circle cx="60" cy="42" r="5" fill="#38BDF8" />
                <circle cx="42" cy="40" r="1.5" fill="#FFFFFF" />
                <circle cx="62" cy="40" r="1.5" fill="#FFFFFF" />
              </>
            )}

            {/* Cheerful Mouth */}
            <path d="M42 53 Q50 59 58 53" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Ear Bolts */}
            <rect x="16" y="38" width="6" height="14" rx="3" fill="#60A5FA" />
            <rect x="78" y="38" width="6" height="14" rx="3" fill="#60A5FA" />

            {/* Neck & Chest Top */}
            <rect x="42" y="70" width="16" height="8" fill="#1E40AF" />
            <path d="M26 78 C26 78 36 74 50 74 C64 74 74 78 74 78 L80 94 L20 94 Z" fill="#3B82F6" />
            <circle cx="50" cy="85" r="4" fill="#FBBF24" />
          </svg>
        </div>
      );

    case 'brainy':
      // Brainy: Purple/Indigo logic & algorithm bot with glowing brain nodes
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Glowing Brain Dome */}
            <path d="M25 46 C25 22 75 22 75 46 Z" fill="#E0E7FF" stroke="#6366F1" strokeWidth="3" />
            {/* Synapse Lines in Brain */}
            <circle cx="40" cy="32" r="3" fill="#8B5CF6" />
            <circle cx="60" cy="32" r="3" fill="#8B5CF6" />
            <circle cx="50" cy="24" r="3.5" fill="#EC4899" className="animate-pulse" />
            <line x1="40" y1="32" x2="50" y2="24" stroke="#A78BFA" strokeWidth="2" />
            <line x1="60" y1="32" x2="50" y2="24" stroke="#A78BFA" strokeWidth="2" />
            
            {/* Robot Head Body */}
            <rect x="24" y="44" width="52" height="34" rx="12" fill="#4F46E5" stroke="#3730A3" strokeWidth="3" />
            
            {/* Glasses / Smart Eyes */}
            <circle cx="40" cy="58" r="8" fill="#1E1B4B" stroke="#FBBF24" strokeWidth="2.5" />
            <circle cx="60" cy="58" r="8" fill="#1E1B4B" stroke="#FBBF24" strokeWidth="2.5" />
            <line x1="48" y1="58" x2="52" y2="58" stroke="#FBBF24" strokeWidth="2.5" />
            
            {/* Eye Dots */}
            <circle cx="41" cy="58" r="3.5" fill="#A5B4FC" />
            <circle cx="61" cy="58" r="3.5" fill="#A5B4FC" />
            
            {/* Smart Smile */}
            <path d="M44 70 Q50 74 56 70" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            
            {/* Shoulders */}
            <path d="M26 80 L74 80 L80 94 L20 94 Z" fill="#4338CA" />
          </svg>
        </div>
      );

    case 'sparky':
      // Sparky: Amber / Gold energetic electronics & Arduino robot
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Lightning bolt ears */}
            <polygon points="18,36 10,48 20,48 14,60 26,44 18,44" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            <polygon points="82,36 90,48 80,48 86,60 74,44 82,44" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            
            {/* Sparky Head */}
            <rect x="24" y="24" width="52" height="48" rx="14" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
            
            {/* LED matrix eyes */}
            <rect x="32" y="34" width="14" height="14" rx="4" fill="#78350F" />
            <rect x="54" y="34" width="14" height="14" rx="4" fill="#78350F" />
            
            <circle cx="39" cy="41" r="3.5" fill="#FDE047" className="animate-ping" />
            <circle cx="61" cy="41" r="3.5" fill="#FDE047" className="animate-ping" />
            <circle cx="39" cy="41" r="3" fill="#FBBF24" />
            <circle cx="61" cy="41" r="3" fill="#FBBF24" />
            
            {/* Resistor colored stripes on collar */}
            <rect x="34" y="60" width="32" height="6" rx="2" fill="#92400E" />
            <rect x="38" y="60" width="4" height="6" fill="#EF4444" />
            <rect x="46" y="60" width="4" height="6" fill="#10B981" />
            <rect x="54" y="60" width="4" height="6" fill="#F59E0B" />
            
            {/* Body */}
            <path d="M26 74 C26 74 36 72 50 72 C64 72 74 74 74 74 L78 94 L22 94 Z" fill="#D97706" />
            <circle cx="50" cy="84" r="5" fill="#FEF08A" />
          </svg>
        </div>
      );

    case 'buggy':
      // Buggy: Cute green mini mechanical bug robot
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Curly spring antennas */}
            <path d="M38 28 Q30 18 36 10 Q42 6 40 12" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="10" r="4" fill="#34D399" />
            <path d="M62 28 Q70 18 64 10 Q58 6 60 12" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="60" cy="10" r="4" fill="#34D399" />
            
            {/* Buggy Body / Shell */}
            <ellipse cx="50" cy="54" rx="30" ry="26" fill="#10B981" stroke="#047857" strokeWidth="3" />
            
            {/* Big Googly Eyes */}
            <circle cx="40" cy="44" r="10" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
            <circle cx="60" cy="44" r="10" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
            
            <circle cx="42" cy="44" r="5" fill="#064E3B" />
            <circle cx="58" cy="44" r="5" fill="#064E3B" />
            <circle cx="44" cy="42" r="2" fill="#FFFFFF" />
            <circle cx="60" cy="42" r="2" fill="#FFFFFF" />
            
            {/* Cute Quirky Teeth */}
            <path d="M42 62 Q50 68 58 62" stroke="#064E3B" strokeWidth="2.5" fill="none" />
            <rect x="47" y="62" width="6" height="5" fill="#FFFFFF" rx="1" />
            
            {/* Legs */}
            <path d="M22 52 L12 56 M20 62 L10 70 M78 52 L88 56 M80 62 L90 70" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'glitch':
      // Glitch: Mischievous Neon-Magenta antagonist robot with glitch spikes
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Glitch spikes */}
            <polygon points="26,18 36,30 20,32" fill="#EC4899" />
            <polygon points="50,12 56,28 44,28" fill="#F43F5E" />
            <polygon points="74,18 80,32 64,30" fill="#EC4899" />
            
            {/* Glitch Head */}
            <rect x="22" y="28" width="56" height="46" rx="10" fill="#18181B" stroke="#EC4899" strokeWidth="3" />
            
            {/* Neon Glitch Eyes (Zigzag / Angry squint) */}
            <path d="M30 46 L44 42 L38 52" stroke="#F43F5E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M70 46 L56 42 L62 52" stroke="#F43F5E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            
            {/* Glitch digital artifacts / offset pixels */}
            <rect x="26" y="58" width="8" height="4" fill="#06B6D4" />
            <rect x="66" y="34" width="6" height="3" fill="#FBBF24" />
            
            {/* Mischievous Grin */}
            <path d="M38 64 L44 68 L50 63 L56 68 L62 64" stroke="#A855F7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Body */}
            <path d="M24 76 L76 76 L82 94 L18 94 Z" fill="#27272A" stroke="#EC4899" strokeWidth="2" />
          </svg>
        </div>
      );
  }
};

