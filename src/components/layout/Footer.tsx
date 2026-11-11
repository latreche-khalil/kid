import React from 'react';
import { Sparkles, Heart, Shield, Cpu } from 'lucide-react';
import { CharacterAvatar } from '../characters/CharacterAvatars';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 sm:mt-20 pt-10 sm:pt-16 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <CharacterAvatar character="robo" size="sm" />
              <div>
                <span className="text-xl font-black text-slate-900">المبتكرون الصغار</span>
                <p className="text-xs font-bold text-[#FF5B5A]">YOUNG INNOVATORS PLATFORM</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              مغامرة تعليمية تفاعلية مدتها ستة أشهر للأطفال واليافعين (7–14 سنة)، تدمج عتاد الآردوينو مع البرمجة، الخوارزميات، الذكاء الاصطناعي، وعلم البيانات.
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-slate-800">
              <span className="text-[#FF5B5A]">✦</span>
              <span>تعلّم • العب • اكتشف • ابنِ (Learn • Play • Discover • Build)</span>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">العوالم الستة</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>1. البرمجة والتفكير الحاسوبي</li>
              <li>2. الخوارزميات وهياكل البيانات</li>
              <li>3. الإلكترونيات والأنظمة الرقمية</li>
              <li>4. الروبوتات والهندسة الميكانيكية</li>
              <li>5. بايثون والاتصال وعلم البيانات</li>
              <li>6. الذكاء الاصطناعي والأمن والابتكار</li>
            </ul>
          </div>

          {/* Local Security & Hardware Badge */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">الأمان والعتاد</h4>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span>لوحة Arduino UNO R3 متكاملة</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                حاضرة في كافة الأسابيع الـ 24 من خلال التجارب الحقيقية والاتصال التسلسلي USB Serial.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>خصوصية تامة: حفظ محلي على الجهاز دون سحابة</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — منصة المبتكرون الصغار (Young Innovators)
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span>صُممت بشغف لإلهام الجيل القادم من المهندسين والمبتكرين</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

