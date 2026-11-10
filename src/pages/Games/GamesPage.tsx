import React, { useState } from 'react';
import { Gamepad2, Bug, Binary, Layers, Sparkles } from 'lucide-react';
import { BugHunterGame } from '../../components/games/BugHunterGame';
import { BinaryInvadersGame } from '../../components/games/BinaryInvadersGame';
import { LogicGateEscapeGame } from '../../components/games/LogicGateEscapeGame';
import { soundFx } from '../../services/sound/webAudio';

export const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'bug_hunter' | 'binary' | 'logic'>('bug_hunter');

  const games = [
    {
      id: 'bug_hunter',
      titleAr: 'صائد الأخطاء البرمجية',
      subtitleAr: 'Bug Hunter Game',
      icon: <Bug className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'binary',
      titleAr: 'غزاة النظام الثنائي',
      subtitleAr: 'Binary Invaders Game',
      icon: <Binary className="w-5 h-5" />,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      id: 'logic',
      titleAr: 'الهروب عبر البوابات المنطقية',
      subtitleAr: 'Logic Gate Escape',
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-black">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>مركز الألعاب التعليمية الذكية</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">ألعاب التفكير الحاسوبي والهندسي</h1>
          <p className="text-white/90 text-sm max-w-lg">
            ألعاب صُممت لترسيخ المفاهيم البرمجية والمنطقية بعيداً عن الحفظ التلقيني. العب واكسب نقاط XP لملفك الشخصي!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs font-black">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>تمنح كل لعبة نقاط XP فورية وتضاف لملفك!</span>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((g) => {
          const isActive = activeGame === g.id;

          return (
            <button
              key={g.id}
              onClick={() => {
                soundFx.playClick();
                setActiveGame(g.id as any);
              }}
              className={`p-5 rounded-3xl border text-right transition-all flex items-center gap-4 ${
                isActive
                  ? 'bg-white border-blue-500 shadow-lg ring-4 ring-blue-500/10 scale-102 font-black'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-card text-slate-700'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${g.color}`}>
                {g.icon}
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">{g.titleAr}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{g.subtitleAr}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Stage */}
      <div>
        {activeGame === 'bug_hunter' && <BugHunterGame />}
        {activeGame === 'binary' && <BinaryInvadersGame />}
        {activeGame === 'logic' && <LogicGateEscapeGame />}
      </div>
    </div>
  );
};

