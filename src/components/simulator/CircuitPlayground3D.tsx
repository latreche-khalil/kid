import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  Sliders,
  Volume2,
  Eye,
  Play,
  RotateCw,
  Gauge,
  Activity,
  Move3d,
  Compass
} from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../characters/CharacterAvatars';

export type CircuitPresetId = 'reaction' | 'ultrasonic' | 'servo' | 'motor';

interface ComponentSpec {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  descriptionAr: string;
  sparkyTipAr: string;
  specsAr: string;
}

const COMPONENTS_SPECS: Record<string, ComponentSpec> = {
  led: {
    id: 'led',
    nameAr: 'مصباح LED أحمر مع مقاومة 220Ω',
    nameEn: 'Red LED with 220Ω Resistor',
    categoryAr: 'مخرجات بصرية (Visual Output)',
    descriptionAr: 'الصمام الثنائي الباعث للضوء يعمل بجهد 2 فولت تقريباً. نضع دائماً مقاومة 220 أوم على التوالي لمنع احتراقه.',
    sparkyTipAr: 'الطرف الطويل هو المصعد (Anode +) ويتصل بمنفذ الإشارة، أما الطرف القصير فهو المهبط (Cathode -) ويتصل بالأرضي GND.',
    specsAr: 'الجهد التشغيلي: 1.8V - 2.2V | أقصى تيار: 20mA',
  },
  button: {
    id: 'button',
    nameAr: 'زر ضاغط (Push Button)',
    nameEn: 'Tactile Push Button',
    categoryAr: 'مدخلات رقمية (Digital Input)',
    descriptionAr: 'مفتاح فيزيائي يوصل الدارة عند الضغط عليه ويفصلها عند تركه. يمكن تفعيل مقاومة الشد الداخلية في الآردوينو (INPUT_PULLUP) لتسهيل التوصيل.',
    sparkyTipAr: 'عند تفعيل INPUT_PULLUP: عدم الضغط يعطي HIGH، والضغط يوصل بالأرضي فيعطي LOW.',
    specsAr: '4 أطراف داخلية متصلة كأزواج لتثبيت قوي على لوحة التجارب',
  },
  ultrasonic: {
    id: 'ultrasonic',
    nameAr: 'حساس المسافة بالأمواج فوق الصوتية (HC-SR04)',
    nameEn: 'Ultrasonic Distance Sensor (HC-SR04)',
    categoryAr: 'حساسات واستشعار (Sensor)',
    descriptionAr: 'يحتوي على مكبر صوت فوق صوتي (Trigger) وميكروفون استقبال (Echo). يحسب المسافة بقياس الزمن الذي يستغرقه الصدى للعودة.',
    sparkyTipAr: 'سرعة الصوت في الهواء 340 م/ث. المعادلة: المسافة = (زمن الرحلة بالمايكروثانية × 0.034) ÷ 2.',
    specsAr: 'مدى القياس: 2 سم إلى 400 سم | الدقة: 0.3 سم | زاوية الكشف: 15°',
  },
  servo: {
    id: 'servo',
    nameAr: 'محرك السيرفو الموجه (SG90 Micro Servo)',
    nameEn: 'SG90 9g Micro Servo Motor',
    categoryAr: 'محركات وآليات (Actuators)',
    descriptionAr: 'محرك ذكي يدور بزوايا محددة ودقيقة (من 0 إلى 180 درجة) بدلاً من الدوران المستمر، مما يجعله مثالياً لأذرع الروبوتات والحواجز.',
    sparkyTipAr: 'يتحكم به عبر إشارات PWM بتكرار 50Hz. نستخدم مكتبة <Servo.h> ودالة myServo.write(angle).',
    specsAr: 'الجهد: 4.8V - 6V | العزم: 1.8 kg·cm | زاوية الدوران: 180°',
  },
  dc_motor: {
    id: 'dc_motor',
    nameAr: 'محرك التيار المستمر مع مروحة (DC Motor)',
    nameEn: 'DC Motor with Fan Propeller',
    categoryAr: 'محركات وسرعة (Motion)',
    descriptionAr: 'يدور باستمرار بسرعة تتناسب مع الجهد المطبق. نستخدم تقنية PWM لتغيير سرعة دورانه من 0 إلى 255.',
    sparkyTipAr: 'لا نوصله مباشرة بمنفذ الآردوينو لسحب تيار عالٍ، بل نستخدم درايفر محركات أو ترانزستور مع دايود حماية Flyback.',
    specsAr: 'السرعة القصوى: 9000 RPM عند 5V | تيار التشغيل: 150mA - 300mA',
  },
};

