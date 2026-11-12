import React, { useState } from 'react';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { LESSONS_DATA } from '../../data/curriculum';
import { StudentProfile } from '../../types/student';
import { LessonSummary } from '../../types/curriculum';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { SpeakButton } from '../../components/common/SpeakButton';
import { Check, ChevronLeft, Lock, Play } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';

interface AdventureMapProps {
  activeProfile: StudentProfile;
  onSelectLesson: (week: number) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({ activeProfile, onSelectLesson }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const completedWeeks = activeProfile.progress.completedWeeks || [];
  const currentWeek = activeProfile.progress.currentWeek || 1;

  const visibleWorlds = WORLDS_DATA.filter(
    (world) => selectedMonth === 'all' || world.month === selectedMonth
  );

  const handleNodeClick = (lesson: LessonSummary) => {
    soundFx.playClick();
    onSelectLesson(lesson.week);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Friendly Light Banner */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-right">
          <h1 className="text-xl sm:text-2xl font-black text-[#203447]">
            🗺️ خريطة التعلم (6 عوالم • 24 مهمة)
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            اختر الشهر أو ادخل إلى مهمتك لمتابعة رحلة المختبر
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3 bg-[#FAFAF6] px-4 py-2.5 rounded-2xl border border-slate-200/80">
          <CharacterAvatar character="robo" size="sm" expression="excited" />
          <div className="text-right">
            <div className="text-xs font-black text-[#203447]">
              المكتمل: {completedWeeks.length} / {LESSONS_DATA.length}
            </div>
            <span className="text-[11px] text-[#30A89A] font-bold">
              المهمة الحالية: الدرس {currentWeek}
            </span>
          </div>
        </div>
      </div>

      {/* Month Filter Pills (Absorbed from MissionsPage) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setSelectedMonth('all');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
            selectedMonth === 'all'
              ? 'bg-[#30A89A] text-white shadow-teal-glow'
              : 'bg-white border border-slate-200 text-[#203447] hover:bg-slate-50'
          }`}
        >
          كل العوالم (24)
        </button>

        {WORLDS_DATA.map((world) => (
          <button
            key={world.month}
            type="button"
            onClick={() => {
              soundFx.playClick();
              setSelectedMonth(world.month);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              selectedMonth === world.month
                ? 'bg-[#30A89A] text-white shadow-teal-glow'
                : 'bg-white border border-slate-200 text-[#203447] hover:bg-slate-50'
            }`}
          >
            الشهر {world.month}: {world.titleAr.split('و')[0].trim()}
          </button>
        ))}
      </div>

      {/* The Worlds Journey */}
      <div className="space-y-6">
        {visibleWorlds.map((world) => {
          const worldLessons = LESSONS_DATA.filter((l) => l.worldId === world.id);

          return (
            <div
              key={world.id}
              className="rounded-3xl p-5 sm:p-6 border border-slate-200/90 bg-white shadow-card space-y-5"
            >
              {/* World Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: world.accentBg }}
                  >
                    <CharacterAvatar character={world.character} size="sm" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-black text-white"
                        style={{ backgroundColor: world.themeColor }}
                      >
                        الشهر {world.month}
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-[#203447]">{world.titleAr}</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                      {world.storyAr}
                    </p>
                  </div>
                </div>

                <SpeakButton
                  compact
                  text={`الشهر ${world.month}: ${world.titleAr}. ${world.storyAr}`}
                  labelAr="اسمع قصة الشهر"
                />
              </div>

              {/* 4 Missions Grid with Status (Completed / Current / Locked) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {worldLessons.map((lesson) => {
                  const isCompleted = completedWeeks.includes(lesson.week);
                  const isCurrent = lesson.week === currentWeek;
                  const isLocked = !isCompleted && lesson.week > currentWeek;

                  return (
                    <div
                      key={lesson.week}
                      onClick={() => handleNodeClick(lesson)}
                      className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group ${
                        isCurrent
                          ? 'bg-[#30A89A]/6 border-[#30A89A] shadow-sm'
                          : isCompleted
                          ? 'bg-[#FAFAF6] border-[#30A89A]/40 hover:bg-white'
                          : 'bg-[#FAFAF6] border-slate-200/80 hover:bg-white hover:border-[#6388D8]/60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-black text-white"
                            style={{ backgroundColor: world.themeColor }}
                          >
                            الدرس {lesson.week}
                          </span>

                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#30A89A] text-white text-[11px] font-black">
                              <Check className="w-3 h-3" />
                              <span>مكتملة</span>
                            </span>
                          ) : isCurrent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFC857] text-[#203447] text-[11px] font-black">
                              <Play className="w-3 h-3 fill-current" />
                              <span>الحالية</span>
                            </span>
                          ) : isLocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-600 text-[11px] font-black">
                              <Lock className="w-3 h-3" />
                              <span>مقفلة</span>
                            </span>
                          ) : null}
                        </div>

                        <h4 className="font-black text-[#203447] text-base group-hover:text-[#30A89A] transition-colors leading-snug">
                          {lesson.missionNameAr}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {lesson.storySnippetAr}
                        </p>
                      </div>

                      <div
                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'bg-[#30A89A] text-white shadow-teal-glow'
                            : 'bg-white border border-slate-200 text-[#203447] group-hover:bg-[#30A89A] group-hover:text-white group-hover:border-[#30A89A]'
                        }`}
                      >
                        <span>{isCurrent ? 'أكمل المهمة' : isCompleted ? 'مراجعة الدرس' : 'استكشف الدرس'}</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
