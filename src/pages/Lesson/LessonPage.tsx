import React, { useState } from 'react';
import {
  Film,
  BookOpen,
  Gamepad2,
  Coffee,
  Cpu,
  Award,
  ScreenShare,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Wrench,
} from 'lucide-react';
import { getLessonByWeek } from '../../data/lessons';
import { CharacterSpeechBubble } from '../../components/characters/CharacterSpeechBubble';
import { InteractiveBreadboardCircuit } from '../../components/circuit/InteractiveBreadboardCircuit';
import { ReactionGameSimulator } from '../../components/simulator/ReactionGameSimulator';
import { BugHunterGame } from '../../components/games/BugHunterGame';
import { QuizSection } from '../../components/lesson/QuizSection';
import { Arduino3DExplorer } from '../../components/simulator/Arduino3DExplorer';
import { CircuitPlayground3D } from '../../components/simulator/CircuitPlayground3D';
import { MissionChallengeVerifier } from '../../components/simulator/MissionChallengeVerifier';
import { CodeSimulationEngine } from '../../components/simulator/CodeSimulationEngine';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { SpeakButton } from '../../components/common/SpeakButton';

interface LessonPageProps {
  weekNumber: number;
  onBackToMap: () => void;
  onOpenClassroom: () => void;
}

const KID_STAGE_TITLES: Record<string, string> = {
  story: 'القصة',
  theory: 'فكرة اليوم',
  games: 'لعبة ذكية',
  break: 'استراحة',
  lab: 'ركّب وجرّب 3D',
  quiz: 'اختبر نفسك',
};

