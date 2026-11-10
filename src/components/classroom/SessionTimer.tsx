import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Bell, Clock } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';

interface SessionTimerProps {
  stageTitleAr: string;
  stageDurationMinutes: number;
  onStageComplete?: () => void;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  stageTitleAr,
  stageDurationMinutes,
  onStageComplete,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(stageDurationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Update seconds when stage duration changes
  useEffect(() => {
    setSecondsRemaining(stageDurationMinutes * 60);
    setIsRunning(false);
  }, [stageDurationMinutes]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      soundFx.playTimerBell();
      if (onStageComplete) onStageComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining, onStageComplete]);

  const toggleRun = () => {
    soundFx.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundFx.playClick();
    setIsRunning(false);
    setSecondsRemaining(stageDurationMinutes * 60);
  };

  const adjustMinutes = (delta: number) => {
    soundFx.playClick();
    setSecondsRemaining((sec) => Math.max(0, sec + delta * 60));
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.max(
    0,
    Math.min(100, ((stageDurationMinutes * 60 - secondsRemaining) / (stageDurationMinutes * 60)) * 100)
  );

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
      {/* Top stage info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 text-sm font-bold">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>مؤقت المرحلة: <span className="text-white">{stageTitleAr}</span></span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
          المدة المحددة: {stageDurationMinutes} دقيقة
        </span>
      </div>

      {/* Big Digital Clock Display */}
      <div className="flex items-center justify-between gap-6">
        <div className="font-mono text-5xl md:text-6xl font-black text-amber-400 tracking-wider drop-shadow-md">
          {formattedTime}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustMinutes(-1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="إنقاص دقيقة"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => adjustMinutes(1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="زيادة دقيقة"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={toggleRun}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'إيقاف مؤقت' : 'بدء المؤقت'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
