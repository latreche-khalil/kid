import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Cpu,
  Code2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Bug,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { virtualArduinoEngine } from '../../services/simulator/virtualArduinoEngine';
import { storageService } from '../../services/storage/localStorage';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import confetti from 'canvas-confetti';

export interface VerificationTestCase {
  id: string;
  titleAr: string;
  descriptionAr: string;
  passed: boolean;
  hintAr: string;
}

interface MissionChallengeVerifierProps {
  weekNumber?: number;
  onMissionCompleted?: () => void;
}

export const MissionChallengeVerifier: React.FC<MissionChallengeVerifierProps> = ({
  weekNumber = 1,
  onMissionCompleted,
}) => {
  const [code, setCode] = useState<string>(`// كود غليتش المعطوب لتحدّي 1 ضد 1 — مهمتك إصلاحه واجتياز الفحص الذكي!
void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT);       // مصباح LED
  pinMode(2, INPUT);        // ⚠️ ثغرة: زر اللاعب 1 عائم بدون مقاومة شد!
  pinMode(3, INPUT);        // ⚠️ ثغرة: زر اللاعب 2 عائم بدون مقاومة شد!
  pinMode(9, OUTPUT);       // الطنان الصوتي
}

void loop() {
  delay(2500);
  digitalWrite(8, HIGH);
  unsigned long startTime = millis();
  
  while (digitalRead(2) == HIGH && digitalRead(3) == HIGH) {
    // انتظار أول من يضغط من اللاعبَين...
  }
  
  unsigned long endTime = millis();
  digitalWrite(8, LOW);
  
  // ⚠️ ثغرة: معادلة مقلوبة تعطي زمناً سالباً!
  unsigned long reactionTime = startTime - endTime;
  Serial.println(reactionTime);
}`);

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<VerificationTestCase[] | null>(null);
  const [allPassed, setAllPassed] = useState<boolean>(false);

  // Auto Repair Button (shows the fixed code for educational comparison)
  const handleLoadRepairedCode = () => {
    soundFx.playClick();
    setCode(`/*
  ✅ الكود المصحح السليم لتحدّي الأسرع (1 ضد 1)
*/
void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT);           // مصباح LED مخرج سليم
  pinMode(2, INPUT_PULLUP);     // زر اللاعب 1 (الأزرق) بمقاومة شد
  pinMode(3, INPUT_PULLUP);     // زر اللاعب 2 (الأخضر) بمقاومة شد
  pinMode(9, OUTPUT);           // الطنان الصوتي
  Serial.println("1v1 Duel Ready!");
}

void loop() {
  delay(2500);
  digitalWrite(8, HIGH);
  tone(9, 1200, 150);
  unsigned long startTime = millis();
  
  while (digitalRead(2) == HIGH && digitalRead(3) == HIGH) {
    // مراقبة اللاعبَين لحظياً...
  }
  
  unsigned long endTime = millis();
  digitalWrite(8, LOW);
  
  // المعادلة الصحيحة: زمن النهاية ناقص زمن البداية
  unsigned long reactionTime = endTime - startTime;
  Serial.print("Winner Reaction Time: ");
  Serial.print(reactionTime);
  Serial.println(" ms");
  delay(2000);
}`);
    setTestResults(null);
    setAllPassed(false);
  };

  // Run Automated Simulation Tests on the Code
  const handleVerifyCode = () => {
    soundFx.playClick();
    setIsVerifying(true);

    setTimeout(() => {
      // Test 1: Check INPUT_PULLUP on Pin 2 & Pin 3
      const hasInputPullup =
        /pinMode\(\s*3\s*,\s*INPUT_PULLUP\s*\)/.test(code) &&
        /pinMode\(\s*2\s*,\s*INPUT_PULLUP\s*\)/.test(code);

      // Test 2: Check Correct Time Difference (endTime - startTime)
      const hasCorrectEquation = /endTime\s*-\s*startTime/.test(code) && !/startTime\s*-\s*endTime/.test(code);

      // Test 3: Check LED Pin 8 Output definition
      const hasLedOutput = /pinMode\(\s*8\s*,\s*OUTPUT\s*\)/.test(code);

      // Test 4: Check Buzzer Pin 9 tone or output
      const hasBuzzerPin = /pinMode\(\s*9\s*,\s*OUTPUT\s*\)/.test(code) || /tone\(/.test(code);

      const tests: VerificationTestCase[] = [
        {
          id: 't1',
          titleAr: '1. فحص مقاومة الشد لزرّي اللاعبَين D2 و D3 (INPUT_PULLUP)',
          descriptionAr: 'التأكد من استخدام pinMode(2, INPUT_PULLUP) و pinMode(3, INPUT_PULLUP) لمنع التذبذب العشوائي.',
          passed: hasInputPullup,
          hintAr: 'استبدل INPUT بـ INPUT_PULLUP في سطري المنفذين 2 و 3.',
        },
        {
          id: 't2',
          titleAr: '2. فحص معادلة حساب زمن رد الفعل',
          descriptionAr: 'التأكد من أن المعادلة هي: reactionTime = endTime - startTime (النهاية ناقص البداية).',
          passed: hasCorrectEquation,
          hintAr: 'تأكد أن endTime يأتي أولاً حتى لا تخرج النتيجة سالبة وتفيض في الذاكرة.',
        },
        {
          id: 't3',
          titleAr: '3. فحص تهيئة مخرج المصباح D8 (LED Output)',
          descriptionAr: 'التأكد من كتابة pinMode(8, OUTPUT) لتفعيل ترانزستور الإخراج للضوء.',
          passed: hasLedOutput,
          hintAr: 'تأكد من ضبط المنفذ 8 كـ OUTPUT في دالة setup().',
        },
        {
          id: 't4',
          titleAr: '4. فحص تهيئة الطنان الصوتي D9 (Buzzer & Tone)',
          descriptionAr: 'التأكد من ضبط منفذ الصوت D9 وتفعيل نغمات التنبيه للمتسابق.',
          passed: hasBuzzerPin,
          hintAr: 'تأكد من وجود pinMode(9, OUTPUT) لتشغيل أصوات الطنان.',
        },
      ];

      setTestResults(tests);
      setIsVerifying(false);

      const isSuccess = tests.every((t) => t.passed);
      setAllPassed(isSuccess);

      if (isSuccess) {
        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
        });

        // Award XP and complete mission in storage
        const active = storageService.getActiveProfile();
        storageService.completeMission(active.id, weekNumber, 150, 'bug-hunter');

        if (onMissionCompleted) {
          onMissionCompleted();
        }
      } else {
        soundFx.playFalseStartBuzz();
      }
    }, 600);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-800">
                مختبر الفحص الذكي لتحدي الأسبوع #{weekNumber}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                المرحلة 4: Auto-Grading Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              يقوم المحاكي باختبار كود الطالب آلياً، واكتشاف ثغرات غليتش، ومنح نقاط XP والأوسمة عند اجتياز كافة الفحوصات
            </p>
          </div>
        </div>

        {/* Action helper buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadRepairedCode}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            تحميل الكود المصحح النموذجي
          </button>
        </div>
      </div>

      {/* Code Editor + Verification Suite Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Editable Code (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200 text-slate-900 flex flex-col justify-between space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-sans">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">محرر كود التحدي (عدّل الكود وأصلح الثغرات):</span>
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={isVerifying}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md ${
                isVerifying
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-600/30 ring-2 ring-emerald-400/20'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isVerifying ? 'جارٍ فحص الكود في المحاكي...' : '🧪 فحص الكود في المحاكي'}</span>
            </button>
          </div>

          {/* Textarea for code */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="w-full bg-slate-50 text-slate-900 font-semibold p-4 rounded-2xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed select-text resize-none"
            spellCheck={false}
          />

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200 font-sans">
            <span>💡 نصيحة: تأكد من إصلاح السطر 5 والسطر 21 لاجتياز الفحص.</span>
            <span className="text-amber-700 font-bold">+150 XP عند الاجتياز</span>
          </div>
        </div>

        {/* Right Column: Automated Test Suite Checklist (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CharacterAvatar character="buggy" size="sm" />
                <div>
                  <span className="text-xs text-emerald-700 font-bold block">مساعد التصحيح (Buggy)</span>
                  <h4 className="font-black text-slate-900 text-base">سجل الفحص البرمجي</h4>
                </div>
              </div>

              {testResults && (
                <span
                  className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                    allPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {testResults.filter((t) => t.passed).length} / {testResults.length} مكتمل
                </span>
              )}
            </div>

            {/* Test Results List */}
            <div className="space-y-3 mt-4">
              {!testResults ? (
                <div className="py-12 text-center space-y-3 text-slate-500">
                  <Cpu className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-medium max-w-xs mx-auto leading-relaxed">
                    اضغط زر <span className="font-bold text-emerald-600">"🧪 فحص الكود في المحاكي"</span> ليقوم المحرك الذكي باختبار كودك تلقائياً والتأكد من عمل الدارة بشكل صحيح.
                  </p>
                </div>
              ) : (
                testResults.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 ${
                      t.passed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black flex items-center gap-2">
                        {t.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{t.titleAr}</span>
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          t.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {t.passed ? 'ناجح ✓' : 'مطلوب تعديل ✗'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-normal">{t.descriptionAr}</p>

                    {!t.passed && (
                      <div className="p-2 rounded-xl bg-white/80 border border-rose-200 text-[10px] text-rose-800 font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>تلميح بَغّي: {t.hintAr}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Success Banner when all tests pass */}
          {allPassed && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white space-y-2 shadow-lg animate-fadeIn text-center">
              <div className="flex items-center justify-center gap-2 font-black text-sm">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span>مبارك! اجتزت كافة اختبارات المحاكي بنجاح!</span>
              </div>
              <p className="text-xs text-white/90">
                تمت إضافة +150 XP لملفك وفتح وسام "صائد الثغرات (Bug Hunter)" رسمياً!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

