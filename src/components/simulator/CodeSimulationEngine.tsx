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

export const CodeSimulationEngine: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<ArduinoProgramPreset>(ARDUINO_CODE_PRESETS[0]);
  const [codeText, setCodeText] = useState<string>(ARDUINO_CODE_PRESETS[0].code);
  const [boardState, setBoardState] = useState<VirtualBoardState>(() => virtualArduinoEngine.getState());
  const serialEndRef = useRef<HTMLDivElement | null>(null);

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

  const handleSelectPreset = (preset: ArduinoProgramPreset) => {
    soundFx.playClick();
    virtualArduinoEngine.stop();
    setSelectedPreset(preset);
    setCodeText(preset.code);
  };

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

  const handleSimulateButtonPress = () => {
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
              ترجمة وتنفيذ أسطر كود C++ للآردوينو وربطها فورياً بسلوك المصابيح والمحركات والأصوات
            </p>
          </div>
        </div>

        {/* Code Presets Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">البرامج الجاهزة:</span>
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl">
            {ARDUINO_CODE_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.titleAr.split(' ')[0]} {preset.titleAr.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Code Editor + Live Hardware State + Serial Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (Code Editor): 7 cols */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white flex flex-col justify-between space-y-4 font-mono shadow-xl">
          {/* Top Editor Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-400 mr-2 font-mono">sketch.ino</span>
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
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="إعادة ضبط اللوحة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Code Editor & Step Highlighter */}
          <div className="relative h-96 overflow-y-auto text-xs space-y-1 font-mono pr-2 select-text scrollbar-thin">
            {codeLines.map((line, idx) => {
              const isExecutingLine = boardState.isRunning && boardState.activeLineIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                    isExecutingLine
                      ? 'bg-blue-600/40 border-r-4 border-blue-400 text-white font-bold'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <span className="w-6 text-slate-600 text-right select-none text-[11px]">{idx + 1}</span>
                  <span
                    className={`flex-1 whitespace-pre ${
                      line.includes('//')
                        ? 'text-slate-500'
                        : line.includes('digitalWrite') || line.includes('analogWrite') || line.includes('tone')
                        ? 'text-amber-300'
                        : line.includes('pinMode') || line.includes('Serial')
                        ? 'text-cyan-300'
                        : 'text-slate-200'
                    }`}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Execution Status */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${boardState.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}
              />
              <span>{boardState.isRunning ? 'المعالج ينفذ الكود لحظياً' : 'المعالج في وضع الاستعداد'}</span>
            </div>
            <span className="font-mono text-slate-400">millis(): {boardState.millis} ms</span>
          </div>
        </div>

        {/* Right Column: Live Virtual Components & Serial Monitor: 5 cols */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Live Hardware Pins State Deck */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="font-black text-slate-900 text-sm">استجابة المكونات للكود</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Virtual Hardware Output</span>
            </div>

            {/* Component 1: D8 LED Indicator */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    boardState.pins[8]?.state === 'HIGH'
                      ? 'bg-rose-500 border-rose-300 shadow-[0_0_20px_#EF4444] scale-110'
                      : 'bg-rose-950 border-slate-300'
                  }`}
                >
                  <Zap className={`w-4 h-4 ${boardState.pins[8]?.state === 'HIGH' ? 'text-white' : 'text-rose-800'}`} />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800">مصباح D8 (LED)</div>
                  <span className="text-[10px] text-slate-400 font-mono">digitalWrite(8, {boardState.pins[8]?.state})</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                  boardState.pins[8]?.state === 'HIGH'
                    ? 'bg-rose-100 text-rose-700 animate-pulse'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {boardState.pins[8]?.state === 'HIGH' ? 'مضاء ON (5V)' : 'مطفأ OFF (0V)'}
              </span>
            </div>

            {/* Component 2: D3 Push Button (Student can click to trigger digitalRead) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  🔘
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800">زر الاستجابة D3</div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    digitalRead(3) = {boardState.pins[3]?.state}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSimulateButtonPress}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
              >
                اضغط الزر الآن
              </button>
            </div>

            {/* Component 3: Servo Angle Display */}
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

            {/* Component 4: PWM Motor Speed */}
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
          </div>

          {/* Serial Monitor Output Window */}
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 flex flex-col justify-between font-mono shadow-md text-white min-h-[180px]">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 font-sans">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-300">Serial Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-mono">9600 baud</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="mt-2 h-36 overflow-y-auto space-y-1 text-xs text-slate-300 pr-1 select-text scrollbar-thin">
                {boardState.serialBuffer.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.includes('Reaction')
                        ? 'text-cyan-300 font-bold'
                        : line.includes('Blink') || line.includes('Gate')
                        ? 'text-amber-300 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                <div ref={serialEndRef} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-sans">
              يستقبل الأوامر المطبوعة عبر Serial.println() مباشرة من الكود.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

