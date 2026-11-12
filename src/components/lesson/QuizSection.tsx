import React, { useEffect, useState } from 'react';
import { Award, BookOpen, Check, ChevronLeft, ChevronRight, Code2, RotateCcw, Sparkles, X } from 'lucide-react';
import { QuizDifficulty, QuizQuestion } from '../../types/curriculum';
import { soundFx } from '../../services/sound/webAudio';
import { storageService } from '../../services/storage/localStorage';
import confetti from 'canvas-confetti';
import { FormattedText } from '../common/FormattedText';
import { SpeakButton } from '../common/SpeakButton';

interface QuizSectionProps {
  questions: QuizQuestion[];
  weekNumber: number;
  xpReward?: number;
  badgeId?: string;
  onCompleted?: () => void;
}

const DIFFICULTY_BADGE: Record<
  QuizDifficulty,
  { labelAr: string; badgeClass: string; dotClass: string }
> = {
  easy: {
    labelAr: 'مستوى سهل',
    badgeClass: 'bg-[#30A89A]/12 text-[#203447] border-[#30A89A]/40',
    dotClass: 'bg-[#30A89A]',
  },
  medium: {
    labelAr: 'مستوى متوسط',
    badgeClass: 'bg-[#FFC857]/20 text-[#203447] border-[#FFC857]',
    dotClass: 'bg-[#FFC857]',
  },
  hard: {
    labelAr: 'تحدّي الأبطال',
    badgeClass: 'bg-[#F47C62]/15 text-[#203447] border-[#F47C62]/45',
    dotClass: 'bg-[#F47C62]',
  },
};

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  weekNumber,
  onCompleted,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOptions({});
    setCheckedQuestions({});
    setIsFinished(false);
  }, [weekNumber, questions]);

  const computeScore = (selections: Record<string, string>) => {
    const correctCount = questions.reduce((total, q) => {
      const pickedId = selections[q.id];
      const isRight = q.options.some((opt) => opt.id === pickedId && opt.isCorrect);
      return total + (isRight ? 1 : 0);
    }, 0);
    const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return { correctCount, percent };
  };

  const finalizeQuiz = (selections: Record<string, string>) => {
    const allChecked: Record<string, boolean> = {};
    questions.forEach((q) => {
      allChecked[q.id] = true;
    });
    setCheckedQuestions(allChecked);

    const { percent } = computeScore(selections);
    const active = storageService.getActiveProfile();
    if (active) {
      storageService.recordQuizScore(active.id, weekNumber, percent);
    }

    if (percent >= 60) {
      soundFx.playVictoryFanfare();
      confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.65 },
      });
    } else {
      soundFx.playFalseStartBuzz();
    }

    setIsFinished(true);
    if (onCompleted) onCompleted();
  };

  const handleSelectAndCheckSingle = (q: QuizQuestion, optionId: string) => {
    if (checkedQuestions[q.id]) return;

    const nextSelections = { ...selectedOptions, [q.id]: optionId };
    setSelectedOptions(nextSelections);

    if (viewMode === 'single') {
      const chosenOpt = q.options.find((o) => o.id === optionId);
      if (chosenOpt?.isCorrect) {
        soundFx.playSuccessChime();
      } else {
        soundFx.playFalseStartBuzz();
      }
      setCheckedQuestions((prev) => ({ ...prev, [q.id]: true }));
    } else {
      soundFx.playClick();
    }
  };

  const handleRetake = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setSelectedOptions({});
    setCheckedQuestions({});
    setIsFinished(false);
  };

  if (questions.length === 0) return null;

  const answeredCount = questions.filter((q) => Boolean(checkedQuestions[q.id])).length;
  const progressPercent =
    viewMode === 'single' && !isFinished
      ? Math.round(((currentIdx + 1) / questions.length) * 100)
      : Math.round((answeredCount / questions.length) * 100);
  const { correctCount, percent: scorePercent } = computeScore(selectedOptions);

  const renderQuestionCard = (q: QuizQuestion, idx: number) => {
    const pickedOptionId = selectedOptions[q.id];
    const isChecked = Boolean(checkedQuestions[q.id]);
    const pickedOpt = q.options.find((o) => o.id === pickedOptionId);
    const difficultyMeta = q.difficulty ? DIFFICULTY_BADGE[q.difficulty] : null;
    const speakPayload = `${q.questionAr}. الخيارات: ${q.options.map((o) => o.textAr).join('، أو ')}`;

    return (
      <div
        key={q.id}
        className={`rounded-3xl border p-5 sm:p-6 space-y-5 transition-all ${
          isChecked && pickedOpt?.isCorrect
            ? 'border-[#30A89A] bg-[#30A89A]/5'
            : isChecked && pickedOpt && !pickedOpt.isCorrect
            ? 'border-[#F47C62] bg-[#F47C62]/5'
            : 'border-slate-200/90 bg-[#FAFAF6]'
        }`}
      >
        {/* Top Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#6388D8]/15 text-[#203447] text-xs font-black">
              السؤال {idx + 1} من {questions.length}
            </span>

            {difficultyMeta && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${difficultyMeta.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${difficultyMeta.dotClass}`} />
                {difficultyMeta.labelAr}
              </span>
            )}
          </div>

          <SpeakButton text={speakPayload} labelAr="اسمع السؤال" />
        </div>

        {/* Question Prompt */}
        <h4 className="text-base sm:text-xl font-black text-[#203447] leading-relaxed">
          <FormattedText text={q.questionAr} />
        </h4>

        {/* Optional Code Snippet */}
        {q.codeSnippet && (
          <div className="rounded-2xl border border-[#6388D8]/35 bg-white overflow-hidden shadow-xs">
            <div className="px-3.5 py-2 bg-[#6388D8]/10 border-b border-[#6388D8]/20 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#203447]">
                <Code2 className="w-3.5 h-3.5 text-[#6388D8]" />
                كود التجربة
              </span>
              <span className="text-[10px] font-mono text-[#6388D8] font-bold">Arduino C++</span>
            </div>
            <pre
              dir="ltr"
              className="p-4 text-xs sm:text-sm font-mono text-[#203447] bg-white overflow-x-auto leading-relaxed text-left"
            >
              <code>{q.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const isSelected = pickedOptionId === opt.id;
            let optionStyle =
              'border-slate-200 hover:border-[#30A89A] bg-white text-[#203447]';

            if (isSelected && !isChecked) {
              optionStyle =
                'border-[#6388D8] bg-[#6388D8]/10 text-[#203447] font-bold ring-2 ring-[#6388D8]/20';
            } else if (isChecked) {
              if (opt.isCorrect) {
                optionStyle =
                  'border-[#30A89A] bg-[#30A89A]/12 text-[#203447] font-bold ring-2 ring-[#30A89A]/25';
              } else if (isSelected && !opt.isCorrect) {
                optionStyle = 'border-[#F47C62] bg-[#F47C62]/12 text-[#203447]';
              } else {
                optionStyle = 'border-slate-200/60 bg-white/70 text-slate-400';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectAndCheckSingle(q, opt.id)}
                disabled={isChecked}
                className={`w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 min-h-[52px] ${
                  isChecked ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                } ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isChecked && opt.isCorrect
                        ? 'border-[#30A89A] bg-[#30A89A] text-white'
                        : isChecked && isSelected && !opt.isCorrect
                        ? 'border-[#F47C62] bg-[#F47C62] text-white'
                        : isSelected
                        ? 'border-[#6388D8] bg-[#6388D8] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && opt.isCorrect ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : isChecked && isSelected && !opt.isCorrect ? (
                      <X className="w-3.5 h-3.5 text-white" />
                    ) : isSelected ? (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    ) : null}
                  </div>

                  <span className="text-xs sm:text-sm font-bold leading-relaxed">
                    <FormattedText text={opt.textAr} />
                  </span>
                </div>

                {isChecked && opt.isCorrect && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#30A89A] text-white text-[10px] font-black shrink-0">
                    إجابة صحيحة ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Calm Explanation of Why */}
        {isChecked && pickedOpt && (
          <div className="p-4 rounded-2xl bg-[#FFC857]/20 border border-[#FFC857] text-[#203447] text-xs sm:text-sm space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-black">💡 لماذا؟ (التفسير المبسط)</span>
              <SpeakButton text={pickedOpt.explanationAr} labelAr="اسمع السبب" />
            </div>
            <p className="leading-relaxed font-medium">
              <FormattedText
                text={
                  pickedOpt.explanationAr ||
                  'أحسنت! فهم السبب يساعدك على بناء مشاريع أذكى.'
                }
              />
            </p>
          </div>
        )}
      </div>
    );
  };

  const currentQuestion = questions[currentIdx] || questions[0];
  const isCurrentChecked = Boolean(checkedQuestions[currentQuestion.id]);
  const isLastQuestion = currentIdx === questions.length - 1;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6 animate-lab-enter max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#30A89A]/15 text-[#30A89A] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#203447]">
              اختبر نفسك — الأسبوع {weekNumber}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {viewMode === 'single'
                ? 'سؤال واحد في كل مرة مع توضيح السبب مباشرة'
                : 'مراجعة جميع الأسئلة الثمانية متتالية'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setViewMode((m) => (m === 'single' ? 'all' : 'single'));
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FAFAF6] hover:bg-slate-100 border border-slate-200 text-[#203447] text-xs font-bold transition-colors"
          >
            {viewMode === 'single' ? 'عرض كل الأسئلة (8)' : 'عرض سؤال بسؤال'}
          </button>
          <span className="px-3 py-1.5 rounded-full bg-[#30A89A]/15 text-[#203447] text-xs font-black">
            {viewMode === 'single' && !isFinished
              ? `${currentIdx + 1} / ${questions.length}`
              : `${answeredCount} / ${questions.length}`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#30A89A] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Body: Summary Card OR Single Question OR All Questions */}
      {isFinished && viewMode === 'single' ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAFAF6] border border-[#30A89A]/40 text-center space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-[#FFC857]/25 text-[#203447] mx-auto flex items-center justify-center border border-[#FFC857]">
            <Award className="w-10 h-10 text-[#F47C62]" />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-2xl font-black text-[#203447]">
              {scorePercent >= 80
                ? '🎉 أحسنت يا بطل! ثقة وفهم ممتاز!'
                : scorePercent >= 60
                ? '👏 نتيجة رائعة جداً!'
                : '💪 محاولة جميلة! يمكنك مراجعة الإجابات والمحاولة مجدداً.'}
            </h4>
            <p className="text-sm font-bold text-slate-600">
              أجبت عن {correctCount} من أصل {questions.length} أسئلة بشكل صحيح.
            </p>
          </div>

          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-3xl font-black text-[#30A89A] font-mono">{scorePercent}%</span>
            <div className="text-right">
              <div className="text-xs font-black text-[#203447]">نسبة الإتقان</div>
              <div className="text-[11px] text-slate-500">الأسبوع {weekNumber}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setViewMode('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#203447] text-xs sm:text-sm font-black"
            >
              مراجعة كل الأسئلة والتفسيرات
            </button>
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#30A89A] hover:bg-[#279185] text-white text-xs sm:text-sm font-black shadow-teal-glow"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'single' ? (
        <div className="space-y-5">
          {renderQuestionCard(currentQuestion, currentIdx)}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setCurrentIdx((i) => Math.max(0, i - 1));
              }}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAFAF6] hover:bg-slate-100 disabled:opacity-40 border border-slate-200 text-[#203447] text-xs sm:text-sm font-black transition-all"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السؤال السابق</span>
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setCurrentIdx((i) => Math.min(questions.length - 1, i + 1));
                }}
                disabled={!isCurrentChecked}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#30A89A] hover:bg-[#279185] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-black shadow-teal-glow disabled:shadow-none transition-all"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => finalizeQuiz(selectedOptions)}
                disabled={!isCurrentChecked}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#30A89A] hover:bg-[#279185] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-black shadow-teal-glow disabled:shadow-none transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>عرض النتيجة النهائية 🏆</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((q, idx) => renderQuestionCard(q, idx))}

          {!isFinished && (
            <button
              type="button"
              onClick={() => finalizeQuiz(selectedOptions)}
              disabled={Object.keys(selectedOptions).length < questions.length}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#30A89A] hover:bg-[#279185] disabled:bg-slate-200 disabled:text-slate-500 text-white font-black text-sm shadow-teal-glow disabled:shadow-none transition-all"
            >
              تصحيح كل الأسئلة وعرض النتيجة ({Object.keys(selectedOptions).length} / {questions.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
};
