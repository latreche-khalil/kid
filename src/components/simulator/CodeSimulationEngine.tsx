import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Terminal,
  Zap,
  Code2,
  Sparkles,
  Cpu,
  Layers,
  Check,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Sliders,
  Move3d,
  ChevronDown
} from 'lucide-react';
import {
  virtualArduinoEngine,
  VirtualBoardState,
  ARDUINO_CODE_PRESETS,
  ArduinoProgramPreset
} from '../../services/simulator/virtualArduinoEngine';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../characters/CharacterAvatars';

interface CodeSimulationEngineProps {
  weekNumber?: number;
}

export const CodeSimulationEngine: React.FC<CodeSimulationEngineProps> = ({ weekNumber }) => {
  const activePreset: ArduinoProgramPreset =
    weekNumber !== undefined
      ? [...ARDUINO_CODE_PRESETS]
          .reverse()
          .find((preset) => preset.weekRef <= weekNumber) || ARDUINO_CODE_PRESETS[0]
      : ARDUINO_CODE_PRESETS[0];
  const showServo = weekNumber === undefined || weekNumber >= 13;
  const showMotor = weekNumber === undefined || weekNumber >= 14;

  const [selectedPreset, setSelectedPreset] = useState<ArduinoProgramPreset>(activePreset);
  const [codeText, setCodeText] = useState<string>(activePreset.code);
  const [boardState, setBoardState] = useState<VirtualBoardState>(() => virtualArduinoEngine.getState());
  const serialEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedPreset.id !== activePreset.id) {
      virtualArduinoEngine.stop();
      setSelectedPreset(activePreset);
      setCodeText(activePreset.code);
    }
  }, [activePreset, selectedPreset.id]);

  // Subscribe to Virtual Runtime Engine
  useEffect(() => {
    const unsubscribe = virtualArduinoEngine.subscribe((newState) => {
      setBoardState(newState);
    });
    return () => {
      unsubscribe();
      virtualArduinoEngine.stop();
    };
  }, []);

  // Auto-scroll serial monitor
  useEffect(() => {
    serialEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [boardState.serialBuffer]);

  const handleRunCode = () => {
    soundFx.playClick();
    virtualArduinoEngine.runCode(codeText);
  };

  const handleStopCode = () => {
    soundFx.playClick();
    virtualArduinoEngine.stop();
  };

  const handleReset = () => {
    soundFx.playClick();
    virtualArduinoEngine.reset();
  };

  const handleSimulateP1Press = () => {
    soundFx.playClick();
    virtualArduinoEngine.pressButton(2, 300);
  };

  const handleSimulateP2Press = () => {
    soundFx.playClick();
    virtualArduinoEngine.pressButton(3, 300);
  };

  const codeLines = codeText.split('\n');

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Code2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-800">محرك محاكاة الكود التفاعلي (Code Engine)</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black">
                المرحلة 3: Virtual Hardware Runtime
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {showServo || showMotor
                ? 'ترجمة وتنفيذ أسطر كود C++ للآردوينو وربطها فورياً بسلوك المصابيح والمحركات والأصوات'
                : 'ترجمة وتنفيذ أسطر كود C++ للآردوينو وربطها فورياً بسلوك المصباح والزر والطنان الصوتي'}
            </p>
          </div>
        </div>

        {/* Single Active Program Badge */}
        <span className="px-3.5 py-1.5 rounded-2xl bg-[#30A89A]/12 text-[#203447] border border-[#30A89A]/35 text-xs font-black">
          برنامج الحصة: {selectedPreset.titleAr}
        </span>
      </div>

      {/* Balanced 2-Column Split: Code Editor (50%) | Hardware & Serial Monitor (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Half 1: Code Editor */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 text-slate-900 flex flex-col justify-between space-y-4 font-mono shadow-card">
          {/* Top Editor Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-600 mr-2 font-mono">sketch.ino</span>
            </div>

            {/* Run / Stop / Reset Buttons */}
            <div className="flex items-center gap-2">
              {!boardState.isRunning ? (
                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>رفع وتشغيل الكود</span>
                </button>
              ) : (
                <button
                  onClick={handleStopCode}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-600/30 active:scale-95 transition-all"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>إيقاف مؤقت</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                title="إعادة ضبط اللوحة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Code Editor & Step Highlighter */}
          <div className="relative h-96 overflow-y-auto text-xs space-y-1 font-mono p-3 rounded-2xl bg-slate-50 border border-slate-200 select-text scrollbar-thin">
            {codeLines.map((line, idx) => {
              const isExecutingLine = boardState.isRunning && boardState.activeLineIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                    isExecutingLine
                      ? 'bg-sky-100 border-r-4 border-sky-500 text-slate-950 font-bold'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className="w-6 text-slate-400 text-right select-none text-[11px]">{idx + 1}</span>
                  <span
                    className={`flex-1 whitespace-pre ${
                      line.includes('//')
                        ? 'text-slate-500'
                        : line.includes('digitalWrite') || line.includes('analogWrite') || line.includes('tone')
                        ? 'text-amber-700 font-semibold'
                        : line.includes('pinMode') || line.includes('Serial')
                        ? 'text-indigo-700 font-semibold'
                        : 'text-slate-900'
                    }`}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Execution Status */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-sans">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${boardState.isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}
              />
              <span>{boardState.isRunning ? 'المعالج ينفذ الكود لحظياً' : 'المعالج في وضع الاستعداد'}</span>
            </div>
            <span className="font-mono text-slate-600">millis(): {boardState.millis} ms</span>
          </div>
        </div>

        {/* Half 2: Live Virtual Components & Serial Monitor */}
        <div className="flex flex-col justify-between space-y-5">
          {/* Live Hardware Pins State Deck */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="font-black text-slate-900 text-sm">استجابة المكونات للكود</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Virtual Hardware Output</span>
            </div>

            <div className="space-y-2.5">

            {/* Component 1: Player 1 Yellow (D2 Button + D4 Yellow LED) */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black text-amber-900 pb-1 border-b border-amber-200/60">
                <span>اللاعب 1: الأصفر (D2 / D4)</span>
                <span className="text-[10px] text-amber-700">فريق الأصفر</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Yellow LED D4 */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        boardState.pins[4]?.state === 'HIGH'
                          ? 'bg-amber-400 border-amber-300 shadow-[0_0_15px_#F59E0B] scale-110'
                          : 'bg-amber-950 border-slate-300'
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${boardState.pins[4]?.state === 'HIGH' ? 'text-slate-950' : 'text-amber-700'}`} />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800">لمبة صفراء (D4)</div>
                      <span className="text-[10px] text-slate-400 font-mono">digitalWrite(4)</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                      boardState.pins[4]?.state === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {boardState.pins[4]?.state === 'HIGH' ? 'مضاءة 💡' : 'مطفأة'}
                  </span>
                </div>

                {/* Yellow Button D2 */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200">
                  <div>
                    <div className="font-bold text-xs text-slate-800">زر أصفر (D2)</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      digitalRead(2) = {boardState.pins[2]?.state || 'HIGH'}
                    </span>
                  </div>
                  <button
                    onClick={handleSimulateP1Press}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs shadow-sm transition-all"
                  >
                    اضغط الأصفر
                  </button>
                </div>
              </div>
            </div>

            {/* Component 2: Player 2 Red (D3 Button + D5 Red LED) */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black text-rose-900 pb-1 border-b border-rose-200/60">
                <span>اللاعب 2: الأحمر (D3 / D5)</span>
                <span className="text-[10px] text-rose-700">فريق الأحمر</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Red LED D5 */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-200">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        boardState.pins[5]?.state === 'HIGH'
                          ? 'bg-rose-500 border-rose-300 shadow-[0_0_15px_#EF4444] scale-110'
                          : 'bg-rose-950 border-slate-300'
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${boardState.pins[5]?.state === 'HIGH' ? 'text-white' : 'text-rose-800'}`} />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800">لمبة حمراء (D5)</div>
                      <span className="text-[10px] text-slate-400 font-mono">digitalWrite(5)</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                      boardState.pins[5]?.state === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {boardState.pins[5]?.state === 'HIGH' ? 'مضاءة 💡' : 'مطفأة'}
                  </span>
                </div>

                {/* Red Button D3 */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-200">
                  <div>
                    <div className="font-bold text-xs text-slate-800">زر أحمر (D3)</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      digitalRead(3) = {boardState.pins[3]?.state || 'HIGH'}
                    </span>
                  </div>
                  <button
                    onClick={handleSimulateP2Press}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black text-xs shadow-sm transition-all"
                  >
                    اضغط الأحمر
                  </button>
                </div>
              </div>
            </div>

            {/* Component 3 (Early Lessons): D9 Buzzer Indicator */}
            {!showServo && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      boardState.toneActive
                        ? 'bg-amber-500 text-white shadow-[0_0_16px_#F59E0B] scale-110'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">الطنان الصوتي D9 (Buzzer)</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      tone(9, ...) = {boardState.toneActive ? 'ACTIVE' : 'SILENT'}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                    boardState.toneActive
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {boardState.toneActive ? 'يصدر صوتاً 🔊' : 'صامت 🔇'}
                </span>
              </div>
            )}

            {/* Component 3: Servo Angle Display (Weeks 13+) */}
            {showServo && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                    🅿️
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">محرك السيرفو (D9)</div>
                    <span className="text-[10px] text-slate-400 font-mono">myServo.write({boardState.servoAngle})</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-purple-600 font-mono">{boardState.servoAngle}°</span>
                  <span className="text-[10px] text-slate-400 block">زاوية الدوران</span>
                </div>
              </div>
            )}

            {/* Component 4: PWM Motor Speed (Weeks 14+) */}
            {showMotor && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    🌀
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">محرك المروحة PWM</div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      analogWrite(9, {boardState.pins[9]?.analogValue})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-600 font-mono">
                    {boardState.pins[9]?.analogValue} / 255
                  </span>
                  <span className="text-[10px] text-slate-400 block">قوة الـ PWM</span>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Serial Monitor Output Window */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 flex flex-col justify-between font-mono shadow-sm text-slate-900 min-h-[180px]">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-600 font-sans">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-slate-800">Serial Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-700 font-bold font-mono">9600 baud</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="mt-2 h-36 overflow-y-auto space-y-1 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 select-text scrollbar-thin">
                {boardState.serialBuffer.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.includes('Reaction')
                        ? 'text-indigo-700 font-bold'
                        : line.includes('Blink') || line.includes('Gate')
                        ? 'text-amber-700 font-bold'
                        : 'text-slate-700'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                <div ref={serialEndRef} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-sans">
              يستقبل الأوامر المطبوعة عبر Serial.println() مباشرة من الكود.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

