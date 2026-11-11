import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Zap,
  Play,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Move3d,
  Trophy,
  Flag,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../characters/CharacterAvatars';
import { SpeakButton } from '../common/SpeakButton';

export type CircuitProjectId = 'reaction' | 'ultrasonic' | 'servo' | 'motor';

interface CircuitPlayground3DProps {
  lessonWeek?: number;
}

function getProjectFromWeek(week?: number): CircuitProjectId {
  if (week === 12) return 'ultrasonic';
  if (week === 13) return 'servo';
  if (week === 14) return 'motor';
  return 'reaction';
}

interface AssemblyStep {
  step: number;
  titleAr: string;
  componentAr: string;
  wireColor: string;
  fromPin: string;
  toLocation: string;
  codeLine: string;
  instructionAr: string;
  sparkyTipAr: string;
}

const REACTION_ASSEMBLY_STEPS: AssemblyStep[] = [
  {
    step: 0,
    titleAr: 'تجهيز اللوحة ولوحة التجارب',
    componentAr: 'لوحة Arduino UNO R3 + Breadboard',
    wireColor: 'بدون أسلاك',
    fromPin: '-',
    toLocation: 'قاعدة التجارب',
    codeLine: '// تجهيز اللوحة قبل كتابة المنافذ:\nvoid setup() { Serial.begin(9600); }',
    instructionAr: 'ضع لوحة الآردوينو إلى اليسار ولوحة التجارب (Breadboard) إلى اليمين لتسهيل التوصيل المنظم.',
    sparkyTipAr: 'احرص دائماً على فصل كابل USB قبل البدء في تركيب أو تعديل الأسلاك لمنع أي تلامس كهربائي خاطئ!'
  },
  {
    step: 1,
    titleAr: 'توصيل سلك التأريض المشترك (GND)',
    componentAr: 'سلك التوصيل الأسود (Ground Wire)',
    wireColor: 'أسود (Black)',
    fromPin: 'Arduino GND',
    toLocation: 'خط السالب الأزرق (-) في لوحة التجارب',
    codeLine: '// الخط السالب المشترك لكل المكونات:\n// Arduino GND  --->  Breadboard (-)',
    instructionAr: 'وصّل سلكاً أسود من أحد منافذ GND في الآردوينو إلى المسار الطولي الأزرق السالب (-) في لوحة التجارب.',
    sparkyTipAr: 'التأريض المشترك يمنح كل عناصر الدارة الجهد المرجعي نفسه (0 فولت) لتعمل بشكل سليم.'
  },
  {
    step: 2,
    titleAr: 'تركيب مصباح LED الأحمر ومقاومة 220Ω',
    componentAr: 'مصباح LED أحمر + مقاومة 220 أوم',
    wireColor: 'أحمر (Red) للموجب + مقاومة للأرضي',
    fromPin: 'Arduino Pin D8',
    toLocation: 'المصعد (+) للـ LED، والمهبط (-) عبر المقاومة للأرضي',
    codeLine: 'const int LED_PIN = 8;\npinMode(LED_PIN, OUTPUT);',
    instructionAr: 'وصّل السلك الأحمر من المنفذ الرقمي D8 إلى الطرف الطويل للـ LED (المصعد Anode). وصّل الطرف القصير (المهبط Cathode) بمقاومة 220Ω متجهة إلى خط السالب.',
    sparkyTipAr: 'المقاومة تحمي الـ LED من الاحتراق! ألوان حلقاتها: أحمر - أحمر - بني - ذهبي.'
  },
  {
    step: 3,
    titleAr: 'تركيب زر اللاعب الأول الأزرق (D2)',
    componentAr: 'زر اللاعب 1 (أزرق)',
    wireColor: 'أزرق (Blue) للإشارة + أسود للأرضي',
    fromPin: 'Arduino Pin D2',
    toLocation: 'طرف زر اللاعب 1، والطرف المقابل للأرضي GND',
    codeLine: 'const int P1_BTN = 2; // اللاعب الأول\npinMode(P1_BTN, INPUT_PULLUP);',
    instructionAr: 'ثبّت الزر الأزرق الخاص باللاعب الأول في لوحة التجارب. وصّل سلكاً أزرق من المنفذ D2 إلى طرف الزر، وسلكاً أسود إلى خط السالب.',
    sparkyTipAr: 'هذا الزر يتحكم فيه اللاعب الأول! عند ضغطه يرسل إشارة LOW عبر مقاومة الشد الداخلية INPUT_PULLUP.'
  },
  {
    step: 4,
    titleAr: 'تركيب زر اللاعب الثاني الأخضر (D3)',
    componentAr: 'زر اللاعب 2 (أخضر)',
    wireColor: 'أخضر (Green) للإشارة + أسود للأرضي',
    fromPin: 'Arduino Pin D3',
    toLocation: 'طرف زر اللاعب 2، والطرف المقابل للأرضي GND',
    codeLine: 'const int P2_BTN = 3; // اللاعب الثاني\npinMode(P2_BTN, INPUT_PULLUP);',
    instructionAr: 'ثبّت الزر الأخضر الخاص باللاعب الثاني بجانب الزر الأزرق. وصّل سلكاً أخضر من المنفذ D3 إلى طرف الزر، وسلكاً أسود إلى خط السالب.',
    sparkyTipAr: 'الآن يتحدى لاعبان بعضهما! من يضغط بعد الإشارة أولاً يفوز، والأخير يخسر — ومن يتسرع قبل الإشارة يخسر فوراً!'
  },
  {
    step: 5,
    titleAr: 'تركيب الجرس الصوتي (Piezo Buzzer - D9)',
    componentAr: 'جرس بيزو إلكتروني',
    wireColor: 'أصفر (Yellow) للإشارة + أسود للأرضي',
    fromPin: 'Arduino Pin D9',
    toLocation: 'الطرف الموجب (+) للجرس، والسالب للأرضي',
    codeLine: 'const int BUZZER_PIN = 9;\npinMode(BUZZER_PIN, OUTPUT);',
    instructionAr: 'ثبّت الجرس على لوحة التجارب. وصّل سلكاً أصفر من المنفذ D9 إلى الطرف الموجب (+) للجرس، وسلكاً أسود من الطرف الآخر إلى خط السالب.',
    sparkyTipAr: 'الجرس يصدر نغمة بداية السباق، وصوت إنذار عند تسرّع أحد اللاعبين، ونغمة الفوز للفائز!'
  },
  {
    step: 6,
    titleAr: 'الدارة مكتملة وجاهزة للتحدّي الثنائي (1 ضد 1)!',
    componentAr: 'منظومة التحدّي الثنائي الكاملة',
    wireColor: 'جميع الأسلاك متصلة',
    fromPin: 'D2, D3, D8, D9, GND',
    toLocation: 'جميع المكونات تعمل بانسجام',
    codeLine: '// ملخص منافذ الكود الكامل:\n// D2=P1_BTN | D3=P2_BTN | D8=LED | D9=BUZZER',
    instructionAr: 'رائع جداً! تم تركيب جميع مكونات لعبة التحدّي الثنائي. اضغطا زر بدء السباق بالأسفل، وانتظرا الضوء الأحمر ثم تسابقا!',
    sparkyTipAr: 'الأسرع بعد الضوء يفوز والأبطأ يخسر! انتبها: من يضغط قبل أن تشتعل اللمبة يخسر فوراً بالانطلاق المبكر!'
  }
];

