import React, { useState } from 'react';
import { ArrowLeft, Play, Sparkles, Map } from 'lucide-react';
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
  onNavigateToMap,
  onNavigateToLesson,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  const selectedWorld = WORLDS_DATA.find((w) => w.month === selectedMonth) || WORLDS_DATA[0];
  const monthLessons = LESSONS_DATA.filter((l) => l.month === selectedMonth);

  return (
    <div className="space-y-8 sm:space-y-10 pb-8 sm:pb-12">
      {/* 1. Clean Airy Hero Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-amber-50/35 to-rose-50/30 border border-amber-200/60 shadow-card p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>أهلاً بك يا بطل في مغامرة البرمجة والآردوينو</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 leading-[1.2]">
              تعلّم، العب، وابنِ <br />
              <span className="text-[#FF5B5A]">مشاريعك الإلكترونية بيديك!</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              اختر أي شهر من الأسفل، واضغط على الدرس الذي تريد تجربته مع أصدقائنا روبو وسباركي.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToLesson(1);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF5B5A] hover:bg-[#E84A5F] active:scale-95 text-white font-black text-sm shadow-coral-glow transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>ابدأ الدرس الأول الآن</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToMap();
                }}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-bold text-sm transition-all shadow-xs"
              >
                <Map className="w-4 h-4" />
                <span>خريطة الأشهر الـ 6</span>
              </button>

              <div className="flex justify-center sm:justify-start">
                <SpeakButton
                  text="أهلاً بك يا بطل في منصة المبتكرون الصغار! اختر أي شهر من الأسفل واضغط على الدرس الذي تريد تجربته مع روبو وسباركي."
                  labelAr="اسمع الترحيب"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[210px] sm:max-w-[250px] aspect-square rounded-3xl bg-gradient-to-tr from-amber-100/90 via-rose-50 to-sky-100/90 p-5 border border-white shadow-card flex flex-col items-center justify-center">
              <CharacterAvatar character="robo" size="xl" expression="excited" />
              <div className="mt-3 px-4 py-1.5 rounded-full bg-white text-slate-800 border border-amber-200/80 shadow-xs font-black text-xs whitespace-nowrap">
                أهلاً! أنا صديقك روبو 🤖
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Visual Lesson Shelf (Pick Month -> Pick Lesson) */}
      <section className="space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              اختر الشهر لاستكشاف الدروس 🗓️
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              6 أشهر تعليمية منظمة — كل شهر يضم 4 دروس تفاعلية
            </p>
          </div>
        </div>

        {/* 6 Clean Month Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {WORLDS_DATA.map((world) => {
            const isSelected = selectedMonth === world.month;
            return (
              <button
                key={world.month}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedMonth(world.month);
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-white border-[#FF5B5A] shadow-card ring-2 ring-[#FF5B5A]/15'
                    : 'bg-white/75 border-slate-200/80 hover:border-amber-300 hover:bg-white'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: world.accentBg }}
                >
                  <CharacterAvatar character={world.character} size="sm" />
                </div>
                <div className="w-full space-y-1">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black text-white"
                    style={{ backgroundColor: world.themeColor }}
                  >
                    الشهر {world.month}
                  </span>
                  <div className="font-bold text-xs text-slate-800 line-clamp-1">
                    {world.titleAr.split('و')[0].trim()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Unified World Panel + 4 Clean Lesson Cards */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-card p-4 sm:p-6 space-y-5">
          {/* Month Header Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 text-center md:text-right">
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: selectedWorld.accentBg }}
              >
                <CharacterAvatar character={selectedWorld.character} size="md" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-black text-white"
                    style={{ backgroundColor: selectedWorld.themeColor }}
                  >
                    الشهر {selectedWorld.month}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{selectedWorld.titleAr}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{selectedWorld.storyAr}</p>
              </div>
            </div>

            <div className="shrink-0">
              <SpeakButton
                text={`${selectedWorld.titleAr}. ${selectedWorld.storyAr}`}
                labelAr="اسمع قصة الشهر"
              />
            </div>
          </div>

          {/* 4 Clean, Light Lesson Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {monthLessons.map((lesson) => (
              <div
                key={lesson.week}
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToLesson(lesson.week);
                }}
                className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-[#FF5B5A]/60 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-black text-white"
                    style={{ backgroundColor: selectedWorld.themeColor }}
                  >
                    الدرس {lesson.week}
                  </span>

                  <h4 className="font-black text-base text-slate-900 group-hover:text-[#FF5B5A] transition-colors leading-snug">
                    {lesson.missionNameAr}
                  </h4>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {lesson.storySnippetAr}
                  </p>
                </div>

                <div className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200/80 text-indigo-700 group-hover:bg-[#FF5B5A] group-hover:text-white group-hover:border-[#FF5B5A] font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs">
                  <span>ادخل الدرس</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
