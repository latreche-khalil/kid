import React, { useState } from 'react';
import { BookOpen, Check, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../../types/curriculum';
import { soundFx } from '../../services/sound/webAudio';
import { storageService } from '../../services/storage/localStorage';
import confetti from 'canvas-confetti';
import { FormattedText } from '../common/FormattedText';

interface QuizSectionProps {
  questions: QuizQuestion[];
  weekNumber: number;
  xpReward?: number;
  badgeId?: string;
  onCompleted?: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  weekNumber,
  onCompleted,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; isCorrect: boolean }>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundFx.playClick();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const opt = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = opt ? opt.isCorrect : false;

    if (isCorrect) {
      soundFx.playSuccessChime();
    } else {
      soundFx.playFalseStartBuzz();
    }

    setAnswers({
      ...answers,
      [currentQ.id]: { optionId: selectedOptionId, isCorrect },
    });
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished all questions!
      const correctCount = Object.values(answers).filter((a) => a.isCorrect).length + (
        (() => {
          const opt = currentQ.options.find((o) => o.id === selectedOptionId);
          return opt && opt.isCorrect ? 1 : 0;
        })()
      );

      const scorePercent = Math.round((correctCount / questions.length) * 100);

      // Record score quietly for progress tracking
      const active = storageService.getActiveProfile();
      if (active) {
        storageService.recordQuizScore(active.id, weekNumber, scorePercent);
      }

      if (scorePercent >= 60) {
        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setIsFinished(true);
      if (onCompleted) onCompleted();
    }
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setAnswers({});
    setIsFinished(false);
  };

  // Calculate final score
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  const selectedOpt = currentQ.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-800">اختبار الفهم الذاتي — الأسبوع {weekNumber}</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              أسئلة تفاعلية فورية لمراجعة وتثبيت ما تعلمته في هذه الحصة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
            السؤال {currentIdx + 1} من {questions.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto py-1 sm:py-2">
          {/* Question Text */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug">
              <FormattedText text={currentQ.questionAr} />
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-2.5 sm:space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700';

              if (isSelected && !isAnswerSubmitted) {
                optionStyle = 'border-blue-500 bg-blue-50/70 text-blue-950 font-bold ring-2 ring-blue-500/20';
              } else if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                } else if (isSelected && !opt.isCorrect) {
                  optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 line-through';
                } else {
                  optionStyle = 'border-slate-100 bg-slate-50 opacity-40';
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4 min-h-[48px] ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isAnswerSubmitted && opt.isCorrect ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : isSelected ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : null}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      <FormattedText text={opt.textAr} />
                    </span>
                  </div>

                  {isAnswerSubmitted && opt.isCorrect && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                      إجابة صحيحة ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Banner after submission */}
          {isAnswerSubmitted && selectedOpt && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1 animate-fadeIn">
              <span className="font-black block">💡 التفسير العلمي:</span>
              <p className="leading-relaxed">
                <FormattedText
                  text={selectedOpt.explanationAr || 'أحسنت! فهم المنطق وراء الإجابة هو جوهر التفكير الحاسوبي.'}
                />
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 text-center sm:text-right">
              اختر الإجابة ثم اضغط "تأكيد الإجابة" لمعرفة التفسير
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className={`px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                  selectedOptionId
                    ? 'bg-[#FF5B5A] text-white hover:bg-[#E84A5F] shadow-coral-glow'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{currentIdx < questions.length - 1 ? 'السؤال التالي ←' : 'عرض نتيجة المراجعة 📊'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Final Score & Self-Assessment Review Screen */
        <div className="py-8 text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-md border-2 border-blue-200">
              <BookOpen className="w-10 h-10" />
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
                ? '🎉 استيعاب ممتاز للمفاهيم!'
                : scorePercent >= 60
                ? '👏 نتيجة جيدة جداً في مراجعة الدرس!'
                : '💪 محاولة مفيدة! يمكنك إعادة المراجعة لترسيخ المعلومات.'}
            </h4>
            <p className="text-sm text-slate-500">
              أجبت عن {correctCount} من أصل {questions.length} أسئلة بشكل صحيح.
            </p>
          </div>

          {/* Big Score Badge */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-3xl font-black text-blue-700 font-mono">{scorePercent}%</span>
            <div className="text-right">
              <div className="text-xs font-bold text-blue-900">نسبة الإتقان والمراجعة</div>
              <div className="text-[11px] text-blue-600">تقييم ذاتي للمفاهيم</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة المراجعة والتأكد من الإجابات</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
