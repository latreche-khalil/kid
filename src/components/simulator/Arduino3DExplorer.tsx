import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Check,
  Eye,
  Sliders,
  Play
} from 'lucide-react';
import { soundFx } from '../../services/sound/webAudio';
import { CharacterAvatar } from '../characters/CharacterAvatars';

export interface PinInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  typeAr: 'رقمي (Digital)' | 'تناظري (Analog)' | 'طاقة وتغذية (Power)' | 'معالج مدمج (CPU)' | 'اتصال ومقاطعة (Comm)';
  color: string;
  voltage: string;
  specsAr: string;
  descriptionAr: string;
  lessonConnectionAr: string;
  position3D: [number, number, number]; // x, y, z on the board
}

export const ARDUINO_PINS_DATA: PinInfo[] = [
  {
    id: 'd8',
    nameAr: 'المنفذ الرقمي D8',
    nameEn: 'Digital Pin 8',
    typeAr: 'رقمي (Digital)',
    color: '#EF4444',
    voltage: '5V (0V - 5V)',
    specsAr: 'إخراج / إدخال رقمي عادي (GPIO) بتيار حتى 40mA',
    descriptionAr: 'منفذ رقمي يمكن برمجته كمخرج (OUTPUT) لإرسال إشارة 5V أو كمدخل (INPUT) لقراءة حالة المفاتيح.',
    lessonConnectionAr: 'استخدمناه في الأسبوع الأول لتشغيل مصباح LED لعبة سرعة الاستجابة عبر مقاومة 220 أوم.',
    position3D: [2.5, 0.4, -2.4],
  },
  {
    id: 'd9',
    nameAr: 'المنفذ الرقمي D9 (PWM)',
    nameEn: 'Digital Pin 9 (PWM ~)',
    typeAr: 'رقمي (Digital)',
    color: '#F59E0B',
    voltage: '5V (PWM ~490Hz)',
    specsAr: 'يدعم تعديل عرض النبضة PWM بدقة 8-bit (من 0 إلى 255)',
    descriptionAr: 'يتميز برمز التموج (~)، مما يعني أنه قادر على محاكاة الإشارات التناظرية للتحكم بسطوع الضوء أو سرعة المحركات أو نغمات الطنان الصوتي.',
    lessonConnectionAr: 'استخدمناه في الأسبوع الأول لتوليد نغمات الطنان الصوتي Buzzer ونغمات الفوز الاحتفالية بدالة tone().',
    position3D: [2.5, 0.4, -2.0],
  },
  {
    id: 'd3',
    nameAr: 'المنفذ الرقمي D3 (Interrupt & PWM)',
    nameEn: 'Digital Pin 3 (~ / INT1)',
    typeAr: 'اتصال ومقاطعة (Comm)',
    color: '#10B981',
    voltage: '5V (PWM & INT)',
    specsAr: 'يدعم المقاطعات العتادية السريعة (Hardware Interrupt 1)',
    descriptionAr: 'منفذ متعدد القدرات، يدعم PWM كما يدعم مقاطعة المعالج فوراً دون انتظار، مما يجعله مثالياً لأزرار الاستجابة السريعة.',
    lessonConnectionAr: 'متصل بزر اللاعب الثاني (الأخضر) في تحدّي 1 ضد 1 بالأسبوع الأول مع خاصية INPUT_PULLUP.',
    position3D: [2.5, 0.4, 0.4],
  },
  {
    id: 'd2',
    nameAr: 'المنفذ الرقمي D2 (Interrupt 0)',
    nameEn: 'Digital Pin 2 (INT0)',
    typeAr: 'اتصال ومقاطعة (Comm)',
    color: '#3B82F6',
    voltage: '5V (INT0)',
    specsAr: 'يدعم المقاطعة العتادية 0 (Hardware Interrupt 0)',
    descriptionAr: 'يستخدم لرصد استجابة اللاعب الأول فوراً وكشف الانطلاق المبكر.',
    lessonConnectionAr: 'متصل بزر اللاعب الأول (الأزرق) في مشروع تحدّي السرعة الثنائي.',
    position3D: [2.5, 0.4, 0.8],
  },
  {
    id: 'd13',
    nameAr: 'المنفذ الرقمي D13 (مصباح اللوحة المدمج L)',
    nameEn: 'Digital Pin 13 (Built-in LED L)',
    typeAr: 'رقمي (Digital)',
    color: '#EC4899',
    voltage: '5V',
    specsAr: 'متصل فيزيائياً بمصباح LED أصفر صغير مدمج على سطح اللوحة يحمل حرف L',
    descriptionAr: 'المنفذ الأسهل للاختبار السريع؛ يمكنك كتابة digitalWrite(13, HIGH) لتشغيل المصباح دون الحاجة لتوصيل أي سلك خارجي!',
    lessonConnectionAr: 'يستخدم لاختبار سلامة اللوحة وكود الوميض الأساسي Blink قبل تركيب الدارات المعقدة.',
    position3D: [2.5, 0.4, -4.0],
  },
  {
    id: 'gnd',
    nameAr: 'منفذ الأرضي المشترك (GND)',
    nameEn: 'Ground (GND - 0V)',
    typeAr: 'طاقة وتغذية (Power)',
    color: '#1E293B',
    voltage: '0V (المرجع الكهربائي)',
    specsAr: 'مسار العودة للتيار الكهربائي لإكمال أي دارة',
    descriptionAr: 'القطب السالب في عالم الإلكترونيات. لا يمكن لأي تيار كهربائي أن يتدفق، ولا لأي مصباح أن يضيء دون العودة إلى نقطة الأرضي GND.',
    lessonConnectionAr: 'متصل بخط الأرضي الأزرق على لوحة التجارب لكافة أزرار ومصابيح وطنانات المشروع.',
    position3D: [-2.5, 0.4, 0.8],
  },
  {
    id: '5v',
    nameAr: 'منفذ التغذية 5 فولت (5V Power)',
    nameEn: '5V Regulated Power',
    typeAr: 'طاقة وتغذية (Power)',
    color: '#DC2626',
    voltage: '+5.0V DC',
    specsAr: 'يخرج جهداً كهربائياً ثابتاً منظماً بقدرة تصل إلى 500mA',
    descriptionAr: 'شريان الحياة الذي يغذي الحساسات الإلكترونية، شاشات LCD، والدارات المدمجة بالطاقة اللازمة لعملها.',
    lessonConnectionAr: 'يغذي حساس المسافة ومحركات السيرفو ولوحة التجارب في الأسابيع المتقدمة.',
    position3D: [-2.5, 0.4, 0.4],
  },
  {
    id: '3v3',
    nameAr: 'منفذ التغذية 3.3 فولت (3.3V Power)',
    nameEn: '3.3V Regulated Power',
    typeAr: 'طاقة وتغذية (Power)',
    color: '#EA580C',
    voltage: '+3.3V DC',
    specsAr: 'جهد منخفض مخصص للموديلات الحديثة الحساسة لفرق الجهد',
    descriptionAr: 'يوفر طاقة للحساسات الدقيقة وموديلات الاتصال اللاسلكي التي قد تحترق إذا تم وصلها بـ 5 فولت مباشرة.',
    lessonConnectionAr: 'يستخدم لحماية الشرائح الحساسة ومتحسسات الحركة الجيروسكوبية.',
    position3D: [-2.5, 0.4, 0.0],
  },
  {
    id: 'a0',
    nameAr: 'المدخل التناظري A0 (Analog In)',
    nameEn: 'Analog Input A0',
    typeAr: 'تناظري (Analog)',
    color: '#0284C7',
    voltage: '0V إلى 5V (قراءة مستمرة)',
    specsAr: 'محول تناظري-رقمي (ADC) بدقة 10-bit (يقيس من 0 إلى 1023)',
    descriptionAr: 'لا يفهم فقط 0 أو 1، بل يستشعر درجات التغير المستمرة مثل دوران مقياس الجهد، درجات الحرارة، وشدة الضوء.',
    lessonConnectionAr: 'استخدمناه في الأسبوع الأول كمنفذ عائم لتوليد بذور الأرقام العشوائية بدقة: randomSeed(analogRead(A0)).',
    position3D: [-2.5, 0.4, 2.2],
  },
  {
    id: 'atmega',
    nameAr: 'المعالج الدقيق ATmega328P',
    nameEn: 'ATmega328P Microcontroller Chip',
    typeAr: 'معالج مدمج (CPU)',
    color: '#4F46E5',
    voltage: '5V (تردد 16 MHz)',
    specsAr: 'ذاكرة فلاش 32KB، ذاكرة SRAM 2KB، وذاكرة EEPROM 1KB',
    descriptionAr: 'العقل والمفكر الإلكتروني الحقيقي للوحة الآردوينو! يستقبل كودك المكتوب بلغة C++ وينفذ 16 مليون تعليمة في الثانية الواحدة.',
    lessonConnectionAr: 'قلب الدارة ومحور معمارية النظم المدمجة الذي ندرسه بالتفصيل في الشهر الرابع.',
    position3D: [0.2, 0.5, 0.8],
  },
  {
    id: 'usb',
    nameAr: 'منفذ كابل USB Type-B',
    nameEn: 'USB Type-B Port',
    typeAr: 'اتصال ومقاطعة (Comm)',
    color: '#64748B',
    voltage: '5V USB',
    specsAr: 'تغذية اللوحة + اتصال تسلسلي Serial UART لنقل الكود والبيانات',
    descriptionAr: 'الجسر الذي يربط حاسوبك بالآردوينو لرفع الأكواد البرمجية وتبادل الرسائل مع شاشة Serial Monitor بسرعة 9600 بود.',
    lessonConnectionAr: 'ينقل قراءات سرعة الاستجابة من الآردوينو إلى شاشة الحاسوب اللحظية.',
    position3D: [-2.2, 0.7, -4.2],
  },
];

