import React, { useState } from 'react';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { LESSONS_DATA } from '../../data/curriculum';
import { StudentProfile } from '../../types/student';
import { LessonSummary } from '../../types/curriculum';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { BookOpen, Sparkles, ChevronLeft, Cpu, Eye, Play } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';

interface AdventureMapProps {
  activeProfile: StudentProfile;
  onSelectLesson: (week: number) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({ activeProfile, onSelectLesson }) => {
  const [selectedMission, setSelectedMission] = useState<LessonSummary | null>(null);

  const handleNodeClick = (lesson: LessonSummary) => {
    soundFx.playClick();
    onSelectLesson(lesson.week);
  };

  const handlePreviewClick = (e: React.MouseEvent, lesson: LessonSummary) => {
    e.stopPropagation();
    soundFx.playClick();
    setSelectedMission(lesson);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Top Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <span>🗺️ خريطة المنهج الكاملة</span>
              <span>•</span>
              <span>6 عوالم • 24 أسبوعاً دراسياً</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">طريق المبتكر الصغير: استعراض شامل للمنهج</h1>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              جميع الدروس والمهمات الـ 24 مفتوحة ومتاحة للعرض المباشر. انقر على أي أسبوع لدخول الحصة، واستعراض القصة، والدارة ثلاثية الأبعاد، والشفرة البرمجية، والمفاهيم النظرية.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
            <CharacterAvatar character="robo" size="lg" expression="excited" />
            <div className="text-right">
              <span className="text-xs text-amber-200 font-bold block">وضع المنصة الحالي:</span>
              <div className="text-lg font-black text-white">العرض والاستعراض المفتوح ✨</div>
              <span className="text-xs text-white/80">
                24 درساً متاحاً للمطالعة الفورية
              </span>
            </div>
          </div>
        </div>

        {/* Decorative sparkles */}
        <span className="absolute top-4 right-10 text-white/30 text-3xl">✦</span>
        <span className="absolute bottom-4 left-16 text-white/20 text-4xl">★</span>
      </div>

      {/* The 6 Worlds Progression Journey */}
      <div className="space-y-16">
        {WORLDS_DATA.map((world) => {
          const worldLessons = LESSONS_DATA.filter((l) => l.worldId === world.id);

          return (
            <div
              key={world.id}
              className="relative rounded-3xl p-6 md:p-10 border bg-white border-slate-200 shadow-card transition-all hover:shadow-lg"
            >
              {/* World Header Card */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-md"
                    style={{ backgroundColor: world.accentBg }}
                  >
                    <CharacterAvatar character={world.character} size="md" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: world.themeColor }}
                      >
                        الشهر {world.month}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{world.subtitleAr}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">{world.titleAr}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{world.titleEn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>4 مهمات أسبوعية متكاملة</span>
                </div>
              </div>

              {/* Story Intro of this world */}
              <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 ml-1">قصة العالم:</span>
                {world.storyAr}
              </div>

              {/* Connected Missions Grid for this World (ALL UNLOCKED) */}
              <div className="relative pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {worldLessons.map((lesson) => {
                    return (
                      <div
                        key={lesson.week}
                        onClick={() => handleNodeClick(lesson)}
                        className="relative rounded-2xl p-5 border-2 border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/20 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        {/* Top Node Pill */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            الأسبوع #{lesson.week}
                          </span>

                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>متاح للعرض</span>
                          </span>
                        </div>

                        {/* Title & Info */}
                        <div className="space-y-1.5 flex-1">
                          <h4 className="font-black text-slate-900 text-sm group-hover:text-[#FF5B5A] transition-colors leading-snug">
                            {lesson.missionNameAr}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {lesson.titleAr}
                          </p>
                        </div>

                        {/* Arduino Role Highlight */}
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                          <div className="text-[11px] text-slate-600 line-clamp-1 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{lesson.arduinoRoleAr.split(':')[0]}</span>
                          </div>

                          {/* CTA Button */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                              <span>دخول الدرس</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </span>

                            <button
                              onClick={(e) => handlePreviewClick(e, lesson)}
                              className="text-[11px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-md"
                              title="معاينة سريعة"
                            >
                              معاينة ℹ️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Preview Modal if requested */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-100 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-black">
                    الأسبوع #{selectedMission.week}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">معاينة تفاصيل المهمة</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                  {selectedMission.missionNameAr}
                </h3>
                <p className="text-xs text-slate-500">{selectedMission.titleAr}</p>
              </div>

              <button
                onClick={() => setSelectedMission(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Story Snippet */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-black text-slate-900 block mb-1">قصة المهمة:</span>
              {selectedMission.storySnippetAr}
            </div>

            {/* Key Concepts Tags */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500">المفاهيم البرمجية والهندسية:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMission.conceptsAr.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Arduino Role */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-800">دور لوحة آردوينو UNO: </span>
                <span>{selectedMission.arduinoRoleAr}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">الدرس متاح للعرض والمطالعة المباشرة</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  إغلاق
                </button>

                <button
                  onClick={() => {
                    onSelectLesson(selectedMission.week);
                    setSelectedMission(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5B5A] hover:bg-[#E84A5F] text-white font-bold text-xs shadow-coral-glow transition-all"
                >
                  <span>فتح الدرس الآن</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
