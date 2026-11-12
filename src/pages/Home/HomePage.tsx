import React from 'react';
import { ArrowLeft, Map, Play } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { LESSONS_DATA } from '../../data/curriculum';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { SpeakButton } from '../../components/common/SpeakButton';
import { soundFx } from '../../services/sound/webAudio';

interface HomePageProps {
  activeProfile: StudentProfile;
  onNavigateToMap: () => void;
  onNavigateToLesson: (week: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activeProfile,
  onNavigateToMap,
  onNavigateToLesson,
}) => {
  const currentWeek = activeProfile.progress.currentWeek || 1;
  const currentLesson = LESSONS_DATA.find((l) => l.week === currentWeek) || LESSONS_DATA[0];
  const currentWorld = WORLDS_DATA.find((w) => w.id === currentLesson.worldId) || WORLDS_DATA[0];

  const completedCount = activeProfile.progress.completedWeeks.length;
  const unlockedWorldIds = new Set<number>([1, currentWorld.id]);
  activeProfile.progress.completedWeeks.forEach((w) => {
    const lesson = LESSONS_DATA.find((l) => l.week === w);
    if (lesson) unlockedWorldIds.add(lesson.worldId);
  });
  const discoveredWorldsCount = unlockedWorldIds.size;
  const journeyPercent = Math.max(
    Math.round((discoveredWorldsCount / WORLDS_DATA.length) * 100),
    Math.round(((completedCount + 1) / LESSONS_DATA.length) * 100)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* 1. Focused Welcome + Robo + Current Mission */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 text-center space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-28 h-28 rounded-3xl bg-[#FAFAF6] border-2 border-[#30A89A]/30 flex items-center justify-center shadow-2xs">
            <CharacterAvatar character="robo" size="xl" expression="excited" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFAF6] border border-slate-200/90">
            <span className="text-xs sm:text-sm font-black text-[#203447]">
              أهلاً {activeProfile.name} في عالم الابتكار!
            </span>
            <SpeakButton
              compact
              text={`أهلاً ${activeProfile.name} في عالم الابتكار! مهمتك الحالية هي ${currentLesson.missionNameAr}`}
              labelAr="اسمع الترحيب"
            />
          </div>
        </div>

        {/* Current Active Mission */}
        <div className="rounded-2xl bg-[#FAFAF6] border border-slate-200/80 p-5 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-[#30A89A] block">
              مهمتك الحالية • الشهر {currentLesson.month} • الدرس {currentLesson.week}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#203447]">
              {currentLesson.missionNameAr}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
              {currentLesson.titleAr}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onNavigateToLesson(currentLesson.week);
            }}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#30A89A] hover:bg-[#279185] active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-teal-glow transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>أكمل مهمتك ←</span>
          </button>
        </div>
      </section>

      {/* 2. Simple Learning Journey Progress + Map CTA */}
      <section className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#203447]">رحلتك التعليمية</h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              {discoveredWorldsCount}/6 عوالم مكتشفة • {completedCount}/24 مهمة مكتملة
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FFC857]/25 text-[#203447] text-xs font-black font-mono">
            🏆 {activeProfile.progress.xp} XP
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-[#FAFAF6] border border-slate-200/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#30A89A] transition-all duration-500"
            style={{ width: `${journeyPercent}%` }}
          />
        </div>

        <div className="pt-1 flex justify-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onNavigateToMap();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FAFAF6] hover:bg-[#6388D8]/10 text-[#203447] border border-slate-200 hover:border-[#6388D8]/50 font-black text-xs sm:text-sm transition-all"
          >
            <Map className="w-4 h-4 text-[#6388D8]" />
            <span>استكشف خريطة التعلم</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
