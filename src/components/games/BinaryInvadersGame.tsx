import React, { useState, useEffect } from 'react';
import { Binary, Sparkles, RotateCcw, Trophy, Check, ArrowRight } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import { storageService } from '../../services/storage/localStorage';
import confetti from 'canvas-confetti';

const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

export const BinaryInvadersGame: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(42);
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  // Generate target number
  const generateNewTarget = () => {
    // Generate interesting numbers between 5 and 150
    const randomVal = Math.floor(Math.random() * 120) + 7;
    setTargetNumber(randomVal);
    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
  };

  useEffect(() => {
    generateNewTarget();
  }, []);

  // Calculate current decimal sum from active bits
  const currentSum = bits.reduce((acc, bit, idx) => acc + (bit === 1 ? BIT_WEIGHTS[idx] : 0), 0);

  // Toggle single bit
  const toggleBit = (idx: number) => {
    soundFx.playClick();
    const newBits = [...bits];
    newBits[idx] = newBits[idx] === 0 ? 1 : 0;
    setBits(newBits);

    // Calculate sum after this toggle
    const newSum = newBits.reduce((acc, bit, i) => acc + (bit === 1 ? BIT_WEIGHTS[i] : 0), 0);

    if (newSum === targetNumber) {
      soundFx.playSuccessChime();
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      setScore((s) => s + 40 + streak * 5);
      setStreak((st) => st + 1);
      setSolvedCount((c) => c + 1);

      // Save to active profile XP
      const active = storageService.getActiveProfile();
      storageService.updateProgress(active.id, {
        xp: active.progress.xp + 40,
      });

      setTimeout(() => {
        generateNewTarget();
      }, 1200);
    }
  };

  const isMatched = currentSum === targetNumber;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">غزاة النظام الثنائي (Binary Invaders)</h3>
            <p className="text-xs text-slate-500">قم بتبديل مفاتيح البتات (0 و 1) حتى يتطابق مجموع الأوزان مع الرقم المطلوب!</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>النقاط: {score} XP</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs">
            أرقام محلولة: {solvedCount}
          </div>
        </div>
      </div>

      {/* Target Number Display Area */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-inner">
        {/* Target */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-indigo-300">الرقم العشري المطلوب</span>
          <div className="text-5xl font-black text-amber-400 font-mono tracking-wider">{targetNumber}</div>
        </div>

        <div className="text-2xl text-slate-500 font-bold hidden md:block">➔</div>

        {/* Current Total */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-indigo-300">المجموع الحالي لمفاتيحك</span>
          <div
            className={`text-5xl font-black font-mono tracking-wider transition-colors ${
              isMatched
                ? 'text-emerald-400 scale-110 animate-bounce'
                : currentSum > targetNumber
                ? 'text-rose-400'
                : 'text-white'
            }`}
          >
            {currentSum}
          </div>
        </div>

        {/* Feedback pill */}
        <div className="text-center">
          {isMatched ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md animate-pulse">
              <Check className="w-4 h-4" />
              <span>تطابق ممتاز! كود صحيح!</span>
            </span>
          ) : currentSum > targetNumber ? (
            <span className="text-xs text-rose-300 font-medium bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800">
              المجموع تجاوز الرقم! أطفئ بعض المفاتيح
            </span>
          ) : (
            <span className="text-xs text-slate-400">شغّل مفاتيح إضافية للوصول للمجموع</span>
          )}
        </div>
      </div>

      {/* 8-Bit Interactive Switches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>1 بايت (Byte) = 8 بتات (Bits)</span>
          <span className="font-mono text-indigo-600">القوى الأسية للعدد 2</span>
        </div>

        {/* Switches Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {BIT_WEIGHTS.map((weight, idx) => {
            const isActive = bits[idx] === 1;

            return (
              <button
                key={weight}
                onClick={() => toggleBit(idx)}
                className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10 scale-102'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Weight Tag */}
                <span className="text-xs font-black text-slate-700 font-mono">{weight}</span>

                {/* Digital Bit State Button (0 or 1) */}
                <div
                  className={`w-12 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-black my-2 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-indigo-glow'
                      : 'bg-white border border-slate-300 text-slate-400 shadow-inner'
                  }`}
                >
                  {bits[idx]}
                </div>

                {/* State Label */}
                <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isActive ? 'تشغيل ON' : 'إطفاء OFF'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculation Formula Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 flex flex-wrap items-center justify-center gap-1.5">
        <span className="font-sans font-bold text-slate-800 ml-2">المعادلة:</span>
        {BIT_WEIGHTS.map((w, idx) => (
          <span key={w} className="inline-flex items-center">
            <span className={bits[idx] === 1 ? 'text-indigo-600 font-bold' : 'text-slate-400'}>
              ({bits[idx]} × {w})
            </span>
            {idx < BIT_WEIGHTS.length - 1 && <span className="text-slate-400 mx-1">+</span>}
          </span>
        ))}
        <span className="text-slate-800 font-bold mx-1">=</span>
        <span className="text-indigo-600 font-black text-sm font-sans">{currentSum}</span>
      </div>
    </div>
  );
};

