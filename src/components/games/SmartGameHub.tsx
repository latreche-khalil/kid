import React, { useState } from 'react';
import { CheckCircle2, Gamepad2, Lock, RotateCcw, Sparkles, Unlock } from 'lucide-react';
import { BugHunterGame } from './BugHunterGame';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { soundFx } from '../../services/sound/webAudio';

interface SmartGameHubProps {
  weekNumber: number;
}

export const SmartGameHub: React.FC<SmartGameHubProps> = ({ weekNumber }) => {
  const modeIndex = weekNumber === 1 ? 1 : weekNumber % 6;

  // Variables game state
  const [varValue, setVarValue] = useState<number>(10);
  const [varSolved, setVarSolved] = useState<boolean>(false);

  // Conditions game state
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [powerOn, setPowerOn] = useState<boolean>(false);

  // Loops game state
  const [loopCount, setLoopCount] = useState<number>(1);
  const [loopSolved, setLoopSolved] = useState<boolean>(false);

  // Arrays game state
  const [pickedChestIdx, setPickedChestIdx] = useState<number | null>(null);

  // Binary game state
  const [bits, setBits] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const binaryTarget = 11; // 1011 = 8 + 0 + 2 + 1
  const binarySum = bits[0] * 8 + bits[1] * 4 + bits[2] * 2 + bits[3] * 1;

  // Week 1 & Debugging lessons -> BugHunterGame
  if (modeIndex === 1) {
    return (
      <div className="space-y-4 animate-lab-enter">
        <div className="rounded-2xl bg-white border border-slate-200/90 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CharacterAvatar character="buggy" size="sm" expression="excited" />
            <div>
              <span className="text-[11px] font-black text-[#F47C62] block">لعبة اكتشف الخطأ 🐞</span>
              <h2 className="text-base font-black text-[#203447]">اضغط على السطر الخاطئ داخل الكود وأصلحه!</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#30A89A]/15 text-[#203447] text-xs font-black">
            Debugging
          </span>
        </div>
        <BugHunterGame />
      </div>
    );
  }

  // Variables: تحكم في القيم
  if (modeIndex === 2) {
    const target = 25;
    const isHit = varValue === target;
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-5 text-center animate-lab-enter">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6388D8]/15 text-[#203447] text-xs font-black">
          <Gamepad2 className="w-4 h-4 text-[#6388D8]" />
          <span>لعبة المتغيرات: تحكّم في القيم 📦</span>
        </div>

        <h2 className="text-xl font-black text-[#203447]">اضبط قيمة المتغير energy حتى تصل إلى 25 بالضبط!</h2>

        <div className="p-5 rounded-2xl bg-[#FAFAF6] border border-slate-200 space-y-3">
          <div className="font-mono text-lg font-black text-[#203447]" dir="ltr">
            int energy = <span className="text-[#30A89A]">{varValue}</span>;
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[-5, -1, +1, +5, +10].map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  const next = Math.max(0, varValue + delta);
                  setVarValue(next);
                  if (next === target) {
                    soundFx.playSuccessChime();
                    setVarSolved(true);
                  } else {
                    setVarSolved(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#30A89A] hover:text-white border border-slate-200 font-mono text-xs font-black transition-all"
                dir="ltr"
              >
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>
        </div>

        {isHit && varSolved && (
          <div className="p-3.5 rounded-2xl bg-[#30A89A]/15 border border-[#30A89A] text-sm font-black text-[#203447] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#30A89A]" />
            <span>أحسنت! وصلت القيمة إلى 25 وفتحت القفل!</span>
          </div>
        )}
      </div>
    );
  }

  // Conditions: افتح الباب بالمنطق
  if (modeIndex === 3) {
    const doorOpen = hasKey && powerOn;
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-5 text-center animate-lab-enter">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC857]/25 text-[#203447] text-xs font-black">
          🎮 لعبة الشروط: افتح الباب بالمنطق (AND)
        </span>
        <h2 className="text-xl font-black text-[#203447]">حقق الشرط البرمجي لفتح بوابة المختبر!</h2>
        <div className="font-mono text-xs sm:text-sm font-bold bg-[#FAFAF6] p-3.5 rounded-2xl border border-slate-200 text-[#203447]" dir="ltr">
          if (hasKey == true && powerOn == true) {'{ openDoor(); }'}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setHasKey((v) => !v);
            }}
            className={`p-4 rounded-2xl border font-black text-sm transition-all ${
              hasKey ? 'bg-[#30A89A] text-white border-[#30A89A]' : 'bg-[#FAFAF6] text-[#203447] border-slate-200'
            }`}
          >
            🗝️ المفتاح (hasKey): {hasKey ? 'true' : 'false'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setPowerOn((v) => !v);
            }}
            className={`p-4 rounded-2xl border font-black text-sm transition-all ${
              powerOn ? 'bg-[#30A89A] text-white border-[#30A89A]' : 'bg-[#FAFAF6] text-[#203447] border-slate-200'
            }`}
          >
            ⚡ الكهرباء (powerOn): {powerOn ? 'true' : 'false'}
          </button>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-black text-sm ${
            doorOpen ? 'bg-[#30A89A]/15 border-[#30A89A] text-[#203447]' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          {doorOpen ? <Unlock className="w-5 h-5 text-[#30A89A]" /> : <Lock className="w-5 h-5" />}
          <span>{doorOpen ? 'انفتح الباب! الشرطان متحققان معاً 🎉' : 'الباب مغلق — يحتاج تحقق الشرطين معاً'}</span>
        </div>
      </div>
    );
  }

  // Loops: أكمل النمط
  if (modeIndex === 4) {
    const targetPattern = 5;
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-5 text-center animate-lab-enter">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#30A89A]/15 text-[#203447] text-xs font-black">
          🔁 لعبة الحلقات: أكمل النمط بـ for loop
        </span>
        <h2 className="text-xl font-black text-[#203447]">كم مرة يجب أن تتكرر الحلقة لإضاءة 5 مصابيح متتالية؟</h2>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                n <= loopCount
                  ? 'bg-[#FFC857] border-[#F47C62] text-[#203447] scale-105'
                  : 'bg-[#FAFAF6] border-slate-200 text-slate-400'
              }`}
            >
              💡
            </div>
          ))}
        </div>

        <div className="font-mono text-xs sm:text-sm font-bold bg-[#FAFAF6] p-3.5 rounded-2xl border border-slate-200 text-[#203447]" dir="ltr">
          for (int i = 0; i &lt; <span className="text-[#30A89A] font-black">{loopCount}</span>; i++)
        </div>

        <div className="flex justify-center gap-2">
          {[2, 4, 5, 6].map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setLoopCount(choice);
                if (choice === targetPattern) {
                  soundFx.playSuccessChime();
                  setLoopSolved(true);
                } else {
                  setLoopSolved(false);
                }
              }}
              className={`px-5 py-2.5 rounded-xl font-mono text-sm font-black border transition-all ${
                loopCount === choice
                  ? 'bg-[#30A89A] text-white border-[#30A89A]'
                  : 'bg-white text-[#203447] border-slate-200 hover:bg-slate-50'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>

        {loopSolved && (
          <div className="p-3 rounded-2xl bg-[#30A89A]/15 border border-[#30A89A] text-xs sm:text-sm font-black text-[#203447]">
            ✅ ممتاز! الحلقة كررت الإضاءة 5 مرات بدقة!
          </div>
        )}
      </div>
    );
  }

  // Arrays: ابحث عن الكنز
  if (modeIndex === 5) {
    const targetIdx = 2; // treasure[2]
    const items = ['🔩 برغي', '🔋 بطارية', '💎 جوهرة الكنز', '🔌 سلك'];
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-5 text-center animate-lab-enter">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6388D8]/15 text-[#203447] text-xs font-black">
          🧰 لعبة المصفوفات: ابحث عن الكنز
        </span>
        <h2 className="text-xl font-black text-[#203447]">أين يوجد العنصر <code className="font-mono text-[#30A89A]" dir="ltr">chest[2]</code>؟</h2>
        <p className="text-xs text-slate-500 font-bold">تذكّر: الترقيم في المصفوفات يبدأ دائماً من 0!</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((item, idx) => {
            const isPicked = pickedChestIdx === idx;
            const isRight = isPicked && idx === targetIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setPickedChestIdx(idx);
                  if (idx === targetIdx) soundFx.playSuccessChime();
                  else soundFx.playFalseStartBuzz();
                }}
                className={`p-4 rounded-2xl border space-y-1.5 transition-all ${
                  isRight
                    ? 'bg-[#30A89A]/15 border-[#30A89A]'
                    : isPicked
                    ? 'bg-[#F47C62]/15 border-[#F47C62]'
                    : 'bg-[#FAFAF6] border-slate-200 hover:border-[#6388D8]'
                }`}
              >
                <span className="font-mono text-xs font-black text-[#6388D8] block" dir="ltr">
                  [{idx}]
                </span>
                <span className="text-xs font-bold text-[#203447]">
                  {isPicked ? item : '📦 صندوق مغلق'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Binary: تحدي الأرقام الثنائية
  const toggleBit = (index: 0 | 1 | 2 | 3) => {
    soundFx.playClick();
    const copy: [number, number, number, number] = [...bits] as [number, number, number, number];
    copy[index] = copy[index] === 1 ? 0 : 1;
    setBits(copy);
    const nextSum = copy[0] * 8 + copy[1] * 4 + copy[2] * 2 + copy[3] * 1;
    if (nextSum === binaryTarget) soundFx.playSuccessChime();
  };

  return (
    <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 space-y-5 text-center animate-lab-enter">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC857]/25 text-[#203447] text-xs font-black">
        💻 تحدي الأرقام الثنائية (Binary 0 / 1)
      </span>
      <h2 className="text-xl font-black text-[#203447]">
        شكّل الرقم العشري <span className="text-[#30A89A] font-mono">{binaryTarget}</span> باستخدام مفاتيح 0 و 1!
      </h2>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto" dir="ltr">
        {[8, 4, 2, 1].map((weight, idx) => (
          <button
            key={weight}
            type="button"
            onClick={() => toggleBit(idx as 0 | 1 | 2 | 3)}
            className={`p-4 rounded-2xl border space-y-1 transition-all ${
              bits[idx] === 1
                ? 'bg-[#30A89A] text-white border-[#30A89A] shadow-teal-glow'
                : 'bg-[#FAFAF6] text-[#203447] border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold opacity-80 block">قيمة {weight}</span>
            <span className="text-2xl font-black font-mono">{bits[idx]}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-black text-[#203447]">المجموع الحالي: {binarySum}</span>
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setBits([0, 0, 0, 0]);
          }}
          className="p-2 rounded-xl bg-[#FAFAF6] border border-slate-200 text-[#203447]"
          title="تصفير"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {binarySum === binaryTarget && (
        <div className="p-3.5 rounded-2xl bg-[#30A89A]/15 border border-[#30A89A] text-sm font-black text-[#203447] flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#30A89A]" />
          <span>رائع! 1011 بالثنائي تساوي 11 🎉</span>
        </div>
      )}
    </div>
  );
};