export const LessonPage: React.FC<LessonPageProps> = ({
  weekNumber,
  onBackToMap,
  onOpenClassroom,
}) => {
  const [activeStage, setActiveStage] = useState<string>('story');
  const [codeTab, setCodeTab] = useState<'repaired' | 'broken'>('repaired');
  const [advancedLabMode, setAdvancedLabMode] = useState<'verifier' | 'code3d' | 'circuit' | 'board3d'>('verifier');
  const [showAdvancedLab, setShowAdvancedLab] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const lessonDetail = getLessonByWeek(weekNumber);

  const stageOrder = lessonDetail.timeline.map((s) => s.stage);
  const currentStageIdx = Math.max(0, stageOrder.indexOf(activeStage));
  const hasPrevStage = currentStageIdx > 0;
  const hasNextStage = currentStageIdx < stageOrder.length - 1;

  const goToStage = (stageKey: string) => {
    soundFx.playClick();
    setActiveStage(stageKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (text: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const stageIcons: Record<string, React.ReactNode> = {
    story: <Film className="w-4 h-4" />,
    theory: <BookOpen className="w-4 h-4" />,
    games: <Gamepad2 className="w-4 h-4" />,
    break: <Coffee className="w-4 h-4" />,
    lab: <Cpu className="w-4 h-4" />,
    quiz: <Award className="w-4 h-4" />,
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 sm:pb-16 w-full">
      {/* Top Bar: Big Back Button + Subtle Teacher Mode Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm">
        <button
          onClick={() => {
            soundFx.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-black transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للدروس</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenClassroom();
          }}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 text-xs font-bold transition-all"
          title="فتح وضع الشاشة الكاملة للشرح أمام التلاميذ"
        >
          <ScreenShare className="w-3.5 h-3.5" />
          <span>للمعلّم: عرض الصف</span>
        </button>
      </div>

      {/* Hero Lesson Header + Clear Numbered Stepper */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-amber-50/30 to-blue-50/40 p-4 sm:p-6 md:p-8 border border-amber-200/70 shadow-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-black">
              الأسبوع {lessonDetail.week}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-snug">
              {lessonDetail.missionNameAr}
            </h1>
            <p className="text-xs sm:text-base text-slate-600 font-bold">
              {lessonDetail.titleAr}
            </p>
          </div>

          <div className="shrink-0 hidden sm:block">
            <CharacterAvatar character={lessonDetail.story.characterSpeaker || 'robo'} size="lg" />
          </div>
        </div>

        {/* Kid-Friendly Numbered Stepper (Zero Hidden Overflow on Mobile) */}
        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-200/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {lessonDetail.timeline.map((stage, idx) => {
              const isActive = activeStage === stage.stage;
              const isCompleted = idx < currentStageIdx;
              const label = KID_STAGE_TITLES[stage.stage] || stage.titleAr;

              return (
                <button
                  key={stage.stage}
                  onClick={() => goToStage(stage.stage)}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-[#FF5B5A] text-white shadow-coral-glow font-black'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-white text-[#FF5B5A]'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {stageIcons[stage.stage]}
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Content Panel (One Step Card at a Time) */}
      <div className="space-y-6">
        {/* 1. CARTOON STORY */}
        {activeStage === 'story' && (
          <div className="space-y-6">
            <CharacterSpeechBubble
              character={lessonDetail.story.characterSpeaker}
              speakerNameAr="روبو (Robo)"
              badgeTextAr="قصة مغامرة اليوم"
              speechTextAr={lessonDetail.story.contentAr}
              expression="excited"
            />

            <div className="p-5 sm:p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-black text-base text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>ماذا فعل غليتش المشاغب؟ 👾</span>
                </h4>
                <SpeakButton text={lessonDetail.story.glitchActionAr} labelAr="اسمع المشكلة" />
              </div>
              <p className="text-sm sm:text-base leading-relaxed font-medium">{lessonDetail.story.glitchActionAr}</p>
            </div>

            {/* Learning Objectives Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-800">ماذا سنتعلم اليوم؟ 🎯</h3>
                <SpeakButton
                  text={lessonDetail.objectivesAr.join('. ')}
                  labelAr="اسمع الأهداف"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lessonDetail.objectivesAr.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-800 font-bold leading-relaxed">
                      {obj}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. THEORY & EXPLANATIONS */}
        {activeStage === 'theory' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{lessonDetail.theory.titleAr}</h2>
                <p className="text-sm text-slate-600 mt-1">{lessonDetail.theory.summaryAr}</p>
              </div>
              <SpeakButton
                text={`${lessonDetail.theory.titleAr}. ${lessonDetail.theory.summaryAr}`}
                labelAr="اسمع الملخص"
              />
            </div>

            <div className="space-y-5">
              {lessonDetail.theory.sections.map((sec, i) => (
                <div key={i} className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-800">{sec.headingAr}</h3>
                    <SpeakButton
                      text={`${sec.headingAr}. ${sec.contentAr}${sec.noteAr ? `. ${sec.noteAr}` : ''}`}
                      labelAr="اسمع الفكرة"
                    />
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                    {sec.contentAr}
                  </p>

                  {sec.codeExample && (
                    <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto" dir="ltr">
                      <pre className="whitespace-pre-wrap">{sec.codeExample}</pre>
                    </div>
                  )}

                  {sec.noteAr && (
                    <div className="p-3.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <span>💡</span>
                      <span>{sec.noteAr}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. GAMES & EXERCISES */}
        {activeStage === 'games' && (
          <div className="space-y-6">
            <BugHunterGame />
          </div>
        )}

        {/* 4. BRAIN BREAK */}
        {activeStage === 'break' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-card text-center space-y-4 sm:space-y-5 max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <Coffee className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">استراحة سريعة! ☕</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              حرّك يديك قليلاً، اشرب رشفة ماء، ثم اضغط على الخطوة التالية لنركّب الدارة ثلاثية الأبعاد معاً!
            </p>
            <div className="flex justify-center">
              <SpeakButton
                text="استراحة سريعة! حرّك يديك قليلاً واشرب رشفة ماء، ثم اضغط على الخطوة التالية لنركّب الدارة ثلاثية الأبعاد معاً!"
                labelAr="اسمع الرسالة"
              />
            </div>
          </div>
        )}

        {/* 5. ARDUINO LAB (Focused 3D Workbench + Collapsible Advanced Drawer) */}
        {activeStage === 'lab' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Simple Components Showcase */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-card space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base sm:text-xl font-black text-slate-800">القطع التي سنركبها اليوم 🧰</h3>
                <span className="text-xs text-slate-500 font-bold">
                  {lessonDetail.components.length} قطع
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {lessonDetail.components.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                        {comp.count}x
                      </span>
                    </div>
                    <div className="font-black text-xs sm:text-sm text-slate-900">{comp.nameAr}</div>
                    <p className="text-[11px] text-slate-600 leading-snug">{comp.roleAr}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Kid Experience: Project-Specific 3D Assembly & Test */}
            <CircuitPlayground3D lessonWeek={lessonDetail.week} />

            {/* Collapsible Toggle for Code, 2D Diagrams, Challenge Verifier & Extra Simulators */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowAdvancedLab((prev) => !prev);
                }}
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-black text-sm sm:text-base text-slate-900 block">
                      أدوات إضافية والكود الكامل (للمتقدمين والمعلّم 💻)
                    </span>
                    <span className="text-xs text-slate-500">
                      اضغط هنا لفتح الكود البرمجي الكامل، مخططات التوصيل 2D، وفاحص التحديات
                    </span>
                  </div>
                </div>
                {showAdvancedLab ? (
                  <ChevronUp className="w-5 h-5 text-slate-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
                )}
              </button>

              {showAdvancedLab && (
                <div className="p-3.5 sm:p-6 space-y-6 sm:space-y-8 border-t border-slate-200">
                  {/* Extra Lab Simulators Switcher */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-100">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setAdvancedLabMode('verifier');
                        }}
                        className={`py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                          advancedLabMode === 'verifier'
                            ? 'bg-emerald-600 text-white shadow-md font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        🧪 فحص التحدي آلياً
                      </button>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setAdvancedLabMode('code3d');
                        }}
                        className={`py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                          advancedLabMode === 'code3d'
                            ? 'bg-indigo-600 text-white shadow-md font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        💻 محاكي الكود
                      </button>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setAdvancedLabMode('circuit');
                        }}
                        className={`py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                          advancedLabMode === 'circuit'
                            ? 'bg-white text-slate-900 shadow-sm font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ⚡ مخطط التوصيل 2D
                      </button>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setAdvancedLabMode('board3d');
                        }}
                        className={`py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                          advancedLabMode === 'board3d'
                            ? 'bg-blue-600 text-white shadow-sm font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        🔍 استكشف لوحة UNO 3D
                      </button>
                    </div>

                    {advancedLabMode === 'verifier' ? (
                      <MissionChallengeVerifier weekNumber={lessonDetail.week} />
                    ) : advancedLabMode === 'code3d' ? (
                      <CodeSimulationEngine />
                    ) : advancedLabMode === 'circuit' ? (
                      <InteractiveBreadboardCircuit wiringSteps={lessonDetail.circuit.wiringSteps} />
                    ) : (
                      <Arduino3DExplorer />
                    )}
                  </div>

                  {/* Code Comparator: Repaired vs Broken Code */}
                  <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <h3 className="text-lg font-black text-slate-800">شفرة البرنامج (Arduino Code)</h3>
                        <p className="text-xs text-slate-500">قارن بين كود غليتش المعطوب وكود المشروع السليم</p>
                      </div>

                      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
                        <button
                          onClick={() => setCodeTab('repaired')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            codeTab === 'repaired'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          الكود السليم
                        </button>
                        <button
                          onClick={() => setCodeTab('broken')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            codeTab === 'broken'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          كود غليتش المعطوب
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          handleCopyCode(
                            codeTab === 'repaired' ? lessonDetail.code.repairedCode : lessonDetail.code.brokenCode
                          )
                        }
                        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
                      </button>

                      <div className="bg-slate-950 rounded-2xl p-5 font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto max-h-[420px]" dir="ltr">
                        <pre className="whitespace-pre leading-relaxed select-text">
                          {codeTab === 'repaired' ? lessonDetail.code.repairedCode : lessonDetail.code.brokenCode}
                        </pre>
                      </div>
                    </div>

                    {codeTab === 'broken' && (
                      <div className="space-y-3 pt-2">
                        <h4 className="font-bold text-rose-800 text-sm">الأخطاء في كود غليتش:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {lessonDetail.code.bugsList.map((bug, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                              <div className="font-black text-rose-900 flex items-center justify-between">
                                <span>سطر #{bug.line}</span>
                                <span className="text-[10px] text-rose-600">Bug #{i + 1}</span>
                              </div>
                              <p className="text-rose-950 font-bold">{bug.bugAr}</p>
                              <p className="text-emerald-700 font-bold">الحل: {bug.fixAr}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Extra Hardware Simulator */}
                  <ReactionGameSimulator />

                  {/* 3 Challenge Levels */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-800">تحديات إضافية داخل الحصة</h3>
                      <p className="text-xs text-slate-500">اختر التحدي المناسب لتطوير المشروع</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {lessonDetail.challengeLevels.map((lvl) => (
                        <div
                          key={lvl.level}
                          className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 shadow-sm border border-slate-200 mb-2">
                              {lvl.titleAr}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{lvl.goalAr}</h4>
                            <ul className="space-y-1.5 text-xs text-slate-700 mt-2">
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. QUIZ & CHALLENGES */}
        {activeStage === 'quiz' && (
          <QuizSection
            questions={lessonDetail.quiz}
            weekNumber={lessonDetail.week}
          />
        )}

        {/* Card-by-Card Bottom Next / Previous Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-card">
          <span className="sm:order-2 text-center text-xs sm:text-sm font-black text-slate-500">
            الخطوة {currentStageIdx + 1} من {stageOrder.length}
          </span>

          <div className="grid grid-cols-2 gap-2.5 sm:contents">
            <button
              onClick={() => hasPrevStage && goToStage(stageOrder[currentStageIdx - 1])}
              disabled={!hasPrevStage}
              className="sm:order-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs sm:text-sm font-black transition-all min-h-[46px]"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>الخطوة السابقة</span>
            </button>

            {hasNextStage ? (
              <button
                onClick={() => goToStage(stageOrder[currentStageIdx + 1])}
                className="sm:order-3 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 rounded-2xl bg-[#FF5B5A] hover:bg-[#ff4645] text-white text-xs sm:text-base font-black shadow-coral-glow transition-all active:scale-95 min-h-[46px]"
              >
                <span className="truncate">التالي: {KID_STAGE_TITLES[stageOrder[currentStageIdx + 1]] || 'التالي'}</span>
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onBackToMap();
                }}
                className="sm:order-3 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-base font-black shadow-md transition-all active:scale-95 min-h-[46px]"
              >
                <span className="truncate">العودة لكل الدروس</span>
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
