import React, { useEffect, useRef, useState } from 'react';
import { Award, BookOpen, Check, Code2, RotateCcw, Sparkles, X } from 'lucide-react';
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
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  medium: {
    labelAr: 'مستوى متوسط',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  hard: {
    labelAr: 'تحدّي الأبطال',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500',
  },
};

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  weekNumber,
  onCompleted,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [missingWarning, setMissingWarning] = useState<string | null>(null);
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setSelectedOptions({});
    setCheckedQuestions({});
    setIsFinished(false);
    setMissingWarning(null);
    setHighlightedQuestionId(null);
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
    setMissingWarning(null);
    setHighlightedQuestionId(null);

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

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (checkedQuestions[questionId]) return;
    soundFx.playClick();
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    if (highlightedQuestionId === questionId) {
      setHighlightedQuestionId(null);
    }
    if (missingWarning) {
      setMissingWarning(null);
    }
  };

  const handleCheckSingleQuestion = (q: QuizQuestion) => {
    const pickedId = selectedOptions[q.id];
    if (!pickedId || checkedQuestions[q.id]) return;

    const chosenOpt = q.options.find((o) => o.id === pickedId);
    if (chosenOpt?.isCorrect) {
      soundFx.playSuccessChime();
    } else {
      soundFx.playFalseStartBuzz();
    }

    const nextChecked = { ...checkedQuestions, [q.id]: true };
    setCheckedQuestions(nextChecked);

    if (questions.every((item) => nextChecked[item.id])) {
      finalizeQuiz(selectedOptions);
    }
  };

  const handleSubmitAll = () => {
    const unanswered = questions.filter((q) => !selectedOptions[q.id]);
    if (unanswered.length > 0) {
      soundFx.playFalseStartBuzz();
      const firstMissing = unanswered[0];
      const firstIndex = questions.findIndex((q) => q.id === firstMissing.id) + 1;
      setHighlightedQuestionId(firstMissing.id);
      setMissingWarning(
        `بقي ${unanswered.length} ${unanswered.length === 1 ? 'سؤال' : 'أسئلة'} دون إجابة — ابدأ بالسؤال رقم ${firstIndex}.`
      );
      questionRefs.current[firstMissing.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    soundFx.playClick();
    finalizeQuiz(selectedOptions);
  };

  const handleRetake = () => {
    soundFx.playClick();
    setSelectedOptions({});
    setCheckedQuestions({});
    setIsFinished(false);
    setMissingWarning(null);
    setHighlightedQuestionId(null);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const answeredCount = questions.filter((q) => Boolean(selectedOptions[q.id])).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
  const { correctCount, percent: scorePercent } = computeScore(selectedOptions);

  if (questions.length === 0) {
    return null;
  }

  return (
    <div
      ref={topRef}
      className="bg-white rounded-3xl border border-slate-100 shadow-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6"
    >
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-800">
              اختبار الفهم الذاتي — الأسبوع {weekNumber}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              أسئلة متدرجة من السهل إلى التحدّي لمراجعة المفاهيم والمشروع العملي
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            أجبت عن {answeredCount} من {questions.length}
          </span>
          {isFinished && (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black font-mono">
              النتيجة: {scorePercent}%
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-l from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* All Questions Stacked Vertically */}
      <div className="space-y-5 sm:space-y-6">
        {questions.map((q, idx) => {
          const pickedOptionId = selectedOptions[q.id];
          const isChecked = Boolean(checkedQuestions[q.id]);
          const pickedOpt = q.options.find((o) => o.id === pickedOptionId);
          const difficultyMeta = q.difficulty ? DIFFICULTY_BADGE[q.difficulty] : null;
          const isMissingHighlight = highlightedQuestionId === q.id && !pickedOptionId;
          const speakPayload = `${q.questionAr}. الخيارات: ${q.options.map((o) => o.textAr).join('، أو ')}`;

          return (
            <div
              key={q.id}
              ref={(el) => {
                questionRefs.current[q.id] = el;
              }}
              className={`rounded-3xl border p-4 sm:p-5 md:p-6 space-y-4 transition-all ${
                isMissingHighlight
                  ? 'border-amber-400 bg-amber-50/40 ring-4 ring-amber-200/50'
                  : isChecked && pickedOpt?.isCorrect
                  ? 'border-emerald-300 bg-emerald-50/25'
                  : isChecked && pickedOpt && !pickedOpt.isCorrect
                  ? 'border-rose-300 bg-rose-50/25'
                  : 'border-slate-200/80 bg-slate-50/50 hover:border-blue-200'
              }`}
            >
              {/* Card Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
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

                  {q.category === 'find-bug' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                      صائد الثغرات
                    </span>
                  )}
                </div>

                <SpeakButton text={speakPayload} labelAr="اسمع السؤال" />
              </div>

              {/* Question Prompt */}
              <h4 className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-relaxed">
                <FormattedText text={q.questionAr} />
              </h4>

              {/* Optional Code Snippet (Bright Light Card) */}
              {q.codeSnippet && (
                <div className="rounded-2xl border border-indigo-200 bg-white overflow-hidden shadow-sm">
                  <div className="px-3.5 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-800">
                      <Code2 className="w-3.5 h-3.5" />
                      جزء من كود الآردوينو
                    </span>
                    <span className="text-[10px] font-mono text-indigo-500">Arduino C++</span>
                  </div>
                  <pre
                    dir="ltr"
                    className="p-3.5 sm:p-4 text-xs sm:text-sm font-mono text-slate-800 bg-white overflow-x-auto leading-relaxed text-left"
                  >
                    <code>{q.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isSelected = pickedOptionId === opt.id;
                  let optionStyle =
                    'border-slate-200 hover:border-blue-300 bg-white text-slate-700';

                  if (isSelected && !isChecked) {
                    optionStyle =
                      'border-blue-500 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-500/20';
                  } else if (isChecked) {
                    if (opt.isCorrect) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (isSelected && !opt.isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      optionStyle = 'border-slate-100 bg-white/70 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      disabled={isChecked}
                      className={`w-full text-right p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 sm:gap-4 min-h-[48px] ${
                        isChecked ? 'cursor-default' : 'cursor-pointer'
                      } ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked && opt.isCorrect
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : isChecked && isSelected && !opt.isCorrect
                              ? 'border-rose-500 bg-rose-500 text-white'
                              : isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
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

                        <span className="text-xs sm:text-sm font-medium leading-relaxed">
                          <FormattedText text={opt.textAr} />
                        </span>
                      </div>

                      {isChecked && opt.isCorrect && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                          إجابة صحيحة ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Check Action per Question (before full submit) */}
              {!isChecked && pickedOptionId && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleCheckSingleQuestion(q)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-black transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تأكد من إجابتي الآن</span>
                  </button>
                </div>
              )}

              {/* Scientific Explanation after Checking */}
              {isChecked && pickedOpt && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-amber-900">💡 التفسير المبسط:</span>
                    <SpeakButton text={pickedOpt.explanationAr} labelAr="اسمع التفسير" />
                  </div>
                  <p className="leading-relaxed">
                    <FormattedText
                      text={
                        pickedOpt.explanationAr ||
                        'أحسنت! فهم الفكرة وراء الإجابة يجعلك مبتكراً حقيقياً.'
                      }
                    />
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit All Bar (when not yet finished) */}
      {!isFinished && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-l from-blue-50 via-indigo-50 to-sky-50 border border-blue-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-right">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {answeredCount === questions.length
                ? 'أجبت عن كل الأسئلة! اضغط لعرض نتيجتك وتفسير كل سؤال.'
                : 'اختر إجاباتك لكل الأسئلة أعلاه، ثم اضغط لعرض النتيجة النهائية.'}
            </p>
            {missingWarning && (
              <p className="text-xs font-bold text-amber-700">{missingWarning}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmitAll}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-md inline-flex items-center justify-center gap-2 shrink-0 ${
              answeredCount === questions.length
                ? 'bg-[#FF5B5A] hover:bg-[#E84A5F] text-white shadow-coral-glow'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تصحيح الإجابات وعرض النتيجة</span>
          </button>
        </div>
      )}

      {/* Final Score Card (kept alongside all questions for easy review) */}
      {isFinished && (
        <div
          ref={resultRef}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 border-2 border-blue-200 text-center space-y-5 shadow-sm"
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-white text-blue-600 mx-auto flex items-center justify-center shadow-md border-2 border-blue-200">
              <Award className="w-10 h-10" />
            </div>
            {scorePercent >= 60 && (
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl md:text-3xl font-black text-slate-800">
              {scorePercent >= 80
                ? '🎉 بطل! استيعاب ممتاز للمفاهيم والمشروع!'
                : scorePercent >= 60
                ? '👏 نتيجة رائعة! فهمت أغلب أفكار الدرس!'
                : '💪 محاولة جميلة! راجع التفسيرات أعلاه وجرّب مرة أخرى.'}
            </h4>
            <p className="text-sm font-medium text-slate-600">
              أجبت عن {correctCount} من أصل {questions.length} أسئلة بشكل صحيح.
            </p>
          </div>

          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-blue-200 shadow-sm">
            <span className="text-3xl font-black text-blue-700 font-mono">{scorePercent}%</span>
            <div className="text-right">
              <div className="text-xs font-bold text-blue-900">نسبة الإتقان</div>
              <div className="text-[11px] text-blue-600">يمكنك مراجعة كل سؤال أعلاه</div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار من جديد</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
