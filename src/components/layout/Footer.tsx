import React from 'react';
import { Shield, Cpu } from 'lucide-react';
import { CharacterAvatar } from '../characters/CharacterAvatars';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 border-t border-slate-200/70 mt-10 sm:mt-14 py-6 sm:py-8" role="contentinfo" aria-label="تذييل الموقع">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
        <div className="flex items-center gap-3">
          <CharacterAvatar character="robo" size="sm" />
          <div>
            <span className="text-base font-black text-slate-900">المبتكرون الصغار</span>
            <p className="text-[11px] font-bold text-slate-400">
              تعلّم • العب • اكتشف • ابنِ — مغامرة البرمجة والآردوينو (6 أشهر)
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-slate-500" aria-label="معلومات إضافية">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 text-amber-800 border border-amber-200/70">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            <span>Arduino UNO R3</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 text-emerald-700 border border-emerald-200/70">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>حفظ محلي آمن على الجهاز</span>
          </span>
          <span className="text-slate-400 font-medium">
            © {new Date().getFullYear()} المبتكرون الصغار
          </span>
        </nav>
      </div>
    </footer>
  );
};

