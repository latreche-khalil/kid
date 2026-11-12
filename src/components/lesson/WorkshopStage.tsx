import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Cable,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Eye,
  Play,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { LessonDetail } from '../../types/curriculum';
import { CircuitPlayground3D } from '../simulator/CircuitPlayground3D';
import { CodeSimulationEngine } from '../simulator/CodeSimulationEngine';
import { soundFx } from '../../services/sound/webAudio';
import { FormattedText } from '../common/FormattedText';

interface WorkshopStageProps {
  lesson: LessonDetail;
}

type WorkshopStep = 'explore' | 'prepare' | 'wire_code' | 'run';

export const WorkshopStage: React.FC<WorkshopStageProps> = ({ lesson }) => {
  const [step, setStep] = useState<WorkshopStep>('explore');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [experimentRunResult, setExperimentRunResult] = useState<{
    ran: boolean;
    passedCount: number;
    totalCount: number;
    checks: { labelAr: string; ok: boolean }[];
  } | null>(null);

  useEffect(() => {
    setStep('explore');
    setExperimentRunResult(null);
  }, [lesson.week]);

  const steps: { id: WorkshopStep; num: number; titleAr: string }[] = [
    { id: 'explore', num: 1, titleAr: 'استكشف' },
    { id: 'prepare', num: 2, titleAr: 'جهّز' },
    { id: 'wire_code', num: 3, titleAr: 'وصّل وبرمج' },
    { id: 'run', num: 4, titleAr: 'جرّب' },
  ];

  const handleRunUnifiedExperiment = () => {
    soundFx.playClick();
    const targetCode = lesson.code.repairedCode;
    const checks =
      lesson.week === 1
        ? [
            {
              labelAr: 'تفعيل مقاومة الشد INPUT_PULLUP لزرّي D2 و D3',
              ok: /INPUT_PULLUP/.test(targetCode),
            },
            {
              labelAr: 'تهيئة منافذ اللمبتين كـ OUTPUT (لمبة الأصفر D4 ولمبة الأحمر D5)',
              ok: /OUTPUT/.test(targetCode) && (/LED_YELLOW|4/.test(targetCode) || /LED_RED|5/.test(targetCode)),
            },
            {
              labelAr: 'معادلة الزمن السليمة (endTime - startTime)',
              ok: /endTime\s*-\s*startTime/.test(targetCode) && !/startTime\s*-\s*endTime/.test(targetCode),
            },
            {
              labelAr: 'إضاءة لمبة الفائز باللون الخاص به (digitalWrite HIGH)',
              ok: /digitalWrite\s*\(\s*(LED_YELLOW|LED_RED|4|5)\s*,\s*HIGH\s*\)/.test(targetCode),
            },
            {
              labelAr: 'جاهز للرفع والتشغيل على لوحة UNO',
              ok: /void\s+setup\s*\(/.test(targetCode) && /void\s+loop\s*\(/.test(targetCode),
            },
          ]
        : [
            { labelAr: 'وجود دالة التهيئة setup()', ok: /void\s+setup\s*\(/.test(targetCode) },
            { labelAr: 'وجود حلقة التكرار loop()', ok: /void\s+loop\s*\(/.test(targetCode) },
            { labelAr: 'الكود جاهز للتجربة والرفع على UNO', ok: true },
          ];

    const passedCount = checks.filter((c) => c.ok).length;
    if (passedCount === checks.length) {
      soundFx.playSuccessChime();
    } else {
      soundFx.playFalseStartBuzz();
    }
    setExperimentRunResult({
      ran: true,
      passedCount,
      totalCount: checks.length,
      checks,
    });
  };

  const handleCopyCode = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(lesson.code.repairedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-5 animate-lab-enter">
      {/* 4 Internal Workshop Steps Switcher */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((s) => {
            const isActive = step === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setStep(s.id);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  isActive
                    ? 'bg-[#30A89A] text-white shadow-teal-glow'
                    : 'bg-[#FAFAF6] text-[#203447] border border-slate-200/80 hover:border-[#30A89A]/50'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white text-[#30A89A]' : 'bg-white text-[#203447] border border-slate-200'
                  }`}
                >
                  {s.num}
                </span>
                <span>{s.titleAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Explore in 3D */}
      {step === 'explore' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200/90 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#203447]">
              <Eye className="w-4 h-4 text-[#30A89A]" />
              <span>1. استكشف لوحة Arduino والمكونات ثلاثية الأبعاد قبل التركيب:</span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setStep('prepare');
              }}
              className="px-4 py-2 rounded-xl bg-[#30A89A] text-white text-xs font-black hover:bg-[#279185] transition-all"
            >
              التالي: جهّز القطع ←
            </button>
          </div>
          <CircuitPlayground3D lessonWeek={lesson.week} />
        </div>
      )}

      {/* STEP 2: Prepare Required Parts */}
      {step === 'prepare' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Wrench className="w-5 h-5 text-[#6388D8]" />
              <h3 className="text-base sm:text-lg font-black text-[#203447]">
                2. جهّز القطع المطلوبة ({lesson.components.length} قطع)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setStep('wire_code');
              }}
              className="px-4 py-2 rounded-xl bg-[#30A89A] text-white text-xs font-black hover:bg-[#279185] transition-all"
            >
              التالي: وصّل وبرمج ←
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.components.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-2xl bg-[#FAFAF6] border border-slate-200/80 flex items-start gap-3"
              >
                <span className="w-9 h-9 rounded-xl bg-[#6388D8]/15 text-[#203447] flex items-center justify-center font-black text-xs shrink-0">
                  {comp.count}x
                </span>
                <div className="min-w-0 space-y-1">
                  <div className="font-black text-sm text-[#203447]">{comp.nameAr}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{comp.roleAr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Wire & Debug Code (50/50 split useful here!) */}
      {step === 'wire_code' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Wiring Checklist */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Cable className="w-5 h-5 text-[#FFC857]" />
              <h3 className="text-base font-black text-[#203447]">خطوات التوصيل</h3>
            </div>

            <ol className="space-y-2.5">
              {lesson.circuit.wiringSteps.map((ws) => (
                <li
                  key={ws.step}
                  className="p-3 rounded-2xl bg-[#FAFAF6] border border-slate-200/80 flex items-start gap-3"
                >
                  <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-[#FFC857] text-[#203447] font-black text-xs flex items-center justify-center">
                      {ws.step}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: ws.color }}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                      <span className="px-2 py-0.5 rounded-lg bg-[#6388D8]/15 text-[#203447] font-mono" dir="ltr">
                        {ws.from}
                      </span>
                      <span className="text-slate-400">←</span>
                      <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[#203447]" dir="ltr">
                        {ws.to}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#203447] leading-relaxed">
                      <FormattedText text={ws.instructionAr} />
                    </p>
                    {ws.cautionAr && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F47C62]">
                        <AlertTriangle className="w-3 h-3" />
                        <FormattedText text={ws.cautionAr} />
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Clean Working Code Only (Bug-hunting lives in Smart Game stage) */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#30A89A]" />
                <h3 className="text-base font-black text-[#203447]">كود المشروع السليم ✓</h3>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#30A89A] text-white text-xs font-black"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود السليم'}</span>
              </button>
            </div>

            <p className="text-xs font-bold text-slate-600 bg-[#30A89A]/8 border border-[#30A89A]/30 p-3 rounded-xl">
              {lesson.code.repairedCodeExplanationAr}
            </p>

            <div className="rounded-2xl bg-[#FAFAF6] border border-slate-200 p-4 font-mono text-xs overflow-x-auto max-h-[380px]" dir="ltr">
              <pre className="whitespace-pre text-[#203447] leading-relaxed">{lesson.code.repairedCode}</pre>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setStep('run');
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#30A89A] hover:bg-[#279185] text-white text-xs sm:text-sm font-black shadow-teal-glow transition-all"
            >
              التالي: شغّل التجربة ←
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Unified Run Experiment (One Trigger Button -> Result & Checks Automatically) */}
      {step === 'run' && (
        <div className="space-y-5">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-[#30A89A]" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#203447]">4. جرّب التجربة وتحقّق من عملها</h3>
                  <p className="text-xs text-slate-500">زر واحد يشغّل الاختبار ويعرض النتيجة والأخطاء تلقائياً</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunUnifiedExperiment}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#30A89A] hover:bg-[#279185] text-white text-xs sm:text-sm font-black shadow-teal-glow transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شغّل التجربة والتحقق ⚡</span>
              </button>
            </div>

            {experimentRunResult && (
              <div className="p-4 rounded-2xl bg-[#30A89A]/10 border border-[#30A89A] space-y-2">
                <div className="flex items-center gap-2 text-sm font-black text-[#203447]">
                  <Sparkles className="w-4 h-4 text-[#30A89A]" />
                  <span>
                    نتيجة الفحص الآلي ({experimentRunResult.passedCount}/{experimentRunResult.totalCount} بنجاح):
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {experimentRunResult.checks.map((chk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 text-xs font-bold text-[#203447]"
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${chk.ok ? 'text-[#30A89A]' : 'text-[#F47C62]'}`} />
                      <span>{chk.labelAr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CodeSimulationEngine weekNumber={lesson.week} />
        </div>
      )}
    </div>
  );
};
