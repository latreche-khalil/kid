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
    titleAr: 'تحدّي الأسرع: أصفر ضد أحمر (الأسبوع 1)',
    titleEn: 'Speed Duel: Yellow vs Red (Week 1)',
    weekRef: 1,
    descriptionAr: 'زر أصفر مع لمبة صفراء (D2/D4) وزر أحمر مع لمبة حمراء (D3/D5): من يضغط أولاً تشتعل لمبته فوراً!',
    code: `const int BTN_YELLOW = 2; // زر اللاعب الأصفر
const int BTN_RED    = 3; // زر اللاعب الأحمر
const int LED_YELLOW = 4; // لمبة اللاعب الأصفر
const int LED_RED    = 5; // لمبة اللاعب الأحمر
const int BUZZER_PIN = 9; // الطنان الصوتي

void setup() {
  Serial.begin(9600);
  pinMode(BTN_YELLOW, INPUT_PULLUP);
  pinMode(BTN_RED,    INPUT_PULLUP);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED,    OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("1v1 Duel Ready! Press Yellow (D2) or Red (D3)");
}

void loop() {
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED,    LOW);
  delay(2000);
  
  // صفارة البداية
  tone(BUZZER_PIN, 1200, 200);
  unsigned long startT = millis();
  
  int winner = 0;
  while (winner == 0) {
    if (digitalRead(BTN_YELLOW) == LOW) {
      winner = 1;
    } else if (digitalRead(BTN_RED) == LOW) {
      winner = 2;
    }
  }
  
  unsigned long endT = millis();
  unsigned long reaction = endT - startT;
  
  if (winner == 1) {
    digitalWrite(LED_YELLOW, HIGH); // اشتعال اللمبة الصفراء
    Serial.print("🏆 فاز اللاعب الأصفر! الزمن: ");
    Serial.print(reaction);
    Serial.println(" ms");
  } else {
    digitalWrite(LED_RED, HIGH); // اشتعال اللمبة الحمراء
    Serial.print("🏆 فاز اللاعب الأحمر! الزمن: ");
    Serial.print(reaction);
    Serial.println(" ms");
  }
  
  delay(3000);
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
        if (pin === 4 || pin === 5 || pin === 8) {
          if (state === 'HIGH') {
            soundFx.playTone(pin === 4 ? 880 : pin === 5 ? 660 : 770, 80, 'sine');
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

