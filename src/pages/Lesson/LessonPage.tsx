import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Cpu,
  Film,
  Gamepad2,
  Pause,
  Play,
  Rocket,
  RotateCcw,
} from 'lucide-react';
import { getLessonByWeek } from '../../data/lessons';
import { QuizSection } from '../../components/lesson/QuizSection';
import { TodayConceptLab } from '../../components/lesson/TodayConceptLab';
import { WorkshopStage } from '../../components/lesson/WorkshopStage';
import { InventorChallengeSection } from '../../components/lesson/InventorChallengeSection';
import { SmartGameHub } from '../../components/games/SmartGameHub';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { SpeakButton } from '../../components/common/SpeakButton';
import { FormattedText } from '../../components/common/FormattedText';

interface LessonPageProps {
  weekNumber: number;
  onBackToMap: () => void;
}

const STAGE_META: Record<string, { titleAr: string; duration: number }> = {
  story: { titleAr: 'القصة', duration: 10 },
  theory: { titleAr: 'اكتشف الفكرة', duration: 15 },
  lab: { titleAr: 'المختبر العملي', duration: 55 },
  break: { titleAr: 'استراحة', duration: 5 },
  games: { titleAr: 'اللعبة الذكية', duration: 15 },
  quiz: { titleAr: 'اختبر نفسك وابتكر', duration: 20 },
};

const MONTH_ORDINAL_AR = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
const LESSON_ORDINAL_AR = [
  '',
  'الأولى',
  'الثانية',
  'الثالثة',
  'الرابعة',
  'الخامسة',
  'السادسة',
  'السابعة',
  'الثامنة',
  'التاسعة',
  'العاشرة',
  'الحادية عشرة',
  'الثانية عشرة',
];

