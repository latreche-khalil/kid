import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Zap,
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Move3d,
  Layers,
  Volume2,
  Award,
  AlertTriangle,
  RotateCw,
  Eye
} from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../characters/CharacterAvatars';

export type CircuitProjectId = 'reaction' | 'ultrasonic' | 'servo' | 'motor';

interface AssemblyStep {
  step: number;
  titleAr: string;
  componentAr: string;
  wireColor: string;
  fromPin: string;
  toLocation: string;
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
    instructionAr: 'وصّل السلك الأحمر من المنفذ الرقمي D8 إلى الطرف الطويل للـ LED (المصعد Anode). وصّل الطرف القصير (المهبط Cathode) بمقاومة 220Ω متجهة إلى خط السالب.',
    sparkyTipAr: 'المقاومة تحمي الـ LED من الاحتراق! ألوان حلقاتها: أحمر - أحمر - بني - ذهبي.'
  },
  {
    step: 3,
    titleAr: 'تركيب زر البدء (Start Button - D2)',
    componentAr: 'زر ضاغط بلون أزرق',
    wireColor: 'أزرق (Blue) للإشارة + أسود للأرضي',
    fromPin: 'Arduino Pin D2',
    toLocation: 'طرف زر البدء، والطرف المقابل للأرضي GND',
    instructionAr: 'ثبّت زر البدء في منتصف لوحة التجارب. وصّل سلكاً أزرق من المنفذ D2 إلى طرف الزر، وسلكاً أسود من الطرف المقابل إلى خط السالب.',
    sparkyTipAr: 'في الكود سنفعّل INPUT_PULLUP، لذا لن نحتاج إلى مقاومة خارجية إضافية للزر!'
  },
  {
    step: 4,
    titleAr: 'تركيب زر سرعة الاستجابة (Reaction Button - D3)',
    componentAr: 'زر ضاغط بلون أخضر',
    wireColor: 'أخضر (Green) للإشارة + أسود للأرضي',
    fromPin: 'Arduino Pin D3',
    toLocation: 'طرف زر الاستجابة، والطرف المقابل للأرضي GND',
    instructionAr: 'ثبّت زر الاستجابة بجانب زر البدء. وصّل سلكاً أخضر من المنفذ D3 إلى طرف الزر، وسلكاً أسود من الطرف المقابل إلى خط السالب.',
    sparkyTipAr: 'هذا هو الزر الذي سيتحدى اللاعب سرعته بالضغط عليه فور إضاءة المصباح الأحمر!'
  },
  {
    step: 5,
    titleAr: 'تركيب الجرس الصوتي (Piezo Buzzer - D9)',
    componentAr: 'جرس بيزو إلكتروني',
    wireColor: 'أصفر (Yellow) للإشارة + أسود للأرضي',
    fromPin: 'Arduino Pin D9',
    toLocation: 'الطرف الموجب (+) للجرس، والسالب للأرضي',
    instructionAr: 'ثبّت الجرس على لوحة التجارب. وصّل سلكاً أصفر من المنفذ D9 إلى الطرف الموجب (+) للجرس، وسلكاً أسود من الطرف الآخر إلى خط السالب.',
    sparkyTipAr: 'الجرس يصدر نغمات عبر دالة tone(pin, frequency) لإعطاء إشارات صوتية مع المؤثرات الضوئية!'
  },
  {
    step: 6,
    titleAr: 'الدارة مكتملة وجاهزة للاختبار الحي!',
    componentAr: 'المنظومة الفيزيائية الكاملة',
    wireColor: 'جميع الأسلاك متصلة',
    fromPin: 'D2, D3, D8, D9, GND',
    toLocation: 'جميع المكونات تعمل بانسجام',
    instructionAr: 'رائع جداً! تم تركيب جميع مكونات لعبة سرعة الاستجابة حسب المخطط الهندسي. يمكنك الآن تجربة اللعبة حياً في الأسفل!',
    sparkyTipAr: 'اضغط على زر البدء، انتظر إشارة المصباح الأحمر العشوائية، ثم اضغط زر الاستجابة بأقصى سرعة!'
  }
];

