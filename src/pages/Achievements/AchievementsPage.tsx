import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2, Lock, Shield, Cpu, Bot, Terminal, LineChart, Trophy } from 'lucide-react';
import { BADGES_DATA } from '../../data/badges';
import { StudentProfile, StudentBadge } from '../../types/student';
import { soundFx } from '../../services/sound/webAudio';

interface AchievementsPageProps {
  activeProfile: StudentProfile;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ activeProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<StudentBadge | null>(null);

  const earnedIds = new Set(activeProfile.progress.earnedBadgeIds);

  const filteredBadges = BADGES_DATA.filter(
    (b) => selectedCategory === 'all' || b.category === selectedCategory
  );

  const totalEarned = BADGES_DATA.filter((b) => earnedIds.has(b.id)).length;
  const earnedPercent = Math.round((totalEarned / BADGES_DATA.length) * 100);

  const categories = [
    { id: 'all', labelAr: 'كافة الأوسمة' },
    { id: 'programming', labelAr: 'البرمجة' },
    { id: 'electronics', labelAr: 'الإلكترونيات' },
    { id: 'robotics', labelAr: 'الروبوتات' },
    { id: 'python', labelAr: 'بايثون وعلم البيانات' },
    { id: 'ai', labelAr: 'الذكاء الاصطناعي' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black">
            <Trophy className="w-3.5 h-3.5" />
            <span>قاعة الأوسمة والتكريم</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">أوسمة {activeProfile.nickname || activeProfile.name}</h1>
          <p className="text-white/90 text-sm max-w-lg">
            كل وسام يمثل مهارة برمجية أو هندسية أثبت الطالب تمكنه منها في الميدان العملي.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[200px]">
          <div className="text-4xl font-black font-mono">{totalEarned} / {BADGES_DATA.length}</div>
          <span className="text-xs text-white/80 font-bold">أوسمة مفتوحة ({earnedPercent}%)</span>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-white shadow-md font-black'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.labelAr}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => {
          const isEarned = earnedIds.has(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedBadge(badge);
              }}
              className={`rounded-3xl p-6 border transition-all cursor-pointer flex flex-col items-center text-center space-y-4 group ${
                isEarned
                  ? 'bg-white border-amber-200 shadow-card hover:shadow-card-hover hover:border-amber-400'
                  : 'bg-slate-50/70 border-slate-200 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Badge Icon Emblem */}
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
                    isEarned
                      ? 'bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 shadow-md group-hover:scale-110'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Award className="w-10 h-10" />
                </div>

                {isEarned ? (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </div>
                ) : (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center shadow">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  {badge.titleAr}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">{badge.titleEn}</p>
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {badge.descriptionAr}
                </p>
              </div>

              {/* XP Value Pill */}
              <div className="pt-2 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-black text-amber-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>+{badge.xpValue} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div
              className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center ${
                earnedIds.has(selectedBadge.id)
                  ? 'bg-amber-100 text-amber-700 shadow-md'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                {earnedIds.has(selectedBadge.id) ? 'وسام مفتوح ومكتسب 🎉' : 'وسام قيد الإنجاز 🔒'}
              </span>
              <h3 className="text-xl font-black text-slate-900 pt-2">{selectedBadge.titleAr}</h3>
              <p className="text-xs text-slate-400 font-mono">{selectedBadge.titleEn}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {selectedBadge.descriptionAr}
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>القيمة التقديرية: +{selectedBadge.xpValue} XP</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

