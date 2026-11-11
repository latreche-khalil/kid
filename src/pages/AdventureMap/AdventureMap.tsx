import React from 'react';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { LESSONS_DATA } from '../../data/curriculum';
import { StudentProfile } from '../../types/student';
import { LessonSummary } from '../../types/curriculum';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { SpeakButton } from '../../components/common/SpeakButton';
import { ChevronLeft } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';

interface AdventureMapProps {
  activeProfile: StudentProfile;
  onSelectLesson: (week: number) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({ onSelectLesson }) => {
  const handleNodeClick = (lesson: LessonSummary) => {
    soundFx.playClick();
    onSelectLesson(lesson.week);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12">
      {/* Top Friendly Light Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-rose-50/40 p-5 sm:p-7 border border-amber-200/70 shadow-card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 max-w-xl text-center md:text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">🗺️ خريطة الدروس (6 أشهر)</h1>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              اضغط على أي درس لتبدأ التعلم والتجربة فوراً — كل الدروس الـ 24 مفتوحة أمامك.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-white p-3 sm:px-4 sm:py-3 rounded-2xl border border-amber-200/70 shadow-xs">
            <CharacterAvatar character="robo" size="md" expression="excited" />
            <div className="text-right">
              <div className="text-sm font-black text-slate-900">24 درساً ممتعاً</div>
              <span className="text-xs text-slate-500 font-medium">اختر وابدأ المغامرة 🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 6 Worlds Journey */}
      <div className="space-y-6 sm:space-y-8">
        {WORLDS_DATA.map((world) => {
          const worldLessons = LESSONS_DATA.filter((l) => l.worldId === world.id);

          return (
            <div
              key={world.id}
              className="rounded-3xl p-5 sm:p-6 border border-slate-200/80 bg-white shadow-card space-y-5"
            >
              {/* World Header Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: world.accentBg }}
                  >
                    <CharacterAvatar character={world.character} size="md" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black text-white"
                        style={{ backgroundColor: world.themeColor }}
                      >
                        الشهر {world.month}
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900">{world.titleAr}</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-medium">
                      {world.storyAr}
                    </p>
                  </div>
                </div>

                <SpeakButton
                  text={`الشهر ${world.month}: ${world.titleAr}. ${world.storyAr}`}
                  labelAr="اسمع القصة"
                />
              </div>

              {/* Connected 4 Lessons Grid for this Month */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {worldLessons.map((lesson) => (
                  <div
                    key={lesson.week}
                    onClick={() => handleNodeClick(lesson)}
                    className="rounded-2xl p-4 sm:p-5 border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-[#FF5B5A]/60 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group"
                  >
                    <div className="space-y-2">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-black text-white"
                        style={{ backgroundColor: world.themeColor }}
                      >
                        الدرس {lesson.week}
                      </span>

                      <h4 className="font-black text-slate-900 text-base group-hover:text-[#FF5B5A] transition-colors leading-snug">
                        {lesson.missionNameAr}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {lesson.storySnippetAr}
                      </p>
                    </div>

                    <div className="py-2 px-3 rounded-xl bg-white border border-slate-200/80 text-indigo-700 group-hover:bg-[#FF5B5A] group-hover:text-white group-hover:border-[#FF5B5A] text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>ادخل الدرس</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
