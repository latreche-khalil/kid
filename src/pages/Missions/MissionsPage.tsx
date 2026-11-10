import React, { useState } from 'react';
import { Layers, Sparkles, BookOpen, ChevronLeft, Cpu, Eye } from 'lucide-react';
import { LESSONS_DATA } from '../../data/curriculum';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { StudentProfile } from '../../types/student';
import { soundFx } from '../../services/sound/webAudio';

interface MissionsPageProps {
  activeProfile: StudentProfile;
  onSelectLesson: (week: number) => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({ onSelectLesson }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

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
            <span>فهرس الدروس والمهمات (24 أسبوعاً)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">استعراض محتوى المنهج التعليمي</h1>
          <p className="text-white/90 text-sm max-w-lg leading-relaxed">
            جميع محطات الرحلة الـ 24 متاحة للعرض المباشر. يمكنك الدخول لأي درس ومطالعة القصة، والمفاهيم النظرية، والمحاكي 3D، والكود البرمجي دون أي قيود.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[200px]">
          <div className="text-2xl font-black font-mono">
            24 / 24 درس
          </div>
          <span className="text-xs text-white/80 font-bold">مفتوحة للعرض والمطالعة ✨</span>
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
          كافة الدروس (24)
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

      {/* Missions Grid (ALL 24 FULLY OPEN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          return (
            <div
              key={lesson.week}
              onClick={() => {
                soundFx.playClick();
                onSelectLesson(lesson.week);
              }}
              className="rounded-3xl p-6 border bg-white border-slate-200 shadow-card hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    الأسبوع #{lesson.week} • الشهر {lesson.month}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    <Eye className="w-3.5 h-3.5" />
                    <span>متاح للعرض</span>
                  </span>
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
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>تطبيق UNO R3</span>
                </span>

                <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>عرض محتوى الدرس</span>
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
