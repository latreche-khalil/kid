// Virtual Arduino Execution Engine
// Parses and runs Arduino C++ instructions, updating virtual pin states, timers, and Serial output.

import { soundFx } from '../sound/webAudio';

export type PinMode = 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
export type PinState = 'HIGH' | 'LOW';

export interface VirtualPin {
  pinNumber: number;
  mode: PinMode;
  state: PinState;
  analogValue: number; // 0 to 255 for PWM
}

export interface VirtualBoardState {
  pins: Record<number, VirtualPin>;
  millis: number;
  isRunning: boolean;
  activeLineIndex: number;
  serialBuffer: string[];
  servoAngle: number;
  toneActive: boolean;
}

export interface ArduinoProgramPreset {
  id: string;
  titleAr: string;
  titleEn: string;
  weekRef: number;
  descriptionAr: string;
  code: string;
}

export const ARDUINO_CODE_PRESETS: ArduinoProgramPreset[] = [
  {
    id: 'reaction_game',
    titleAr: 'لعبة سرعة الاستجابة الرسمية (الأسبوع 1)',
    titleEn: 'Reaction Time Game Official Code',
    weekRef: 1,
    descriptionAr: 'ينتظر زمناً عشوائياً، يضيء المصباح ويطلق صفارة، ثم يحسب زمن ضغط زر D3 بالملي ثانية.',
    code: `void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT);       // مصباح LED
  pinMode(3, INPUT_PULLUP); // زر الاستجابة
  pinMode(9, OUTPUT);       // الطنان الصوتي
  Serial.println("System Ready! Press Start...");
}

void loop() {
  // انتظار عشوائي بين ثانيتين و 4 ثوانٍ
  delay(2500);
  
  // تشغيل المصباح وصفارة الانطلاق
  digitalWrite(8, HIGH);
  tone(9, 1200, 150);
  unsigned long startT = millis();
  
  // انتظار ضغط اللاعب لزر الاستجابة D3
  while (digitalRead(3) == HIGH) {
    // ترقب الضغط...
  }
  
  unsigned long endT = millis();
  digitalWrite(8, LOW);
  
  unsigned long reaction = endT - startT;
  Serial.print("Reaction Time: ");
  Serial.print(reaction);
  Serial.println(" ms");
  
  delay(2000);
}`,
  },
  {
    id: 'blink_led',
    titleAr: 'وميض المصباح الكلاسيكي (Blink LED)',
    titleEn: 'Classic Blink LED',
    weekRef: 1,
    descriptionAr: 'أول برنامج يكتبه كل مهندس! يضيء المصباح D8 لمدة ثانية ثم يطفئه لمدة ثانية باستمرار.',
    code: `void setup() {
  pinMode(8, OUTPUT); // ضبط منفذ المصباح كمخرج
  Serial.begin(9600);
  Serial.println("Blink Program Started!");
}

void loop() {
  digitalWrite(8, HIGH); // إشعال المصباح
  Serial.println("LED: HIGH (ON)");
  delay(1000);           // انتظر 1000 ملي ثانية
  
  digitalWrite(8, LOW);  // إطفاء المصباح
  Serial.println("LED: LOW (OFF)");
  delay(1000);           // انتظر 1000 ملي ثانية
}`,
  },
  {
    id: 'servo_sweep',
    titleAr: 'دوران محرك السيرفو الذكي (Servo Sweep)',
    titleEn: 'Smart Servo Sweep (Week 13)',
    weekRef: 13,
    descriptionAr: 'يتحكم بزاوية ذراع السيرفو الموجه من 0 إلى 180 درجة ثم يعود بسلاسة كحاجز مواقف ذكي.',
    code: `Servo myServo;

void setup() {
  myServo.attach(9); // وصل السيرفو بالمنفذ 9
  Serial.begin(9600);
  Serial.println("Servo Gate Ready!");
}

void loop() {
  // رفع حاجز المرور بزاوية 90 درجة
  myServo.write(90);
  Serial.println("Gate: OPEN (90 deg)");
  delay(1500);
  
  // فتح الحاجز بالكامل 180 درجة
  myServo.write(180);
  Serial.println("Gate: FULL (180 deg)");
  delay(1500);
  
  // إغلاق الحاجز 0 درجة
  myServo.write(0);
  Serial.println("Gate: CLOSED (0 deg)");
  delay(2000);
}`,
  },
  {
    id: 'motor_pwm',
    titleAr: 'التحكم بسرعة محرك المروحة PWM (الأسبوع 14)',
    titleEn: 'DC Motor PWM Speed Control',
    weekRef: 14,
    descriptionAr: 'تعديل عرض النبضة analogWrite(9, val) لزيادة سرعة دوران المروحة تدريجياً.',
    code: `void setup() {
  pinMode(9, OUTPUT); // منفذ المحرك PWM
  Serial.begin(9600);
}

void loop() {
  // سرعة منخفضة (PWM 60)
  analogWrite(9, 60);
  Serial.println("Motor Speed: LOW (60/255)");
  delay(1500);
  
  // سرعة متوسطة (PWM 160)
  analogWrite(9, 160);
  Serial.println("Motor Speed: MEDIUM (160/255)");
  delay(1500);
  
  // أقصى سرعة توربو (PWM 255)
  analogWrite(9, 255);
  Serial.println("Motor Speed: TURBO MAX (255/255)");
  delay(2000);
  
  // إيقاف المحرك
  analogWrite(9, 0);
  Serial.println("Motor: STOP (0/255)");
  delay(1000);
}`,
  },
];

