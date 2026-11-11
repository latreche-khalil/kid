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
    <div className="space-y-7 sm:space-y-10 pb-12 sm:pb-16">
      {/* Top Friendly Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 sm:p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">🗺️ خريطة الدروس (6 أشهر)</h1>
            <p className="text-white/95 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              اضغط على أي درس تريد أن تبدأ به! كل الدروس مفتوحة لتتعلم وتلعب وتكتشف بحرية.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-white/15 backdrop-blur-md p-3 sm:p-3.5 rounded-3xl border border-white/25">
            <CharacterAvatar character="robo" size="md" expression="excited" />
            <div className="text-right">
              <div className="text-sm sm:text-base font-black text-white">24 درساً ممتعاً</div>
              <span className="text-xs text-white/90">اضغط وابدأ فوراً! 🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 6 Worlds Journey */}
      <div className="space-y-8 sm:space-y-12">
        {WORLDS_DATA.map((world) => {
          const worldLessons = LESSONS_DATA.filter((l) => l.worldId === world.id);

          return (
            <div
              key={world.id}
              className="relative rounded-3xl p-4 sm:p-6 md:p-8 border-2 bg-white border-slate-200 shadow-card space-y-5 sm:space-y-6"
            >
              {/* World Header Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shrink-0 shadow-md"
                    style={{ backgroundColor: world.accentBg }}
                  >
                    <CharacterAvatar character={world.character} size="md" />
                  </div>
                  <div>
                    <span
                      className="inline-block px-3 py-0.5 rounded-full text-xs font-black text-white"
                      style={{ backgroundColor: world.themeColor }}
                    >
                      الشهر {world.month}
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{world.titleAr}</h2>
                  </div>
                </div>

                <SpeakButton
                  text={`الشهر ${world.month}: ${world.titleAr}. ${world.storyAr}`}
                  labelAr="اسمع القصة"
                />
              </div>

              {/* Story Intro of this world */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {world.storyAr}
              </div>

              {/* Connected 4 Lessons Grid for this Month */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {worldLessons.map((lesson) => (
                  <div
                    key={lesson.week}
                    onClick={() => handleNodeClick(lesson)}
                    className="rounded-2xl p-4 sm:p-5 border-2 border-slate-200 hover:border-[#FF5B5A] bg-white hover:bg-rose-50/10 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-3 sm:space-y-4 group"
                  >
                    <div className="space-y-2.5">
                      <span
                        className="inline-block px-3 py-1 rounded-xl text-xs font-black text-white"
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

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 group-hover:text-[#FF5B5A] flex items-center gap-1">
                        <span>ادخل الدرس</span>
                        <ChevronLeft className="w-4 h-4" />
                      </span>
                      <span className="text-lg">✨</span>
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
