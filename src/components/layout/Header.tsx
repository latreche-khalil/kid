import React from 'react';
import { Compass, Map } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { soundFx } from '../../services/sound/webAudio';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeProfile: StudentProfile;
  profiles: StudentProfile[];
  onProfileChange: (profile: StudentProfile) => void;
  onOpenCreateProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  activeProfile,
}) => {
  const kidNavItems = [
    { id: 'home', labelAr: 'الرئيسية', icon: <Compass className="w-4 h-4" /> },
    { id: 'map', labelAr: 'خريطة التعلم (24)', icon: <Map className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-3 sm:gap-5">
          {/* Logo & Brand Identity */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              soundFx.playClick();
              onTabChange('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            aria-label="الرئيسية — المبتكرون الصغار"
          >
            <CharacterAvatar character="robo" size="sm" />
            <div>
              <h1 className="text-sm sm:text-xl font-black text-[#203447] tracking-tight group-hover:text-[#30A89A] transition-colors whitespace-nowrap block">
                المبتكرون الصغار
              </h1>
              <p className="hidden sm:block text-[11px] font-bold text-slate-400">
                مرحباً {activeProfile.name}! ✨
              </p>
            </div>
          </a>

          {/* Super Simple Kid Navigation (2 Clean Choices) */}
          <nav className="flex items-center gap-2" aria-label="التنقل الرئيسي">
            {kidNavItems.map((item) => {
              const isActive =
                currentTab === item.id ||
                (item.id === 'map' && currentTab === 'lesson');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    onTabChange(item.id);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#30A89A] text-white shadow-teal-glow'
                      : 'bg-[#FAFAF6] text-[#203447] hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.labelAr}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
