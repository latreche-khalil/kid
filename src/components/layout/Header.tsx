import React, { useState } from 'react';
import {
  Compass,
  Map,
  Layers,
  Gamepad2,
  FolderGit2,
  ScreenShare,
  Users,
  Plus,
  Sparkles,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Cpu,
  Eye
} from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { storageService } from '../../services/storage/localStorage';
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
  activeProfile,
  profiles,
  onProfileChange,
  onOpenClassroom,
  onOpenCreateProfile,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', labelAr: 'الرئيسية', icon: <Compass className="w-4 h-4" /> },
    { id: 'map', labelAr: 'خريطة المنهج (24 أسبوعاً)', icon: <Map className="w-4 h-4" /> },
    { id: 'missions', labelAr: 'فهرس الدروس', icon: <Layers className="w-4 h-4" /> },
    { id: 'simulator3d', labelAr: 'المختبر ثلاثي الأبعاد 3D', icon: <Cpu className="w-4 h-4 text-cyan-500 animate-pulse" /> },
    { id: 'games', labelAr: 'الألعاب التعليمية', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'projects', labelAr: 'معرض المشاريع', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'instructor', labelAr: 'لوحة المعلم والعرض', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
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
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  UNO R3
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400">YOUNG INNOVATORS</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    onTabChange(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF5B5A] text-white shadow-coral-glow scale-102 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.labelAr}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Classroom Mode & Showcase Mode Pill */}
          <div className="flex items-center gap-3">
            {/* Open Showcase Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>وضع العرض المفتوح</span>
            </div>

            {/* Classroom Presentation Mode Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenClassroom();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-indigo-glow transition-all"
              title="عرض قاعة الدرس بشاشة كاملة للمعلّم أو العرض التقديمي"
            >
              <ScreenShare className="w-4 h-4" />
              <span className="hidden sm:inline">شاشة العرض (Classroom)</span>
            </button>

            {/* Profile / Visitor Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-right"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center overflow-hidden">
                  <CharacterAvatar
                    character={(activeProfile.avatarSeed as any) || 'sparky'}
                    size="sm"
                    className="w-8 h-8 scale-90"
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {activeProfile.nickname || activeProfile.name}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span>مستعرض المنهج</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-2xl p-2.5 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs font-bold text-slate-400">
                    ملفات الاستعراض والمطالعة:
                  </div>

                  <div className="space-y-1 my-2 max-h-56 overflow-y-auto">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          soundFx.playClick();
                          storageService.setActiveProfileId(p.id);
                          onProfileChange(p);
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                          p.id === activeProfile.id
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CharacterAvatar character={(p.avatarSeed as any) || 'sparky'} size="sm" className="w-7 h-7" />
                          <span>{p.nickname || p.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">طالب</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenCreateProfile();
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة مستعرض جديد</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FF5B5A] text-white font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.labelAr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
