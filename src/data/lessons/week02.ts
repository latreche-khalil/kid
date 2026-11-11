import { LessonDetail } from '../../types/curriculum';

export const WEEK_02_LESSON: LessonDetail = {
  week: 2,
  month: 1,
  worldId: 1,
  titleAr: 'المتغيرات وأنواع البيانات وصناديق الذاكرة',
  titleEn: 'Variables, Data Types & Analog Sensing',
  missionNameAr: 'كنز المتغيرات — القفل التناظري السري',
  missionNameEn: 'Variable Treasure — The Secret Analog Vault',
  storySnippetAr: 'غليتش خلط بين أنواع المتغيرات وتسبب في فيضان ذاكرة قفل الخزنة! ساعد روبو في فك شفرة المتغيرات وقراءة المقاومة المتغيرة لفتح كنز الابتكار.',
  durationMinutes: 120,
  xpReward: 150,
  badgeId: 'variable-master',
  isFullyImplemented: true,

  timeline: [
    {
      stage: 'story',
      titleAr: 'القصة الكرتونية ومهمة الكنز',
      duration: 10,
      icon: 'Film',
      descriptionAr: 'روبو يعثر على الخزنة المشفرة ويكتشف فوضى غليتش في صناديق الذاكرة.',
    },
    {
      stage: 'theory',
      titleAr: 'المفاهيم والنظرية: المتغيرات والدخل التناظري',
      duration: 20,
      icon: 'BookOpen',
      descriptionAr: 'فهم أنواع البيانات (int, float, char, bool) والفرق بين الإشارة الرقمية والتناظرية.',
    },
    {
      stage: 'lab',
      titleAr: 'مختبر آردوينو: المقاومة المتغيرة والتحكم التناظري',
      duration: 55,
      icon: 'Cpu',
      descriptionAr: 'توصيل المقاومة المتغيرة على المنفذ A0، ومصابيح الإشارة، وتطبيق دالة map() لقراءة وتعديل القيم.',
    },
    {
      stage: 'break',
      titleAr: 'استراحة المبتكر الذكي',
      duration: 5,
      icon: 'Coffee',
      descriptionAr: 'تمارين استرخاء الذهن مع بريني وروبو وتناول جرعة ماء.',
    },
    {
      stage: 'games',
      titleAr: 'لعبة صائد الأخطاء البرمجية',
      duration: 15,
      icon: 'Gamepad2',
      descriptionAr: 'تحدي اكتشاف أخطاء الكود وتثبيت ما تعلمناه في المختبر العملي.',
    },
    {
      stage: 'quiz',
      titleAr: 'التحدي النهائي واختبر نفسك',
      duration: 15,
      icon: 'Award',
      descriptionAr: 'اختبار المعرفة والتأكد من فهم المتغيرات والدخل التناظري.',
    },
  ],

  objectivesAr: [
    'فهم مفهوم المتغير كصندوق تخزين يحمل اسماً ونوعاً وقيمة تتغير في الذاكرة RAM.',
    'التمييز بين الأنواع الأساسية للبيانات: int (أعداد صحيحة)، float (أعداد عشرية)، bool (منطقي)، char (حرف)، و String (نص).',
    'استيعاب الفرق بين المنافذ الرقمية (0 و 1 فقط) والمنافذ التناظرية A0-A5 (قراءات من 0 إلى 1023 بدقة 10-bit ADC).',
    'توصيل وفهم مبدأ عمل المقاومة المتغيرة (Potentiometer) كمقسّم جهد (Voltage Divider).',
    'استخدام دالة map() لتحويل المدى التناظري (0-1023) إلى مدى التحكم بالجهد النبضي PWM (0-255).',
  ],

  conceptsAr: [
    'المتغيرات وإعلانها وتخصيص القيم (Variables & Assignment)',
    'أنواع البيانات الأساسية (Data Types: int, float, bool, char, String)',
    'الدخل التناظري ومحول الإشارة (Analog-to-Digital Converter 10-bit)',
    'دالة map() الرياضية لتحويل المدى',
    'مراقبة المتغيرات على الشاشة التسلسلية (Serial Monitor & Plotter)',
  ],

  arduinoRoleAr: 'لوحة آردوينو UNO تقرأ فرق الجهد المستمر المتغير من المقاومة المتغيرة عبر منفذ A0، وتحوله داخلياً إلى رقم من 0 إلى 1023، ثم تعالج المتغير للتحكم في شدة إضاءة المصباح وفتح قفل الخزنة الرقمي.',

  story: {
    titleAr: 'لغز قفل الخزنة المشفرة!',
    characterSpeaker: 'robo',
    contentAr: [
      'يا أصدقائي المبتكرين! وجدنا صندوق كنز حديدياً مقفلاً برمز سري! 🗝️',
      'نحتاج تدوير المقبض إلى الرقم الصحيح لتنفتح الخزنة وتضيء اللمبة الخضراء!',
      'لكن "غليتش" المشاغب 👾 وضع الأرقام الكبيرة في صناديق صغيرة لا تسعها، فتجمد القفل!',
      'هيا نتعلّم صناديق الأرقام (المتغيرات) ونفتح الكنز معاً!',
    ],
    glitchActionAr: 'وضع غليتش أرقاماً كبيرة في متغير صغير (byte) فاختلّت القراءة وتجمد القفل.',
    callToActionAr: 'هيا لنكتشف أنواع الصناديق البرمجية ونفتح الخزنة!',
  },

  theory: {
    titleAr: 'ما هو المتغير وكيف يقرأ الآردوينو المقبض؟ 💡',
    summaryAr: 'المتغير يشبه صندوقاً نضع فيه رقماً أو كلمة، والمقبض يعطي أرقاماً متدرجة من 0 إلى 1023.',
    sections: [
      {
        headingAr: '1. المتغير مثل صندوق تخزين عليه اسم 📦',
        contentAr: 'مثلما نضع الكتب في صندوق كبير والأقلام في علبة صغيرة، نختار لكل نوع من المعلومات صندوقاً مناسباً: `int` للأرقام الصحيحة، `float` للأرقام ذات الفاصلة، و`bool` لـ صح أو خطأ.',
        codeExample: `int secretCode = 542;       // رقم صحيح
float voltage = 3.75;       // رقم بفاصلة
bool isVaultOpen = false;   // صح أو خطأ`,
        noteAr: 'اختر اسم المتغير واضحاً وبدون مسافات مثل secretCode.',
      },
      {
        headingAr: '2. الفرق بين الإشارة العادية والمتدرجة 🎚️',
        contentAr: 'الزر العادي له حالتان فقط (0 مطفأ أو 1 مضغوط)، أما المقبض الدوّار فيتدرج بسلاسة ويقرأه الآردوينو من 0 إلى 1023 عبر `analogRead(A0)`.',
        codeExample: `int rawValue = analogRead(A0); // يعطي رقماً من 0 إلى 1023`,
        noteAr: 'كلما أدرت المقبض أكثر، زاد الرقم من 0 حتى 1023!',
      },
      {
        headingAr: '3. دالة التحويل السريعة map() ✨',
        contentAr: 'المقبض يعطي أرقاماً حتى 1023، لكن اللمبة تقبل سطوعاً من 0 إلى 255 فقط! دالة `map()` تحوّل المدى تلقائياً بكل سهولة.',
        codeExample: `int brightness = map(rawValue, 0, 1023, 0, 255);
analogWrite(LED_PIN, brightness);`,
        noteAr: 'map() تحوّل الرقم الكبير إلى رقم مناسب للمبة في سطر واحد!',
      },
    ],
  },

  components: [
    {
      id: 'arduino-uno',
      nameAr: 'لوحة آردوينو UNO R3',
      nameEn: 'Arduino UNO R3 Board',
      count: 1,
      descriptionAr: 'العقل الإلكتروني الذي يقرأ الجهد عبر المنفذ التناظري A0.',
      roleAr: 'معالجة قراءات المقاومة المتغيرة والتحكم في مخرجات PWM.',
      icon: 'Cpu',
    },
    {
      id: 'potentiometer',
      nameAr: 'مقاومة متغيرة دوارة 10kΩ',
      nameEn: 'Rotary Potentiometer 10kΩ',
      count: 1,
      descriptionAr: 'عنصر فيزيائي له ثلاثة أطراف: طرفان للتغذية وطرف وسطي يعطي جهداً متغيراً حسب زاوية الدوران.',
      roleAr: 'تعديل قيمة الجهد التناظري لضبط رمز فتح الخزنة.',
      icon: 'Sliders',
    },
    {
      id: 'led-red',
      nameAr: 'مصباح LED أحمر',
      nameEn: 'Red LED 5mm',
      count: 1,
      descriptionAr: 'مؤشر إشارة يوضح حالة القفل (مغلق).',
      roleAr: 'متصل بالمنفذ الرقمي D8.',
      icon: 'Zap',
    },
    {
      id: 'led-green',
      nameAr: 'مصباح LED أخضر',
      nameEn: 'Green LED 5mm',
      count: 1,
      descriptionAr: 'مؤشر إشارة يوضح فتح الخزنة وشدة تطابق الرمز.',
      roleAr: 'متصل بمنفذ PWM D9 للتحكم بتدرج الإضاءة.',
      icon: 'Zap',
    },
    {
      id: 'resistors',
      nameAr: 'مقاومتان 220 أوم',
      nameEn: '220Ω Resistors',
      count: 2,
      descriptionAr: 'حماية المصباحين من الاحتراق.',
      roleAr: 'توضع على التوالي مع المهبط لكل LED.',
      icon: 'Shield',
    },
    {
      id: 'buzzer',
      nameAr: 'جرس بيزو إلكتروني',
      nameEn: 'Piezo Buzzer',
      count: 1,
      descriptionAr: 'يصدر نغمات صوتية متغيرة التردد حسب زاوية المقاومة.',
      roleAr: 'متصل بالمنفذ D10.',
      icon: 'Volume2',
    },
  ],

  circuit: {
    descriptionAr: 'دارة كشف الجهد وقفل الخزنة: المقاومة المتغيرة تزود منفذ A0 بجهد مستمر متغير بين 0 و 5 فولت، والمصباح الأخضر على D9 يتدرج في إضاءته، والمصباح الأحمر على D8 يشير للقفل.',
    wiringSteps: [
      {
        step: 1,
        instructionAr: 'وصّل خط السالب الأزرق في لوحة التجارب بمنفذ GND في الآردوينو (سلك أسود)، وخط الموجب الأحمر بمنفذ 5V (سلك أحمر).',
        color: '#1E293B',
        from: 'Arduino GND / 5V',
        to: 'Breadboard Power Rails (+ / -)',
      },
      {
        step: 2,
        instructionAr: 'ثبّت المقاومة المتغيرة على لوحة التجارب: وصّل طرفها الأيمن بخط 5V، وطرفها الأيسر بخط الأرضي GND، والطرف الأوسط (Wiper) بمنفذ A0 في الآردوينو (سلك أصفر).',
        color: '#EAB308',
        from: 'Arduino Pin A0',
        to: 'Potentiometer Middle Pin (Wiper)',
      },
      {
        step: 3,
        instructionAr: 'ركّب مصباح LED الأخضر: المصعد متصل بالمنفذ D9 عبر مقاومة 220Ω، والمهبط بخط السالب.',
        color: '#10B981',
        from: 'Arduino Pin D9 (PWM)',
        to: 'Green LED Anode (+) through 220Ω',
      },
      {
        step: 4,
        instructionAr: 'ركّب مصباح LED الأحمر: المصعد متصل بالمنفذ D8 عبر مقاومة 220Ω، والمهبط بخط السالب.',
        color: '#EF4444',
        from: 'Arduino Pin D8',
        to: 'Red LED Anode (+) through 220Ω',
      },
      {
        step: 5,
        instructionAr: 'وصّل الطرف الموجب لجرس البيزو بالمنفذ D10، والطرف السالب بالأرضي GND.',
        color: '#8B5CF6',
        from: 'Arduino Pin D10',
        to: 'Piezo Buzzer (+)',
      },
    ],
  },

  code: {
    brokenCode: `// ⚠️ كود غليتش المعطوب: فوضى أنواع البيانات والذاكرة الفائضة!
const int POT_PIN = A0;
const int RED_LED = 8;
const int GREEN_LED = 9;
const int BUZZER = 10;

// ثغرة 1: خزن رقم سري يتجاوز سعة المتغير!
byte targetVaultCode = 750; // byte يتسع فقط من 0 إلى 255!

void setup() {
  Serial.begin(9600);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  // ثغرة 2: نوع المتغير خاطئ يمنع حفظ القراءات بشكل سليم!
  char sensorValue = analogRead(POT_PIN); 

  // ثغرة 3: معادلة map بأرقام مقلوبة تسبب عتمة كاملة!
  int brightness = map(sensorValue, 1023, 0, 0, 255); 

  analogWrite(GREEN_LED, brightness);

  // فحص فتح الخزنة
  if (sensorValue == targetVaultCode) {
    digitalWrite(RED_LED, LOW);
    tone(BUZZER, 1200, 200);
    Serial.println("VAULT UNLOCKED!");
  } else {
    digitalWrite(RED_LED, HIGH);
  }

  delay(100);
}`,
    brokenCodeExplanationAr: 'استخدم غليتش نوع byte لتخزين القيمة 750، وبما أن byte لا يتسع إلا حتى 255 فإن القيمة تفيض وتصبح رقماً عشوائياً! كما قرأ analogRead في متغير char حرفي بدلاً من int!',
    bugsList: [
      {
        line: 8,
        bugAr: 'استخدام نوع byte لقيمة 750 (تفيض سعة byte القصوى 255).',
        fixAr: 'استبدال byte بـ int targetVaultCode = 750;',
        impactAr: 'القيمة تصبح مشوهة (750 % 256 = 238) ولا يمكن مطابقة رمز الخزنة أبداً!',
      },
      {
        line: 18,
        bugAr: 'تخزين قراءة analogRead في متغير من نوع char حرفي.',
        fixAr: 'تغييره إلى: int sensorValue = analogRead(POT_PIN);',
        impactAr: 'نوع char مخصص لحرف مفرد (1 بايت، من -128 إلى 127) بينما analogRead يعطي أرقاماً حتى 1023!',
      },
      {
        line: 21,
        bugAr: 'قلب نطاق الدخل في دالة map() بدون مبرر.',
        fixAr: 'تصحيحها إلى: int brightness = map(sensorValue, 0, 1023, 0, 255);',
        impactAr: 'المصباح يعمل بشكل مقلوب أو يتعطل التدرج تماماً.',
      },
    ],
    repairedCode: `// 🌟 كود كنز المتغيرات السليم بعد إصلاح ثغرات غليتش
const int POT_PIN = A0;
const int RED_LED = 8;
const int GREEN_LED = 9;
const int BUZZER = 10;

const int TARGET_CODE = 750;
const int TOLERANCE = 15;

void setup() {
  Serial.begin(9600);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  int sensorValue = analogRead(POT_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  int brightness = map(sensorValue, 0, 1023, 0, 255);
  analogWrite(GREEN_LED, brightness);

  if (abs(sensorValue - TARGET_CODE) <= TOLERANCE) {
    digitalWrite(RED_LED, LOW);
    tone(BUZZER, 1500, 80);
    Serial.println("🔓 مبروك! انفتح قفل الخزنة وظهر كنز المعرفة!");
    delay(200);
  } else {
    digitalWrite(RED_LED, HIGH);
  }

  delay(80);
}`,
    repairedCodeExplanationAr: 'تم تصحيح أنواع البيانات إلى int واستخدام float لحساب الجهد الدقيق وتعديل دالة map() لتعمل بسلاسة.',
  },

  challengeLevels: [
    {
      level: 'explorer',
      titleAr: 'مستوى المستكشف: مقياس الجهد الرقمي',
      titleEn: 'Explorer Tier: Digital Voltmeter',
      targetAudienceAr: 'للمبتدئين — تعديل المتغيرات ومراقبة الشاشة.',
      goalAr: 'طباعة نسبة مئوية لدوران المقاومة من 0% إلى 100% بدلاً من الأرقام الخام.',
      tasksAr: [
        'استخدام دالة map لتحويل القراءة 0-1023 إلى 0-100.',
        'طباعة الرمز % بجانب النتيجة على الشاشة التسلسلية.',
      ],
      hintAr: 'أنشئ متغيراً باسم int percent = map(sensorValue, 0, 1023, 0, 100);',
    },
    {
      level: 'builder',
      titleAr: 'مستوى البنّاء: نظام النغمات التفاعلي',
      titleEn: 'Builder Tier: Interactive Frequency Buzzer',
      targetAudienceAr: 'للمتوسطين — ربط الحساسات بالمخرجات الصوتية.',
      goalAr: 'تغيير نغمة جرس البيزو بتردد يرتفع كلما اقتربت من الرمز السري للخزنة.',
      tasksAr: [
        'تحويل القراءة إلى تردد صوتي بين 300Hz و 2000Hz.',
        'تفعيل دالة tone(BUZZER, freq) مع تحديث النغمة.',
      ],
      hintAr: 'استخدم دالة map مع دالة tone.',
    },
    {
      level: 'inventor',
      titleAr: 'مستوى المخترع: القفل متعدد المراحل',
      titleEn: 'Inventor Tier: Multi-Stage Vault Lock',
      targetAudienceAr: 'للمتقدمين — منطق برمجي معقد وإدارة الوقت.',
      goalAr: 'برمجة قفل يتطلب تثبيت المقبض عند قيمة معينة لثانيتين لفتح الخزنة.',
      tasksAr: [
        'استخدام millis لحساب زمن بقاء المقبض في النطاق الصحيح.',
        'إصدار صوت نجاح عند انقضاء الثانيتين بنجاح.',
      ],
      hintAr: 'قارن بين millis() وزمن بداية الاستقرار.',
    },
  ],

  quiz: [
    {
      id: 'q1',
      questionAr: 'أي نوع متغير نختاره لتخزين قراءة المقبض `analogRead(A0)` (من 0 إلى 1023)؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'int (عدد صحيح)',
          isCorrect: true,
          explanationAr: 'صحيح! صندوق int يتسع للأرقام من 0 إلى 1023 وأكبر من ذلك بكثير.',
        },
        {
          id: 'opt-b',
          textAr: 'bool (صح أو خطأ)',
          isCorrect: false,
          explanationAr: 'صندوق bool يحفظ فقط true أو false ولا يحفظ أرقاماً كبيرة.',
        },
        {
          id: 'opt-c',
          textAr: 'byte (صندوق صغير حتى 255)',
          isCorrect: false,
          explanationAr: 'صندوق byte صغير ويتوقف عند 255، بينما المقبض يصل إلى 1023!',
        },
      ],
    },
    {
      id: 'q2',
      questionAr: 'ما أعلى رقم يستطيع منفذ المقبض (`analogRead`) قراءته في الآردوينو؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'من 0 إلى 1023',
          isCorrect: true,
          explanationAr: 'ممتاز! الآردوينو يقرأ دوران المقبض بأرقام متدرجة من 0 حتى 1023.',
        },
        {
          id: 'opt-b',
          textAr: 'من 0 إلى 10 فقط',
          isCorrect: false,
          explanationAr: 'المدى أكبر بكثير ويعطي تدرجاً دقيقاً من 0 إلى 1023.',
        },
      ],
    },
    {
      id: 'q3',
      questionAr: 'ماذا يعني إذا أعطانا المقبض `analogRead(A0)` الرقم 512 تقريباً؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'أن المقبض في المنتصف تقريباً (نصف الـ 1023)',
          isCorrect: true,
          explanationAr: 'رائع! بما أن الحد الأقصى هو 1023، فإن 512 يعني أن المقبض في المنتصف!',
        },
        {
          id: 'opt-b',
          textAr: 'أن القطعة معطلة',
          isCorrect: false,
          explanationAr: 'الرقم 512 طبيعي جداً ويعني أن المقبض في المنتصف تماماً.',
        },
      ],
    },
  ],
};
