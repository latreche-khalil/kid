import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';

interface WiringStep {
  step: number;
  instructionAr: string;
  color: string;
  from: string;
  to: string;
  cautionAr?: string;
}

interface CircuitProps {
  wiringSteps: WiringStep[];
}

export const InteractiveBreadboardCircuit: React.FC<CircuitProps> = ({ wiringSteps }) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const toggleStepCompleted = (stepNum: number) => {
    soundFx.playClick();
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
      soundFx.playSuccessChime();
    }
  };

  const handleStepClick = (stepNum: number) => {
    soundFx.playClick();
    setSelectedStep(selectedStep === stepNum ? null : stepNum);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span>⚡ مختبر الدوائر التفاعلي</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mt-1">مخطط توصيل دارة التحدّي الثنائي (1 ضد 1)</h3>
          <p className="text-sm text-slate-500">انقر على أي سلك أو خطوة لتسليط الضوء عليها والتأكد من صحة التوصيل</p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
            className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setSelectedStep(null);
            }}
            className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Diagram Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 border border-slate-800 min-h-[380px] flex items-center justify-center">
        <div
          className="transition-transform duration-300 w-full flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg viewBox="0 0 900 520" className="w-full max-w-[850px] h-auto select-none">
            <defs>
              <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Accent */}
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            <rect width="900" height="520" fill="url(#smallGrid)" />

            {/* ================= ARDUINO UNO BOARD (LEFT) ================= */}
            <g transform="translate(60, 80)">
              {/* Board Body */}
              <rect x="0" y="0" width="240" height="340" rx="16" fill="#0284C7" stroke="#0369A1" strokeWidth="4" />
              
              {/* USB Port & Power Jack */}
              <rect x="20" y="-18" width="55" height="30" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="2" />
              <rect x="160" y="-14" width="45" height="26" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="182" cy="-1" r="5" fill="#475569" />

              {/* ATmega328P Chip */}
              <rect x="60" y="140" width="120" height="45" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <text x="120" y="167" fill="#94A3B8" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ATmega328P
              </text>

              {/* Reset Button */}
              <circle cx="35" cy="50" r="10" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
              <text x="35" y="72" fill="#E2E8F0" fontSize="9" textAnchor="middle">RESET</text>

              {/* Text label Arduino Uno */}
              <text x="120" y="90" fill="#FFFFFF" fontSize="18" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                ARDUINO UNO
              </text>
              <text x="120" y="108" fill="#BAE6FD" fontSize="11" textAnchor="middle">
                ITALY DESIGN • R3
              </text>

              {/* Right Header: Digital Pins */}
              <rect x="212" y="30" width="22" height="260" rx="4" fill="#0F172A" />
              {/* Digital Pin Labels */}
              <text x="202" y="52" fill="#BAE6FD" fontSize="9" textAnchor="end">D13</text>
              <text x="202" y="72" fill="#BAE6FD" fontSize="9" textAnchor="end">D12</text>
              <text x="202" y="92" fill="#BAE6FD" fontSize="9" textAnchor="end">D11</text>
              <text x="202" y="112" fill="#BAE6FD" fontSize="9" textAnchor="end">D10</text>
              <text x="202" y="132" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="end">D9 (Buzzer)</text>
              <text x="202" y="152" fill="#BAE6FD" fontSize="9" textAnchor="end">D8</text>
              <text x="202" y="172" fill="#BAE6FD" fontSize="9" textAnchor="end">D7</text>
              <text x="202" y="192" fill="#BAE6FD" fontSize="9" textAnchor="end">D6</text>
              <text x="202" y="212" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="end">D5 (LED أحمر)</text>
              <text x="202" y="232" fill="#EAB308" fontSize="10" fontWeight="bold" textAnchor="end">D4 (LED أصفر)</text>
              <text x="202" y="252" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="end">D3 (زر أحمر)</text>
              <text x="202" y="272" fill="#EAB308" fontSize="10" fontWeight="bold" textAnchor="end">D2 (زر أصفر)</text>

              {/* Pin holes */}
              {[48, 68, 88, 108, 128, 148, 168, 188, 208, 228, 248, 268].map((y, i) => (
                <circle key={i} cx="223" cy={y} r="3.5" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
              ))}

              {/* Left Header: Power Pins */}
              <rect x="6" y="120" width="22" height="170" rx="4" fill="#0F172A" />
              <text x="34" y="172" fill="#F87171" fontSize="9" textAnchor="start">5V</text>
              <text x="34" y="202" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="start">GND</text>
              <text x="34" y="222" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="start">GND</text>
              
              {/* GND Pin Hole */}
              <circle cx="17" cy="198" r="4" fill="#FFFFFF" stroke="#475569" strokeWidth="2" className="animate-pulse" />
            </g>

            {/* ================= BREADBOARD (RIGHT) ================= */}
            <g transform="translate(420, 50)">
              {/* Breadboard Base Body */}
              <rect x="0" y="0" width="420" height="400" rx="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="4" />
              
              {/* Center Channel Trench */}
              <rect x="200" y="20" width="20" height="360" rx="3" fill="#E2E8F0" />

              {/* Power Rails (Top & Bottom Red/Blue lines) */}
              <line x1="20" y1="25" x2="400" y2="25" stroke="#3B82F6" strokeWidth="3" strokeDasharray="6 4" />
              <text x="12" y="29" fill="#2563EB" fontSize="12" fontWeight="bold">-</text>
              <text x="408" y="29" fill="#2563EB" fontSize="12" fontWeight="bold">-</text>

              <line x1="20" y1="42" x2="400" y2="42" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 4" />
              <text x="12" y="46" fill="#DC2626" fontSize="12" fontWeight="bold">+</text>
              <text x="408" y="46" fill="#DC2626" fontSize="12" fontWeight="bold">+</text>

              {/* Breadboard Pins Simulation */}
              {Array.from({ length: 14 }).map((_, col) => (
                <g key={col}>
                  {Array.from({ length: 5 }).map((_, row) => (
                    <circle
                      key={`t-${col}-${row}`}
                      cx={35 + col * 26}
                      cy={75 + row * 20}
                      r="2.5"
                      fill="#94A3B8"
                    />
                  ))}
                  {Array.from({ length: 5 }).map((_, row) => (
                    <circle
                      key={`b-${col}-${row}`}
                      cx={35 + col * 26}
                      cy={250 + row * 20}
                      r="2.5"
                      fill="#94A3B8"
                    />
                  ))}
                </g>
              ))}

              {/* COMPONENT 1: PLAYER 1 YELLOW BUTTON (Left) */}
              <g transform="translate(60, 160)">
                <rect x="0" y="0" width="60" height="60" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                <circle cx="30" cy="30" r="18" fill="#EAB308" stroke="#CA8A04" strokeWidth="3" />
                <text x="30" y="80" fill="#1E293B" fontSize="11" fontWeight="bold" textAnchor="middle">اللاعب الأصفر</text>
                <text x="30" y="93" fill="#64748B" fontSize="9" textAnchor="middle">منفذ D2</text>
                {/* Legs */}
                <circle cx="8" cy="12" r="3.5" fill="#F59E0B" />
                <circle cx="52" cy="12" r="3.5" fill="#F59E0B" />
                <circle cx="8" cy="48" r="3.5" fill="#F59E0B" />
                <circle cx="52" cy="48" r="3.5" fill="#F59E0B" />
              </g>

              {/* COMPONENT 2: YELLOW LED (Beside Yellow Button) */}
              <g transform="translate(140, 160)">
                <rect x="-10" y="5" width="20" height="8" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                <text x="0" y="24" fill="#B45309" fontSize="8" textAnchor="middle">220Ω</text>
                <circle cx="0" cy="38" r="14" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" className="animate-pulse" />
                <circle cx="-3" cy="34" r="3" fill="#FEF08A" />
                <text x="0" y="64" fill="#CA8A04" fontSize="10" fontWeight="bold" textAnchor="middle">LED أصفر</text>
                <text x="0" y="75" fill="#64748B" fontSize="8" textAnchor="middle">منفذ D4</text>
              </g>

              {/* COMPONENT 3: RED LED (Beside Red Button) */}
              <g transform="translate(230, 160)">
                <rect x="-10" y="5" width="20" height="8" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                <text x="0" y="24" fill="#B45309" fontSize="8" textAnchor="middle">220Ω</text>
                <circle cx="0" cy="38" r="14" fill="#EF4444" stroke="#DC2626" strokeWidth="2" className="animate-pulse" />
                <circle cx="-3" cy="34" r="3" fill="#FCA5A5" />
                <text x="0" y="64" fill="#DC2626" fontSize="10" fontWeight="bold" textAnchor="middle">LED أحمر</text>
                <text x="0" y="75" fill="#64748B" fontSize="8" textAnchor="middle">منفذ D5</text>
              </g>

              {/* COMPONENT 4: PLAYER 2 RED BUTTON (Right) */}
              <g transform="translate(290, 160)">
                <rect x="0" y="0" width="60" height="60" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                <circle cx="30" cy="30" r="18" fill="#EF4444" stroke="#DC2626" strokeWidth="3" />
                <text x="30" y="80" fill="#1E293B" fontSize="11" fontWeight="bold" textAnchor="middle">اللاعب الأحمر</text>
                <text x="30" y="93" fill="#64748B" fontSize="9" textAnchor="middle">منفذ D3</text>
                {/* Legs */}
                <circle cx="8" cy="12" r="3.5" fill="#F59E0B" />
                <circle cx="52" cy="12" r="3.5" fill="#F59E0B" />
                <circle cx="8" cy="48" r="3.5" fill="#F59E0B" />
                <circle cx="52" cy="48" r="3.5" fill="#F59E0B" />
              </g>

              {/* COMPONENT 5: BUZZER (Bottom Center) */}
              <g transform="translate(185, 260)">
                <circle cx="20" cy="30" r="24" fill="#0F172A" stroke="#334155" strokeWidth="3" />
                <circle cx="20" cy="30" r="6" fill="#475569" />
                <text x="20" y="70" fill="#0F172A" fontSize="11" fontWeight="bold" textAnchor="middle">طنان صوتي Buzzer</text>
                <text x="20" y="82" fill="#64748B" fontSize="9" textAnchor="middle">منفذ D9</text>
              </g>
            </g>

            {/* ================= CONNECTING WIRES (CURVED PATHS) ================= */}

            {/* Step 1: GND Wire (Black/Slate) */}
            <path
              d="M 77 278 C 60 460, 400 480, 440 75"
              fill="none"
              stroke={selectedStep === 1 ? '#38BDF8' : '#334155'}
              strokeWidth={selectedStep === 1 ? 6 : 3.5}
              strokeLinecap="round"
              filter={selectedStep === 1 ? 'url(#glow-selected)' : undefined}
              className="cursor-pointer transition-all"
              onClick={() => handleStepClick(1)}
            />

            {/* Step 2: Yellow Button Wire (Yellow D2) */}
            <path
              d="M 283 348 C 340 370, 420 320, 488 208"
              fill="none"
              stroke={selectedStep === 2 ? '#FBBF24' : '#EAB308'}
              strokeWidth={selectedStep === 2 ? 6 : 4}
              strokeLinecap="round"
              filter={selectedStep === 2 ? 'url(#glow-selected)' : undefined}
              className="cursor-pointer transition-all"
              onClick={() => handleStepClick(2)}
            />

            {/* Step 3: Yellow LED Wire (Yellow D4) */}
            <path
              d="M 283 308 C 360 260, 480 220, 560 200"
              fill="none"
              stroke={selectedStep === 3 ? '#FEF08A' : '#FACC15'}
              strokeWidth={selectedStep === 3 ? 6 : 4}
              strokeLinecap="round"
              filter={selectedStep === 3 ? 'url(#glow-selected)' : undefined}
              className="cursor-pointer transition-all"
              onClick={() => handleStepClick(3)}
            />

            {/* Step 4: Red Button Wire (Red D3) */}
            <path
              d="M 283 328 C 420 390, 640 380, 718 208"
              fill="none"
              stroke={selectedStep === 4 ? '#F87171' : '#EF4444'}
              strokeWidth={selectedStep === 4 ? 6 : 4}
              strokeLinecap="round"
              filter={selectedStep === 4 ? 'url(#glow-selected)' : undefined}
              className="cursor-pointer transition-all"
              onClick={() => handleStepClick(4)}
            />

            {/* Step 5: Red LED Wire (Red D5) */}
            <path
              d="M 283 288 C 400 240, 580 230, 650 200"
              fill="none"
              stroke={selectedStep === 5 ? '#FCA5A5' : '#DC2626'}
              strokeWidth={selectedStep === 5 ? 6 : 4}
              strokeLinecap="round"
              filter={selectedStep === 5 ? 'url(#glow-selected)' : undefined}
              className="cursor-pointer transition-all"
              onClick={() => handleStepClick(5)}
            />

            {/* Step 6: Buzzer Wire (Amber D9) */}
            <path
              d="M 283 208 C 330 220, 490 280, 605 310"
              fill="none"
              stroke={selectedStep === 6 ? '#FBBF24' : '#F59E0B'}
              strokeWidth={selectedStep === 6 ? 6 : 4}
              strokeLinecap="round"
              filter={selectedStep === 6 ? 'url(#glow-selected)' : undefined}
              className="cursor-pointer transition-all"
              onClick={() => handleStepClick(6)}
            />
          </svg>
        </div>

        {/* Selected wire callout banner on SVG */}
        {selectedStep && (
          <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700 text-white p-3.5 rounded-2xl shadow-xl max-w-sm backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-amber-400 text-sm">
                الخطوة #{selectedStep}: {wiringSteps[selectedStep - 1]?.from} ➔ {wiringSteps[selectedStep - 1]?.to}
              </span>
              <button onClick={() => setSelectedStep(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {wiringSteps[selectedStep - 1]?.instructionAr}
            </p>
          </div>
        )}
      </div>

      {/* Step by Step Checklist with Interactivity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-slate-800 text-base">قائمة التحقق من التوصيل خطوة بخطوة</h4>
          <span className="text-xs font-bold text-slate-500">
            أنجزت ({completedSteps.length} من {wiringSteps.length}) خطوات
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wiringSteps.map((step) => {
            const isDone = completedSteps.includes(step.step);
            const isHighlighted = selectedStep === step.step;

            return (
              <div
                key={step.step}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'border-blue-400 bg-blue-50/70 shadow-sm'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                }`}
                onClick={() => handleStepClick(step.step)}
              >
                {/* Complete Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStepCompleted(step.step);
                  }}
                  className={`shrink-0 mt-0.5 p-1 rounded-xl transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white border-2 border-slate-300 text-transparent hover:border-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-800">
                      خطوة {step.step}: <span className="font-mono text-[11px] text-blue-600 font-bold">{step.from} ➔ {step.to}</span>
                    </span>
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: step.color }}
                      title="لون السلك"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.instructionAr}</p>

                  {step.cautionAr && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-100/70 px-2 py-1 rounded-lg mt-1 font-medium">
                      <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                      <span>{step.cautionAr}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStepClick(step.step);
                  }}
                  className="shrink-0 p-1 text-slate-400 hover:text-slate-700"
                  title="تسليط الضوء"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

