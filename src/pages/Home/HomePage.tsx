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
    <div className="space-y-7 sm:space-y-10 pb-12 sm:pb-16">
      {/* 1. Simple Cheerful Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-white border-2 border-amber-200 shadow-card p-5 sm:p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
              <span>أهلاً بك يا بطل في مغامرة البرمجة والآردوينو!</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              تعلّم، العب، وابنِ <br />
              <span className="text-[#FF5B5A]">مشاريعك الإلكترونية بيديك!</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-medium">
              اختر أي شهر من الأسفل، واضغط على الدرس الذي تريد تجربته مع أصدقائنا: روبو وسباركي.
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
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-all"
              >
                <Map className="w-4 h-4" />
                <span>عرض كل الأشهر الـ 6</span>
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
            <div className="relative w-full max-w-[190px] sm:max-w-[240px] lg:max-w-[280px] aspect-square rounded-3xl bg-gradient-to-tr from-amber-300 via-orange-300 to-rose-300 p-2 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-white p-4 sm:p-6 flex flex-col items-center justify-center relative">
                <CharacterAvatar character="robo" size="xl" expression="excited" />
                <div className="mt-2 px-3 sm:px-4 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] sm:text-xs whitespace-nowrap">
                  أهلاً! أنا صديقك روبو 🤖
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Visual Lesson Shelf (Pick Month -> Pick Lesson) */}
      <section className="space-y-5 sm:space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
            اختر الشهر لتشاهد دروسه 🗓️
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            رحلة من 6 أشهر، في كل شهر 4 مغامرات ممتعة
          </p>
        </div>

        {/* 6 Colorful Month Selector Pills */}
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
                className={`p-2.5 sm:p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1.5 sm:gap-2 ${
                  isSelected
                    ? 'bg-white border-[#FF5B5A] shadow-lg ring-4 ring-[#FF5B5A]/15'
                    : 'bg-white/80 border-slate-200 hover:border-amber-300 hover:bg-white'
                }`}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: world.accentBg }}
                >
                  <CharacterAvatar character={world.character} size="sm" />
                </div>
                <div className="w-full">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black text-white"
                    style={{ backgroundColor: world.themeColor }}
                  >
                    الشهر {world.month}
                  </span>
                  <div className="font-black text-xs text-slate-800 mt-1 line-clamp-1">
                    {world.titleAr.split('و')[0].trim()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Month World Intro Strip */}
        <div
          className="rounded-3xl p-4 sm:p-5 md:p-6 border-2 bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right"
          style={{ borderColor: selectedWorld.themeColor }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: selectedWorld.accentBg }}
            >
              <CharacterAvatar character={selectedWorld.character} size="md" />
            </div>
            <div>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-black text-white"
                style={{ backgroundColor: selectedWorld.themeColor }}
              >
                الشهر {selectedWorld.month}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">{selectedWorld.titleAr}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">{selectedWorld.storyAr}</p>
            </div>
          </div>

          <SpeakButton
            text={`${selectedWorld.titleAr}. ${selectedWorld.storyAr}`}
            labelAr="اسمع قصة الشهر"
          />
        </div>

        {/* 4 Large, Clean, Kid-Friendly Lesson Cards for the Selected Month */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {monthLessons.map((lesson) => (
            <div
              key={lesson.week}
              onClick={() => {
                soundFx.playClick();
                onNavigateToLesson(lesson.week);
              }}
              className="rounded-3xl p-4 sm:p-6 bg-white border-2 border-slate-200 hover:border-[#FF5B5A] shadow-card hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 sm:space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-xl text-xs font-black text-white"
                    style={{ backgroundColor: selectedWorld.themeColor }}
                  >
                    الدرس {lesson.week}
                  </span>
                  <span className="text-xl">🚀</span>
                </div>

                <h4 className="font-black text-lg text-slate-900 group-hover:text-[#FF5B5A] transition-colors leading-snug">
                  {lesson.missionNameAr}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {lesson.storySnippetAr}
                </p>
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-2xl bg-slate-900 group-hover:bg-[#FF5B5A] text-white font-black text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>ادخل الدرس</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
