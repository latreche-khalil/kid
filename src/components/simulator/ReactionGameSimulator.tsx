import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, Terminal, Trophy, AlertOctagon, Volume2, ShieldCheck } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import confetti from 'canvas-confetti';

type GameState = 'IDLE' | 'WAITING_RANDOM' | 'ACTIVE_LIGHT' | 'FALSE_START' | 'RESULT';

export const ReactionGameSimulator: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [bestTimeMs, setBestTimeMs] = useState<number | null>(null);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '======================================',
    '🚀 لعبة سرعة الاستجابة جاهزة ومحمية!',
    'اضغط زر البدء (D2) لبدء جولة جديدة...',
    '======================================',
  ]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const serialEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll serial monitor
  useEffect(() => {
    serialEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const appendLog = (message: string) => {
    setSerialLogs((prev) => [...prev, message]);
  };

  // 1. Press Start Button
  const handleStartRound = () => {
    if (gameState === 'WAITING_RANDOM' || gameState === 'ACTIVE_LIGHT') return;

    soundFx.playClick();
    setReactionTimeMs(null);
    setGameState('WAITING_RANDOM');

    appendLog('');
    appendLog('🎯 بدأت الجولة! استعد وركّز بصرك على المصباح...');

    // Random duration between 2000 and 4500 ms
    const randomDelay = Math.floor(Math.random() * 2500) + 2000;

    timerRef.current = setTimeout(() => {
      // Light up LED and sound tone
      setGameState('ACTIVE_LIGHT');
      startTimeRef.current = performance.now();
      soundFx.playStartSignal();
      appendLog('🚨 اشتعل المصباح! اضغط الآن بأقصى سرعة!');
    }, randomDelay);
  };

  // 2. Press Reaction Button
  const handleReactionPress = () => {
    // Case A: Pressed too early (False Start / Cheat)
    if (gameState === 'WAITING_RANDOM') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('FALSE_START');
      soundFx.playFalseStartBuzz();
      appendLog('❌ انطلاق مبكر! ضغطت الزر قبل إضاءة الضوء!');
      appendLog('ألغيت الجولة. حاول ثانية والتزم بالقواعد!');
      return;
    }

    // Case B: Pressed when LED is ON (Valid Reaction)
    if (gameState === 'ACTIVE_LIGHT') {
      const now = performance.now();
      const elapsed = Math.round(now - startTimeRef.current);

      setReactionTimeMs(elapsed);
      setGameState('RESULT');

      // Update best score
      if (bestTimeMs === null || elapsed < bestTimeMs) {
        setBestTimeMs(elapsed);
      }

      appendLog('--------------------------------------');
      appendLog(`⚡ زمن استجابتك الفائق: ${elapsed} ملي ثانية (ms)!`);

      if (elapsed < 240) {
        appendLog('🏆 لقبك: البرق الخارق (Lightning Reflexes)!');
        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else if (elapsed < 350) {
        appendLog('👏 لقبك: الفهد السريع (Fast Cheetah)!');
        soundFx.playSuccessChime();
      } else {
        appendLog('🐢 لقبك: السلحفاة المتأملة! تدرب أكثر لتصبح أسرع.');
        soundFx.playTone(400, 250);
      }
      appendLog('--------------------------------------');
      return;
    }

    // Idle press
    soundFx.playClick();
  };

  // Reset all
  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameState('IDLE');
    setReactionTimeMs(null);
    appendLog('🔄 تمت إعادة ضبط اللعبة.');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-slate-800 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">محاكي لعبة سرعة الاستجابة الحية</h3>
            <p className="text-xs text-slate-400">محاكاة فيزيائية حية لمنطق كود الآردوينو مع رصد الغش وأصوات الطنان الحقيقية</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          {bestTimeMs !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Trophy className="w-4 h-4" />
              <span>أفضل زمن: {bestTimeMs} ms</span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Hardware Panel (Buttons & LED) */}
        <div className="lg:col-span-7 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between space-y-8">
          {/* LED & Status Lamp Area */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              مصباح إشارة الانطلاق (D8)
            </span>

            {/* Glowing Big LED Lamp */}
            <div className="relative">
              <div
                className={`w-28 h-28 rounded-full transition-all duration-150 flex items-center justify-center border-4 ${
                  gameState === 'ACTIVE_LIGHT'
                    ? 'bg-red-500 border-red-300 shadow-[0_0_60px_#EF4444] scale-105'
                    : gameState === 'FALSE_START'
                    ? 'bg-amber-600 border-amber-400 shadow-[0_0_30px_#D97706]'
                    : 'bg-red-950/80 border-slate-700'
                }`}
              >
                {/* Core reflection */}
                <div
                  className={`w-10 h-10 rounded-full transition-opacity ${
                    gameState === 'ACTIVE_LIGHT' ? 'bg-red-200 opacity-90' : 'bg-red-900/40 opacity-30'
                  }`}
                />
              </div>

              {/* Status Ring Pulse */}
              {gameState === 'ACTIVE_LIGHT' && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60" />
              )}
            </div>

            {/* Realtime Status text */}
            <div className="text-center font-bold">
              {gameState === 'IDLE' && (
                <span className="text-slate-400 text-sm">جاهز.. اضغط زر البدء لبدء الجولة</span>
              )}
              {gameState === 'WAITING_RANDOM' && (
                <span className="text-amber-400 text-sm animate-pulse flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  ترقب عشوائي... إياك أن تضغط زر الاستجابة الآن!
                </span>
              )}
              {gameState === 'ACTIVE_LIGHT' && (
                <span className="text-red-400 text-base font-black animate-bounce flex items-center justify-center gap-1.5">
                  ⚡ اضغط الآن بسرعة قصوى! ⚡
                </span>
              )}
              {gameState === 'FALSE_START' && (
                <span className="text-amber-300 text-sm flex items-center justify-center gap-1.5 font-bold">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  انطلاق مبكر! احتسبت محاولة غش ملغاة!
                </span>
              )}
              {gameState === 'RESULT' && reactionTimeMs !== null && (
                <div className="space-y-1">
                  <span className="text-emerald-400 text-2xl font-black">{reactionTimeMs} ms</span>
                  <p className="text-xs text-slate-300">
                    {reactionTimeMs < 240
                      ? '⚡ سرعة خارقة تفوق التوقعات!'
                      : reactionTimeMs < 350
                      ? '👏 استجابة سريعة وممتازة!'
                      : '🐢 استجابة متوسطة.. استمر بالتدريب!'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Hardware Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/80">
            {/* Start Button */}
            <button
              onClick={handleStartRound}
              disabled={gameState === 'WAITING_RANDOM' || gameState === 'ACTIVE_LIGHT'}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl font-bold transition-all ${
                gameState === 'WAITING_RANDOM' || gameState === 'ACTIVE_LIGHT'
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-lg shadow-blue-600/30'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Play className="w-6 h-6 fill-current text-white" />
              </div>
              <span className="text-base font-black">1. زر البدء (D2)</span>
              <span className="text-xs text-blue-200 mt-0.5">Start Button</span>
            </button>

            {/* Reaction Button */}
            <button
              onClick={handleReactionPress}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl font-bold transition-all active:scale-95 ${
                gameState === 'ACTIVE_LIGHT'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/50 ring-4 ring-emerald-300 animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-md'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 fill-current text-white" />
              </div>
              <span className="text-base font-black">2. زر الاستجابة (D3)</span>
              <span className="text-xs text-emerald-200 mt-0.5">Reaction Button</span>
            </button>
          </div>
        </div>

        {/* Right: Serial Monitor Terminal Output */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between font-mono">
          <div>
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-300">Serial Monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-[11px]">9600 baud</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Terminal Screen text */}
            <div className="mt-3 h-64 overflow-y-auto space-y-1 text-xs text-slate-300 pr-1 select-text scrollbar-thin">
              {serialLogs.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('❌')
                      ? 'text-amber-400 font-bold bg-amber-950/30 px-1 rounded'
                      : log.includes('⚡')
                      ? 'text-cyan-300 font-bold'
                      : log.includes('🏆')
                      ? 'text-yellow-300 font-bold'
                      : log.includes('🚨')
                      ? 'text-rose-400 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
              <div ref={serialEndRef} />
            </div>
          </div>

          {/* Educational Note */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>نظام الحماية من الانطلاق المبكر يعمل عبر فحص millis() غير المعطل.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
