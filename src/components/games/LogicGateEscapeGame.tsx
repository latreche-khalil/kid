import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, ShieldCheck, DoorOpen, RotateCcw } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import { storageService } from '../../services/storage/localStorage';
import confetti from 'canvas-confetti';

interface GatePuzzle {
  id: number;
  titleAr: string;
  gateType: 'AND' | 'OR' | 'NOT' | 'XOR';
  gateDescriptionAr: string;
  targetOutput: number; // 1 to open door
  inputALocked?: number; // if set, student can only change B
  inputBLocked?: number;
}

const GATE_PUZZLES: GatePuzzle[] = [
  {
    id: 1,
    titleAr: 'المرحلة 1: بوابة العبور المزدوج (AND)',
    gateType: 'AND',
    gateDescriptionAr: 'بوابة AND لا تُعطي 1 إلا إذا كان المدخلان معاً 1 في نفس الوقت! اضبط المفتاحين لفتح الباب.',
    targetOutput: 1,
  },
  {
    id: 2,
    titleAr: 'المرحلة 2: بوابة الخيار البديل (OR)',
    gateType: 'OR',
    gateDescriptionAr: 'بوابة OR تعطي 1 إذا كان أيٌّ من المدخلين (أو كلاهما) 1. افتح الباب!',
    targetOutput: 1,
  },
  {
    id: 3,
    titleAr: 'المرحلة 3: بوابة العاكس السحري (NOT)',
    gateType: 'NOT',
    gateDescriptionAr: 'بوابة NOT تعكس الإشارة: الصفر يصبح 1 والواحد يصبح صفر! اضبط المدخل ليخرج 1.',
    targetOutput: 1,
  },
];

export const LogicGateEscapeGame: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [score, setScore] = useState(0);

  const puzzle = GATE_PUZZLES[currentIdx];

  // Calculate gate output
  let output = 0;
  if (puzzle.gateType === 'AND') output = inputA === 1 && inputB === 1 ? 1 : 0;
  else if (puzzle.gateType === 'OR') output = inputA === 1 || inputB === 1 ? 1 : 0;
  else if (puzzle.gateType === 'NOT') output = inputA === 0 ? 1 : 0;
  else if (puzzle.gateType === 'XOR') output = inputA !== inputB ? 1 : 0;

  const isDoorUnlocked = output === puzzle.targetOutput;

  const handleNext = () => {
    soundFx.playClick();
    if (currentIdx < GATE_PUZZLES.length - 1) {
      setCurrentIdx((i) => i + 1);
      setInputA(0);
      setInputB(0);
    } else {
      soundFx.playVictoryFanfare();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      const active = storageService.getActiveProfile();
      storageService.updateProgress(active.id, {
        xp: active.progress.xp + 50,
      });
    }
  };

  const toggleA = () => {
    soundFx.playClick();
    setInputA((v) => (v === 0 ? 1 : 0));
  };

  const toggleB = () => {
    soundFx.playClick();
    setInputB((v) => (v === 0 ? 1 : 0));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">الهروب عبر البوابات المنطقية (Logic Gate Escape)</h3>
            <p className="text-xs text-slate-500">تحكم بمدخلات الدارة لتفعيل مخرج الأمان وفتح بوابة المختبر المحصنة!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
            لغز {currentIdx + 1} من {GATE_PUZZLES.length}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <h4 className="font-bold text-slate-800 text-sm mb-1">{puzzle.titleAr}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{puzzle.gateDescriptionAr}</p>
      </div>

      {/* Circuit Diagram Simulator */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleA}
              className={`w-14 h-12 rounded-xl font-mono text-xl font-black transition-all ${
                inputA === 1 ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {inputA}
            </button>
            <span className="text-xs font-bold text-slate-300">مدخل A ({inputA === 1 ? '5V HIGH' : '0V LOW'})</span>
          </div>

          {puzzle.gateType !== 'NOT' && (
            <div className="flex items-center gap-3">
              <button
                onClick={toggleB}
                className={`w-14 h-12 rounded-xl font-mono text-xl font-black transition-all ${
                  inputB === 1 ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {inputB}
              </button>
              <span className="text-xs font-bold text-slate-300">مدخل B ({inputB === 1 ? '5V HIGH' : '0V LOW'})</span>
            </div>
          )}
        </div>

        {/* Center: Logic Gate Symbol */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800 border border-slate-700 min-w-[150px]">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">رمز البوابة</span>
          <span className="text-3xl font-black text-white font-mono">{puzzle.gateType}</span>
          <span className="text-[10px] text-slate-400 mt-1">Logic Gate</span>
        </div>

        {/* Output & Door Status */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black font-mono transition-all ${
              isDoorUnlocked
                ? 'bg-emerald-500 text-white shadow-[0_0_35px_#10B981]'
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}
          >
            {output}
          </div>
          <span className="text-xs font-bold">المخرج ({output === 1 ? 'فتح القفل' : 'مغلق'})</span>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
              isDoorUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isDoorUnlocked ? <DoorOpen className="w-4 h-4 text-emerald-400" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{isDoorUnlocked ? 'الباب مفتوح!' : 'الباب محكم الإغلاق'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {isDoorUnlocked && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>{currentIdx < GATE_PUZZLES.length - 1 ? 'اللغز التالي ←' : 'حصد وسام البوابات 🏆'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