export const Arduino3DExplorer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedPin, setSelectedPin] = useState<PinInfo>(ARDUINO_PINS_DATA[0]);
  const [isLed13On, setIsLed13On] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [isRotatingAuto, setIsRotatingAuto] = useState<boolean>(true);

  // References for Three.js control
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const boardGroupRef = useRef<THREE.Group | null>(null);
  const led13MeshRef = useRef<THREE.Mesh | null>(null);
  const led13LightRef = useRef<THREE.PointLight | null>(null);
  const markerMeshRef = useRef<THREE.Mesh | null>(null);

  // Filtered Pins List
  const filteredPins = ARDUINO_PINS_DATA.filter((p) => {
    if (filterType === 'all') return true;
    if (filterType === 'digital') return p.typeAr.includes('رقمي');
    if (filterType === 'analog') return p.typeAr.includes('تناظري');
    if (filterType === 'power') return p.typeAr.includes('طاقة');
    if (filterType === 'cpu') return p.typeAr.includes('معالج') || p.typeAr.includes('اتصال');
    return true;
  });

  // Handle Pin Selection
  const handleSelectPin = (pin: PinInfo) => {
    soundFx.playClick();
    setSelectedPin(pin);

    // Reposition 3D highlight marker over selected pin
    if (markerMeshRef.current) {
      markerMeshRef.current.position.set(pin.position3D[0], pin.position3D[1] + 0.3, pin.position3D[2]);
      markerMeshRef.current.visible = true;
    }
  };

  // Toggle Built-in Pin 13 LED
  const handleToggleLed13 = () => {
    soundFx.playClick();
    const nextState = !isLed13On;
    setIsLed13On(nextState);

    if (led13MeshRef.current && led13LightRef.current) {
      const mat = led13MeshRef.current.material as THREE.MeshStandardMaterial;
      if (nextState) {
        mat.color.setHex(0xfbbf24);
        mat.emissive.setHex(0xf59e0b);
        led13LightRef.current.intensity = 1.2;
      } else {
        mat.color.setHex(0x78350f);
        mat.emissive.setHex(0x000000);
        led13LightRef.current.intensity = 0;
      }
    }
  };

  // Set Camera Preset Angles
  const setCameraPreset = (preset: 'iso' | 'top' | 'digital' | 'power' | 'cpu') => {
    soundFx.playClick();
    setIsRotatingAuto(false);
    if (!cameraRef.current || !boardGroupRef.current) return;

    switch (preset) {
      case 'iso':
        cameraRef.current.position.set(7, 8, 8);
        boardGroupRef.current.rotation.set(0, 0, 0);
        break;
      case 'top':
        cameraRef.current.position.set(0, 11, 0.01);
        boardGroupRef.current.rotation.set(0, 0, 0);
        break;
      case 'digital':
        cameraRef.current.position.set(6, 6, -1);
        handleSelectPin(ARDUINO_PINS_DATA[0]); // D8
        break;
      case 'power':
        cameraRef.current.position.set(-6, 6, 1);
        handleSelectPin(ARDUINO_PINS_DATA[5]); // GND
        break;
      case 'cpu':
        cameraRef.current.position.set(1, 5, 3);
        handleSelectPin(ARDUINO_PINS_DATA[9]); // ATmega328P
        break;
    }
    cameraRef.current.lookAt(0, 0, 0);
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef6ff); // Bright studio sky backdrop
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7, 8, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.0);
    sunLight.position.set(8, 14, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueRimLight.position.set(-8, 6, -6);
    scene.add(blueRimLight);

    // ================= BOARD 3D MODEL BUILDER =================
    const boardGroup = new THREE.Group();
    boardGroupRef.current = boardGroup;
    scene.add(boardGroup);

    // 1. PCB Main Board (Signature Arduino Teal/Blue)
    const pcbGeo = new THREE.BoxGeometry(6.0, 0.25, 9.0);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Arduino Blue
      roughness: 0.35,
      metalness: 0.1,
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.receiveShadow = true;
    pcb.castShadow = true;
    boardGroup.add(pcb);

    // 2. White Silkscreen Border Decal
    const borderGeo = new THREE.BoxGeometry(5.7, 0.02, 8.7);
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.y = 0.13;
    boardGroup.add(border);

    // 3. ATmega328P DIP-28 Chip
    const chipSocketGeo = new THREE.BoxGeometry(1.6, 0.2, 4.4);
    const chipSocketMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const chipSocket = new THREE.Mesh(chipSocketGeo, chipSocketMat);
    chipSocket.position.set(0.2, 0.22, 0.8);
    chipSocket.castShadow = true;
    boardGroup.add(chipSocket);

    // Chip top package with label
    const chipTopGeo = new THREE.BoxGeometry(1.4, 0.22, 4.2);
    const chipTopMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 });
    const chipTop = new THREE.Mesh(chipTopGeo, chipTopMat);
    chipTop.position.set(0.2, 0.32, 0.8);
    boardGroup.add(chipTop);

    // 4. USB Type-B Port (Metal)
    const usbGeo = new THREE.BoxGeometry(1.8, 1.4, 1.8);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.85,
      roughness: 0.25,
    });
    const usb = new THREE.Mesh(usbGeo, metalMat);
    usb.position.set(-2.0, 0.8, -4.0);
    usb.castShadow = true;
    boardGroup.add(usb);

    // 5. DC Barrel Power Jack
    const powerJackGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 16);
    const jackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 });
    const powerJack = new THREE.Mesh(powerJackGeo, jackMat);
    powerJack.rotation.x = Math.PI / 2;
    powerJack.position.set(2.0, 0.6, -4.0);
    powerJack.castShadow = true;
    boardGroup.add(powerJack);

    // 6. Reset Push Button (Red button cap in metal frame)
    const btnFrameGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
    const btnFrame = new THREE.Mesh(btnFrameGeo, metalMat);
    btnFrame.position.set(-2.2, 0.3, -2.6);
    boardGroup.add(btnFrame);

    const btnCapGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16);
    const btnCapMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const btnCap = new THREE.Mesh(btnCapGeo, btnCapMat);
    btnCap.position.set(-2.2, 0.55, -2.6);
    boardGroup.add(btnCap);

    // 7. 16 MHz Quartz Crystal Oscillator (Silver Oval Can)
    const crystalGeo = new THREE.BoxGeometry(0.5, 0.4, 1.1);
    const crystal = new THREE.Mesh(crystalGeo, metalMat);
    crystal.position.set(-0.9, 0.32, -1.8);
    boardGroup.add(crystal);

    // 8. Female Headers (Digital Top, Digital Bottom, Power, Analog)
    const headerMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });

    // Digital Header (Right side D8 to D13 + GND + AREF)
    const headerDig1Geo = new THREE.BoxGeometry(0.5, 0.7, 3.2);
    const headerDig1 = new THREE.Mesh(headerDig1Geo, headerMat);
    headerDig1.position.set(2.5, 0.48, -2.5);
    headerDig1.castShadow = true;
    boardGroup.add(headerDig1);

    // Digital Header (Right side D0 to D7)
    const headerDig2Geo = new THREE.BoxGeometry(0.5, 0.7, 2.6);
    const headerDig2 = new THREE.Mesh(headerDig2Geo, headerMat);
    headerDig2.position.set(2.5, 0.48, 0.8);
    headerDig2.castShadow = true;
    boardGroup.add(headerDig2);

    // Power Header (Left side)
    const headerPowerGeo = new THREE.BoxGeometry(0.5, 0.7, 2.6);
    const headerPower = new THREE.Mesh(headerPowerGeo, headerMat);
    headerPower.position.set(-2.5, 0.48, 0.2);
    headerPower.castShadow = true;
    boardGroup.add(headerPower);

    // Analog Header (Left side A0 to A5)
    const headerAnalogGeo = new THREE.BoxGeometry(0.5, 0.7, 2.0);
    const headerAnalog = new THREE.Mesh(headerAnalogGeo, headerMat);
    headerAnalog.position.set(-2.5, 0.48, 2.8);
    headerAnalog.castShadow = true;
    boardGroup.add(headerAnalog);

    // Header Pin Holes (Gold contact dots inside socket)
    const pinDotGeo = new THREE.BoxGeometry(0.2, 0.05, 0.2);
    const pinDotMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
    for (let z = -4.0; z <= 3.8; z += 0.4) {
      if (Math.abs(z - (-0.8)) > 0.4) {
        const dotR = new THREE.Mesh(pinDotGeo, pinDotMat);
        dotR.position.set(2.5, 0.84, z);
        boardGroup.add(dotR);
      }
      if (z > -1.0) {
        const dotL = new THREE.Mesh(pinDotGeo, pinDotMat);
        dotL.position.set(-2.5, 0.84, z);
        boardGroup.add(dotL);
      }
    }

    // 9. Status LEDs on Board
    // Power ON LED (Green)
    const onLedGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
    const onLedMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.8,
    });
    const onLed = new THREE.Mesh(onLedGeo, onLedMat);
    onLed.position.set(1.4, 0.22, -1.8);
    boardGroup.add(onLed);

    const onLight = new THREE.PointLight(0x10b981, 0.8, 2);
    onLight.position.set(1.4, 0.4, -1.8);
    boardGroup.add(onLight);

    // Built-in Pin 13 LED (Yellow/Amber)
    const led13Geo = new THREE.BoxGeometry(0.22, 0.16, 0.22);
    const led13Mat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    });
    const led13 = new THREE.Mesh(led13Geo, led13Mat);
    led13.position.set(1.4, 0.22, -2.4);
    boardGroup.add(led13);
    led13MeshRef.current = led13;

    const led13Light = new THREE.PointLight(0xf59e0b, 1.2, 2.5);
    led13Light.position.set(1.4, 0.5, -2.4);
    boardGroup.add(led13Light);
    led13LightRef.current = led13Light;

    // 10. Floating Interactive Highlight Marker
    const markerGeo = new THREE.RingGeometry(0.35, 0.5, 32);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.rotation.x = Math.PI / 2;
    marker.position.set(2.5, 0.7, -2.4); // Initial on D8
    boardGroup.add(marker);
    markerMeshRef.current = marker;

    // ================= INTERACTION DRAG / ROTATION =================
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
      if (!isDragging || !boardGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      boardGroupRef.current.rotation.y += deltaX * 0.008;
      boardGroupRef.current.rotation.x += deltaY * 0.008;

      // Limit pitch to prevent complete upside-down disorientation
      boardGroupRef.current.rotation.x = Math.max(-0.9, Math.min(0.9, boardGroupRef.current.rotation.x));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch Support for Tablets & Mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsRotatingAuto(false);
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !boardGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;

      boardGroupRef.current.rotation.y += deltaX * 0.008;
      boardGroupRef.current.rotation.x += deltaY * 0.008;

      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    // Zoom on wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.y += e.deltaY * 0.006;
      cameraRef.current.position.y = Math.max(3.5, Math.min(16, cameraRef.current.position.y));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // ================= RENDER ANIMATION LOOP =================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto rotation when active
      if (isRotatingAuto && boardGroupRef.current) {
        boardGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.4) * 0.45;
      }

      // Marker pulse animation
      if (markerMeshRef.current) {
        const scale = 1 + Math.sin(elapsedTime * 5) * 0.15;
        markerMeshRef.current.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 460;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [isRotatingAuto]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-800">مستكشف لوحة Arduino UNO ثلاثي الأبعاد</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black">
                المرحلة 1: 3D Interactive Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500">
              اسحب بالفأرة لتدوير اللوحة 360 درجة، وكبّر لتفقد المنافذ والمعالج واستكشف وظيفة كل رجل
            </p>
          </div>
        </div>

        {/* View Camera Presets Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setCameraPreset('iso')}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
          >
            🔍 منظور حر 3D
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
          >
            📐 مسقط علوي
          </button>
          <button
            onClick={() => setCameraPreset('digital')}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
          >
            ⚡ المنافذ الرقمية
          </button>
          <button
            onClick={() => setCameraPreset('power')}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
          >
            🔌 الطاقة والأرضي
          </button>
          <button
            onClick={() => setCameraPreset('cpu')}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
          >
            🧠 المعالج ATmega
          </button>
        </div>
      </div>

      {/* Main 3D Canvas + Slide-in Pin Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3D WebGL Canvas Stage */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-50 to-indigo-50/70 border border-sky-200 min-h-[460px] flex flex-col justify-between p-4 shadow-inner">
          {/* Top Canvas Controls Overlay */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 text-xs text-slate-800 font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>لوحة حية: اسحب للتدوير • عجلة الفأرة للتكبير</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Auto Rotation */}
              <button
                onClick={() => setIsRotatingAuto(!isRotatingAuto)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm transition-colors ${
                  isRotatingAuto
                    ? 'bg-blue-600 border-blue-700 text-white'
                    : 'bg-white/95 border-slate-200 text-slate-700 hover:bg-sky-50'
                }`}
                title="تدوير تلقائي"
              >
                {isRotatingAuto ? 'إيقاف الدوران ⏸' : 'دوران تلقائي ▶'}
              </button>

              {/* Reset Angle Button */}
              <button
                onClick={() => setCameraPreset('iso')}
                className="p-2 rounded-xl bg-white/95 hover:bg-sky-50 border border-slate-200 text-slate-700 shadow-sm transition-colors"
                title="إعادة ضبط زاوية الرؤية"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Three.js Canvas Mount */}
          <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Bottom Interactive Hardware Quick Toggles */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="text-amber-600">⚡ تجربة مباشرة على اللوحة:</span>
              <span>مصباح D13 المدمج (L LED):</span>
            </div>

            <button
              onClick={handleToggleLed13}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black border transition-all ${
                isLed13On
                  ? 'bg-amber-400 border-amber-500 hover:bg-amber-300 text-slate-950 shadow-md'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isLed13On ? 'مضاء ON (HIGH 5V)' : 'مطفأ OFF (LOW 0V)'}</span>
            </button>
          </div>
        </div>

        {/* Right: Pin & Component Inspector Educational Panel */}
        <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Inspector Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CharacterAvatar character="sparky" size="sm" />
                <div>
                  <span className="text-xs text-amber-700 font-bold block">مختبر سباركي (Sparky)</span>
                  <h4 className="font-black text-slate-900 text-base">بطاقة تعريف المنفذ</h4>
                </div>
              </div>

              <span
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedPin.color }}
              />
            </div>

            {/* Selected Pin Details */}
            <div className="space-y-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-slate-700 border border-slate-200 shadow-sm">
                  {selectedPin.typeAr}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedPin.nameAr}</h3>
                <p className="text-xs font-mono text-slate-400">{selectedPin.nameEn}</p>
              </div>

              {/* Voltage & Electrical Specs */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500">فرق الجهد الكهربائي:</span>
                  <span className="font-black text-emerald-700 font-mono">{selectedPin.voltage}</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-normal">
                  {selectedPin.specsAr}
                </div>
              </div>

              {/* Functional Explanation */}
              <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                <span className="font-bold text-slate-900 block">الوظيفة الهندسية:</span>
                <p>{selectedPin.descriptionAr}</p>
              </div>

              {/* Lesson Connection Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>تطبيقه في رحلة المبتكر الصغير:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">{selectedPin.lessonConnectionAr}</p>
              </div>
            </div>
          </div>

          {/* Quick Pins List Selector Tabs */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>اختر منفذاً آخر للفحص:</span>
              <span className="text-[10px] text-slate-400">({filteredPins.length}) منافذ</span>
            </div>

            {/* Quick Filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterType('digital')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  filterType === 'digital' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'
                }`}
              >
                رقمي D
              </button>
              <button
                onClick={() => setFilterType('analog')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  filterType === 'analog' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'
                }`}
              >
                تناظري A
              </button>
              <button
                onClick={() => setFilterType('power')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  filterType === 'power' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'
                }`}
              >
                طاقة
              </button>
            </div>

            {/* Pin Selection Buttons Grid */}
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {filteredPins.map((pin) => {
                const isSelected = selectedPin.id === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => handleSelectPin(pin)}
                    className={`p-2 rounded-xl text-right text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm font-black'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className="truncate">{pin.nameEn}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 mr-1"
                      style={{ backgroundColor: pin.color }}
                    />
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