export const CircuitPlayground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activePreset, setActivePreset] = useState<CircuitPresetId>('reaction');
  const [selectedCompId, setSelectedCompId] = useState<string>('led');

  // Interactive Live Circuit State Controls
  const [isReactionLedOn, setIsReactionLedOn] = useState<boolean>(true);
  const [isBtnPressed, setIsBtnPressed] = useState<boolean>(false);
  const [distanceCm, setDistanceCm] = useState<number>(35);
  const [servoAngleDeg, setServoAngleDeg] = useState<number>(90);
  const [motorSpeedPwm, setMotorSpeedPwm] = useState<number>(180);
  const [isRotatingAuto, setIsRotatingAuto] = useState<boolean>(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const circuitGroupRef = useRef<THREE.Group | null>(null);

  // Dynamic Mesh References for Animation
  const ledMeshRef = useRef<THREE.Mesh | null>(null);
  const ledLightRef = useRef<THREE.PointLight | null>(null);
  const buttonCapRef = useRef<THREE.Mesh | null>(null);
  const servoArmRef = useRef<THREE.Group | null>(null);
  const fanPropellerRef = useRef<THREE.Mesh | null>(null);
  const obstacleMeshRef = useRef<THREE.Mesh | null>(null);

  // Handle Preset Change
  const handleSelectPreset = (preset: CircuitPresetId) => {
    soundFx.playClick();
    setActivePreset(preset);

    switch (preset) {
      case 'reaction':
        setSelectedCompId('led');
        break;
      case 'ultrasonic':
        setSelectedCompId('ultrasonic');
        break;
      case 'servo':
        setSelectedCompId('servo');
        break;
      case 'motor':
        setSelectedCompId('dc_motor');
        break;
    }
  };

  // Toggle Reaction LED
  const handleToggleLed = () => {
    soundFx.playClick();
    const next = !isReactionLedOn;
    setIsReactionLedOn(next);
    if (ledMeshRef.current && ledLightRef.current) {
      const mat = ledMeshRef.current.material as THREE.MeshStandardMaterial;
      if (next) {
        mat.color.setHex(0xef4444);
        mat.emissive.setHex(0xdc2626);
        ledLightRef.current.intensity = 2.0;
        soundFx.playStartSignal();
      } else {
        mat.color.setHex(0x7f1d1d);
        mat.emissive.setHex(0x000000);
        ledLightRef.current.intensity = 0;
      }
    }
  };

  // Press 3D Push Button
  const handlePressButton = () => {
    soundFx.playClick();
    setIsBtnPressed(true);

    if (buttonCapRef.current) {
      buttonCapRef.current.position.y = 0.45; // pushed down
    }

    // Toggle reaction LED as direct hardware feedback
    handleToggleLed();

    setTimeout(() => {
      setIsBtnPressed(false);
      if (buttonCapRef.current) {
        buttonCapRef.current.position.y = 0.65; // bounce back up
      }
    }, 200);
  };

  // Update Distance
  const handleDistanceChange = (val: number) => {
    setDistanceCm(val);
    if (obstacleMeshRef.current) {
      // Map 5cm-150cm to 3D Z position
      obstacleMeshRef.current.position.z = 2.5 + (val / 150) * 4.0;
    }
    // Sound beep rate proportional to distance
    soundFx.playTone(800 + (150 - val) * 8, 40, 'triangle');
  };

  // Update Servo Angle
  const handleServoChange = (val: number) => {
    setServoAngleDeg(val);
    if (servoArmRef.current) {
      // Convert degrees to radians
      servoArmRef.current.rotation.y = ((val - 90) * Math.PI) / 180;
    }
    soundFx.playTone(400 + val * 2, 30, 'sine');
  };

  // Update Motor Speed
  const handleMotorSpeedChange = (val: number) => {
    setMotorSpeedPwm(val);
    soundFx.playTone(200 + val, 30, 'sawtooth');
  };

  // Reset 3D Camera Angle
  const resetCamera = () => {
    soundFx.playClick();
    setIsRotatingAuto(false);
    if (cameraRef.current && circuitGroupRef.current) {
      cameraRef.current.position.set(0, 14, 12);
      cameraRef.current.lookAt(0, 0, 0);
      circuitGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // Initialize Three.js Workbench Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep slate space
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 14, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfffaed, 2.2);
    mainSun.position.set(10, 18, 8);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 1024;
    mainSun.shadow.mapSize.height = 1024;
    scene.add(mainSun);

    const blueRim = new THREE.DirectionalLight(0x38bdf8, 1.0);
    blueRim.position.set(-10, 8, -8);
    scene.add(blueRim);

    // Root Group for interactive rotation
    const circuitGroup = new THREE.Group();
    circuitGroupRef.current = circuitGroup;
    scene.add(circuitGroup);

    // ================= 1. WOODEN / ANTISTATIC WORKBENCH MAT =================
    const matGeo = new THREE.BoxGeometry(22, 0.3, 16);
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });
    const workMat = new THREE.Mesh(matGeo, matMaterial);
    workMat.position.y = -0.16;
    workMat.receiveShadow = true;
    circuitGroup.add(workMat);

    // ================= 2. ARDUINO UNO BOARD (LEFT SIDE) =================
    const boardPcbGeo = new THREE.BoxGeometry(5.6, 0.25, 8.2);
    const boardPcbMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Arduino Teal
      roughness: 0.4,
    });
    const arduino = new THREE.Mesh(boardPcbGeo, boardPcbMat);
    arduino.position.set(-5.5, 0.12, 0);
    arduino.castShadow = true;
    arduino.receiveShadow = true;
    circuitGroup.add(arduino);

    // ATmega328P Chip on Arduino
    const chipGeo = new THREE.BoxGeometry(1.4, 0.28, 4.0);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(-5.3, 0.35, 0.6);
    chip.castShadow = true;
    circuitGroup.add(chip);

    // USB Port on Arduino
    const usbGeo = new THREE.BoxGeometry(1.6, 1.2, 1.6);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.25 });
    const usb = new THREE.Mesh(usbGeo, metalMat);
    usb.position.set(-7.0, 0.75, -3.4);
    circuitGroup.add(usb);

    // Female Headers on Arduino
    const headerMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
    const headerR1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 2.8), headerMat);
    headerR1.position.set(-3.2, 0.45, -2.2);
    circuitGroup.add(headerR1);

    const headerR2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 2.4), headerMat);
    headerR2.position.set(-3.2, 0.45, 0.9);
    circuitGroup.add(headerR2);

    const headerL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 4.6), headerMat);
    headerL.position.set(-7.8, 0.45, 1.0);
    circuitGroup.add(headerL);

    // ================= 3. BREADBOARD (RIGHT SIDE) =================
    const breadboardGeo = new THREE.BoxGeometry(7.6, 0.5, 11.5);
    const breadboardMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6,
    });
    const breadboard = new THREE.Mesh(breadboardGeo, breadboardMat);
    breadboard.position.set(3.8, 0.25, 0);
    breadboard.castShadow = true;
    breadboard.receiveShadow = true;
    circuitGroup.add(breadboard);

    // Power Rails (Blue and Red stripe lines on Breadboard)
    const lineMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const lineMatBlue = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    const stripeR1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 10.5), lineMatRed);
    stripeR1.position.set(7.1, 0.52, 0);
    circuitGroup.add(stripeR1);

    const stripeB1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 10.5), lineMatBlue);
    stripeB1.position.set(7.35, 0.52, 0);
    circuitGroup.add(stripeB1);

    const stripeR2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 10.5), lineMatRed);
    stripeR2.position.set(0.4, 0.52, 0);
    circuitGroup.add(stripeR2);

    const stripeB2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 10.5), lineMatBlue);
    stripeB2.position.set(0.15, 0.52, 0);
    circuitGroup.add(stripeB2);

    // Center Trench
    const trench = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 10.5), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
    trench.position.set(3.8, 0.47, 0);
    circuitGroup.add(trench);

    // Tie Holes Representation (Rows of contact pins)
    const holeGeo = new THREE.BoxGeometry(0.12, 0.05, 0.12);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    for (let x = 1.0; x <= 6.6; x += 0.55) {
      if (Math.abs(x - 3.8) > 0.35) {
        for (let z = -4.8; z <= 4.8; z += 0.48) {
          const h = new THREE.Mesh(holeGeo, holeMat);
          h.position.set(x, 0.51, z);
          circuitGroup.add(h);
        }
      }
    }

    // ================= 4. DYNAMIC COMPONENTS ON BREADBOARD =================

    // COMPONENT A: RED LED BULB
    const ledBase = new THREE.Group();
    ledBase.position.set(2.4, 0.52, -2.5);
    circuitGroup.add(ledBase);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    const legL = new THREE.Mesh(legGeo, metalMat);
    legL.position.set(-0.15, 0.3, 0);
    ledBase.add(legL);

    const legR = new THREE.Mesh(legGeo, metalMat);
    legR.position.set(0.15, 0.3, 0);
    ledBase.add(legR);

    // Bulb Capsule
    const bulbGeo = new THREE.SphereGeometry(0.45, 24, 24);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95,
    });
    const ledBulb = new THREE.Mesh(bulbGeo, bulbMat);
    ledBulb.position.set(0, 0.85, 0);
    ledBulb.scale.set(1, 1.4, 1);
    ledBase.add(ledBulb);
    ledMeshRef.current = ledBulb;

    // Glowing PointLight from the LED
    const ledLight = new THREE.PointLight(0xef4444, 2.0, 5);
    ledLight.position.set(0, 1.2, 0);
    ledBase.add(ledLight);
    ledLightRef.current = ledLight;

    // COMPONENT B: 220 OHM RESISTOR
    const resistor = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }));
    resistor.rotation.x = Math.PI / 2;
    resistor.position.set(1.4, 0.7, -2.5);
    circuitGroup.add(resistor);

    // COMPONENT C: TACTILE PUSH BUTTON
    const buttonBase = new THREE.Group();
    buttonBase.position.set(5.2, 0.52, 1.2);
    circuitGroup.add(buttonBase);

    const btnBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }));
    btnBody.position.y = 0.2;
    btnBody.castShadow = true;
    buttonBase.add(btnBody);

    const btnCap = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.4, 20), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 }));
    btnCap.position.y = 0.55;
    buttonBase.add(btnCap);
    buttonCapRef.current = btnCap;

    // COMPONENT D: HC-SR04 ULTRASONIC SENSOR (Visible in ultrasonic preset)
    const ultrasonicGroup = new THREE.Group();
    ultrasonicGroup.position.set(3.8, 0.52, 4.2);
    circuitGroup.add(ultrasonicGroup);

    // Blue PCB
    const usPcb = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.2), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    usPcb.position.y = 0.8;
    ultrasonicGroup.add(usPcb);

    // Two Silver Eye Cylinders (Transducers)
    const barrelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.8, 20);
    const barrelL = new THREE.Mesh(barrelGeo, metalMat);
    barrelL.rotation.x = Math.PI / 2;
    barrelL.position.set(-0.8, 0.8, 0.4);
    ultrasonicGroup.add(barrelL);

    const barrelR = new THREE.Mesh(barrelGeo, metalMat);
    barrelR.rotation.x = Math.PI / 2;
    barrelR.position.set(0.8, 0.8, 0.4);
    ultrasonicGroup.add(barrelR);

    // Ultrasonic Target Obstacle (Moves with slider)
    const obstacle = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 0.3), new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }));
    obstacle.position.set(3.8, 0.9, 6.5);
    circuitGroup.add(obstacle);
    obstacleMeshRef.current = obstacle;

    // COMPONENT E: SG90 MICRO SERVO MOTOR
    const servoGroup = new THREE.Group();
    servoGroup.position.set(9.2, 0.2, -2.5);
    circuitGroup.add(servoGroup);

    const servoBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.0), new THREE.MeshStandardMaterial({ color: 0x2563eb, transparent: true, opacity: 0.9 }));
    servoBody.position.y = 1.1;
    servoGroup.add(servoBody);

    // Rotating Servo Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 2.3, 0);
    servoGroup.add(armGroup);
    servoArmRef.current = armGroup;

    const armHorn = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 2.4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    armHorn.position.z = 0.8;
    armGroup.add(armHorn);

    // COMPONENT F: DC MOTOR WITH SPINNING PROPELLER
    const motorGroup = new THREE.Group();
    motorGroup.position.set(9.2, 0.2, 2.5);
    circuitGroup.add(motorGroup);

    const motorCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.0, 24), metalMat);
    motorCylinder.rotation.x = Math.PI / 2;
    motorCylinder.position.y = 0.9;
    motorGroup.add(motorCylinder);

    // Fan Blades Propeller
    const fanGeo = new THREE.BoxGeometry(2.8, 0.15, 0.4);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const fanPropeller = new THREE.Mesh(fanGeo, fanMat);
    fanPropeller.position.set(0, 0.9, 1.2);
    motorGroup.add(fanPropeller);
    fanPropellerRef.current = fanPropeller;

    // ================= 5. CURVED 3D JUMPER WIRES =================
    // Helper to generate curved 3D tube wire
    const createWireTube = (points: THREE.Vector3[], color: number) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
      const wireMesh = new THREE.Mesh(tubeGeo, tubeMat);
      wireMesh.castShadow = true;
      circuitGroup.add(wireMesh);
    };

    // Wire 1: D8 (Arduino) ➔ LED Anode (Red)
    createWireTube([
      new THREE.Vector3(-3.2, 0.7, -2.4),
      new THREE.Vector3(-1.0, 2.4, -2.4),
      new THREE.Vector3(2.4, 0.7, -2.5),
    ], 0xef4444);

    // Wire 2: GND (Arduino) ➔ Breadboard Ground Rail (Black)
    createWireTube([
      new THREE.Vector3(-3.2, 0.7, 0.8),
      new THREE.Vector3(-1.2, 1.8, 0.0),
      new THREE.Vector3(0.15, 0.7, 0.0),
    ], 0x1e293b);

    // Wire 3: D3 (Arduino) ➔ Button Terminal (Green)
    createWireTube([
      new THREE.Vector3(-3.2, 0.7, 0.4),
      new THREE.Vector3(1.0, 2.2, 0.8),
      new THREE.Vector3(5.2, 0.7, 0.6),
    ], 0x10b981);

    // Wire 4: 5V (Arduino) ➔ Breadboard Positive Rail (Red)
    createWireTube([
      new THREE.Vector3(-7.8, 0.7, 1.2),
      new THREE.Vector3(-4.0, 2.8, 3.0),
      new THREE.Vector3(0.4, 0.7, 3.0),
    ], 0xdc2626);

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

    // Wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.y += e.deltaY * 0.006;
      cameraRef.current.position.y = Math.max(5, Math.min(24, cameraRef.current.position.y));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // ================= ANIMATION TICK =================
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Spin DC motor fan if speed > 0
      if (fanPropellerRef.current && motorSpeedPwm > 0) {
        fanPropellerRef.current.rotation.z += (motorSpeedPwm / 255) * 25 * delta;
      }

      // Auto camera rotation when enabled
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
  }, [motorSpeedPwm, isRotatingAuto]);

  const activeSpec = COMPONENTS_SPECS[selectedCompId] || COMPONENTS_SPECS.led;

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
              <h3 className="text-xl font-black text-slate-800">مختبر الدوائر ثلاثي الأبعاد (Circuit Playground 3D)</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                المرحلة 2: Components & Breadboard
              </span>
            </div>
            <p className="text-xs text-slate-500">
              لوحة تجارب فيزيائية كاملة، مكونات إلكترونية تفاعلية، وأسلاك توصيل منحنية ثلاثية الأبعاد
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => handleSelectPreset('reaction')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activePreset === 'reaction'
                ? 'bg-[#FF5B5A] text-white shadow-coral-glow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏎️ دارة سرعة الاستجابة (W1)
          </button>
          <button
            onClick={() => handleSelectPreset('ultrasonic')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activePreset === 'ultrasonic'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🦇 حساس المسافة (W12)
          </button>
          <button
            onClick={() => handleSelectPreset('servo')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activePreset === 'servo'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🅿️ محرك السيرفو (W13)
          </button>
          <button
            onClick={() => handleSelectPreset('motor')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activePreset === 'motor'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌀 محرك المروحة (W14)
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Stage + Live Interactive Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3D Viewport Stage */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[520px] flex flex-col justify-between p-4 shadow-inner">
          {/* Top HUD */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>مختبر حي: اسحب لتدوير زاوية الرؤية • عجلة الفأرة للتكبير</span>
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

          {/* Three.js Canvas */}
          <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Bottom Live Interactive Hardware Triggers */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4" />
                <span>لوحة التحكم التفاعلية بالمكونات الحية:</span>
              </span>
              <span className="text-[11px] text-slate-400">انقر للتجربة الفيزيائية المباشرة</span>
            </div>

            {/* Contextual Control Bar according to Active Preset */}
            <div className="flex flex-wrap items-center gap-4">
              {activePreset === 'reaction' && (
                <>
                  <button
                    onClick={handlePressButton}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs shadow-md transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>اضغط زر الاستجابة (D3)</span>
                  </button>

                  <button
                    onClick={handleToggleLed}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${
                      isReactionLedOn
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_#EF4444]'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isReactionLedOn ? 'مصباح LED مضاء (5V)' : 'مصباح LED مطفأ (0V)'}</span>
                  </button>
                </>
              )}

              {activePreset === 'ultrasonic' && (
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
                    مسافة العائق: <span className="text-amber-400 font-mono font-black">{distanceCm} سم</span>
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
              )}

              {activePreset === 'servo' && (
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
                    زاوية السيرفو: <span className="text-purple-400 font-mono font-black">{servoAngleDeg}°</span>
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
              )}

              {activePreset === 'motor' && (
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 whitespace-nowrap">
                    سرعة PWM: <span className="text-emerald-400 font-mono font-black">{motorSpeedPwm} / 255</span>
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
        </div>

        {/* Right: Component Technical Guide & Sparky's Insight */}
        <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <CharacterAvatar character="sparky" size="sm" />
                <div>
                  <span className="text-xs text-amber-700 font-bold block">مساعد الإلكترونيات الذكي</span>
                  <h4 className="font-black text-slate-900 text-base">دليل المكونات والعناصر</h4>
                </div>
              </div>
            </div>

            {/* Selected Component Details */}
            <div className="space-y-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-slate-700 border border-slate-200 shadow-sm">
                  {activeSpec.categoryAr}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{activeSpec.nameAr}</h3>
                <p className="text-xs font-mono text-slate-400">{activeSpec.nameEn}</p>
              </div>

              {/* Electrical Specs */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-slate-500 block">المواصفات الكهربائية:</span>
                <p className="font-mono text-slate-800 text-[11px] leading-relaxed">{activeSpec.specsAr}</p>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                <span className="font-bold text-slate-900 block">كيف يعمل العنصر؟</span>
                <p>{activeSpec.descriptionAr}</p>
              </div>

              {/* Sparky's Pro Tip */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>نصيحة المهندس سباركي (Sparky):</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">{activeSpec.sparkyTipAr}</p>
              </div>
            </div>
          </div>

          {/* Quick Component Selector Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-600 block">اختر مكوناً لتفحص مواصفاته:</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(COMPONENTS_SPECS).map((comp) => {
                const isSelected = selectedCompId === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedCompId(comp.id);
                    }}
                    className={`p-2 rounded-xl text-right text-xs font-bold transition-all truncate ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {comp.nameAr.split(' ')[0]} {comp.nameAr.split(' ')[1]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

