import React, { useEffect, useState } from 'react';
import { Box, Clock, Lightbulb, Play, Plus, RotateCcw } from 'lucide-react';
import { LessonDetail } from '../../types/curriculum';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { SpeakButton } from '../common/SpeakButton';
import { FormattedText } from '../common/FormattedText';
import { soundFx } from '../../services/sound/webAudio';

interface TodayConceptLabProps {
  lesson: LessonDetail;
}

export const TodayConceptLab: React.FC<TodayConceptLabProps> = ({ lesson }) => {
  // Week 1 state: Single concept — millis() keeps watching while delay() freezes
  const [monitorMode, setMonitorMode] = useState<'millis' | 'delay'>('millis');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [p1Held, setP1Held] = useState(false);
  const [p2Held, setP2Held] = useState(false);
  const [labAlert, setLabAlert] = useState<string>(
    'اضغط "شغّل المراقبة" ثم حاول الضغط على زر أحد اللاعبين قبل انتهاء الـ 3 ثوانٍ.'
  );

  // Week 2 state: Single concept — saving & changing a variable value
  const [scoreVar, setScoreVar] = useState<number>(0);

  useEffect(() => {
    setIsMonitoring(false);
    setElapsedMs(0);
    setP1Held(false);
    setP2Held(false);
    setScoreVar(0);
  }, [lesson.week]);

  useEffect(() => {
    if (!isMonitoring) return;
    const interval = window.setInterval(() => {
      setElapsedMs((prev) => {
        if (prev >= 3000) {
          setIsMonitoring(false);
          setLabAlert(
            monitorMode === 'delay'
              ? '⏰ انتهت 3 ثوانٍ: delay() جمّدت اللوحة تماماً ولم تشعر بأي ضغطة!'
              : '✅ انتهت 3000 ms بنجاح دون تسرّع — اللمبة تشتعل الآن!'
          );
          return 3000;
        }
        return prev + 100;
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [isMonitoring, monitorMode]);

  const handleStartTest = () => {
    soundFx.playClick();
    setElapsedMs(0);
    setP1Held(false);
    setP2Held(false);
    setIsMonitoring(true);
    setLabAlert(
      monitorMode === 'delay'
        ? '🧊 الآردوينو نائم داخل delay(3000)... اضغط على زر اللاعب 1 أو 2 وجرّب!'
        : '👀 ساعة millis() تراقب D2 و D3 في كل لحظة... جرّب الضغط قبل انتهاء الوقت!'
    );
  };

  const handleTestButton = (player: 1 | 2) => {
    soundFx.playClick();
    if (player === 1) setP1Held((v) => !v);
    else setP2Held((v) => !v);

    if (!isMonitoring) return;

    if (monitorMode === 'delay') {
      setLabAlert(`😴 ضغط اللاعب ${player} أثناء delay() لكن اللوحة نائمة ولم تكتشف التسرّع!`);
    } else {
      soundFx.playFalseStartBuzz();
      setIsMonitoring(false);
      setLabAlert(`🚨 كشفت millis() اللاعب ${player} فورياً عند ${elapsedMs} ms!`);
    }
  };

  // Week 1: Single Concept — millis() vs delay()
  if (lesson.week === 1) {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5 animate-lab-enter">
        {/* Compact Header + Small Avatar */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6388D8]/12 flex items-center justify-center shrink-0">
              <CharacterAvatar character="brainy" size="sm" />
            </div>
            <div>
              <span className="text-[11px] font-black text-[#6388D8] block">مفهوم واحد واضح 💡</span>
              <h2 className="text-lg sm:text-xl font-black text-[#203447]">
                كيف يراقب الآردوينو اللاعبَين معاً بدون تجميد؟
              </h2>
            </div>
          </div>
          <SpeakButton
            compact
            text="يريد روبو مراقبة زر اللاعب الأول والثاني معاً. جرّب الفرق بين delay التي تجمّد اللوحة وساعة millis الذكية."
            labelAr="اسمع الفكرة"
          />
        </div>

        {/* Situation */}
        <p className="text-sm font-bold text-[#203447] bg-[#FAFAF6] p-3.5 rounded-2xl border border-slate-200/80">
          🎯 الموقف: يريد <span className="text-[#30A89A]">روبو</span> مراقبة زر اللاعب الأصفر (D2) وزر اللاعب الأحمر (D3) دون تجميد اللوحة، حتى تشتعل لمبة من يضغط أولاً!
        </p>

        {/* Interactive Experiment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black text-[#203447] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#30A89A]" />
              <span>1. اختر الطريقة وجرّب الضغط أثناء الانتظار:</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#FAFAF6] border border-slate-200 font-mono text-xs font-black text-[#203447]">
              {elapsedMs} / 3000 ms
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#FAFAF6] border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMonitorMode('millis');
                setIsMonitoring(false);
                setElapsedMs(0);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
                monitorMode === 'millis' ? 'bg-[#30A89A] text-white shadow-sm' : 'text-[#203447]/70 hover:bg-white'
              }`}
            >
              ⏱️ ساعة millis()
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setMonitorMode('delay');
                setIsMonitoring(false);
                setElapsedMs(0);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
                monitorMode === 'delay' ? 'bg-[#F47C62] text-white shadow-sm' : 'text-[#203447]/70 hover:bg-white'
              }`}
            >
              🧊 أمر delay()
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTestButton(1)}
              className={`p-3.5 rounded-2xl border text-right transition-all active:scale-95 ${
                p1Held
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-[#FAFAF6] text-[#203447] border-amber-300 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-black">
                <span>زر اللاعب 1 الأصفر (D2)</span>
                <span className="font-mono px-2 py-0.5 rounded-lg bg-white/85 text-[#203447]">
                  {p1Held ? 'LOW' : 'HIGH'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTestButton(2)}
              className={`p-3.5 rounded-2xl border text-right transition-all active:scale-95 ${
                p2Held
                  ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                  : 'bg-[#FAFAF6] text-[#203447] border-rose-300 hover:border-rose-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-black">
                <span>زر اللاعب 2 الأحمر (D3)</span>
                <span className="font-mono px-2 py-0.5 rounded-lg bg-white/85 text-[#203447]">
                  {p2Held ? 'LOW' : 'HIGH'}
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartTest}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#30A89A] hover:bg-[#279185] text-white text-xs sm:text-sm font-black shadow-teal-glow transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isMonitoring ? 'إعادة التجربة' : 'شغّل المراقبة (3 ثوانٍ)'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsMonitoring(false);
                setElapsedMs(0);
                setP1Held(false);
                setP2Held(false);
                setLabAlert('اضغط "شغّل المراقبة" ثم حاول الضغط على زر أحد اللاعبين قبل انتهاء الـ 3 ثوانٍ.');
              }}
              className="p-2.5 rounded-xl bg-[#FAFAF6] hover:bg-slate-100 border border-slate-200 text-[#203447]"
              title="تصفير"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFC857]/20 border border-[#FFC857] text-xs sm:text-sm font-bold text-[#203447]">
            {labAlert}
          </div>
        </div>

        {/* Conclusion */}
        <div className="p-3.5 rounded-2xl bg-[#30A89A]/10 border border-[#30A89A]/35 flex items-center gap-2.5 text-xs sm:text-sm font-black text-[#203447]">
          <Lightbulb className="w-4 h-4 text-[#30A89A] shrink-0" />
          <span>الاستنتاج: نستخدم millis() لأنها تحسب الوقت دون تجميد الأزرار!</span>
        </div>
      </div>
    );
  }

  // Week 2: Single Concept — Variables (saving and changing a value)
  if (lesson.week === 2) {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5 animate-lab-enter">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6388D8]/12 flex items-center justify-center shrink-0">
              <CharacterAvatar character="brainy" size="sm" />
            </div>
            <div>
              <span className="text-[11px] font-black text-[#6388D8] block">مفهوم واحد واضح 💡</span>
              <h2 className="text-lg sm:text-xl font-black text-[#203447]">ما هو المتغير (Variable)؟</h2>
            </div>
          </div>
          <SpeakButton
            compact
            text="يريد روبو حفظ نتيجة اللاعب أثناء اللعب. جرّب تغيير قيمة المتغير وشاهد النتيجة."
            labelAr="اسمع الفكرة"
          />
        </div>

        <p className="text-sm font-bold text-[#203447] bg-[#FAFAF6] p-3.5 rounded-2xl border border-slate-200/80">
          🎯 الموقف: يريد <span className="text-[#30A89A]">روبو</span> حفظ نتيجة اللاعب وتزويدها كلما ربح جولة!
        </p>

        {/* Interactive Variable Box */}
        <div className="rounded-2xl bg-[#FAFAF6] border border-slate-200/90 p-5 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-[#6388D8] font-mono" dir="ltr">
            <Box className="w-3.5 h-3.5" />
            <span>int score = {scoreVar};</span>
          </div>

          <div className="w-28 h-24 mx-auto rounded-2xl bg-white border-2 border-[#30A89A] shadow-sm flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-slate-400 font-mono">score</span>
            <span className="text-3xl font-black text-[#203447] font-mono">{scoreVar}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setScoreVar((s) => s + 1);
              }}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#30A89A] text-white text-xs font-black shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>أضف 1 نقطة (score + 1)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setScoreVar((s) => s + 5);
              }}
              className="px-4 py-2 rounded-xl bg-[#6388D8] text-white text-xs font-black shadow-sm"
            >
              +5 مكافأة
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setScoreVar(0);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#203447] text-xs font-black"
            >
              تصفير (0)
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#30A89A]/10 border border-[#30A89A]/35 flex items-center gap-2.5 text-xs sm:text-sm font-black text-[#203447]">
          <Lightbulb className="w-4 h-4 text-[#30A89A] shrink-0" />
          <span>الاستنتاج: المتغير هو صندوق باسمٍ محفوظ في الذاكرة يحمل رقماً يمكننا قراءته وتغييره!</span>
        </div>
      </div>
    );
  }

  // Weeks 3-24: Focused Single Concept Card
  const mainSection = lesson.theory.sections[0];
  return (
    <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5 animate-lab-enter">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6388D8]/12 flex items-center justify-center shrink-0">
            <CharacterAvatar character="brainy" size="sm" />
          </div>
          <div>
            <span className="text-[11px] font-black text-[#6388D8] block">اكتشف الفكرة 💡</span>
            <h2 className="text-lg sm:text-xl font-black text-[#203447]">{lesson.theory.titleAr}</h2>
          </div>
        </div>
        <SpeakButton compact text={lesson.theory.summaryAr} labelAr="اسمع الفكرة" />
      </div>

      {mainSection && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAF6] border border-slate-200/80 space-y-3">
          <h3 className="text-base font-black text-[#203447]">{mainSection.headingAr}</h3>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            <FormattedText text={mainSection.contentAr} />
          </p>
        </div>
      )}

      <div className="p-3.5 rounded-2xl bg-[#30A89A]/10 border border-[#30A89A]/35 flex items-center gap-2.5 text-xs sm:text-sm font-black text-[#203447]">
        <Lightbulb className="w-4 h-4 text-[#30A89A] shrink-0" />
        <span>{mainSection?.noteAr || lesson.theory.summaryAr}</span>
      </div>
    </div>
  );
};
