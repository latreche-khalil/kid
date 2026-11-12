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
    'الأول بعد الصافرة تشتعل لمبته ويفوز!',
    'اللاعب 1: D2 (الأصفر) + لمبة D4 | اللاعب 2: D3 (الأحمر) + لمبة D5',
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
    appendLog('⚠️ إياكما أن يضغط أحد قبل صافرة الجرس!');

    const randomDelay = Math.floor(Math.random() * 2500) + 1800;

    timerRef.current = setTimeout(() => {
      gameStateRef.current = 'ACTIVE_LIGHT';
      setGameState('ACTIVE_LIGHT');
      startTimeRef.current = performance.now();
      soundFx.playStartSignal();
      appendLog('🚨 انطلقت الصافرة! اضغطا الآن — من يسبق تشتعل لمبته ويفوز!');
    }, randomDelay);
  }, [appendLog]);

  const handlePlayerPress = useCallback(
    (player: 1 | 2) => {
      const current = gameStateRef.current;
      const otherPlayer: 1 | 2 = player === 1 ? 2 : 1;
      const playerName = player === 1 ? 'اللاعب 1 (الأصفر - D2)' : 'اللاعب 2 (الأحمر - D3)';
      const otherName = otherPlayer === 1 ? 'اللاعب 1 (الأصفر)' : 'اللاعب 2 (الأحمر)';
      const winLamp = otherPlayer === 1 ? 'الصفراء (D4)' : 'الحمراء (D5)';
      const winnerLamp = player === 1 ? 'الصفراء (D4)' : 'الحمراء (D5)';

      if (current === 'WAITING_RANDOM') {
        if (timerRef.current) clearTimeout(timerRef.current);
        gameStateRef.current = 'FALSE_START';
        setGameState('FALSE_START');
        setLoserPlayer(player);
        setWinnerPlayer(otherPlayer);
        if (otherPlayer === 1) setP1Wins((w) => w + 1);
        else setP2Wins((w) => w + 1);

        soundFx.playFalseStartBuzz();
        appendLog(`❌ انطلاق مبكر! ضغط ${playerName} قبل الصافرة!`);
        appendLog(`😢 الخاسر: ${playerName} | 🏆 الفائز: ${otherName} (اشتعلت لمبته ${winLamp})`);
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
        appendLog(`🏆 الفائز: ${playerName} بزمن ${elapsed} ms! اشتعلت لمبته ${winnerLamp}! 💡`);
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
    <div className="bg-gradient-to-br from-sky-50 via-white to-indigo-50/70 rounded-3xl p-4 sm:p-6 md:p-8 text-slate-900 shadow-card border border-sky-200 space-y-5 sm:space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">محاكي تحدّي السرعة الثنائي (1 ضد 1)</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">كل لاعب له زر — الأول بعد الإشارة يفوز، والأخير أو المتسرّع يخسر!</p>
          </div>
        </div>

        {/* Duel Scoreboard */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black shadow-xs">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-amber-600">الأصفر: {p1Wins}</span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-600">الأحمر: {p2Wins}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="إعادة ضبط النتيجة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Balanced 2-Column Split: Duel Arena (50%) | Serial Monitor (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Half 1: Hardware Duel Panel */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          {/* Dual LED Indicators (Yellow D4 & Red D5) */}
          <div className="flex flex-col items-center justify-center py-2 space-y-4">
            <span className="text-xs font-bold tracking-wider text-slate-500">
              لمبات الفائزين (صفراء D4 للأول • حمراء D5 للثاني)
            </span>

            <div className="flex items-center justify-center gap-8">
              {/* Yellow LED */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-150 flex items-center justify-center border-4 ${
                    winnerPlayer === 1
                      ? 'bg-amber-400 border-amber-300 shadow-[0_0_40px_#FACC15] scale-110'
                      : 'bg-amber-100/60 border-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${winnerPlayer === 1 ? 'bg-white animate-ping' : 'bg-amber-300/40'}`} />
                </div>
                <span className="text-[11px] font-black text-amber-700">لمبة الأصفر (D4)</span>
              </div>

              {/* Red LED */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-150 flex items-center justify-center border-4 ${
                    winnerPlayer === 2
                      ? 'bg-rose-500 border-rose-300 shadow-[0_0_40px_#EF4444] scale-110'
                      : 'bg-rose-100/60 border-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${winnerPlayer === 2 ? 'bg-white animate-ping' : 'bg-rose-300/40'}`} />
                </div>
                <span className="text-[11px] font-black text-rose-700">لمبة الأحمر (D5)</span>
              </div>
            </div>

            <div className="text-center font-bold min-h-[44px] flex items-center justify-center">
              {gameState === 'IDLE' && (
                <span className="text-slate-600 text-xs sm:text-sm">اضغطا "ابدأ السباق" بالأسفل لتبدأ المواجهة!</span>
              )}
              {gameState === 'WAITING_RANDOM' && (
                <span className="text-amber-700 text-xs sm:text-sm animate-pulse">
                  ⏳ ترقبوا صافرة الجرس... من يضغط قبل الصافرة يخسر فوراً!
                </span>
              )}
              {gameState === 'ACTIVE_LIGHT' && (
                <span className="text-emerald-700 text-sm sm:text-base font-black animate-bounce">
                  ⚡ انطلقت الصافرة! اضغطا الآن — من يسبق تشتعل لمبته! ⚡
                </span>
              )}
              {gameState === 'FALSE_START' && (
                <span className="text-amber-800 text-xs sm:text-sm flex items-center justify-center gap-1.5 font-black">
                  <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    تسرّع اللاعب {loserPlayer === 1 ? 'الأصفر' : 'الأحمر'} قبل الصافرة وخسر! 🏆 فاز اللاعب {winnerPlayer === 1 ? 'الأصفر' : 'الأحمر'}!
                  </span>
                </span>
              )}
              {gameState === 'RESULT' && reactionTimeMs !== null && (
                <div className="space-y-1">
                  <span className="text-emerald-700 text-lg sm:text-2xl font-black block">
                    🏆 فاز اللاعب {winnerPlayer === 1 ? 'الأصفر' : 'الأحمر'} ({reactionTimeMs} ms) واشتعلت لمبته! 💡
                  </span>
                  <span className="text-xs text-rose-600 font-bold">
                    😢 خسر اللاعب {loserPlayer === 1 ? 'الأصفر' : 'الأحمر'} لأنه ضغط الأخير!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Start Race Control */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <button
              onClick={handleStartRound}
              disabled={gameState === 'WAITING_RANDOM' || gameState === 'ACTIVE_LIGHT'}
              className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                gameState === 'WAITING_RANDOM' || gameState === 'ACTIVE_LIGHT'
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-98'
              }`}
            >
              <Flag className="w-4 h-4 shrink-0" />
              <span>
                {gameState === 'WAITING_RANDOM'
                  ? 'جاري انتظار صافرة الجرس...'
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
                    ? 'bg-amber-400 text-slate-950 shadow-xl ring-4 ring-yellow-300'
                    : loserPlayer === 1
                    ? 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                    : gameState === 'ACTIVE_LIGHT'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/40 flex items-center justify-center mb-2">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-slate-950" />
                </div>
                <span className="text-sm sm:text-base font-black">اللاعب 1 (D2)</span>
                <span className="text-[11px] text-amber-950 font-bold mt-0.5">الأصفر • مفتاح A</span>
              </button>

              <button
                onClick={() => handlePlayerPress(2)}
                className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl font-bold transition-all active:scale-95 ${
                  winnerPlayer === 2
                    ? 'bg-rose-500 text-white shadow-xl ring-4 ring-rose-300'
                    : loserPlayer === 2
                    ? 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                    : gameState === 'ACTIVE_LIGHT'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" />
                </div>
                <span className="text-sm sm:text-base font-black">اللاعب 2 (D3)</span>
                <span className="text-[11px] text-rose-100 mt-0.5">الأحمر • مفتاح L</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Serial Monitor Terminal Output */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between font-mono shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800">Serial Monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold text-[11px]">9600 baud</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            <div className="mt-3 h-64 overflow-y-auto space-y-1 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 select-text scrollbar-thin">
              {serialLogs.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('❌')
                      ? 'text-amber-800 font-bold bg-amber-50 px-1 rounded'
                      : log.includes('😢')
                      ? 'text-rose-700 font-bold'
                      : log.includes('🏆')
                      ? 'text-emerald-700 font-bold'
                      : log.includes('🚨')
                      ? 'text-rose-700 font-bold'
                      : 'text-slate-700'
                  }`}
                >
                  {log}
                </div>
              ))}
              <div ref={serialEndRef} />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>مراقبة الزرّين (D2 و D3) لحظياً بالـ millis() لكشف المتسرّع وتحديد الأسرع!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