export class VirtualArduinoRuntime {
  private state: VirtualBoardState;
  private listeners: ((state: VirtualBoardState) => void)[] = [];
  private executionInterval: ReturnType<typeof setInterval> | null = null;
  private parsedLines: string[] = [];
  private currentStep: number = 0;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): VirtualBoardState {
    const pins: Record<number, VirtualPin> = {};
    for (let i = 0; i <= 13; i++) {
      pins[i] = {
        pinNumber: i,
        mode: 'OUTPUT',
        state: 'LOW',
        analogValue: 0,
      };
    }
    return {
      pins,
      millis: 0,
      isRunning: false,
      activeLineIndex: 0,
      serialBuffer: [
        '=====================================',
        '🤖 محاكي كود الآردوينو الافتراضي v1.0',
        'اضغط "رفع وتشغيل الكود" لبدء التنفيذ',
        '=====================================',
      ],
      servoAngle: 0,
      toneActive: false,
    };
  }

  public subscribe(cb: (state: VirtualBoardState) => void): () => void {
    this.listeners.push(cb);
    cb(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb({ ...this.state }));
  }

  public getState(): VirtualBoardState {
    return { ...this.state };
  }

  public reset() {
    this.stop();
    this.state = this.getInitialState();
    this.notify();
  }

  public stop() {
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
    this.state.isRunning = false;
    this.notify();
  }

  // Simulate Button Press on Pin
  public pressButton(pinNumber: number, durationMs: number = 250) {
    if (!this.state.pins[pinNumber]) return;

    // For INPUT_PULLUP: pressed is LOW
    const isPullup = this.state.pins[pinNumber].mode === 'INPUT_PULLUP';
    this.state.pins[pinNumber].state = isPullup ? 'LOW' : 'HIGH';
    soundFx.playClick();
    this.notify();

    setTimeout(() => {
      if (this.state.pins[pinNumber]) {
        this.state.pins[pinNumber].state = isPullup ? 'HIGH' : 'LOW';
        this.notify();
      }
    }, durationMs);
  }

  // Load and Execute Arduino Code
  public runCode(code: string) {
    this.reset();
    soundFx.playSuccessChime();

    this.state.serialBuffer.push('🚀 يتم الآن ترجمة ورفع الكود إلى المتحكم...');
    this.state.isRunning = true;
    this.notify();

    // Parse executable instruction lines
    this.parsedLines = code
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'));

    this.currentStep = 0;

    // Start Virtual Execution Clock (Runs a step every 350ms for visual comprehension)
    this.executionInterval = setInterval(() => {
      this.stepExecution();
    }, 380);
  }

  private stepExecution() {
    if (!this.state.isRunning || this.parsedLines.length === 0) return;

    const line = this.parsedLines[this.currentStep];
    this.state.activeLineIndex = this.currentStep;
    this.state.millis += 380;

    // Execute parsed instruction
    this.executeSingleInstruction(line);

    this.currentStep = (this.currentStep + 1) % this.parsedLines.length;
    this.notify();
  }

  private executeSingleInstruction(line: string) {
    if (!line) return;

    // 1. pinMode(pin, mode)
    const pinModeMatch = line.match(/pinMode\((\d+),\s*([A-Z_]+)\)/);
    if (pinModeMatch) {
      const pin = parseInt(pinModeMatch[1]);
      const mode = pinModeMatch[2] as PinMode;
      if (this.state.pins[pin]) {
        this.state.pins[pin].mode = mode;
        if (mode === 'INPUT_PULLUP') {
          this.state.pins[pin].state = 'HIGH'; // default unpressed
        }
      }
      return;
    }

    // 2. digitalWrite(pin, state)
    const digitalWriteMatch = line.match(/digitalWrite\((\d+),\s*([A-Z]+)\)/);
    if (digitalWriteMatch) {
      const pin = parseInt(digitalWriteMatch[1]);
      const state = digitalWriteMatch[2] as PinState;
      if (this.state.pins[pin]) {
        this.state.pins[pin].state = state;
        if (pin === 8) {
          if (state === 'HIGH') {
            soundFx.playTone(880, 80, 'sine');
          }
        }
      }
      return;
    }

    // 3. analogWrite(pin, value) - PWM
    const analogWriteMatch = line.match(/analogWrite\((\d+),\s*(\d+)\)/);
    if (analogWriteMatch) {
      const pin = parseInt(analogWriteMatch[1]);
      const val = parseInt(analogWriteMatch[2]);
      if (this.state.pins[pin]) {
        this.state.pins[pin].analogValue = Math.min(255, Math.max(0, val));
        this.state.pins[pin].state = val > 0 ? 'HIGH' : 'LOW';
      }
      return;
    }

    // 4. myServo.write(angle)
    const servoMatch = line.match(/myServo\.write\((\d+)\)/);
    if (servoMatch) {
      const angle = parseInt(servoMatch[1]);
      this.state.servoAngle = Math.min(180, Math.max(0, angle));
      soundFx.playTone(450 + angle * 2, 40, 'sine');
      return;
    }

    // 5. tone(pin, freq, duration)
    const toneMatch = line.match(/tone\((\d+),\s*(\d+)/);
    if (toneMatch) {
      const freq = parseInt(toneMatch[2]);
      soundFx.playTone(freq, 160, 'square');
      this.state.toneActive = true;
      setTimeout(() => {
        this.state.toneActive = false;
        this.notify();
      }, 160);
      return;
    }

    // 6. Serial.println(...) & Serial.print(...)
    const serialMatch = line.match(/Serial\.print(?:ln)?\((.*)\)/);
    if (serialMatch) {
      let content = serialMatch[1].trim();
      // Remove enclosing quotes if string literal
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.substring(1, content.length - 1);
      }
      this.state.serialBuffer.push(`> ${content}`);
      if (this.state.serialBuffer.length > 50) {
        this.state.serialBuffer.shift();
      }
      return;
    }
  }
}

export const virtualArduinoEngine = new VirtualArduinoRuntime();
