import React, { useState } from 'react';
import { Maximize2, Minimize2, ArrowRight, ArrowLeft, X, Film, BookOpen, Gamepad2, Coffee, Cpu, Award } from 'lucide-react';
import { LessonDetail } from '../../types/curriculum';
import { SessionTimer } from './SessionTimer';
import { CharacterSpeechBubble } from '../characters/CharacterSpeechBubble';
import { InteractiveBreadboardCircuit } from '../circuit/InteractiveBreadboardCircuit';
import { ReactionGameSimulator } from '../simulator/ReactionGameSimulator';
import { CircuitPlayground3D } from '../simulator/CircuitPlayground3D';
import { BugHunterGame } from '../games/BugHunterGame';
import { soundFx } from '../../services/sound/webAudio';

interface ClassroomModeProps {
  lesson: LessonDetail;
  onClose: () => void;
}

export const ClassroomMode: React.FC<ClassroomModeProps> = ({ lesson, onClose }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [classroomLabMode, setClassroomLabMode] = useState<'3d' | '2d' | 'simulator'>('3d');

  const stages = lesson.timeline;
  const currentStage = stages[currentStageIdx];

  const toggleFullscreen = () => {
    soundFx.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleNextStage = () => {
    soundFx.playClick();
    if (currentStageIdx < stages.length - 1) {
      setCurrentStageIdx((idx) => idx + 1);
    }
  };

  const handlePrevStage = () => {
    soundFx.playClick();
    if (currentStageIdx > 0) {
      setCurrentStageIdx((idx) => idx - 1);
    }
  };

  const stageIcons = {
    story: <Film className="w-5 h-5" />,
    theory: <BookOpen className="w-5 h-5" />,
    games: <Gamepad2 className="w-5 h-5" />,
    break: <Coffee className="w-5 h-5" />,
    lab: <Cpu className="w-5 h-5" />,
    quiz: <Award className="w-5 h-5" />,
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] overflow-y-auto flex flex-col font-sans">
      {/* Top Classroom Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        {/* Left: Lesson Title & Week */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="الخروج من وضع قاعة الدرس"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                الأسبوع {lesson.week}
              </span>
              <span className="text-xs text-slate-500 font-bold">وضع العرض الصفي التفاعلي</span>
            </div>
            <h1 className="text-lg md:text-xl font-black text-slate-900 mt-0.5">
              {lesson.missionNameAr} — {lesson.titleAr}
            </h1>
          </div>
        </div>

        {/* Right: Controls & Fullscreen */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            إغلاق العرض
          </button>
        </div>
      </div>

      {/* Main Classroom Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Stage Timeline Stepper */}
        <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2">
            {stages.map((stage, idx) => {
              const isActive = currentStageIdx === idx;
              const isPast = currentStageIdx > idx;

              return (
                <button
                  key={stage.stage}
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentStageIdx(idx);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all whitespace-nowrap text-right ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-102 font-black'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl ${
                      isActive ? 'bg-white/20 text-white' : isPast ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {stageIcons[stage.stage as keyof typeof stageIcons] || <Film className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs">{stage.titleAr}</div>
                    <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {stage.duration} دقيقة
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Stage Timer */}
        <SessionTimer
          stageTitleAr={currentStage.titleAr}
          stageDurationMinutes={currentStage.duration}
          onStageComplete={() => soundFx.playVictoryFanfare()}
        />

        {/* Dynamic Presentation Content based on Active Stage */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-card min-h-[500px]">
          {/* STAGE 1: CARTOON STORY */}
          {currentStage.stage === 'story' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Film className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">{lesson.story.titleAr}</h2>
                  <p className="text-sm text-slate-500">القصة الكرتونية التمهيدية لمغامرة الأسبوع</p>
                </div>
              </div>

              <CharacterSpeechBubble
                character={lesson.story.characterSpeaker}
                speakerNameAr="روبو (Robo)"
                badgeTextAr="رسالة عاجلة من قلب المختبر"
                speechTextAr={lesson.story.contentAr}
                expression="excited"
              />

              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
                <h4 className="font-black text-base text-rose-900 flex items-center gap-2">
                  <span>👾 تخريب غليتش المشاغب:</span>
                </h4>
                <p className="text-sm leading-relaxed">{lesson.story.glitchActionAr}</p>
              </div>

              {/* Objectives List */}
              <div className="space-y-3 pt-4">
                <h4 className="font-black text-slate-800 text-lg">أهداف مهمتنا اليوم:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lesson.objectivesAr.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-800 font-medium leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: THEORY & CONCEPTS */}
          {currentStage.stage === 'theory' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">{lesson.theory.titleAr}</h2>
                  <p className="text-sm text-slate-500">{lesson.theory.summaryAr}</p>
                </div>
              </div>

              <div className="space-y-6">
                {lesson.theory.sections.map((sec, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-xl font-black text-slate-800">{sec.headingAr}</h3>
                    <p className="text-base text-slate-700 leading-relaxed">{sec.contentAr}</p>

                    {sec.codeExample && (
                      <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm border border-slate-800 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{sec.codeExample}</pre>
                      </div>
                    )}

                    {sec.noteAr && (
                      <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs font-bold">
                        💡 ملاحظة هامة: {sec.noteAr}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 3: GAMES & EXERCISES */}
          {currentStage.stage === 'games' && (
            <div className="space-y-6">
              <BugHunterGame />
            </div>
          )}

          {/* STAGE 4: BRAIN BREAK */}
          {currentStage.stage === 'break' && (
            <div className="py-12 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                <Coffee className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">استراحة المبتكر الذكي (5 دقائق)</h2>
              <p className="text-base text-slate-600 max-w-lg mx-auto">
                قف وقم بتمارين إطالة خفيفة مع روبو! انظر بعيداً عن الشاشة لمدة 20 ثانية، واشرب كوباً من الماء المنعش لتنشيط خلايا عقلك.
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-sm">
                <span>🧘‍♂️ تمرين روبو: تنفس بعمق 4 ثوانٍ واحبس النفس 4 ثوانٍ ثم ازفر بهدوء.</span>
              </div>
            </div>
          )}

          {/* STAGE 5: ARDUINO LAB */}
          {currentStage.stage === 'lab' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">المختبر العملي والدارة الفيزيائية</h2>
                    <p className="text-sm text-slate-500">توصيل عناصر الدارة على لوحة التجارب واختبار سرعة الاستجابة الحية</p>
                  </div>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 text-xs font-bold">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setClassroomLabMode('3d');
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      classroomLabMode === '3d'
                        ? 'bg-[#FF5B5A] text-white shadow-coral-glow font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ⚡ دارة المشروع 3D
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setClassroomLabMode('2d');
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      classroomLabMode === '2d'
                        ? 'bg-blue-600 text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📋 مخطط التوصيل 2D
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setClassroomLabMode('simulator');
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      classroomLabMode === 'simulator'
                        ? 'bg-emerald-600 text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ⏱️ جهاز قياس السرعة
                  </button>
                </div>
              </div>

              {/* Lab Content View */}
              {classroomLabMode === '3d' ? (
                <CircuitPlayground3D lessonWeek={lesson.week} />
              ) : classroomLabMode === '2d' ? (
                <InteractiveBreadboardCircuit wiringSteps={lesson.circuit.wiringSteps} />
              ) : (
                <ReactionGameSimulator />
              )}
            </div>
          )}

          {/* STAGE 6: QUIZ & CHALLENGES */}
          {currentStage.stage === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">الاختبار الختامي والمستويات الثلاثة</h2>
                  <p className="text-sm text-slate-500">تقييم الفهم وحصد وسام صائد الثغرات</p>
                </div>
              </div>

              {/* Three Challenge Levels for the Classroom */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lesson.challengeLevels.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 shadow-sm border border-slate-200">
                          {lvl.titleAr}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{lvl.titleEn}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{lvl.goalAr}</h4>
                      <p className="text-xs text-slate-500 mb-3">{lvl.targetAudienceAr}</p>

                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {lvl.tasksAr.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200 text-[11px] text-amber-800 font-medium">
                      💡 تلميح: {lvl.hintAr}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Classroom Navigation Footer */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handlePrevStage}
            disabled={currentStageIdx === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
              currentStageIdx === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>المرحلة السابقة ({stages[currentStageIdx - 1]?.titleAr || ''})</span>
          </button>

          <button
            onClick={handleNextStage}
            disabled={currentStageIdx === stages.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${
              currentStageIdx === stages.length - 1
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-[#FF5B5A] text-white hover:bg-[#E84A5F] shadow-coral-glow'
            }`}
          >
            <span>
              {currentStageIdx === stages.length - 1
                ? 'تم الانتهاء من الحصة 🎉'
                : `المرحلة التالية: ${stages[currentStageIdx + 1]?.titleAr}`}
            </span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

