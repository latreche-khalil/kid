import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, Lock, Star, ChevronLeft, Cpu } from 'lucide-react';
import { LESSONS_DATA } from '../../data/curriculum';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { StudentProfile } from '../../types/student';
import { soundFx } from '../../services/sound/webAudio';

interface MissionsPageProps {
  activeProfile: StudentProfile;
  onSelectLesson: (week: number) => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({ activeProfile, onSelectLesson }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const completedSet = new Set(activeProfile.progress.completedWeeks);
  const currentWeek = activeProfile.progress.currentWeek;

  const filteredLessons = LESSONS_DATA.filter(
    (l) => selectedMonth === 'all' || l.month === selectedMonth
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black">
            <Layers className="w-3.5 h-3.5" />
            <span>فهرس المهمات الـ 24</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">رحلة المبتكر الأسبوعية</h1>
          <p className="text-white/90 text-sm max-w-lg">
            24 محطة متصلة تنطلق من مبادئ تصحيح الأكواد حتى بناء مشاريع الذكاء الاصطناعي وإنترنت الأشياء.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[180px]">
          <div className="text-3xl font-black font-mono">
            {completedSet.size} / 24
          </div>
          <span className="text-xs text-white/80 font-bold">مهمة منجزة</span>
        </div>
      </div>

      {/* Month Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            soundFx.playClick();
            setSelectedMonth('all');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedMonth === 'all'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          كافة المهمات (24)
        </button>

        {WORLDS_DATA.map((world) => (
          <button
            key={world.month}
            onClick={() => {
              soundFx.playClick();
              setSelectedMonth(world.month);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedMonth === world.month
                ? 'bg-blue-600 text-white shadow-md font-black'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            الشهر {world.month}: {world.titleAr.split(' ')[0]} {world.titleAr.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const isCompleted = completedSet.has(lesson.week);
          const isCurrent = lesson.week === currentWeek;
          const isLocked = !isCompleted && !isCurrent && lesson.week > currentWeek;

          return (
            <div
              key={lesson.week}
              onClick={() => {
                soundFx.playClick();
                onSelectLesson(lesson.week);
              }}
              className={`rounded-3xl p-6 border transition-card cursor-pointer flex flex-col justify-between space-y-4 group ${
                isCurrent
                  ? 'bg-white border-blue-500 shadow-xl ring-4 ring-blue-500/10 scale-102'
                  : isCompleted
                  ? 'bg-white border-emerald-300 shadow-card hover:border-emerald-400'
                  : 'bg-slate-50/70 border-slate-200 opacity-80 hover:opacity-100 hover:bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    الأسبوع #{lesson.week}
                  </span>

                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مكتمل</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 animate-pulse">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        <span>الحالي</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                        <span>مغلق</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#FF5B5A] transition-colors leading-snug">
                  {lesson.missionNameAr}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {lesson.titleAr}
                </p>

                {/* Concepts preview */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {lesson.conceptsAr.slice(0, 3).map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>+{lesson.xpReward} XP</span>
                </span>

                <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>فتح الدرس</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