export const LessonPage: React.FC<LessonPageProps> = ({
  weekNumber,
  onBackToMap,
}) => {
  const [activeStage, setActiveStage] = useState<string>('story');
  const [breakSeconds, setBreakSeconds] = useState<number>(300);
  const [isBreakRunning, setIsBreakRunning] = useState<boolean>(false);

  useEffect(() => {
    setActiveStage('story');
    setBreakSeconds(300);
    setIsBreakRunning(false);
  }, [weekNumber]);

  useEffect(() => {
    if (!isBreakRunning || breakSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setBreakSeconds((prev) => {
        if (prev <= 1) {
          setIsBreakRunning(false);
          soundFx.playVictoryFanfare();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isBreakRunning, breakSeconds]);

  const lessonDetail = getLessonByWeek(weekNumber);

  // Normalize any lesson's timeline cleanly to the 6 core stages
  const coreStageKeys = ['story', 'theory', 'lab', 'break', 'games', 'quiz'];
  const stageOrder = coreStageKeys.filter(
    (key) => key === 'quiz' || lessonDetail.timeline.some((s) => s.stage === key)
  );

  const currentStageIdx = Math.max(0, stageOrder.indexOf(activeStage));
  const hasPrevStage = currentStageIdx > 0;
  const hasNextStage = currentStageIdx < stageOrder.length - 1;

  const goToStage = (stageKey: string) => {
    soundFx.playClick();
    setActiveStage(stageKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stageIcons: Record<string, React.ReactNode> = {
    story: <Film className="w-4 h-4" />,
    theory: <BookOpen className="w-4 h-4" />,
    lab: <Cpu className="w-4 h-4" />,
    break: <Coffee className="w-4 h-4" />,
    games: <Gamepad2 className="w-4 h-4" />,
    quiz: <Award className="w-4 h-4" />,
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const monthLabelAr = `الشهر ${MONTH_ORDINAL_AR[lessonDetail.month] || lessonDetail.month}`;
  const lessonLabelAr = `الحصة ${LESSON_ORDINAL_AR[lessonDetail.week] || `رقم ${lessonDetail.week}`}`;

  return (
    <div className="space-y-5 pb-12 text-[#203447]">
      {/* 1. Compact Top Lesson Bar */}
      <header className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onBackToMap();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAF6] hover:bg-slate-100 text-[#203447] border border-slate-200 text-xs font-black transition-all"
            >
              <ArrowRight className="w-4 h-4 text-[#30A89A]" />
              <span>خريطة التعلم</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-[#6388D8]/15 text-[#203447] text-xs font-black">
              {monthLabelAr} • {lessonLabelAr}
            </span>

            <h1 className="text-base sm:text-xl font-black text-[#203447]">
              {lessonDetail.missionNameAr}
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#30A89A]/15 text-[#203447] border border-[#30A89A]/35 text-xs font-black font-mono">
            {currentStageIdx + 1} / {stageOrder.length}
          </span>
        </div>

        {/* Horizontal 6-Stage Stepper (Replaces bulky 272px right rail) */}
        <nav aria-label="مراحل الحصة" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stageOrder.map((stageKey, idx) => {
            const isActive = activeStage === stageKey;
            const isCompleted = idx < currentStageIdx;
            const meta = STAGE_META[stageKey] || { titleAr: stageKey, duration: 15 };

            return (
              <button
                key={stageKey}
                type="button"
                onClick={() => goToStage(stageKey)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-right text-xs transition-all ${
                  isActive
                    ? 'bg-[#30A89A] text-white shadow-teal-glow font-black'
                    : isCompleted
                    ? 'bg-[#30A89A]/10 text-[#203447] border border-[#30A89A]/35 font-bold hover:bg-[#30A89A]/18'
                    : 'bg-[#FAFAF6] text-[#203447]/80 border border-slate-200/80 font-bold hover:bg-white'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white text-[#30A89A]'
                      : isCompleted
                      ? 'bg-[#30A89A] text-white'
                      : 'bg-white text-[#203447] border border-slate-200'
                  }`}
                >
                  {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate flex items-center gap-1">
                    <span className="shrink-0 opacity-80">{stageIcons[stageKey]}</span>
                    <span className="truncate">{meta.titleAr}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </header>

      {/* 2. Active Stage Content */}
      <main className="w-full">
        {/* ① STORY (10 mins): Short dialogue + 1 problem + curiosity question + Start */}
        {activeStage === 'story' && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6 animate-lab-enter">
            {/* Cartoon Dialogue Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-[#FAFAF6] border-2 border-[#30A89A]/35 flex items-center justify-center shrink-0">
                  <CharacterAvatar character="robo" size="lg" expression="excited" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFC857]/30 text-[#203447] text-[11px] font-black">
                    📖 قصة المغامرة (10 دقائق)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#203447] mt-1">
                    {lessonDetail.story.titleAr}
                  </h2>
                </div>
              </div>

              <SpeakButton
                compact
                text={`${lessonDetail.story.contentAr.slice(0, 2).join(' ')}. ${lessonDetail.story.glitchActionAr}`}
                labelAr="اسمع القصة"
              />
            </div>

            {/* Short Dialogue between Robo and the Situation */}
            <div className="space-y-2.5">
              {lessonDetail.story.contentAr.slice(0, 2).map((line, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#FAFAF6] border border-slate-200/80 text-sm font-bold text-[#203447] leading-relaxed"
                >
                  <FormattedText text={line} />
                </div>
              ))}
            </div>

            {/* One Clear Problem (Glitch) */}
            <div className="p-4 rounded-2xl bg-[#F47C62]/10 border border-[#F47C62]/40 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#F47C62]/30 flex items-center justify-center shrink-0">
                <CharacterAvatar character="glitch" size="sm" expression="warning" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black text-[#F47C62] block">المشكلة الوحيدة اليوم:</span>
                <p className="text-sm font-bold text-[#203447]">
                  <FormattedText text={lessonDetail.story.glitchActionAr} />
                </p>
              </div>
            </div>

            {/* One Curiosity Question */}
            <div className="p-4 rounded-2xl bg-[#6388D8]/10 border border-[#6388D8]/30 text-sm font-black text-[#203447]">
              🤔 سؤال للتفكير: <FormattedText text={lessonDetail.story.callToActionAr} />
            </div>

            <button
              type="button"
              onClick={() => goToStage(stageOrder[1] || 'theory')}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#30A89A] hover:bg-[#279185] active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-teal-glow transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              <span>ابدأ المغامرة ←</span>
            </button>
          </div>
        )}

        {/* ② DISCOVER (15 mins): Single Focused Concept */}
        {activeStage === 'theory' && <TodayConceptLab lesson={lessonDetail} />}

        {/* ③ PRACTICAL WORKSHOP (55 mins): Unified 4-Step Lab */}
        {activeStage === 'lab' && <WorkshopStage lesson={lessonDetail} />}

        {/* ④ BREAK (5 mins): Calm Rest Timer ONLY (No Extra Lesson / Facts) */}
        {activeStage === 'break' && (
          <div className="max-w-lg mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-7 sm:p-10 text-center space-y-6 animate-lab-enter">
            <div className="w-24 h-24 rounded-3xl bg-[#FFC857]/25 border-2 border-[#FFC857] mx-auto flex items-center justify-center">
              <CharacterAvatar character="robo" size="lg" expression="happy" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#30A89A]/15 text-[#203447] text-xs font-black">
                ☕ استراحة (5 دقائق)
              </span>
              <h2 className="text-2xl font-black text-[#203447]">أحسنت! خذ استراحة قصيرة</h2>
              <p className="text-sm text-slate-600 font-medium">
                أرح عينيك قليلاً، اشرب رشفة ماء، وعد بنشاط للّعبة الذكية.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FAFAF6] border border-slate-200/90 space-y-4">
              <div className="text-4xl sm:text-5xl font-black font-mono text-[#203447] tracking-wider">
                {formatTimer(breakSeconds)}
              </div>

              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsBreakRunning((r) => !r);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#30A89A] hover:bg-[#279185] text-white text-xs sm:text-sm font-black shadow-teal-glow transition-all"
                >
                  {isBreakRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isBreakRunning ? 'إيقاف مؤقت' : breakSeconds === 0 ? 'انتهت الاستراحة!' : 'ابدأ المؤقت'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsBreakRunning(false);
                    setBreakSeconds(300);
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#203447]"
                  title="إعادة 05:00"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ⑤ SMART GAME (15 mins): Topic-Specific Game per Lesson */}
        {activeStage === 'games' && <SmartGameHub weekNumber={lessonDetail.week} />}

        {/* ⑥ QUIZ & INVENTOR CHALLENGE (20 mins): Combined Two Clear Sections */}
        {activeStage === 'quiz' && (
          <div className="space-y-8 animate-lab-enter">
            {/* Section 1: Quick Quiz (10 mins) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-black text-[#203447]">القسم الأول: اختبر نفسك (10 دقائق) 🧠</h2>
              </div>
              <QuizSection
                questions={lessonDetail.quiz}
                weekNumber={lessonDetail.week}
              />
            </section>

            {/* Section 2: Inventor Challenge with 3 Tiers (10 mins) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-black text-[#203447]">القسم الثاني: تحدي المبتكرين الإبداعي (10 دقائق) 🚀</h2>
              </div>
              {lessonDetail.inventorChallenge ? (
                <InventorChallengeSection
                  challenge={lessonDetail.inventorChallenge}
                  challengeLevels={lessonDetail.challengeLevels}
                  weekNumber={lessonDetail.week}
                />
              ) : (
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lessonDetail.challengeLevels.map((tier) => (
                      <div
                        key={tier.level}
                        className="p-4 rounded-2xl bg-[#FAFAF6] border border-slate-200/80 space-y-2"
                      >
                        <div className="font-black text-sm text-[#203447]">{tier.titleAr}</div>
                        <p className="text-xs font-bold text-[#30A89A]">{tier.goalAr}</p>
                        <ul className="space-y-1 text-xs text-slate-600 pr-4 list-disc">
                          {tier.tasksAr.map((t, idx) => (
                            <li key={idx}>
                              <FormattedText text={t} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* 3. Persistent Bottom Stage Navigation Footer */}
      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-card">
        <button
          type="button"
          onClick={() => hasPrevStage && goToStage(stageOrder[currentStageIdx - 1])}
          disabled={!hasPrevStage}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FAFAF6] hover:bg-slate-100 disabled:opacity-40 text-[#203447] border border-slate-200 text-xs sm:text-sm font-black transition-all min-h-[46px]"
        >
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span>السابق</span>
        </button>

        <div className="text-center text-xs sm:text-sm font-black text-[#203447]">
          المرحلة {currentStageIdx + 1} من {stageOrder.length} •{' '}
          <span className="text-[#30A89A]">{STAGE_META[activeStage]?.titleAr}</span>
        </div>

        {hasNextStage ? (
          <button
            type="button"
            onClick={() => goToStage(stageOrder[currentStageIdx + 1])}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#30A89A] hover:bg-[#279185] text-white text-xs sm:text-sm font-black shadow-teal-glow transition-all active:scale-95 min-h-[46px]"
          >
            <span className="truncate">
              التالي: {STAGE_META[stageOrder[currentStageIdx + 1]]?.titleAr || 'التالي'}
            </span>
            <ChevronLeft className="w-4 h-4 shrink-0" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onBackToMap();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FFC857] hover:bg-[#f2b942] text-[#203447] text-xs sm:text-sm font-black shadow-sm transition-all active:scale-95 min-h-[46px]"
          >
            <span>أنهيت الحصة! العودة للخريطة 🏆</span>
            <ChevronLeft className="w-4 h-4 shrink-0" />
          </button>
        )}
      </footer>
    </div>
  );
};
