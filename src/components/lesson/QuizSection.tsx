import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Sparkles, Check, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../../types/curriculum';
import { soundFx } from '../../services/sound/webAudio';
import { storageService } from '../../services/storage/localStorage';
import confetti from 'canvas-confetti';

interface QuizSectionProps {
  questions: QuizQuestion[];
  weekNumber: number;
  xpReward: number;
  badgeId: string;
  onCompleted?: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  weekNumber,
  xpReward,
  badgeId,
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
      const correctCount = Object.values({
        ...answers,
        [currentQ.id]: {
          optionId: selectedOptionId!,
          isCorrect: currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect || false,
        },
      }).filter((a) => a.isCorrect).length;

      const scorePercent = Math.round((correctCount / questions.length) * 100);

      // Save to active student profile
      const active = storageService.getActiveProfile();
      storageService.recordQuizScore(active.id, weekNumber, scorePercent);

      if (scorePercent >= 60) {
        // Complete mission and award badge
        storageService.completeMission(active.id, weekNumber, xpReward, badgeId);
        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 70,
          spread: 80,
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

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">الاختبار التفاعلي الشامل — الأسبوع {weekNumber}</h3>
            <p className="text-xs text-slate-500">
              أجب عن الأسئلة بدقة لتثبيت المفاهيم العلمية وفتح وسام الإنجاز الرسمي!
            </p>
          </div>
        </div>

        {!isFinished && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              السؤال {currentIdx + 1} من {questions.length}
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              +{xpReward} XP
            </span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#FF5B5A] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h4 className="text-lg md:text-xl font-black text-slate-900 leading-relaxed">
              {currentQ.questionAr}
            </h4>

            {currentQ.codeSnippet && (
              <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto">
                <pre className="whitespace-pre-wrap">{currentQ.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;

              let style = 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30';
              if (isSelected) {
                style = 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20';
              }
              if (isAnswerSubmitted) {
                if (option.isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                } else if (isSelected && !option.isCorrect) {
                  style = 'border-rose-400 bg-rose-50 text-rose-950';
                } else {
                  style = 'border-slate-200 bg-slate-50 opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-right p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${style}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isAnswerSubmitted && option.isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    {isAnswerSubmitted && option.isCorrect ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      option.id.replace('opt-', '').toUpperCase()
                    )}
                  </div>

                  <span className="flex-1 text-sm md:text-base font-medium leading-relaxed">
                    {option.textAr}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pedogogical Feedback Explanation (Why correct/incorrect) */}
          {isAnswerSubmitted && selectedOptionId && (
            <div
              className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
                currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm">
                {currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>إجابة صحيحة ومتقنة!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>تفسير الإجابة العلمية:</span>
                  </>
                )}
              </div>
              <p className="text-xs md:text-sm leading-relaxed">
                {currentQ.options.find((o) => o.id === selectedOptionId)?.explanationAr}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              اختر الإجابة ثم اضغط "تأكيد الإجابة" للاطلاع على التفسير العلمي
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
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
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <span>{currentIdx < questions.length - 1 ? 'السؤال التالي ←' : 'عرض النتيجة النهائية 🏆'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Final Score & Badge Unlock Screen */
        <div className="py-8 text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-lg border-2 border-amber-200">
              <Award className="w-12 h-12" />
            </div>
            {scorePercent >= 60 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                <Check className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl md:text-3xl font-black text-slate-800">
              {scorePercent >= 80
                ? '🎉 أداء أسطوري فائق التميز!'
                : scorePercent >= 60
                ? '👏 أحسنت يا بطل! اجتزت الاختبار بنجاح!'
                : '💪 محاولة جيدة! راجع المفاهيم وحاول ثانية.'}
            </h4>
            <p className="text-sm text-slate-500">
              أجبت عن {correctCount} من أصل {questions.length} أسئلة بشكل صحيح.
            </p>
          </div>

          {/* Big Score Badge */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-3xl font-black text-amber-700 font-mono">{scorePercent}%</span>
            <div className="text-right">
              <div className="text-xs font-bold text-amber-800">مكافأة الاختبار</div>
              <div className="text-xs text-amber-600 font-bold">+{xpReward} XP مضافة لملفك</div>
            </div>
          </div>

          {/* Badge Unlocked Notification */}
          {scorePercent >= 60 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto text-emerald-900 space-y-1">
              <div className="flex items-center justify-center gap-2 font-black text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>تم فتح وسام: صائد الثغرات (Bug Hunter)!</span>
              </div>
              <p className="text-xs text-emerald-700">
                أصبح الوسام متاحاً الآن في قاعة الأوسمة بملفك الشخصي.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار لتحسين الدرجة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

