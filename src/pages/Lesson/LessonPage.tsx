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
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  Code2,
  Zap,
  ChevronLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getLessonByWeek } from '../../data/lessons';
import { LESSONS_DATA } from '../../data/curriculum';
import { CharacterSpeechBubble } from '../../components/characters/CharacterSpeechBubble';
import { InteractiveBreadboardCircuit } from '../../components/circuit/InteractiveBreadboardCircuit';
import { ReactionGameSimulator } from '../../components/simulator/ReactionGameSimulator';
import { BugHunterGame } from '../../components/games/BugHunterGame';
import { QuizSection } from '../../components/lesson/QuizSection';
import { Arduino3DExplorer } from '../../components/simulator/Arduino3DExplorer';
import { CircuitPlayground3D } from '../../components/simulator/CircuitPlayground3D';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';

interface LessonPageProps {
  weekNumber: number;
  onBackToMap: () => void;
  onOpenClassroom: () => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  weekNumber,
  onBackToMap,
  onOpenClassroom,
}) => {
  const [activeStage, setActiveStage] = useState<string>('story');
  const [codeTab, setCodeTab] = useState<'repaired' | 'broken'>('repaired');
  const [labViewMode, setLabViewMode] = useState<'circuit' | 'playground3d' | 'board3d'>('playground3d');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const lessonDetail = getLessonByWeek(weekNumber);
  const lessonSummary = LESSONS_DATA.find((l) => l.week === weekNumber) || LESSONS_DATA[0];

  const handleCopyCode = (text: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // If lesson is Week 1 (fully implemented)
  if (lessonDetail) {
    return (
      <div className="space-y-8 pb-16">
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <button
            onClick={() => {
              soundFx.playClick();
              onBackToMap();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لخريطة المغامرة</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-black border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>+{lessonDetail.xpReward} XP</span>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenClassroom();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-indigo-glow transition-all"
            >
              <ScreenShare className="w-4 h-4" />
              <span>عرض قاعة الدرس (Classroom Mode)</span>
            </button>
          </div>
        </div>

        {/* Hero Lesson Header */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-6 md:p-10 border border-slate-200 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black">
                  الأسبوع #{lessonDetail.week}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  المدة: 120 دقيقة تعليمية
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  Arduino UNO R3
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                {lessonDetail.missionNameAr}
              </h1>
              <p className="text-base text-slate-600 font-medium">
                {lessonDetail.titleAr} ({lessonDetail.titleEn})
              </p>
            </div>

            <div className="shrink-0">
              <CharacterAvatar character="buggy" size="lg" />
            </div>
          </div>

          {/* 6 Stage Stepper Tab Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {lessonDetail.timeline.map((stage) => {
                const isActive = activeStage === stage.stage;

                const stageIcons: Record<string, React.ReactNode> = {
                  story: <Film className="w-4 h-4" />,
                  theory: <BookOpen className="w-4 h-4" />,
                  games: <Gamepad2 className="w-4 h-4" />,
                  break: <Coffee className="w-4 h-4" />,
                  lab: <Cpu className="w-4 h-4" />,
                  quiz: <Award className="w-4 h-4" />,
                };

                return (
                  <button
                    key={stage.stage}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveStage(stage.stage);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#FF5B5A] text-white shadow-coral-glow scale-102 font-black'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {stageIcons[stage.stage]}
                    <span>{stage.titleAr}</span>
                    <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      ({stage.duration}د)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage Content Panel */}
        <div className="space-y-8">
          {/* 1. CARTOON STORY */}
          {activeStage === 'story' && (
            <div className="space-y-6">
              <CharacterSpeechBubble
                character={lessonDetail.story.characterSpeaker}
                speakerNameAr="روبو (Robo)"
                badgeTextAr="نداء استغاثة من روبو"
                speechTextAr={lessonDetail.story.contentAr}
                expression="excited"
                actionButton={{
                  labelAr: 'الانتقال إلى المفاهيم النظرية',
                  onClick: () => {
                    soundFx.playClick();
                    setActiveStage('theory');
                  },
                }}
              />

              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2 shadow-sm">
                <h4 className="font-black text-base text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>تخريب غليتش المشاغب:</span>
                </h4>
                <p className="text-sm leading-relaxed">{lessonDetail.story.glitchActionAr}</p>
              </div>

              {/* Learning Objectives Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-4">
                <h3 className="text-xl font-black text-slate-800">أهداف التعلم في هذه المهمة:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lessonDetail.objectivesAr.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-xs md:text-sm text-slate-800 font-medium leading-relaxed">
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
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-slate-900">{lessonDetail.theory.titleAr}</h2>
                <p className="text-sm text-slate-500 mt-1">{lessonDetail.theory.summaryAr}</p>
              </div>

              <div className="space-y-6">
                {lessonDetail.theory.sections.map((sec, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h3 className="text-xl font-black text-slate-800">{sec.headingAr}</h3>
                    <p className="text-sm md:text-base text-slate-700 leading-relaxed font-normal">
                      {sec.contentAr}
                    </p>

                    {sec.codeExample && (
                      <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{sec.codeExample}</pre>
                      </div>
                    )}

                    {sec.noteAr && (
                      <div className="p-3.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-2">
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
            <div className="space-y-8">
              <BugHunterGame />
            </div>
          )}

          {/* 4. BRAIN BREAK */}
          {activeStage === 'break' && (
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-card text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Coffee className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">استراحة المبتكر الذكي (5 دقائق)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                دع عينيك تستريحان! انظر إلى شيء بعيد عبر النافذة، وشرب رشفة ماء، واستعد لمرحلة تركيب الأسلاك والدارة الفيزيائية.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                🧘 روبو يقول: العقل المنعش يكتشف الثغرات أسرع بعشر مرات!
              </div>
            </div>
          )}

          {/* 5. ARDUINO LAB */}
          {activeStage === 'lab' && (
            <div className="space-y-8">
              {/* Components Showcase */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xl font-black text-slate-800">المكونات الإلكترونية المطلوبة</h3>
                  <span className="text-xs text-slate-400 font-bold">
                    {lessonDetail.components.length} عناصر
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {lessonDetail.components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {comp.count}x
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{comp.nameEn}</span>
                      </div>
                      <div className="font-bold text-xs text-slate-800">{comp.nameAr}</div>
                      <p className="text-[10px] text-slate-500 leading-normal">{comp.roleAr}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Visual View Switcher */}
              <div className="flex flex-wrap items-center justify-between p-1.5 rounded-2xl bg-slate-100 max-w-xl">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setLabViewMode('playground3d');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    labViewMode === 'playground3d'
                      ? 'bg-[#FF5B5A] text-white shadow-coral-glow font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>🌀 مختبر الدوائر 3D</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setLabViewMode('circuit');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    labViewMode === 'circuit'
                      ? 'bg-white text-slate-900 shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ مخطط التوصيل
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setLabViewMode('board3d');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    labViewMode === 'board3d'
                      ? 'bg-blue-600 text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                  <span>🔍 لوحة UNO 3D</span>
                </button>
              </div>

              {labViewMode === 'playground3d' ? (
                <CircuitPlayground3D />
              ) : labViewMode === 'circuit' ? (
                <InteractiveBreadboardCircuit wiringSteps={lessonDetail.circuit.wiringSteps} />
              ) : (
                <Arduino3DExplorer />
              )}

              {/* Code Comparator: Repaired vs Broken Code */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-slate-800">شفرة البرنامج (Arduino Code)</h3>
                    <p className="text-xs text-slate-500">قارن بين كود غليتش المعطوب وكود المشروع السليم المصحح</p>
                  </div>

                  {/* Switcher Tab */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setCodeTab('repaired')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        codeTab === 'repaired'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      الكود المصحح السليم (المعتمد)
                    </button>
                    <button
                      onClick={() => setCodeTab('broken')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        codeTab === 'broken'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      كود غليتش المعطوب (للتدريب)
                    </button>
                  </div>
                </div>

                {/* Code Body */}
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

                  <div className="bg-slate-950 rounded-2xl p-6 font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto max-h-[480px]">
                    <pre className="whitespace-pre leading-relaxed select-text">
                      {codeTab === 'repaired' ? lessonDetail.code.repairedCode : lessonDetail.code.brokenCode}
                    </pre>
                  </div>
                </div>

                {/* Bug explanation cards if broken tab is active */}
                {codeTab === 'broken' && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-rose-800 text-sm">الثغرات الأربع المكتشفة في كود غليتش:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lessonDetail.code.bugsList.map((bug, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                          <div className="font-black text-rose-900 flex items-center justify-between">
                            <span>ثغرة السطر #{bug.line}</span>
                            <span className="text-[10px] text-rose-600">Bug #{i + 1}</span>
                          </div>
                          <p className="text-rose-950 font-bold">{bug.bugAr}</p>
                          <p className="text-emerald-700 font-bold">الحل: {bug.fixAr}</p>
                          <p className="text-slate-600 text-[11px]">الأثر: {bug.impactAr}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Hardware Simulator */}
              <ReactionGameSimulator />

              {/* 3 Challenge Levels */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800">مستويات التحدي الثلاثة داخل الحصة</h3>
                  <p className="text-xs text-slate-500">اختر المستوى المناسب لقدراتك وطور البرنامج بميزات إضافية</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {lessonDetail.challengeLevels.map((lvl) => (
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
            </div>
          )}

          {/* 6. QUIZ & CHALLENGES */}
          {activeStage === 'quiz' && (
            <QuizSection
              questions={lessonDetail.quiz}
              weekNumber={lessonDetail.week}
              xpReward={lessonDetail.xpReward}
              badgeId={lessonDetail.badgeId}
            />
          )}
        </div>
      </div>
    );
  }

  // Weeks 2 to 24 Overview Display
  return (
    <div className="space-y-8 pb-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
        <button
          onClick={() => {
            soundFx.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لخريطة المغامرة</span>
        </button>

        <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          +{lessonSummary.xpReward} XP
        </span>
      </div>

      {/* Overview Card for Upcoming Lessons */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black">
            الأسبوع #{lessonSummary.week}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            الشهر {lessonSummary.month}
          </span>
        </div>

        <h1 className="text-3xl font-black text-slate-900">{lessonSummary.missionNameAr}</h1>
        <p className="text-base text-slate-600">{lessonSummary.titleAr}</p>

        {/* Story */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900 text-sm">قصة المهمة الأسبوعية:</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{lessonSummary.storySnippetAr}</p>
        </div>

        {/* Learning Objectives */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm">أهداف الدرس:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lessonSummary.objectivesAr.map((obj, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-800">
                <span className="text-blue-600 font-bold">●</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arduino Role */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Cpu className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-800">دور لوحة آردوينو UNO في الحصة: </span>
            <span>{lessonSummary.arduinoRoleAr}</span>
          </div>
        </div>

        {/* Roadmap notice */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 text-center">
          📌 تم تصميم وتوثيق كافة أهداف ومفاهيم هذا الأسبوع برمجياً وهندسياً. المحتوى العملي التفصيلي للأسبوع الأول جاهز الآن بالكامل ومتاح للتجربة الحية!
        </div>
      </div>
    </div>
  );
};

