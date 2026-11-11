import React from 'react';
import { Compass, BookOpen, GraduationCap } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { soundFx } from '../../services/sound/webAudio';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeProfile: StudentProfile;
  profiles: StudentProfile[];
  onProfileChange: (profile: StudentProfile) => void;
  onOpenClassroom: () => void;
  onOpenCreateProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
}) => {
  const kidNavItems = [
    { id: 'home', labelAr: 'الرئيسية', icon: <Compass className="w-4 h-4" /> },
    { id: 'map', labelAr: 'كل الدروس (24)', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => {
              soundFx.playClick();
              onTabChange('home');
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <CharacterAvatar character="robo" size="sm" />
              <span className="absolute -top-1 -right-1 text-amber-500 text-xs">✦</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#FF5B5A] transition-colors">
                  المبتكرون الصغار
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400">تعلّم • العب • اكتشف • ابنِ</p>
            </div>
          </div>

          {/* Super Simple Kid Navigation (Only 2 Clear Choices) */}
          <nav className="flex items-center gap-2">
            {kidNavItems.map((item) => {
              const isActive =
                currentTab === item.id ||
                (item.id === 'map' && (currentTab === 'missions' || currentTab === 'lesson'));

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    onTabChange(item.id);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${
                    isActive
                      ? 'bg-[#FF5B5A] text-white shadow-coral-glow scale-102'
                      : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-amber-50 border border-slate-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.labelAr}</span>
                </button>
              );
            })}
          </nav>

          {/* Discreet Teacher Access (Tucked away cleanly) */}
          <div className="flex items-center">
            <button
              onClick={() => {
                soundFx.playClick();
                onTabChange('instructor');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentTab === 'instructor'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
              title="أدوات المعلّم وإدارة العرض"
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">للمعلّم</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