export const CircuitPlayground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Active Project & Assembly Step
  const [activeProject, setActiveProject] = useState<CircuitProjectId>('reaction');
  const [currentStep, setCurrentStep] = useState<number>(6); // Default: show full assembled circuit
  const [isRotatingAuto, setIsRotatingAuto] = useState<boolean>(false);

  // Interactive Live Game States (for Reaction Game Circuit)
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'false_start'>('idle');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [gameMessage, setGameMessage] = useState<string>('اضغط على زر البدء الأزرق لبدء الاختبار');
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

  // Timing refs for live game
  const waitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signalStartTimeRef = useRef<number>(0);

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
  const animateButtonDepress = (btnRef: React.MutableRefObject<THREE.Mesh | null>) => {
    if (btnRef.current) {
      btnRef.current.position.y = 0.42; // Pressed down
      setTimeout(() => {
        if (btnRef.current) btnRef.current.position.y = 0.58; // Spring back
      }, 160);
    }
  };

  // LIVE HARDWARE GAME: Press Start Button (D2)
  const handlePressStartButton = () => {
    soundFx.playClick();
    animateButtonDepress(startBtnCapRef);

    // If currently waiting or result, reset
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    set3DLedState(false);
    setReactionTimeMs(null);

    // Enter waiting state
    setGameState('waiting');
    setGameMessage('انتبه! انتظر إشارة المصباح الأحمر... إياك والتسرع!');
    soundFx.playTone(440, 80, 'square'); // Start beep

    // Random delay between 1.5s and 3.5s
    const randomDelay = Math.floor(Math.random() * 2000) + 1500;
    waitTimeoutRef.current = setTimeout(() => {
      // Trigger Red LED and Buzzer
      set3DLedState(true);
      signalStartTimeRef.current = performance.now();
      setGameState('ready');
      setGameMessage('الآن! اضغط زر الاستجابة الأخضر بأقصى سرعة! ⚡');
      soundFx.playTone(880, 150, 'sawtooth'); // High buzzer signal
    }, randomDelay);
  };

  // LIVE HARDWARE GAME: Press Reaction Button (D3)
  const handlePressReactionButton = () => {
    soundFx.playClick();
    animateButtonDepress(reactionBtnCapRef);

    if (gameState === 'waiting') {
      // Pressed BEFORE the LED turned on -> False Start!
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
      set3DLedState(false);
      setGameState('false_start');
      setGameMessage('انطلاقة خاطئة مبكرة! لقد ضغطت الزر قبل أن يضيء المصباح.');
      soundFx.playFalseStartBuzz();
      return;
    }

    if (gameState === 'ready') {
      // Valid reaction! Calculate elapsed milliseconds
      const elapsed = Math.round(performance.now() - signalStartTimeRef.current);
      set3DLedState(false);
      setReactionTimeMs(elapsed);
      setGameState('result');

      if (elapsed < 200) {
        setGameMessage(`سرعة استجابة مذهلة (${elapsed} ms)! ردة فعلك أسرع من البرق ⚡`);
        soundFx.playVictoryFanfare();
      } else if (elapsed <= 340) {
        setGameMessage(`ممتاز جداً (${elapsed} ms)! استجابة احترافية ورائعة 🎯`);
        soundFx.playVictoryFanfare();
      } else {
        setGameMessage(`زمن استجابتك: ${elapsed} ms. تدرب أكثر لتتغلب على غليتش! 👍`);
        soundFx.playTone(600, 180, 'triangle');
      }
    }
  };

  // Reset Camera View
  const resetCamera = () => {
    soundFx.playClick();
    setIsRotatingAuto(false);
    if (cameraRef.current && circuitGroupRef.current) {
      cameraRef.current.position.set(0, 13, 11);
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

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // Initialize Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep slate
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 13, 11);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    const matMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
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

    // ================= INTERACTIVE ORBIT & DRAG =================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsRotatingAuto(false);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !circuitGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      circuitGroupRef.current.rotation.y += deltaX * 0.007;
      circuitGroupRef.current.rotation.x += deltaY * 0.007;
      circuitGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.8, circuitGroupRef.current.rotation.x));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
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
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

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
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Move3d className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-800">مختبر الدوائر حسب تركيب المشروع الفيزيائي</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                {activeProject === 'reaction' ? 'مشروع الأسبوع 1: سرعة الاستجابة' : 'مشروع فيزيائي متقدم'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              تجسيد ثلاثي الأبعاد مطابق تماماً لمخطط الدارة الواقعي، مع إمكانية التجميع خطوة بخطوة والتجربة الحية
            </p>
          </div>
        </div>

        {/* Project Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
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
            🏎️ دارة سرعة الاستجابة (W1)
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
            🦇 رادار المسافة (W12)
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
            🅿️ حاجز السيرفو (W13)
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
            🌀 محرك المروحة (W14)
          </button>
        </div>
      </div>

      {/* Assembly Progress Stepper (Only for Reaction Circuit) */}
      {activeProject === 'reaction' && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-black text-amber-900">
                مراحل التركيب الفيزيائي (خطوة بخطوة):
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectStep(6)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentStep === 6
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                ✨ عرض الدارة كاملة
              </button>
            </div>
          </div>

          {/* Stepper Dots Bar */}
          <div className="grid grid-cols-7 gap-1.5">
            {REACTION_ASSEMBLY_STEPS.map((step) => {
              const isDone = currentStep >= step.step;
              const isCurrent = currentStep === step.step;
              return (
                <button
                  key={step.step}
                  onClick={() => handleSelectStep(step.step)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold text-center transition-all flex flex-col items-center justify-center gap-0.5 border ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-sm'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-white/80 text-slate-400 border-slate-200'
                  }`}
                >
                  <span>{step.step === 0 ? 'البداية' : `خطوة ${step.step}`}</span>
                  <span className="text-[9px] opacity-80 truncate max-w-full px-1">
                    {step.step === 0 ? 'اللوحات' : step.componentAr.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: 3D Viewport + Assembly Guidance & Hardware Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3D Viewport Stage */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[520px] flex flex-col justify-between p-4 shadow-inner">
          {/* Top HUD */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                {activeProject === 'reaction'
                  ? `عرض تركيبي: ${activeStepDetail.titleAr}`
                  : 'مختبر تفاعلي حي'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotatingAuto(!isRotatingAuto)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  isRotatingAuto ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isRotatingAuto ? 'إيقاف الدوران ⏸' : 'دوران سينمائي ▶'}
              </button>

              <button
                onClick={resetCamera}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="إعادة ضبط الكاميرا"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Three.js Canvas Container */}
          <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Bottom Live Hardware Playground Bar */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-3">
            {activeProject === 'reaction' ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Zap className="w-4 h-4" />
                    <span>لوحة التشغيل الفيزيائي للعبة سرعة الاستجابة:</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                    gameState === 'ready'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : gameState === 'waiting'
                      ? 'bg-amber-500 text-slate-950'
                      : gameState === 'false_start'
                      ? 'bg-rose-900 text-rose-200'
                      : gameState === 'result'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {gameState === 'ready'
                      ? '⚡ إشارة مضاءة! اضغط الزر الأخضر!'
                      : gameState === 'waiting'
                      ? '⏳ في انتظار الإشارة العشوائية...'
                      : gameState === 'false_start'
                      ? '⚠️ تسرع مبكر!'
                      : gameState === 'result'
                      ? `🎯 تم القياس: ${reactionTimeMs} ms`
                      : 'جاهز لبدء الجولة'}
                  </span>
                </div>

                {/* Status Message */}
                <p className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800 font-mono text-center">
                  {gameMessage}
                </p>

                {/* Hardware Interactive Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handlePressStartButton}
                    disabled={gameState === 'waiting'}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>اضغط زر البدء (D2 - الأزرق)</span>
                  </button>

                  <button
                    onClick={handlePressReactionButton}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>اضغط زر الاستجابة (D3 - الأخضر)</span>
                  </button>

                  {/* LED Indicator Badge */}
                  <div className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-mono font-black ${
                    isLedLit
                      ? 'bg-rose-600 text-white shadow-[0_0_15px_#EF4444]'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isLedLit ? 'bg-white animate-ping' : 'bg-slate-600'}`} />
                    <span>LED D8: {isLedLit ? 'HIGH (5V)' : 'LOW (0V)'}</span>
                  </div>
                </div>
              </div>
            ) : activeProject === 'ultrasonic' ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
                  مسافة العائق أمام الحساس: <span className="text-amber-400 font-mono font-black">{distanceCm} سم</span>
                </span>
                <input
                  type="range"
                  min={5}
                  max={150}
                  value={distanceCm}
                  onChange={(e) => handleDistanceChange(Number(e.target.value))}
                  className="flex-1 accent-amber-500 cursor-pointer"
                />
              </div>
            ) : activeProject === 'servo' ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
                  زاوية دوران السيرفو: <span className="text-purple-400 font-mono font-black">{servoAngleDeg}°</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={180}
                  value={servoAngleDeg}
                  onChange={(e) => handleServoChange(Number(e.target.value))}
                  className="flex-1 accent-purple-500 cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
                  سرعة مروحة المحرك (PWM): <span className="text-emerald-400 font-mono font-black">{motorSpeedPwm} / 255</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={motorSpeedPwm}
                  onChange={(e) => handleMotorSpeedChange(Number(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Assembly Guide & Wiring Inspector */}
        <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <CharacterAvatar character="sparky" size="sm" />
                <div>
                  <span className="text-xs text-amber-700 font-bold block">المهندس سباركي (Sparky)</span>
                  <h4 className="font-black text-slate-900 text-base">دليل التركيب والتوصيل</h4>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {activeProject === 'reaction' ? `خطوة ${currentStep} / 6` : 'نظرة عامة'}
              </span>
            </div>

            {/* Current Step Wiring Details */}
            {activeProject === 'reaction' ? (
              <div className="space-y-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                    {activeStepDetail.componentAr}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1.5">{activeStepDetail.titleAr}</h3>
                </div>

                {/* Wiring Specs Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">من منفذ:</span>
                    <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {activeStepDetail.fromPin}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">إلى:</span>
                    <span className="font-mono text-slate-800 text-[11px] text-left">
                      {activeStepDetail.toLocation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-bold">لون السلك الموصى به:</span>
                    <span className="font-black text-slate-900">{activeStepDetail.wireColor}</span>
                  </div>
                </div>

                {/* Step Instructions */}
                <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                  <span className="font-bold text-slate-900 block">تعليمات التركيب:</span>
                  <p>{activeStepDetail.instructionAr}</p>
                </div>

                {/* Sparky Tip */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>نصيحة المهندس سباركي:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">{activeStepDetail.sparkyTipAr}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs">
                <h4 className="font-black text-slate-900 text-sm">مواصفات دارة المشروع</h4>
                <p className="text-slate-600 leading-relaxed">
                  تتصل مكونات هذا المشروع مباشرة بمنافذ الآردوينو المحددة في منهج الشهر، مع مشاركة خط التأريض GND وتغذية 5V عبر لوحة التجارب.
                </p>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                  <span className="font-bold block">المنافذ المستخدمة:</span>
                  <span className="font-mono text-xs">
                    {activeProject === 'ultrasonic'
                      ? 'Trig -> D11 | Echo -> D12 | VCC -> 5V | GND -> GND'
                      : activeProject === 'servo'
                      ? 'Signal -> D9 (PWM) | VCC -> 5V | GND -> GND'
                      : 'Motor PWM -> D6 | VCC -> 5V | GND -> GND'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stepper Navigation Controls */}
          {activeProject === 'reaction' && (
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 text-xs font-bold transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الخطوة السابقة</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStep === REACTION_ASSEMBLY_STEPS.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF5B5A] hover:bg-[#ff4645] disabled:opacity-40 text-white text-xs font-black shadow-coral-glow transition-all"
              >
                <span>الخطوة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