export const CircuitPlayground3D: React.FC<CircuitPlayground3DProps> = ({ lessonWeek }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Active Project & Assembly Step
  const [activeProject, setActiveProject] = useState<CircuitProjectId>(() => getProjectFromWeek(lessonWeek));
  const [currentStep, setCurrentStep] = useState<number>(6); // Default: show full assembled circuit
  const [isRotatingAuto, setIsRotatingAuto] = useState<boolean>(false);

  useEffect(() => {
    setActiveProject(getProjectFromWeek(lessonWeek));
  }, [lessonWeek]);

  // Interactive Live 2-Player Duel States (Week 1 Reaction Duel)
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'false_start'>('idle');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [winnerPlayer, setWinnerPlayer] = useState<1 | 2 | null>(null);
  const [loserPlayer, setLoserPlayer] = useState<1 | 2 | null>(null);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [gameMessage, setGameMessage] = useState<string>('اضغط "ابدأ السباق" — من يضغط أولاً بعد الإشارة يفوز والأبطأ يخسر!');
  const [isLedLit, setIsLedLit] = useState<boolean>(false);

  // Other Projects Interactive States
  const [distanceCm, setDistanceCm] = useState<number>(45);
  const [servoAngleDeg, setServoAngleDeg] = useState<number>(90);
  const [motorSpeedPwm, setMotorSpeedPwm] = useState<number>(180);

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const circuitGroupRef = useRef<THREE.Group | null>(null);

  // Interactive 3D Mesh Refs
  const ledBulbMeshRef = useRef<THREE.Mesh | null>(null);
  const ledPointLightRef = useRef<THREE.PointLight | null>(null);
  const startBtnCapRef = useRef<THREE.Mesh | null>(null);
  const reactionBtnCapRef = useRef<THREE.Mesh | null>(null);
  const buzzerMeshRef = useRef<THREE.Mesh | null>(null);
  const servoArmRef = useRef<THREE.Group | null>(null);
  const fanPropellerRef = useRef<THREE.Mesh | null>(null);
  const obstacleMeshRef = useRef<THREE.Mesh | null>(null);

  // Timing & Live State Refs (for accurate keyboard & callback handling)
  const waitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signalStartTimeRef = useRef<number>(0);
  const gameStateRef = useRef<'idle' | 'waiting' | 'ready' | 'result' | 'false_start'>('idle');
  gameStateRef.current = gameState;

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    };
  }, []);

  // Update 3D LED Glow Visuals
  const set3DLedState = useCallback((isOn: boolean) => {
    setIsLedLit(isOn);
    if (ledBulbMeshRef.current && ledPointLightRef.current) {
      const mat = ledBulbMeshRef.current.material as THREE.MeshStandardMaterial;
      if (isOn) {
        mat.color.setHex(0xef4444);
        mat.emissive.setHex(0xff2222);
        mat.emissiveIntensity = 2.5;
        ledPointLightRef.current.intensity = 3.0;
      } else {
        mat.color.setHex(0x551111);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        ledPointLightRef.current.intensity = 0;
      }
    }
  }, []);

  // Animate 3D Button Press
  const animateButtonDepress = useCallback((btnRef: React.MutableRefObject<THREE.Mesh | null>) => {
    if (btnRef.current) {
      btnRef.current.position.y = 0.42;
      setTimeout(() => {
        if (btnRef.current) btnRef.current.position.y = 0.58;
      }, 160);
    }
  }, []);

  // Start 2-Player Duel Round
  const handleStartDuel = useCallback(() => {
    if (gameStateRef.current === 'waiting' || gameStateRef.current === 'ready') return;

    soundFx.playClick();
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    set3DLedState(false);
    setReactionTimeMs(null);
    setWinnerPlayer(null);
    setLoserPlayer(null);

    gameStateRef.current = 'waiting';
    setGameState('waiting');
    setGameMessage('استعدا! انتظروا إشارة المصباح الأحمر... من يضغط قبله يخسر!');
    soundFx.playTone(440, 80, 'square');

    const randomDelay = Math.floor(Math.random() * 2200) + 1600;
    waitTimeoutRef.current = setTimeout(() => {
      set3DLedState(true);
      signalStartTimeRef.current = performance.now();
      gameStateRef.current = 'ready';
      setGameState('ready');
      setGameMessage('⚡ انطلاق! اضغط زرّك بأقصى سرعة — الأخير يخسر!');
      soundFx.playStartSignal();
    }, randomDelay);
  }, [set3DLedState]);

  // Handle Player 1 (Blue D2) or Player 2 (Green D3) Press
  const handlePlayerPress = useCallback(
    (player: 1 | 2) => {
      const btnRef = player === 1 ? startBtnCapRef : reactionBtnCapRef;
      const otherPlayer: 1 | 2 = player === 1 ? 2 : 1;
      const playerName = player === 1 ? 'اللاعب 1 (الأزرق)' : 'اللاعب 2 (الأخضر)';
      const otherName = otherPlayer === 1 ? 'اللاعب 1 (الأزرق)' : 'اللاعب 2 (الأخضر)';

      soundFx.playClick();
      animateButtonDepress(btnRef);

      const currentStatus = gameStateRef.current;

      if (currentStatus === 'waiting') {
        // Pressed BEFORE signal -> This player loses immediately by False Start!
        if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
        set3DLedState(false);
        gameStateRef.current = 'false_start';
        setGameState('false_start');
        setLoserPlayer(player);
        setWinnerPlayer(otherPlayer);
        if (otherPlayer === 1) {
          setP1Score((s) => s + 1);
        } else {
          setP2Score((s) => s + 1);
        }
        setGameMessage(`❌ تسرّع ${playerName} قبل الإشارة وخسر الجولة! 🏆 الفائز: ${otherName}`);
        soundFx.playFalseStartBuzz();
        return;
      }

      if (currentStatus === 'ready') {
        // First valid press after LED lit -> Wins! Other player (last) loses!
        const elapsed = Math.round(performance.now() - signalStartTimeRef.current);
        set3DLedState(false);
        gameStateRef.current = 'result';
        setGameState('result');
        setReactionTimeMs(elapsed);
        setWinnerPlayer(player);
        setLoserPlayer(otherPlayer);

        if (player === 1) {
          setP1Score((s) => s + 1);
        } else {
          setP2Score((s) => s + 1);
        }

        setGameMessage(`🏆 فاز ${playerName} بسرعة ${elapsed} ms! وخسر ${otherName} (الأبطأ)`);
        soundFx.playVictoryFanfare();
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.7 },
        });
      }
    },
    [animateButtonDepress, set3DLedState]
  );

  // Desktop keyboard shortcuts for 2-player duel: A = Player 1, L = Player 2, Space = Start
  useEffect(() => {
    if (activeProject !== 'reaction') return;

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
        if (gameStateRef.current !== 'waiting' && gameStateRef.current !== 'ready') {
          e.preventDefault();
          handleStartDuel();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject, handlePlayerPress, handleStartDuel]);

  const handleResetScores = () => {
    soundFx.playClick();
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    set3DLedState(false);
    gameStateRef.current = 'idle';
    setGameState('idle');
    setP1Score(0);
    setP2Score(0);
    setWinnerPlayer(null);
    setLoserPlayer(null);
    setReactionTimeMs(null);
    setGameMessage('تم تصفير النتيجة! اضغطا "ابدأ السباق" لجولة جديدة');
  };

  // Reset Camera View
  const resetCamera = () => {
    soundFx.playClick();
    setIsRotatingAuto(false);
    const container = mountRef.current;
    const isNarrow = container ? container.clientWidth < 520 : false;
    if (cameraRef.current && circuitGroupRef.current) {
      cameraRef.current.position.set(0, isNarrow ? 16 : 13, isNarrow ? 14 : 11);
      cameraRef.current.lookAt(0, 0, 0);
      circuitGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // Step Forward / Backward
  const handleNextStep = () => {
    if (currentStep < REACTION_ASSEMBLY_STEPS.length - 1) {
      soundFx.playClick();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      soundFx.playClick();
      setCurrentStep(currentStep - 1);
    }
  };

  // Select Step Directly
  const handleSelectStep = (s: number) => {
    soundFx.playClick();
    setCurrentStep(s);
  };

  // Build 3D Scene whenever activeProject or currentStep changes
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions (safe fallback + mobile framing)
    const width = Math.max(container.clientWidth, 260);
    const height = Math.max(container.clientHeight, 260);
    const isNarrow = width < 520;

    // Initialize Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef6ff); // Bright studio sky backdrop
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(isNarrow ? 44 : 40, width / height, 0.1, 100);
    camera.position.set(0, isNarrow ? 16 : 13, isNarrow ? 14 : 11);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    sunLight.position.set(8, 16, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    // Root Group for interactive rotation
    const circuitGroup = new THREE.Group();
    circuitGroupRef.current = circuitGroup;
    scene.add(circuitGroup);

    // ================= 1. ANTISTATIC WORKBENCH MAT =================
    const matGeo = new THREE.BoxGeometry(22, 0.3, 16);
    const matMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.85 });
    const workMat = new THREE.Mesh(matGeo, matMat);
    workMat.position.y = -0.16;
    workMat.receiveShadow = true;
    circuitGroup.add(workMat);

    // Helper: Wire Tube Creator
    const createCurvedWire = (points: THREE.Vector3[], color: number) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35 });
      const wireMesh = new THREE.Mesh(tubeGeo, tubeMat);
      wireMesh.castShadow = true;
      circuitGroup.add(wireMesh);
      return wireMesh;
    };

    // Shared Materials
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.25 });
    const plasticBlackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });

    // ================= 2. ARDUINO UNO BOARD (LEFT SIDE) =================
    const arduino = new THREE.Group();
    arduino.position.set(-5.5, 0.12, 0);
    circuitGroup.add(arduino);

    // Teal PCB
    const pcbGeo = new THREE.BoxGeometry(5.6, 0.25, 8.2);
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.castShadow = true;
    pcb.receiveShadow = true;
    arduino.add(pcb);

    // ATmega328P DIP Chip
    const chipGeo = new THREE.BoxGeometry(1.4, 0.3, 4.0);
    const chip = new THREE.Mesh(chipGeo, plasticBlackMat);
    chip.position.set(0.2, 0.25, 0.6);
    chip.castShadow = true;
    arduino.add(chip);

    // Silver USB Type-B Port
    const usb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), metalMat);
    usb.position.set(-1.6, 0.6, -3.4);
    arduino.add(usb);

    // Black DC Power Barrel Jack
    const powerJack = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.8), plasticBlackMat);
    powerJack.position.set(1.5, 0.6, -3.3);
    arduino.add(powerJack);

    // Digital Female Headers (Pins D0-D13)
    const digHeader = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 5.0), plasticBlackMat);
    digHeader.position.set(2.3, 0.35, -0.6);
    arduino.add(digHeader);

    // Analog & Power Female Headers
    const pwrHeader = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 4.6), plasticBlackMat);
    pwrHeader.position.set(-2.3, 0.35, 1.0);
    arduino.add(pwrHeader);

    // Built-in LED L (Pin 13 indicator)
    const led13 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.3), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.0 }));
    led13.position.set(1.2, 0.2, -1.8);
    arduino.add(led13);

    // ================= 3. BREADBOARD (RIGHT SIDE) =================
    const breadboard = new THREE.Group();
    breadboard.position.set(3.8, 0.25, 0);
    circuitGroup.add(breadboard);

    // Breadboard Body
    const bbGeo = new THREE.BoxGeometry(7.6, 0.5, 11.5);
    const bbMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const bbMesh = new THREE.Mesh(bbGeo, bbMat);
    bbMesh.castShadow = true;
    bbMesh.receiveShadow = true;
    breadboard.add(bbMesh);

    // Red & Blue Power Rails
    const lineMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const lineMatBlue = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    // Negative (Blue) & Positive (Red) lines on both edges
    const railLineGeo = new THREE.BoxGeometry(0.12, 0.02, 10.5);
    const lineL1 = new THREE.Mesh(railLineGeo, lineMatBlue);
    lineL1.position.set(-3.5, 0.26, 0);
    breadboard.add(lineL1);

    const lineL2 = new THREE.Mesh(railLineGeo, lineMatRed);
    lineL2.position.set(-3.25, 0.26, 0);
    breadboard.add(lineL2);

    const lineR1 = new THREE.Mesh(railLineGeo, lineMatRed);
    lineR1.position.set(3.25, 0.26, 0);
    breadboard.add(lineR1);

    const lineR2 = new THREE.Mesh(railLineGeo, lineMatBlue);
    lineR2.position.set(3.5, 0.26, 0);
    breadboard.add(lineR2);

    // Center Trench
    const trench = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 10.5), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
    trench.position.set(0, 0.22, 0);
    breadboard.add(trench);

    // Tie Holes Representation (grid dots)
    const holeGeo = new THREE.BoxGeometry(0.12, 0.05, 0.12);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    for (let x = -2.6; x <= 2.6; x += 0.55) {
      if (Math.abs(x) > 0.3) {
        for (let z = -4.8; z <= 4.8; z += 0.48) {
          const h = new THREE.Mesh(holeGeo, holeMat);
          h.position.set(x, 0.26, z);
          breadboard.add(h);
        }
      }
    }

    // =========================================================================
    // 4. CONDITIONAL WIRING ACCORDING TO PROJECT & STEP
    // =========================================================================

    if (activeProject === 'reaction') {
      // ----------------- WEEK 1: REACTION TIME CIRCUIT -----------------

      // STEP 1: Main GND Wire (Arduino GND -> Breadboard Negative Rail)
      if (currentStep >= 1) {
        // Black wire from Arduino GND (left side) to Breadboard negative line (x: 0.3, z: 0)
        createCurvedWire([
          new THREE.Vector3(-3.2, 0.7, 0.8), // Arduino GND header
          new THREE.Vector3(-1.0, 2.2, 0.4),
          new THREE.Vector3(0.3, 0.6, 0.0)   // Breadboard ground rail
        ], 0x1e293b);
      }

      // STEP 2: Red LED + 220Ω Resistor + D8 Wire
      if (currentStep >= 2) {
        // LED Group on Breadboard
        const ledGroup = new THREE.Group();
        ledGroup.position.set(2.4, 0.52, -2.5);
        circuitGroup.add(ledGroup);

        // LED Legs
        const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
        const leg1 = new THREE.Mesh(legGeo, metalMat);
        leg1.position.set(-0.15, 0.3, 0);
        ledGroup.add(leg1);

        const leg2 = new THREE.Mesh(legGeo, metalMat);
        leg2.position.set(0.15, 0.3, 0);
        ledGroup.add(leg2);

        // Bulb Capsule
        const bulbGeo = new THREE.SphereGeometry(0.45, 24, 24);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: isLedLit ? 0xef4444 : 0x551111,
          emissive: isLedLit ? 0xff2222 : 0x000000,
          emissiveIntensity: isLedLit ? 2.5 : 0,
          roughness: 0.2,
          transparent: true,
          opacity: 0.95
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(0, 0.85, 0);
        bulb.scale.set(1, 1.4, 1);
        ledGroup.add(bulb);
        ledBulbMeshRef.current = bulb;

        // PointLight
        const light = new THREE.PointLight(0xef4444, isLedLit ? 3.0 : 0, 6);
        light.position.set(0, 1.2, 0);
        ledGroup.add(light);
        ledPointLightRef.current = light;

        // 220Ω Resistor (Cylinder with color stripes)
        const resistor = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.1, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }));
        resistor.rotation.x = Math.PI / 2;
        resistor.position.set(1.4, 0.65, -2.5);
        circuitGroup.add(resistor);

        // Resistor lead wire to GND rail
        createCurvedWire([
          new THREE.Vector3(1.4, 0.6, -3.1),
          new THREE.Vector3(0.9, 0.9, -3.1),
          new THREE.Vector3(0.3, 0.6, -3.1)
        ], 0x1e293b);

        // Red Wire: Arduino D8 -> LED Anode (+)
        createCurvedWire([
          new THREE.Vector3(-3.2, 0.7, -2.4), // Arduino Pin D8
          new THREE.Vector3(-0.6, 2.6, -2.5),
          new THREE.Vector3(2.4, 0.7, -2.5)   // LED Anode
        ], 0xef4444);
      }

      // STEP 3: Start Button (D2) + Blue Wire + GND Wire
      if (currentStep >= 3) {
        const startBtnGroup = new THREE.Group();
        startBtnGroup.position.set(4.8, 0.52, 1.2);
        circuitGroup.add(startBtnGroup);

        // Tactile switch base
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), plasticBlackMat);
        body.position.y = 0.2;
        startBtnGroup.add(body);

        // Blue Button Cap
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 20), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 }));
        cap.position.y = 0.58;
        startBtnGroup.add(cap);
        startBtnCapRef.current = cap;

        // Wire: Arduino Pin D2 -> Start Button Leg (Blue Wire)
        createCurvedWire([
          new THREE.Vector3(-3.2, 0.7, 0.4),  // Arduino Pin D2
          new THREE.Vector3(0.5, 2.5, 1.0),
          new THREE.Vector3(4.8, 0.7, 0.6)   // Button Leg 1
        ], 0x2563eb);

        // Wire: Start Button Leg 2 -> GND Rail (Black Wire)
        createCurvedWire([
          new THREE.Vector3(4.8, 0.6, 1.8),
          new THREE.Vector3(2.5, 1.0, 1.8),
          new THREE.Vector3(0.3, 0.6, 1.8)
        ], 0x1e293b);
      }

      // STEP 4: Reaction Button (D3) + Green Wire + GND Wire
      if (currentStep >= 4) {
        const reactBtnGroup = new THREE.Group();
        reactBtnGroup.position.set(4.8, 0.52, 3.6);
        circuitGroup.add(reactBtnGroup);

        // Base
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), plasticBlackMat);
        body.position.y = 0.2;
        reactBtnGroup.add(body);

        // Green Button Cap
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 20), new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 }));
        cap.position.y = 0.58;
        reactBtnGroup.add(cap);
        reactionBtnCapRef.current = cap;

        // Wire: Arduino Pin D3 -> Reaction Button Leg (Green Wire)
        createCurvedWire([
          new THREE.Vector3(-3.2, 0.7, 0.1),  // Arduino Pin D3
          new THREE.Vector3(0.8, 2.6, 2.4),
          new THREE.Vector3(4.8, 0.7, 3.0)   // Button Leg 1
        ], 0x16a34a);

        // Wire: Reaction Button Leg 2 -> GND Rail (Black Wire)
        createCurvedWire([
          new THREE.Vector3(4.8, 0.6, 4.2),
          new THREE.Vector3(2.5, 1.1, 4.2),
          new THREE.Vector3(0.3, 0.6, 4.2)
        ], 0x1e293b);
      }

      // STEP 5: Piezo Buzzer (D9) + Yellow Wire + GND Wire
      if (currentStep >= 5) {
        const buzzerGroup = new THREE.Group();
        buzzerGroup.position.set(4.8, 0.52, -2.5);
        circuitGroup.add(buzzerGroup);

        // Cylindrical Buzzer Body
        const bGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.9, 24);
        const bMesh = new THREE.Mesh(bGeo, plasticBlackMat);
        bMesh.position.y = 0.45;
        buzzerGroup.add(bMesh);
        buzzerMeshRef.current = bMesh;

        // Sound Hole in Center
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), metalMat);
        hole.position.y = 0.92;
        buzzerGroup.add(hole);

        // Yellow Wire: Arduino Pin D9 -> Buzzer Positive Leg (+)
        createCurvedWire([
          new THREE.Vector3(-3.2, 0.7, -2.1), // Arduino Pin D9
          new THREE.Vector3(0.6, 2.8, -2.5),
          new THREE.Vector3(4.4, 0.7, -2.5)   // Buzzer (+)
        ], 0xeab308);

        // Black Wire: Buzzer Negative Leg (-) -> GND Rail
        createCurvedWire([
          new THREE.Vector3(5.2, 0.6, -2.5),
          new THREE.Vector3(2.8, 1.2, -1.8),
          new THREE.Vector3(0.3, 0.6, -1.8)
        ], 0x1e293b);
      }
    } else if (activeProject === 'ultrasonic') {
      // ----------------- WEEK 12: ULTRASONIC RADAR CIRCUIT -----------------
      // Breadboard ground wire
      createCurvedWire([new THREE.Vector3(-3.2, 0.7, 0.8), new THREE.Vector3(-1.0, 2.0, 0.4), new THREE.Vector3(0.3, 0.6, 0.0)], 0x1e293b);
      // 5V power wire
      createCurvedWire([new THREE.Vector3(-7.8, 0.7, 1.2), new THREE.Vector3(-4.0, 2.6, 2.0), new THREE.Vector3(0.55, 0.6, 2.0)], 0xef4444);

      // HC-SR04 Sensor on Breadboard
      const usGroup = new THREE.Group();
      usGroup.position.set(3.8, 0.52, 2.0);
      circuitGroup.add(usGroup);

      const usPcb = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.2), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      usPcb.position.y = 0.8;
      usGroup.add(usPcb);

      const barrelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.8, 20);
      const bL = new THREE.Mesh(barrelGeo, metalMat);
      bL.rotation.x = Math.PI / 2;
      bL.position.set(-0.8, 0.8, 0.4);
      usGroup.add(bL);

      const bR = new THREE.Mesh(barrelGeo, metalMat);
      bR.rotation.x = Math.PI / 2;
      bR.position.set(0.8, 0.8, 0.4);
      usGroup.add(bR);

      // Ultrasonic Jumper Wires (Trig D11 Orange, Echo D12 Blue)
      createCurvedWire([new THREE.Vector3(-3.2, 0.7, -1.5), new THREE.Vector3(0.0, 2.2, 0.5), new THREE.Vector3(3.2, 0.7, 1.8)], 0xf97316);
      createCurvedWire([new THREE.Vector3(-3.2, 0.7, -1.2), new THREE.Vector3(0.2, 2.4, 1.0), new THREE.Vector3(4.4, 0.7, 1.8)], 0x3b82f6);

      // Obstacle Mesh in front of sensor
      const obstacle = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 0.3), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }));
      obstacle.position.set(3.8, 0.9, 4.0 + (distanceCm / 150) * 4.0);
      circuitGroup.add(obstacle);
      obstacleMeshRef.current = obstacle;
    } else if (activeProject === 'servo') {
      // ----------------- WEEK 13: SERVO BARRIER CIRCUIT -----------------
      // Breadboard GND & 5V
      createCurvedWire([new THREE.Vector3(-3.2, 0.7, 0.8), new THREE.Vector3(-1.0, 2.0, 0.4), new THREE.Vector3(0.3, 0.6, 0.0)], 0x1e293b);
      createCurvedWire([new THREE.Vector3(-7.8, 0.7, 1.2), new THREE.Vector3(-4.0, 2.6, 2.0), new THREE.Vector3(0.55, 0.6, 2.0)], 0xef4444);

      // SG90 Micro Servo Motor
      const servoGroup = new THREE.Group();
      servoGroup.position.set(4.0, 0.2, 0);
      circuitGroup.add(servoGroup);

      const servoBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.0), new THREE.MeshStandardMaterial({ color: 0x2563eb, transparent: true, opacity: 0.9 }));
      servoBody.position.y = 1.1;
      servoGroup.add(servoBody);

      // Rotating Horn Arm
      const armGroup = new THREE.Group();
      armGroup.position.set(0, 2.3, 0);
      armGroup.rotation.y = ((servoAngleDeg - 90) * Math.PI) / 180;
      servoGroup.add(armGroup);
      servoArmRef.current = armGroup;

      const armHorn = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 3.2), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      armHorn.position.z = 1.2;
      armGroup.add(armHorn);

      // Signal Wire from D9 to Servo (Orange)
      createCurvedWire([new THREE.Vector3(-3.2, 0.7, -2.1), new THREE.Vector3(0.4, 2.6, -1.0), new THREE.Vector3(3.2, 0.7, 0.0)], 0xf97316);
    } else if (activeProject === 'motor') {
      // ----------------- WEEK 14: DC MOTOR & PROPELLER CIRCUIT -----------------
      // Breadboard GND & 5V
      createCurvedWire([new THREE.Vector3(-3.2, 0.7, 0.8), new THREE.Vector3(-1.0, 2.0, 0.4), new THREE.Vector3(0.3, 0.6, 0.0)], 0x1e293b);
      createCurvedWire([new THREE.Vector3(-7.8, 0.7, 1.2), new THREE.Vector3(-4.0, 2.6, 2.0), new THREE.Vector3(0.55, 0.6, 2.0)], 0xef4444);

      // DC Motor Group
      const motorGroup = new THREE.Group();
      motorGroup.position.set(4.0, 0.2, 0);
      circuitGroup.add(motorGroup);

      const motorCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.2, 24), metalMat);
      motorCylinder.rotation.x = Math.PI / 2;
      motorCylinder.position.y = 1.0;
      motorGroup.add(motorCylinder);

      // Propeller Blades
      const fanGeo = new THREE.BoxGeometry(3.2, 0.15, 0.45);
      const fanMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
      const fanPropeller = new THREE.Mesh(fanGeo, fanMat);
      fanPropeller.position.set(0, 1.0, 1.3);
      motorGroup.add(fanPropeller);
      fanPropellerRef.current = fanPropeller;

      // PWM Control Wire from D6 (Green)
      createCurvedWire([new THREE.Vector3(-3.2, 0.7, -1.2), new THREE.Vector3(0.4, 2.6, -0.6), new THREE.Vector3(3.2, 0.7, 0.0)], 0x10b981);
    }

    // ================= INTERACTIVE ORBIT & DRAG (Mouse + Touch) =================
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const rotateSceneBy = (deltaX: number, deltaY: number) => {
      if (!circuitGroupRef.current) return;
      circuitGroupRef.current.rotation.y += deltaX * 0.007;
      circuitGroupRef.current.rotation.x += deltaY * 0.007;
      circuitGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.8, circuitGroupRef.current.rotation.x));
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsRotatingAuto(false);
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      rotateSceneBy(e.clientX - prevPointerX, e.clientY - prevPointerY);
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      setIsRotatingAuto(false);
      prevPointerX = e.touches[0].clientX;
      prevPointerY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      rotateSceneBy(e.touches[0].clientX - prevPointerX, e.touches[0].clientY - prevPointerY);
      prevPointerX = e.touches[0].clientX;
      prevPointerY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.y += e.deltaY * 0.006;
      cameraRef.current.position.y = Math.max(5, Math.min(22, cameraRef.current.position.y));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    domElement.addEventListener('touchend', onTouchEnd);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Spin DC motor propeller if active
      if (fanPropellerRef.current && activeProject === 'motor' && motorSpeedPwm > 0) {
        fanPropellerRef.current.rotation.z += (motorSpeedPwm / 255) * 28 * delta;
      }

      // Auto rotation if toggled
      if (isRotatingAuto && circuitGroupRef.current) {
        circuitGroupRef.current.rotation.y += 0.3 * delta;
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = Math.max(container.clientWidth, 260);
      const h = Math.max(container.clientHeight, 260);
      cameraRef.current.fov = w < 520 ? 44 : 40;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', onResize);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (resizeObserver) {
      resizeObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(animationId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [activeProject, currentStep, isLedLit, motorSpeedPwm, isRotatingAuto]);

  // Update Servo or Distance in other presets
  const handleDistanceChange = (val: number) => {
    setDistanceCm(val);
    if (obstacleMeshRef.current) {
      obstacleMeshRef.current.position.z = 4.0 + (val / 150) * 4.0;
    }
    soundFx.playTone(800 + (150 - val) * 8, 40, 'triangle');
  };

  const handleServoChange = (val: number) => {
    setServoAngleDeg(val);
    if (servoArmRef.current) {
      servoArmRef.current.rotation.y = ((val - 90) * Math.PI) / 180;
    }
    soundFx.playTone(400 + val * 2, 30, 'sine');
  };

  const handleMotorSpeedChange = (val: number) => {
    setMotorSpeedPwm(val);
    soundFx.playTone(200 + val, 30, 'sawtooth');
  };

  const activeStepDetail = REACTION_ASSEMBLY_STEPS[currentStep] || REACTION_ASSEMBLY_STEPS[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-3.5 sm:p-5 md:p-7 space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <Move3d className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800">ركّب وجرّب الدارة ثلاثية الأبعاد ⚡</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              حرّك الدارة بإصبعك أو بالفأرة وجرّب الأزرار مباشرة
            </p>
          </div>
        </div>

        {/* Simple Assembly Mode Toggle (Step-by-step vs Complete) for Reaction Project */}
        {activeProject === 'reaction' && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 p-1.5 rounded-2xl border border-amber-200 w-full sm:w-auto">
            <button
              onClick={() => handleSelectStep(0)}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-black transition-all text-center ${
                currentStep < 6
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔧 ركّب خطوة بخطوة
            </button>
            <button
              onClick={() => handleSelectStep(6)}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-black transition-all text-center ${
                currentStep === 6
                  ? 'bg-[#FF5B5A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✨ الدارة جاهزة كاملة
            </button>
          </div>
        )}

        {/* Only show project switcher if NOT inside a specific lesson */}
        {lessonWeek === undefined && (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveProject('reaction');
                setCurrentStep(6);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeProject === 'reaction'
                  ? 'bg-[#FF5B5A] text-white shadow-coral-glow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏎️ سرعة الاستجابة
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveProject('ultrasonic');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeProject === 'ultrasonic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🦇 حساس المسافة
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveProject('servo');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeProject === 'servo'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🅿️ محرك السيرفو
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveProject('motor');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeProject === 'motor'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌀 محرك المروحة
            </button>
          </div>
        )}
      </div>

      {/* Clean Progress Indicator when in Step-by-Step mode */}
      {activeProject === 'reaction' && currentStep < 6 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shrink-0">
              الخطوة {currentStep} من 6
            </span>
            <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden border border-amber-200">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(10, Math.round((currentStep / 6) * 100))}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-bold text-amber-900">{activeStepDetail.titleAr}</span>
        </div>
      )}

      {/* Main Grid: 3D Viewport + Assembly Guidance & Hardware Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Left: 3D Viewport Stage + Below-Canvas Interactive Controls */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-50 to-indigo-50/70 border border-sky-200 flex flex-col justify-between p-2.5 sm:p-4 gap-2.5 sm:gap-3 shadow-inner">
          {/* Dedicated 3D Canvas Wrapper (Never covered by bottom buttons!) */}
          <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] w-full rounded-2xl overflow-hidden bg-[#EEF6FF] border border-sky-200/80">
            {/* Top HUD */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-2 pointer-events-none">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-2xl border border-slate-200 text-[11px] sm:text-xs text-slate-800 font-bold shadow-sm max-w-full">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span className="truncate">
                  {activeProject === 'reaction'
                    ? activeStepDetail.titleAr
                    : 'مختبر تفاعلي حي'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => setIsRotatingAuto(!isRotatingAuto)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors border shadow-sm ${
                    isRotatingAuto ? 'bg-amber-400 border-amber-500 text-slate-950' : 'bg-white/95 border-slate-200 text-slate-700 hover:bg-sky-50'
                  }`}
                >
                  {isRotatingAuto ? 'إيقاف ⏸' : 'تدوير ▶'}
                </button>

                <button
                  onClick={resetCamera}
                  className="p-2 rounded-xl bg-white/95 hover:bg-sky-50 border border-slate-200 text-slate-700 shadow-sm transition-colors"
                  title="إعادة ضبط الكاميرا"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Three.js Canvas Container */}
            <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none" />
          </div>

          {/* Bottom Live Hardware Playground Bar */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 sm:space-y-3">
            {activeProject === 'reaction' ? (
              <div className="space-y-2.5 sm:space-y-3">
                {/* Duel Scoreboard & LED Status */}
                <div className="flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-amber-700 font-black">
                      <Trophy className="w-4 h-4 shrink-0 text-amber-500" />
                      <span>تحدّي الأسرع (1 ضد 1):</span>
                    </span>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                      <span className="text-blue-700 font-black">الأزرق: {p1Score}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-black">الأخضر: {p2Score}</span>
                      {(p1Score > 0 || p2Score > 0) && (
                        <button
                          onClick={handleResetScores}
                          className="mr-1 text-slate-400 hover:text-slate-700 transition-colors"
                          title="تصفير النقاط"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold border ${
                      isLedLit
                        ? 'bg-rose-600 border-rose-700 text-white shadow-[0_0_15px_#EF4444]'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isLedLit ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
                      <span>اللمبة: {isLedLit ? 'مشتعلة!' : 'مطفأة'}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-black border ${
                      gameState === 'ready'
                        ? 'bg-rose-500 border-rose-600 text-white animate-pulse'
                        : gameState === 'waiting'
                        ? 'bg-amber-400 border-amber-500 text-slate-950'
                        : gameState === 'false_start'
                        ? 'bg-rose-100 border-rose-300 text-rose-800'
                        : gameState === 'result'
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {gameState === 'ready'
                        ? '⚡ الضوء اشتعل! اضغطوا!'
                        : gameState === 'waiting'
                        ? '⏳ ترقبوا اللمبة الحمراء...'
                        : gameState === 'false_start'
                        ? `⚠️ خسر اللاعب ${loserPlayer} (تسرّع!)`
                        : gameState === 'result'
                        ? `🏆 فاز اللاعب ${winnerPlayer} (${reactionTimeMs} ms)`
                        : 'جاهز للسباق!'}
                    </span>
                  </div>
                </div>

                {/* Status Message */}
                <p className="text-[11px] sm:text-xs text-slate-800 bg-sky-50/90 p-2 sm:p-2.5 rounded-xl border border-sky-200 font-bold text-center">
                  {gameMessage}
                </p>

                {/* Helpful shortcut if browsing an intermediate assembly step */}
                {currentStep < 6 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                    <span className="font-bold">
                      🔧 أنت تستعرض الآن مرحلة التركيب ({currentStep} من 6)
                    </span>
                    <button
                      onClick={() => handleSelectStep(6)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-colors"
                    >
                      أكمل كل الأسلاك الآن ✨
                    </button>
                  </div>
                )}

                {/* Start Round Bar */}
                <button
                  onClick={handleStartDuel}
                  disabled={gameState === 'waiting' || gameState === 'ready'}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all min-h-[42px] ${
                    gameState === 'waiting' || gameState === 'ready'
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-98'
                  }`}
                >
                  {gameState === 'waiting' ? (
                    <span>⏳ استعدا... لا يضغط أحد قبل اللمبة الحمراء!</span>
                  ) : gameState === 'ready' ? (
                    <span>🚨 السباق جارٍ الآن! أسرع زر يفوز والأخير يخسر!</span>
                  ) : (
                    <>
                      <Flag className="w-4 h-4 shrink-0" />
                      <span>
                        {gameState === 'idle' ? '🏁 ابدأ السباق! (1 ضد 1)' : '🔁 ابدأ جولة جديدة (مسافة Space)'}
                      </span>
                    </>
                  )}
                </button>

                {/* Two Player Hardware Interactive Buttons */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    onClick={() => handlePlayerPress(1)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 min-h-[50px] ${
                      winnerPlayer === 1
                        ? 'bg-blue-500 text-white ring-4 ring-amber-400'
                        : loserPlayer === 1
                        ? 'bg-slate-100 text-slate-500 border-2 border-rose-300'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <span>اللاعب 1 (الأزرق - D2)</span>
                    <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] rounded bg-white/20 font-mono">A</kbd>
                  </button>

                  <button
                    onClick={() => handlePlayerPress(2)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 min-h-[50px] ${
                      winnerPlayer === 2
                        ? 'bg-emerald-500 text-white ring-4 ring-amber-400'
                        : loserPlayer === 2
                        ? 'bg-slate-100 text-slate-500 border-2 border-rose-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>اللاعب 2 (الأخضر - D3)</span>
                    <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] rounded bg-white/20 font-mono">L</kbd>
                  </button>
                </div>
              </div>
            ) : activeProject === 'ultrasonic' ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                <span className="text-xs font-bold text-slate-700">
                  مسافة العائق أمام الحساس: <span className="text-amber-700 font-mono font-black">{distanceCm} سم</span>
                </span>
                <input
                  type="range"
                  min={5}
                  max={150}
                  value={distanceCm}
                  onChange={(e) => handleDistanceChange(Number(e.target.value))}
                  className="w-full sm:flex-1 accent-amber-500 cursor-pointer h-2"
                />
              </div>
            ) : activeProject === 'servo' ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                <span className="text-xs font-bold text-slate-700">
                  زاوية دوران السيرفو: <span className="text-purple-700 font-mono font-black">{servoAngleDeg}°</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={180}
                  value={servoAngleDeg}
                  onChange={(e) => handleServoChange(Number(e.target.value))}
                  className="w-full sm:flex-1 accent-purple-500 cursor-pointer h-2"
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
                <span className="text-xs font-bold text-slate-700">
                  سرعة مروحة المحرك (PWM): <span className="text-emerald-700 font-mono font-black">{motorSpeedPwm} / 255</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={motorSpeedPwm}
                  onChange={(e) => handleMotorSpeedChange(Number(e.target.value))}
                  className="w-full sm:flex-1 accent-emerald-500 cursor-pointer h-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Assembly Guide & Wiring Inspector */}
        <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-4 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2.5">
                <CharacterAvatar character="sparky" size="sm" />
                <div>
                  <span className="text-xs text-amber-700 font-bold block">المهندس سباركي</span>
                  <h4 className="font-black text-slate-900 text-base">خطوات تركيب مشروعك</h4>
                </div>
              </div>
              {activeProject === 'reaction' && (
                <SpeakButton
                  text={`${activeStepDetail.titleAr}. ${activeStepDetail.instructionAr}. ${activeStepDetail.sparkyTipAr}`}
                  labelAr="اسمع الشرح"
                />
              )}
            </div>

            {/* Current Step Wiring Details */}
            {activeProject === 'reaction' ? (
              <div className="space-y-3">
                {/* Clickable Step Navigator Chips (0..6) */}
                <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-2xl border border-slate-200">
                  <span className="text-[11px] font-black text-slate-500 ml-1">المراحل:</span>
                  {REACTION_ASSEMBLY_STEPS.map((s) => (
                    <button
                      key={s.step}
                      onClick={() => handleSelectStep(s.step)}
                      title={s.titleAr}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                        currentStep === s.step
                          ? 'bg-[#FF5B5A] text-white shadow-sm'
                          : s.step < currentStep
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s.step === 6 ? 'الكل ✓' : `${s.step}`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                    {activeStepDetail.componentAr}
                  </span>
                  <span className="text-xs font-black text-slate-500">
                    خطوة {currentStep} / 6
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{activeStepDetail.titleAr}</h3>

                {/* Simple Wiring Summary */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">نوصلها من:</span>
                    <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {activeStepDetail.fromPin}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">إلى مكانها:</span>
                    <span className="font-bold text-slate-800 text-[11px] text-left">
                      {activeStepDetail.toLocation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <span className="text-slate-500 font-bold">لون السلك:</span>
                    <span className="font-black text-slate-900">{activeStepDetail.wireColor}</span>
                  </div>
                </div>

                {/* Matching Arduino Code Line for This Step */}
                <div className="rounded-2xl bg-white border-2 border-indigo-100 p-3 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
                    <Code2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>السطر المقابل في كود الآردوينو:</span>
                  </div>
                  <pre
                    className="font-mono text-[11px] sm:text-xs text-slate-900 font-semibold leading-relaxed whitespace-pre-wrap select-text bg-slate-50 p-2 rounded-xl border border-slate-200/80"
                    dir="ltr"
                  >
                    {activeStepDetail.codeLine}
                  </pre>
                </div>

                {/* Step Instructions */}
                <div className="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200">
                  {activeStepDetail.instructionAr}
                </div>

                {/* Sparky Tip */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>تلميح سباركي:</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-900">{activeStepDetail.sparkyTipAr}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-black text-slate-900 text-sm">كيف يعمل هذا المشروع؟</h4>
                  <SpeakButton
                    text={
                      activeProject === 'ultrasonic'
                        ? 'يرسل حساس المسافة موجات صوتية لا نراها ويحسب الوقت حتى ترتد ليعرف المسافة بالسنتيمتر.'
                        : activeProject === 'servo'
                        ? 'يتحكم الآردوينو في ذراع المحرك الدوار لتتحرك إلى الزاوية التي نختارها من صفر إلى مئة وثمانين درجة.'
                        : 'يرسل الآردوينو طاقة متدرجة لتشغيل المروحة أو العجلة بسرعة خفيفة أو سريعة.'
                    }
                    labelAr="اسمع الشرح"
                  />
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {activeProject === 'ultrasonic'
                    ? 'يرسل الحساس موجات صوتية ثم يقيس متى تعود ليعرف المسافة بدقة!'
                    : activeProject === 'servo'
                    ? 'نرسل إشارة ذكية لذراع المحرك لتدور بالزاوية التي نحددها لها.'
                    : 'يتحكم الآردوينو في سرعة دوران المحرك خطوة بخطوة.'}
                </p>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                  <span className="font-bold block mb-1">التوصيلات الأساسية:</span>
                  <span className="font-mono text-xs">
                    {activeProject === 'ultrasonic'
                      ? 'Trig -> D11 | Echo -> D12 | 5V & GND'
                      : activeProject === 'servo'
                      ? 'Signal -> D9 | 5V & GND'
                      : 'PWM -> D6 | 5V & GND'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stepper Navigation Controls */}
          {activeProject === 'reaction' && (
            <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-200">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition-all min-h-[44px]"
              >
                <ChevronRight className="w-4 h-4 shrink-0" />
                <span>الخطوة السابقة</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStep === REACTION_ASSEMBLY_STEPS.length - 1}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FF5B5A] hover:bg-[#ff4645] disabled:opacity-40 text-white text-xs sm:text-sm font-black shadow-coral-glow transition-all min-h-[44px]"
              >
                <span>أضف القطعة التالية</span>
                <ChevronLeft className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
