import React, { useEffect, useState } from 'react';
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
  Code2,
  Cable,
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
import { FormattedText } from '../../components/common/FormattedText';

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

function extractPinCodeLines(fromPin: string, code: string): string | null {
  const upper = fromPin.toUpperCase();
  if (upper.includes('GND') && !/\b[DA]\d{1,2}\b/.test(upper)) {
    return '// الخط السالب المشترك (GND) لجميع القطع في الدارة';
  }
  if (upper.includes('5V') && !/\b[DA]\d{1,2}\b/.test(upper)) {
    return '// خط الطاقة الموجب (+5V) لتغذية القطع والحساسات';
  }

  const analogMatch = upper.match(/\b(A\d)\b/);
  const digitalMatch = upper.match(/\bD(\d{1,2})\b/);
  const pinToken = analogMatch ? analogMatch[1] : digitalMatch ? digitalMatch[1] : null;
  if (!pinToken) return null;

  const lines = code
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const declLine = lines.find((line) => {
    if (line.startsWith('//') || line.startsWith('/*')) return false;
    const eqRegex = new RegExp(`=\\s*${pinToken}\\b`);
    const defRegex = new RegExp(`#define\\s+\\w+\\s+${pinToken}\\b`);
    return eqRegex.test(line) || defRegex.test(line);
  });

  if (!declLine) {
    const directLine = lines.find((line) => {
      if (line.startsWith('//')) return false;
      const directRegex = new RegExp(
        `(?:pinMode|digitalRead|digitalWrite|analogRead|analogWrite|tone)\\s*\\(\\s*${pinToken}\\b`
      );
      return directRegex.test(line);
    });
    return directLine || null;
  }

  const varMatch = declLine.match(/(?:int|byte|define)\s+(\w+)/i);
  const varName = varMatch ? varMatch[1] : null;
  if (!varName) return declLine;

  const modeLine = lines.find((line) => {
    if (line.startsWith('//')) return false;
    const modeRegex = new RegExp(`(?:pinMode|attach)\\s*\\([^)]*\\b${varName}\\b`);
    return modeRegex.test(line);
  });

  return modeLine ? `${declLine}\n${modeLine}` : declLine;
}

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
  const [expandedWiringSteps, setExpandedWiringSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setExpandedWiringSteps({});
  }, [weekNumber]);

  const toggleWiringStep = (stepNumber: number) => {
    soundFx.playClick();
    setExpandedWiringSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

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
    <div className="space-y-4 sm:space-y-5 pb-10 sm:pb-12 w-full">
      {/* Minimal Top Breadcrumb & Teacher Shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <button
          onClick={() => {
            soundFx.playClick();
            onBackToMap();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs text-xs sm:text-sm font-black transition-all"
        >
          <ArrowRight className="w-4 h-4 text-[#FF5B5A]" />
          <span>العودة للدروس</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenClassroom();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 shadow-2xs text-xs font-bold transition-all"
          title="فتح وضع الشاشة الكاملة للشرح أمام التلاميذ"
        >
          <ScreenShare className="w-3.5 h-3.5" />
          <span>عرض الصف (للمعلّم)</span>
        </button>
      </div>

      {/* Hero Lesson Header */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-amber-50/35 to-blue-50/35 p-5 sm:p-6 border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[11px] font-black">
              الأسبوع {lessonDetail.week}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug">
              {lessonDetail.missionNameAr}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              {lessonDetail.titleAr}
            </p>
          </div>

          <div className="shrink-0 hidden sm:block">
            <CharacterAvatar character={lessonDetail.story.characterSpeaker || 'robo'} size="lg" />
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Top Sticky 6-Stage Strip */}
      <div className="lg:hidden sticky top-[65px] sm:top-[75px] z-30 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200/80 shadow-card">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {lessonDetail.timeline.map((stage, idx) => {
            const isActive = activeStage === stage.stage;
            const isCompleted = idx < currentStageIdx;
            const label = KID_STAGE_TITLES[stage.stage] || stage.titleAr;

            return (
              <button
                key={stage.stage}
                onClick={() => goToStage(stage.stage)}
                className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all min-h-[38px] ${
                  isActive
                    ? 'bg-[#FF5B5A] text-white shadow-coral-glow font-black'
                    : isCompleted
                    ? 'bg-emerald-50/80 text-emerald-800 border border-emerald-200/70'
                    : 'bg-slate-50/70 border border-slate-200/70 text-slate-600'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white text-[#FF5B5A]'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar + Main Stage Content Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-5 xl:gap-6">
        {/* Desktop Vertical Lesson Sidebar (Sticky) */}
        <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-[92px] z-20">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-4 space-y-4">
            <div className="space-y-2 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-800">مراحل الدرس</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-[11px] font-black font-mono">
                  {currentStageIdx + 1} / {stageOrder.length}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-[#FF5B5A] to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.round(((currentStageIdx + 1) / stageOrder.length) * 100)}%` }}
                />
              </div>
            </div>

            <nav className="space-y-1.5" aria-label="مراحل الدرس">
              {lessonDetail.timeline.map((stage, idx) => {
                const isActive = activeStage === stage.stage;
                const isCompleted = idx < currentStageIdx;
                const label = KID_STAGE_TITLES[stage.stage] || stage.titleAr;

                return (
                  <button
                    key={stage.stage}
                    onClick={() => goToStage(stage.stage)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl text-right text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#FF5B5A] text-white shadow-coral-glow font-black'
                        : isCompleted
                        ? 'bg-emerald-50/75 text-emerald-900 border border-emerald-200/70 hover:bg-emerald-100/70'
                        : 'bg-slate-50/70 text-slate-700 border border-transparent hover:border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white text-[#FF5B5A]'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </span>
                      <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {stageIcons[stage.stage]}
                      </span>
                      <span className="truncate">{label}</span>
                    </div>

                    {isActive && <ChevronLeft className="w-4 h-4 shrink-0 text-white/90" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Stage Content Panel (One Step Card at a Time) */}
        <div className="flex-1 min-w-0 w-full space-y-6">
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
              <p className="text-sm sm:text-base leading-relaxed font-medium">
                <FormattedText text={lessonDetail.story.glitchActionAr} />
              </p>
            </div>

            {/* Learning Objectives Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-7 border border-slate-200/80 shadow-card space-y-4">
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
                    className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                      <FormattedText text={obj} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. THEORY & EXPLANATIONS */}
        {activeStage === 'theory' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-200/80 shadow-card space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{lessonDetail.theory.titleAr}</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{lessonDetail.theory.summaryAr}</p>
              </div>
              <SpeakButton
                text={`${lessonDetail.theory.titleAr}. ${lessonDetail.theory.summaryAr}`}
                labelAr="اسمع الملخص"
              />
            </div>

            <div className="space-y-4 sm:space-y-5">
              {lessonDetail.theory.sections.map((sec, i) => (
                <div key={i} className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-800">{sec.headingAr}</h3>
                    <SpeakButton
                      text={`${sec.headingAr}. ${sec.contentAr}${sec.noteAr ? `. ${sec.noteAr}` : ''}`}
                      labelAr="اسمع الفكرة"
                    />
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                    <FormattedText text={sec.contentAr} />
                  </p>

                  {sec.codeExample && (
                    <div className="bg-white rounded-2xl p-4 font-mono text-xs text-slate-900 font-semibold border border-indigo-200 shadow-sm overflow-x-auto" dir="ltr">
                      <pre className="whitespace-pre-wrap">{sec.codeExample}</pre>
                    </div>
                  )}

                  {sec.noteAr && (
                    <div className="p-3.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2">
                      <span>💡</span>
                      <FormattedText text={sec.noteAr} />
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
              أحسنت في التركيب والتجربة! حرّك يديك قليلاً واشرب رشفة ماء، ثم اضغط على الخطوة التالية لخوض اللعبة الذكية!
            </p>
            <div className="flex justify-center">
              <SpeakButton
                text="أحسنت في التركيب والتجربة! حرّك يديك قليلاً واشرب رشفة ماء، ثم اضغط على الخطوة التالية لخوض اللعبة الذكية!"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {lessonDetail.components.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-2.5"
                  >
                    <span className="w-7 h-7 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                      {comp.count}x
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-black text-xs text-slate-900 leading-snug">{comp.nameAr}</div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{comp.roleAr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Always-Visible Step 2: Step-by-Step Arduino Wiring Stages Linked to Code */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Cable className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-slate-800">
                      مراحل التركيب في الآردوينو حسب الكود 🔌
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {lessonDetail.circuit.descriptionAr} —{' '}
                      <span className="font-bold text-indigo-600">
                        اضغط على أي نقطة لإظهار الكود المرافق لها.
                      </span>
                    </p>
                  </div>
                </div>
                <SpeakButton
                  text={`${lessonDetail.circuit.descriptionAr}. ${lessonDetail.circuit.wiringSteps
                    .map((s) => `المرحلة ${s.step}: ${s.instructionAr}`)
                    .join(' ')}`}
                  labelAr="اسمع مراحل التركيب"
                />
              </div>

              <ol className="space-y-2.5 sm:space-y-3">
                {lessonDetail.circuit.wiringSteps.map((step) => {
                  const matchedCode = extractPinCodeLines(step.from, lessonDetail.code.repairedCode);
                  const isExpanded = Boolean(expandedWiringSteps[step.step]);

                  return (
                    <li key={step.step}>
                      <div
                        onClick={() => matchedCode && toggleWiringStep(step.step)}
                        className={`rounded-2xl border p-3.5 sm:p-4 transition-all ${
                          matchedCode ? 'cursor-pointer' : ''
                        } ${
                          isExpanded
                            ? 'bg-indigo-50/40 border-indigo-300 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:border-indigo-200 hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {/* Numbered bullet + wire color dot */}
                            <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
                              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                                {step.step}
                              </span>
                              <span
                                className="w-3 h-3 rounded-full border border-slate-300"
                                style={{ backgroundColor: step.color }}
                                title={`لون السلك: ${step.color}`}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                                <span
                                  className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-mono"
                                  dir="ltr"
                                >
                                  {step.from}
                                </span>
                                <span className="text-slate-400">←</span>
                                <span
                                  className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                                  dir="ltr"
                                >
                                  {step.to}
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                                <FormattedText text={step.instructionAr} />
                              </p>

                              {step.cautionAr && (
                                <div className="inline-flex items-start gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-bold">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <FormattedText text={step.cautionAr} />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 shrink-0 pr-10 sm:pr-0">
                            <div onClick={(e) => e.stopPropagation()}>
                              <SpeakButton text={step.instructionAr} labelAr="اسمع" />
                            </div>
                            {matchedCode && (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                                  isExpanded
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-indigo-700 border-indigo-200'
                                }`}
                              >
                                <Code2 className="w-3.5 h-3.5 shrink-0" />
                                <span>{isExpanded ? 'إخفاء الكود' : 'عرض الكود'}</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {matchedCode && isExpanded && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 mr-0 sm:mr-11 rounded-xl bg-white border border-indigo-200 p-3 space-y-1.5 shadow-xs"
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
                              <Code2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>الكود الموافق لهذه المرحلة:</span>
                            </div>
                            <pre
                              className="font-mono text-xs text-slate-900 font-semibold leading-relaxed overflow-x-auto whitespace-pre select-text bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                              dir="ltr"
                            >
                              {matchedCode}
                            </pre>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Step 3: Interactive 3D Assembly & Live Test */}
            <CircuitPlayground3D lessonWeek={lessonDetail.week} />

            {/* Always-Visible: Full Arduino Code Section (Repaired vs Glitch Broken Code) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-slate-800">
                      الكود البرمجي الكامل للآردوينو (Arduino Code) 💻
                    </h3>
                    <p className="text-xs text-slate-500">
                      انسخ الكود السليم لرفعه على لوحة Arduino UNO R3، أو قارنه مع كود غليتش المعطوب
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCodeTab('repaired');
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      codeTab === 'repaired'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    الكود السليم الكامل ✓
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCodeTab('broken');
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      codeTab === 'broken'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    كود غليتش المعطوب ⚠️
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200" dir="ltr">
                  <span className="font-mono text-xs font-bold text-slate-700">
                    week_{String(lessonDetail.week).padStart(2, '0')}_{codeTab === 'repaired' ? 'final' : 'glitch_buggy'}.ino
                  </span>
                  <button
                    onClick={() =>
                      handleCopyCode(
                        codeTab === 'repaired' ? lessonDetail.code.repairedCode : lessonDetail.code.brokenCode
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
                    dir="rtl"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود كاملاً'}</span>
                  </button>
                </div>

                <div
                  className="p-4 sm:p-5 bg-white font-mono text-xs text-slate-900 font-semibold overflow-x-auto max-h-[520px]"
                  dir="ltr"
                >
                  <pre className="whitespace-pre leading-relaxed select-text">
                    {codeTab === 'repaired' ? lessonDetail.code.repairedCode : lessonDetail.code.brokenCode}
                  </pre>
                </div>
              </div>

              {codeTab === 'broken' && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-rose-800 text-sm">الأخطاء في كود غليتش وكيف أصلحناها:</h4>
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

            {/* Collapsible Toggle for Extra 2D Diagrams, Challenge Verifier & Extra Simulators */}
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
                      أدوات إضافية وتحديات متقدمة (مخططات 2D وفاحص التحديات 🧪)
                    </span>
                    <span className="text-xs text-slate-500">
                      اضغط هنا لفتح مخطط التوصيل 2D التفاعلي، محاكي الكود، فاحص التحديات، ومستويات التطوير الثلاثة
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
                                  <FormattedText text={t} />
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-3 border-t border-slate-200 text-[11px] text-amber-800 font-medium">
                            💡 تلميح: <FormattedText text={lvl.hintAr} />
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <span className="sm:order-2 text-center text-xs sm:text-sm font-black text-slate-500">
            الخطوة {currentStageIdx + 1} من {stageOrder.length}
          </span>

          <div className="grid grid-cols-2 gap-2.5 sm:contents">
            <button
              onClick={() => hasPrevStage && goToStage(stageOrder[currentStageIdx - 1])}
              disabled={!hasPrevStage}
              className="sm:order-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-xs sm:text-sm font-black transition-all min-h-[44px]"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>الخطوة السابقة</span>
            </button>

            {hasNextStage ? (
              <button
                onClick={() => goToStage(stageOrder[currentStageIdx + 1])}
                className="sm:order-3 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 rounded-xl bg-[#FF5B5A] hover:bg-[#ff4645] text-white text-xs sm:text-sm font-black shadow-coral-glow transition-all active:scale-95 min-h-[44px]"
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
                className="sm:order-3 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 min-h-[44px]"
              >
                <span className="truncate">العودة لكل الدروس</span>
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
