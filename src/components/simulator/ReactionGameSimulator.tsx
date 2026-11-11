import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Flag, RotateCcw, Zap, Terminal, Trophy, AlertOctagon, ShieldCheck, Play } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import confetti from 'canvas-confetti';

type GameState = 'IDLE' | 'WAITING_RANDOM' | 'ACTIVE_LIGHT' | 'FALSE_START' | 'RESULT';

export const ReactionGameSimulator: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [winnerPlayer, setWinnerPlayer] = useState<1 | 2 | null>(null);
  const [loserPlayer, setLoserPlayer] = useState<1 | 2 | null>(null);
  const [p1Wins, setP1Wins] = useState<number>(0);
  const [p2Wins, setP2Wins] = useState<number>(0);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '======================================',
    '🏁 تحدّي الأسرع (1 ضد 1) جاهز للسباق!',
    'الأول بعد الإشارة يفوز — والأخير (أو المتسرّع) يخسر!',
    'اللاعب 1: D2 (الأزرق) | اللاعب 2: D3 (الأخضر)',
    '======================================',
  ]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>('IDLE');
  gameStateRef.current = gameState;
  const serialEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    serialEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const appendLog = useCallback((message: string) => {
    setSerialLogs((prev) => [...prev, message]);
  }, []);

  const handleStartRound = useCallback(() => {
    if (gameStateRef.current === 'WAITING_RANDOM' || gameStateRef.current === 'ACTIVE_LIGHT') return;

    soundFx.playClick();
    setReactionTimeMs(null);
    setWinnerPlayer(null);
    setLoserPlayer(null);
    gameStateRef.current = 'WAITING_RANDOM';
    setGameState('WAITING_RANDOM');

    appendLog('');
    appendLog('🎯 بدأت جولة 1 ضد 1! ضعا أيديكما على الأزرار...');
    appendLog('⚠️ إياكما أن يضغط أحد قبل اشتعال اللمبة الحمراء!');

    const randomDelay = Math.floor(Math.random() * 2500) + 1800;

    timerRef.current = setTimeout(() => {
      gameStateRef.current = 'ACTIVE_LIGHT';
      setGameState('ACTIVE_LIGHT');
      startTimeRef.current = performance.now();
      soundFx.playStartSignal();
      appendLog('🚨 اشتعلت اللمبة (D8)! اضغطا الآن — الأسرع يفوز والأبطأ يخسر!');
    }, randomDelay);
  }, [appendLog]);

  const handlePlayerPress = useCallback(
    (player: 1 | 2) => {
      const current = gameStateRef.current;
      const otherPlayer: 1 | 2 = player === 1 ? 2 : 1;
      const playerName = player === 1 ? 'اللاعب 1 (الأزرق - D2)' : 'اللاعب 2 (الأخضر - D3)';
      const otherName = otherPlayer === 1 ? 'اللاعب 1 (الأزرق)' : 'اللاعب 2 (الأخضر)';

      if (current === 'WAITING_RANDOM') {
        if (timerRef.current) clearTimeout(timerRef.current);
        gameStateRef.current = 'FALSE_START';
        setGameState('FALSE_START');
        setLoserPlayer(player);
        setWinnerPlayer(otherPlayer);
        if (otherPlayer === 1) setP1Wins((w) => w + 1);
        else setP2Wins((w) => w + 1);

        soundFx.playFalseStartBuzz();
        appendLog(`❌ انطلاق مبكر! ضغط ${playerName} قبل الإشارة!`);
        appendLog(`😢 الخاسر: ${playerName} | 🏆 الفائز: ${otherName}`);
        return;
      }

      if (current === 'ACTIVE_LIGHT') {
        const elapsed = Math.round(performance.now() - startTimeRef.current);
        gameStateRef.current = 'RESULT';
        setGameState('RESULT');
        setReactionTimeMs(elapsed);
        setWinnerPlayer(player);
        setLoserPlayer(otherPlayer);

        if (player === 1) setP1Wins((w) => w + 1);
        else setP2Wins((w) => w + 1);

        appendLog('--------------------------------------');
        appendLog(`🏆 الفائز: ${playerName} بزمن ${elapsed} ms!`);
        appendLog(`🐢 الخاسر (الأبطأ): ${otherName}`);
        appendLog('--------------------------------------');

        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.7 },
        });
        return;
      }

      soundFx.playClick();
    },
    [appendLog]
  );

  // Keyboard bindings (A = P1, L = P2, Space = Start)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'KeyA' || e.code === 'KeyQ' || e.code === 'Digit1') {
        e.preventDefault();
        handlePlayerPress(1);
      } else if (e.code === 'KeyL' || e.code === 'KeyP' || e.code === 'Digit2') {
        e.preventDefault();
        handlePlayerPress(2);
      } else if (e.code === 'Space') {
        if (gameStateRef.current !== 'WAITING_RANDOM' && gameStateRef.current !== 'ACTIVE_LIGHT') {
          e.preventDefault();
          handleStartRound();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePlayerPress, handleStartRound]);

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    gameStateRef.current = 'IDLE';
    setGameState('IDLE');
    setReactionTimeMs(null);
    setWinnerPlayer(null);
    setLoserPlayer(null);
    setP1Wins(0);
    setP2Wins(0);
    appendLog('🔄 تمت إعادة ضبط النتيجة واللعبة.');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl border border-slate-800 space-y-5 sm:space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">محاكي تحدّي السرعة الثنائي (1 ضد 1)</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">كل لاعب له زر — الأول بعد الإشارة يفوز، والأخير أو المتسرّع يخسر!</p>
          </div>
        </div>

        {/* Duel Scoreboard */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-blue-400">الأزرق: {p1Wins}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">الأخضر: {p2Wins}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="إعادة ضبط النتيجة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Left: Hardware Duel Panel */}
        <div className="lg:col-span-7 bg-slate-800/80 rounded-2xl p-4 sm:p-6 border border-slate-700 flex flex-col justify-between space-y-6">
          {/* LED & Status Lamp Area */}
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <span className="text-xs font-bold tracking-wider text-slate-400">
              مصباح إشارة الانطلاق (D8)
            </span>

            <div className="relative">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full transition-all duration-150 flex items-center justify-center border-4 ${
                  gameState === 'ACTIVE_LIGHT'
                    ? 'bg-red-500 border-red-300 shadow-[0_0_60px_#EF4444] scale-105'
                    : gameState === 'FALSE_START'
                    ? 'bg-amber-600 border-amber-400 shadow-[0_0_30px_#D97706]'
                    : 'bg-red-950/80 border-slate-700'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-opacity ${
                    gameState === 'ACTIVE_LIGHT' ? 'bg-red-200 opacity-90' : 'bg-red-900/40 opacity-30'
                  }`}
                />
              </div>
              {gameState === 'ACTIVE_LIGHT' && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60" />
              )}
            </div>

            <div className="text-center font-bold min-h-[44px] flex items-center justify-center">
              {gameState === 'IDLE' && (
                <span className="text-slate-300 text-xs sm:text-sm">اضغطا "ابدأ السباق" بالأسفل لتبدأ المواجهة!</span>
              )}
              {gameState === 'WAITING_RANDOM' && (
                <span className="text-amber-400 text-xs sm:text-sm animate-pulse">
                  ⏳ انتبها... من يضغط قبل اشتعال اللمبة يخسر فوراً!
                </span>
              )}
              {gameState === 'ACTIVE_LIGHT' && (
                <span className="text-red-400 text-sm sm:text-base font-black animate-bounce">
                  ⚡ اضغطا الآن! الأول يفوز والأخير يخسر! ⚡
                </span>
              )}
              {gameState === 'FALSE_START' && (
                <span className="text-amber-300 text-xs sm:text-sm flex items-center justify-center gap-1.5 font-black">
                  <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    تسرّع اللاعب {loserPlayer} قبل الضوء وخسر! 🏆 فاز اللاعب {winnerPlayer}!
                  </span>
                </span>
              )}
              {gameState === 'RESULT' && reactionTimeMs !== null && (
                <div className="space-y-1">
                  <span className="text-emerald-400 text-lg sm:text-2xl font-black block">
                    🏆 فاز اللاعب {winnerPlayer} ({reactionTimeMs} ms)
                  </span>
                  <span className="text-xs text-rose-300 font-bold">
                    😢 خسر اللاعب {loserPlayer} لأنه ضغط الأخير!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Start Race Control */}
          <div className="space-y-3 pt-3 border-t border-slate-700/80">
            <button
              onClick={handleStartRound}
              disabled={gameState === 'WAITING_RANDOM' || gameState === 'ACTIVE_LIGHT'}
              className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                gameState === 'WAITING_RANDOM' || gameState === 'ACTIVE_LIGHT'
                  ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg active:scale-98'
              }`}
            >
              <Flag className="w-4 h-4 shrink-0" />
              <span>
                {gameState === 'WAITING_RANDOM'
                  ? 'جاري انتظار الإشارة العشوائية...'
                  : gameState === 'ACTIVE_LIGHT'
                  ? 'السباق جارٍ الآن!'
                  : '🏁 ابدأ جولة السباق (1 ضد 1)'}
              </span>
            </button>

            {/* 2 Player Hardware Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => handlePlayerPress(1)}
                className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl font-bold transition-all active:scale-95 ${
                  winnerPlayer === 1
                    ? 'bg-blue-500 text-white shadow-xl ring-4 ring-amber-400'
                    : loserPlayer === 1
                    ? 'bg-slate-900/70 text-slate-400 border border-rose-500/40'
                    : gameState === 'ACTIVE_LIGHT'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white ring-2 ring-blue-300 animate-pulse'
                    : 'bg-blue-700 hover:bg-blue-600 text-white shadow-md'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" />
                </div>
                <span className="text-sm sm:text-base font-black">اللاعب 1 (D2)</span>
                <span className="text-[11px] text-blue-200 mt-0.5">الأزرق • مفتاح A</span>
              </button>

              <button
                onClick={() => handlePlayerPress(2)}
                className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl font-bold transition-all active:scale-95 ${
                  winnerPlayer === 2
                    ? 'bg-emerald-500 text-white shadow-xl ring-4 ring-amber-400'
                    : loserPlayer === 2
                    ? 'bg-slate-900/70 text-slate-400 border border-rose-500/40'
                    : gameState === 'ACTIVE_LIGHT'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300 animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-md'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" />
                </div>
                <span className="text-sm sm:text-base font-black">اللاعب 2 (D3)</span>
                <span className="text-[11px] text-emerald-200 mt-0.5">الأخضر • مفتاح L</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Serial Monitor Terminal Output */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between font-mono">
          <div>
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

            <div className="mt-3 h-64 overflow-y-auto space-y-1 text-xs text-slate-300 pr-1 select-text scrollbar-thin">
              {serialLogs.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('❌')
                      ? 'text-amber-400 font-bold bg-amber-950/30 px-1 rounded'
                      : log.includes('😢')
                      ? 'text-rose-300 font-bold'
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

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>مراقبة الزرّين (D2 و D3) لحظياً بالـ millis() لكشف المتسرّع وتحديد الأسرع!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
