import React, { useState } from 'react';
import { Bug, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import { storageService } from '../../services/storage/localStorage';
import confetti from 'canvas-confetti';

interface BugLevel {
  id: number;
  titleAr: string;
  descriptionAr: string;
  codeLines: string[];
  buggyLineIndex: number;
  bugExplanationAr: string;
  options: {
    textAr: string;
    isCorrect: boolean;
  }[];
}

const BUG_LEVELS: BugLevel[] = [
  {
    id: 1,
    titleAr: 'المستوى 1: إصلاح زر اللاعب الأول',
    descriptionAr: 'في سباق 1 ضد 1، غيّر غليتش أمر زر اللاعب الأول (الأزرق على D2) فأصبح يلتقط ضغطات خاطئة!',
    codeLines: [
      'void setup() {',
      '  Serial.begin(9600);',
      '  pinMode(8, OUTPUT);',
      '  pinMode(2, INPUT); // ⚠️ زر اللاعب 1 (الأزرق)',
      '  pinMode(3, INPUT_PULLUP); // زر اللاعب 2 (الأخضر)',
      '}',
    ],
    buggyLineIndex: 3,
    bugExplanationAr: 'نحتاج كتابة INPUT_PULLUP لزر اللاعب 1 (D2) بدل INPUT حتى يعطي قراءة نظيفة ولا يخسر اللاعب بالغلط!',
    options: [
      { textAr: 'استبدال السطر بـ: pinMode(2, INPUT_PULLUP);', isCorrect: true },
      { textAr: 'حذف السطر بالكامل.', isCorrect: false },
      { textAr: 'تغييره إلى: pinMode(2, OUTPUT);', isCorrect: false },
    ],
  },
  {
    id: 2,
    titleAr: 'المستوى 2: حساب وقت السباق المقلوب',
    descriptionAr: 'حساب وقت الفوز يخرج رقماً خاطئاً وكبيراً جداً! أين الخطأ؟',
    codeLines: [
      'unsigned long startTime = millis();',
      '// انتظار ضغط الزر...',
      'unsigned long endTime = millis();',
      'unsigned long reaction = startTime - endTime; // ⚠️ الوقت مقلوب!',
      'Serial.println(reaction);',
    ],
    buggyLineIndex: 3,
    bugExplanationAr: 'لحساب كم ثانية مرّت، نطرح وقت البداية (الأصغر) من وقت النهاية (الأكبر): endTime - startTime.',
    options: [
      { textAr: 'تصحيح المعادلة: reaction = endTime - startTime;', isCorrect: true },
      { textAr: 'استخدام: reaction = startTime + endTime;', isCorrect: false },
      { textAr: 'تحويل startTime إلى صفر دائماً.', isCorrect: false },
    ],
  },
  {
    id: 3,
    titleAr: 'المستوى 3: اللمبة لا تشتعل!',
    descriptionAr: 'المصباح لا يضيء نهائياً رغم أننا كتبنا digitalWrite(LED, HIGH)! ما السطر الناقص؟',
    codeLines: [
      'const int LED = 8;',
      'void setup() {',
      '  Serial.begin(9600);',
      '  // ⚠️ غليتش حذف سطر تهيئة اللمبة هنا!',
      '}',
      'void loop() { digitalWrite(LED, HIGH); }',
    ],
    buggyLineIndex: 3,
    bugExplanationAr: 'نسينا إخبار الآردوينو في setup() أن اللمبة مخرج للضوء! يجب كتابة pinMode(LED, OUTPUT); لتشتعل اللمبة.',
    options: [
      { textAr: 'إضافة: pinMode(LED, OUTPUT); داخل setup()', isCorrect: true },
      { textAr: 'استبدال HIGH بـ LOW.', isCorrect: false },
      { textAr: 'تغيير رقم المنفذ إلى A0.', isCorrect: false },
    ],
  },
];

export const BugHunterGame: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const level = BUG_LEVELS[currentLevelIdx];

  const handleLineClick = (idx: number) => {
    if (isAnswered) return;
    soundFx.playClick();
    setSelectedLine(idx);
  };

  const handleOptionSubmit = (optIdx: number) => {
    soundFx.playClick();
    setSelectedOption(optIdx);
    setIsAnswered(true);

    const isLineCorrect = selectedLine === level.buggyLineIndex;
    const isOptCorrect = level.options[optIdx].isCorrect;

    if (isLineCorrect && isOptCorrect) {
      soundFx.playSuccessChime();
      setScore((s) => s + 50);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } else {
      soundFx.playFalseStartBuzz();
    }
  };

  const handleNextLevel = () => {
    soundFx.playClick();
    if (currentLevelIdx < BUG_LEVELS.length - 1) {
      setCurrentLevelIdx((i) => i + 1);
      setSelectedLine(null);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameFinished(true);
      soundFx.playVictoryFanfare();
      // Save score to active profile
      const active = storageService.getActiveProfile();
      storageService.updateProgress(active.id, {
        xp: active.progress.xp + score,
        gameHighScores: {
          ...active.progress.gameHighScores,
          bug_hunter: Math.max(active.progress.gameHighScores?.bug_hunter || 0, score),
        },
      });
    }
  };

  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setSelectedLine(null);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Bug className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-slate-800">لعبة صائد الأخطاء البرمجية</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">انقر على السطر المعطوب ثم اختر الحل الصحيح!</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>النقاط: {score} XP</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
            المستوى {currentLevelIdx + 1} من {BUG_LEVELS.length}
          </div>
        </div>
      </div>

      {!gameFinished ? (
        <div className="space-y-5 sm:space-y-6">
          {/* Level Prompt */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-1">{level.titleAr}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{level.descriptionAr}</p>
          </div>

          {/* Interactive Code Box */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-slate-500">
              <span>الخطوة 1: انقر على السطر الذي يحتوي على الخطأ</span>
              <span>بيئة Arduino IDE</span>
            </div>

            <div className="bg-white rounded-2xl p-3 sm:p-4 font-mono text-[11px] sm:text-xs text-slate-800 space-y-1 overflow-x-auto select-none border border-slate-200/90 shadow-inner" dir="ltr">
              {level.codeLines.map((line, idx) => {
                const isSelected = selectedLine === idx;
                const isTheBug = idx === level.buggyLineIndex;

                let rowStyle = 'hover:bg-slate-100 cursor-pointer';
                if (isSelected) {
                  rowStyle = 'bg-sky-100 border-l-4 border-sky-500 text-slate-950 font-bold';
                }
                if (isAnswered) {
                  if (isTheBug) {
                    rowStyle = 'bg-emerald-100 border-l-4 border-emerald-500 text-emerald-950 font-bold';
                  } else if (isSelected && !isTheBug) {
                    rowStyle = 'bg-rose-100 border-l-4 border-rose-500 text-rose-900';
                  }
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleLineClick(idx)}
                    className={`flex items-center gap-3 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap min-w-fit ${rowStyle}`}
                  >
                    <span className="w-5 text-slate-400 text-right select-none shrink-0">{idx + 1}</span>
                    <span className="flex-1 font-semibold">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Options Selection (Available once line is selected) */}
          {selectedLine !== null && !isAnswered && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700">
                الخطوة 2: ما هو الحل الصحيح لإصلاح هذا السطر؟
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {level.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionSubmit(optIdx)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-right text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>{opt.textAr}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback & Result */}
          {isAnswered && selectedOption !== null && (
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                selectedLine === level.buggyLineIndex && level.options[selectedOption].isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm">
                {selectedLine === level.buggyLineIndex && level.options[selectedOption].isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>أحسنت! تم رصد وتصحيح الثغرة بنجاح (+50 XP)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>إجابة غير دقيقة! دعنا نكتشف السبب:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">{level.bugExplanationAr}</p>

              <div className="pt-2">
                <button
                  onClick={handleNextLevel}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm transition-all"
                >
                  {currentLevelIdx < BUG_LEVELS.length - 1 ? 'المستوى التالي ←' : 'عرض النتيجة النهائية 🏆'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Game Finished Celebration Screen */
        <div className="py-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-black text-slate-800">مبارك! أكملت تحدي صائد الثغرات بنجاح!</h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            أثبت قدرتك الفائقة على قراءة الكود واكتشاف أفخاخ غليتش وإصلاحها بدقة المهندسين المحترفين.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 font-black text-lg border border-amber-200">
            <span>مجموع النقاط المكتسبة: +{score} XP</span>
          </div>

          <div className="pt-4">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5B5A] text-white font-bold text-sm shadow-coral-glow hover:bg-[#E84A5F]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>العب مرة أخرى</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

