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
      'يا أصدقائي المبتكرين! بينما كنا نستكشف قبو مختبر الروبوتات القديم، عثرنا على صندوق كنز حديدي مصفح! 🗝️',
      'صديقنا "بريني" 🧠 فحص القفل الإلكتروني وقال: هذا قفل ذكي يتطلب ثلاثة مفاتيح: مفتاح الجهد التناظري، مفتاح النسبة المئوية، ومفتاح الكلمة السرية.',
      'لكن "غليتش" المشاغب 👾 كان هناك قبلنا وعبث بذاكرة المعالج! لقد أعلن عن متغير السرعة كنوع char حرفي، وخزن قراءة الحساس 1023 في متغير byte الذي لا يتسع لأكثر من 255 ففاضت الذاكرة (Overflow)!',
      'بسبب هذه الفوضى، تجمد القفل وظن أن الصندوق فارغ! نحن بحاجة لفرز المتغيرات واستخدام المقاومة المتغيرة لقراءة الجهد الصحيح وفتح الكنز!',
    ],
    glitchActionAr: 'وضع غليتش نصوصاً في متغيرات أرقام صحيحة، وتسبب في فيضان ذاكرة المتغيرات وتلف معادلة تحويل الجهد التناظري.',
    callToActionAr: 'دعونا نفتح محرّر الكود ولوحة التجارب، ونبرهن لغليتش أن عقولنا تفهم كيف تعمل الذاكرة!',
  },

  theory: {
    titleAr: 'ما هو المتغير وكيف تفهم لوحة الآردوينو الإشارات التناظرية؟',
    summaryAr: 'المتغير هو مساحة محجوزة في ذاكرة الحاسوب تحمل اسماً ونوعاً وقيمة، والآردوينو يمتلك محولاً تناظرياً رقمياً (ADC) يترجم الجهد الكهربائي إلى أرقام.',
    sections: [
      {
        headingAr: '1. المتغير مثل صندوق تخزين عليه ملصق',
        contentAr: 'تخيّل أن لديك صناديق بأحجام وأشكال مختلفة: صندوق مخصص للأعداد الصحيحة فقط (int)، وصندوق للأعداد التي تحتوي على فواصل عشرية (float)، وصندوق صغير جداً يحمل بطاقة "صح أو خطأ" فقط (bool)، وصندوق لحرف واحد (char). لا يمكنك وضع حذاء في علبة كبريت، ولا يمكنك وضع نص طويل في متغير int!',
        codeExample: `int secretCode = 542;       // عدد صحيح (2 بايت)
float voltage = 3.75;       // عدد عشري (4 بايت)
bool isVaultOpen = false;   // منطقي (true أو false)
char grade = 'A';           // حرف مفرد
String secretPass = "OPEN"; // نص كامل`,
        noteAr: 'تسمية المتغيرات يجب أن تبدأ بحرف، ولا تحتوي على مسافات، وتكتب بأسلوب camelCase مثل secretCode.',
      },
      {
        headingAr: '2. الفرق الحاسم بين الإشارة الرقمية والتناظرية',
        contentAr: 'الإشارة الرقمية (Digital) لها حالتان فقط: إما 0 (إطفاء - 0V) أو 1 (تشغيل - 5V) مثل مفتاح الضوء. أما الإشارة التناظرية (Analog) فهي مستمرة وتتدرج بسلاسة في الطبيعة (مثل درجة الحرارة، شدة الضوء، أو دوران مقبض الصوت).',
        codeExample: `int rawValue = analogRead(A0); // يقرأ جهداً من 0 إلى 5 فولت ويحوله لرقم بين 0 و 1023`,
        noteAr: 'دقة الآردوينو 10-bit، وهذا يعني 2 مرفوعة للقوة 10 = 1024 مستوى (من 0 إلى 1023). الصفر يمثل 0V، و 1023 تمثل 5V.',
      },
      {
        headingAr: '3. السحر الرياضي لدالة map()',
        contentAr: 'إذا كانت المقاومة المتغيرة تعطينا قيماً من 0 إلى 1023، ولكننا نريد التحكم في شدة إضاءة مصباح LED التي تقبل فقط قيماً من 0 إلى 255 (عبر analogWrite)، فكيف نحول النطاق؟ نستخدم دالة الخريطة الرياضية map()!',
        codeExample: `int brightness = map(rawValue, 0, 1023, 0, 255);
analogWrite(LED_PIN, brightness);`,
        noteAr: 'دالة map تقوم بعملية تناسب ثلاثي خطية فورية دون أن تضطر لكتابة معادلات الضرب والقسمة يدوياً.',
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
      questionAr: 'ما هو نوع المتغير الأنسب لتخزين قراءة analogRead(A0) التي تتراوح بين 0 و 1023؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'int (عدد صحيح)',
          isCorrect: true,
          explanationAr: 'نوع int يتسع لأرقام من -32768 إلى 32767، وهو كافٍ تماماً لاستيعاب المدى من 0 إلى 1023.',
        },
        {
          id: 'opt-b',
          textAr: 'bool (منطقي)',
          isCorrect: false,
          explanationAr: 'bool يقبل فقط حالتين: true أو false، ولا يستوعب أرقاماً تزيد عن 1.',
        },
        {
          id: 'opt-c',
          textAr: 'byte (بايت واحد)',
          isCorrect: false,
          explanationAr: 'byte يتسع فقط حتى 255 كحد أقصى، وقراءات analogRead تصل إلى 1023.',
        },
      ],
    },
    {
      id: 'q2',
      questionAr: 'كم يبلغ عدد المستويات المختلفة التي يستطيع منفذ الدخل التناظري في Arduino UNO قراءتها؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: '1024 مستوى (من 0 إلى 1023)',
          isCorrect: true,
          explanationAr: 'لوحة Arduino UNO تمتلك محولاً تناظرياً رقمياً (ADC) بدقة 10-bit، و 2 أس 10 يساوي 1024 مستوى رقمي.',
        },
        {
          id: 'opt-b',
          textAr: '256 مستوى فقط',
          isCorrect: false,
          explanationAr: '256 مستوى هي دقة مخرجات PWM عبر analogWrite، وليس دخل ADC التناظري.',
        },
      ],
    },
    {
      id: 'q3',
      questionAr: 'ماذا تعني النتيجة إذا أعطانا أمر analogRead(A0) القيمة 512 تقريباً؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'أن الجهد الداخل على المنفذ يساوي نصف جهد التغذية (حوالي 2.5 فولت)',
          isCorrect: true,
          explanationAr: 'بما أن 1023 تمثل 5V، فإن 512 هي نصف الـ 1023 بالضبط، مما يعني أن الجهد المطبق هو 2.5V.',
        },
        {
          id: 'opt-b',
          textAr: 'أن المنفذ تالف',
          isCorrect: false,
          explanationAr: 'القيمة 512 طبيعية تماماً عند وضع مقبض المقاومة في المنتصف.',
        },
      ],
    },
  ],
};
