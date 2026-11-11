import { LessonDetail } from '../../types/curriculum';

export const WEEK_01_LESSON: LessonDetail = {
  week: 1,
  month: 1,
  worldId: 1,
  titleAr: 'قراءة الكود واكتشاف الأخطاء البرمجية',
  titleEn: 'Code Reading & Debugging',
  missionNameAr: 'صائدو الثغرات — تحدّي الأسرع (1 ضد 1)',
  missionNameEn: 'Bug Hunters — 2-Player Speed Duel',
  storySnippetAr: 'غليتش أفسد كود تحدّي السرعة بين اللاعبَين! أصلِح الأخطاء الـ 4 ليتنافس صديقان: الأسرع يفوز والأخير أو المتسرّع يخسر!',
  durationMinutes: 120,
  xpReward: 150,
  badgeId: 'bug-hunter',
  isFullyImplemented: true,

  timeline: [
    {
      stage: 'story',
      titleAr: 'القصة الكرتونية والمهمة',
      duration: 10,
      icon: 'Film',
      descriptionAr: 'اكتشاف تخريب غليتش لبرنامج التحدّي الثنائي ومعرفة هدف المغامرة اليوم.',
    },
    {
      stage: 'theory',
      titleAr: 'المفاهيم والنظرية التأسيسية',
      duration: 20,
      icon: 'BookOpen',
      descriptionAr: 'فهم بنية الكود، مراقبة زرّين في نفس الوقت بـ millis()، وكشف الأخطاء.',
    },
    {
      stage: 'games',
      titleAr: 'ألعاب ذهنية وتدريبات ذكاء',
      duration: 15,
      icon: 'Gamepad2',
      descriptionAr: 'لعبة صائد الأخطاء وتوقع مخرجات الكود قبل تنفيذه على اللوحة.',
    },
    {
      stage: 'break',
      titleAr: 'استراحة المبتكر الذكي',
      duration: 5,
      icon: 'Coffee',
      descriptionAr: 'تمارين إطراحة خفيفة مع روبو لتجديد التركيز وتصفية الذهن.',
    },
    {
      stage: 'lab',
      titleAr: 'مختبر آردوينو والتوصيل العملي',
      duration: 55,
      icon: 'Cpu',
      descriptionAr: 'توصيل زري اللاعبَين والمصباح والطنان، وإصلاح الكود لتجربة تحدّي 1 ضد 1.',
    },
    {
      stage: 'quiz',
      titleAr: 'التحدي النهائي وحصد الوسام',
      duration: 15,
      icon: 'Award',
      descriptionAr: 'إجراء الاختبار التفاعلي، فتح المستويات الثلاثة، وحصد وسام صائد الثغرات.',
    },
  ],

  objectivesAr: [
    'التمييز بين دالة setup() ودالة loop() في بيئة عمل الآردوينو.',
    'قراءة حالة زرّين مختلفين (اللاعب 1 على D2 واللاعب 2 على D3) باستخدام INPUT_PULLUP.',
    'استخدام دالة millis() لمراقبة اللاعبَين لحظياً وكشف التسرّع قبل الإشارة دون delay() التجميدية.',
    'تحديد الفائز (أول من يضغط بعد الإشارة) والخاسر (الأخير أو من يتسرّع قبل الضوء) بدقة.',
    'تتبع الكود البرمجي خطوة بخطوة لاكتشاف الأخطاء المنطقية والنحوية.',
  ],

  conceptsAr: [
    'المتغيرات وأنواعها الأساسية (int, unsigned long, bool)',
    'توليد الأرقام العشوائية باستخدام random()',
    'الشروط المنطقية المزدوجة (&& و ||)',
    'قياس الوقت اللحظي غير المعطل بدالة millis()',
    'التصحيح البرمجي واكتشاف الثغرات (Debugging)',
  ],

  arduinoRoleAr: 'لوحة آردوينو UNO تعمل كحكم نزيه بين لاعبين (1 ضد 1): تنتظر زمناً عشوائياً مع مراقبة الزرّين لكشف المتسرع، ثم تطلق إشارة الضوء والصوت، وتعلن فوز الأسرع وخسارة الأبطأ بالملي ثانية.',

  story: {
    titleAr: 'غليتش يخرّب بطولة 1 ضد 1!',
    characterSpeaker: 'robo',
    contentAr: [
      'مرحباً بكم يا أبطال المستقبل! أنا صديقكم "روبو" 🤖.',
      'اليوم ننظم بطولة مشوقة بين صديقَين (1 ضد 1): لكل لاعب زر خاص به — الزر الأزرق للاعب الأول والزر الأخضر للاعب الثاني! ينتظر الاثنان اشتعال المصباح الأحمر، ومن يضغط أولاً بعد الإشارة يفوز فوراً والآخر هو الخاسر؛ أما من يتسرع ويضغط قبل الضوء فيخسر الجولة!',
      'ولكن فجأة... تسلل "غليتش" المشاغب 👾 وعبث بالكود! نسي تفعيل مقاومة الشد، وأغفل فحص اللاعب الثاني، وجعل حساب الوقت يخرج بالسالب، واستخدم delay التي تسمح بالغش!',
      'نحتاج ذكاءكم كصائدي ثغرات لنكشف الأخطاء الأربعة في الكود، ونركّب الدارة، ثم نبدأ التحدي بين اللاعبَين!',
    ],
    glitchActionAr: 'قام غليتش بتعطيل INPUT_PULLUP للأزرار، وحذف تعريف LED، واستخدم delay المانعة، وقلب معادلة الزمن لتخرج النتيجة سالبة ومشوهة!',
    callToActionAr: 'هل أنتما مستعدان لسباق التحدّي؟ لنصلح الكود ونبدأ المواجهة!',
  },

  theory: {
    titleAr: 'الأساسيات العلمية والبرمجية للتحدّي الثنائي',
    summaryAr: 'لبناء لعبة 1 ضد 1 عادلة، نحتاج لفهم دالتي setup و loop، ومراقبة زرّين معاً بـ millis()، وحساب الفرق الزمني الصحيح.',
    sections: [
      {
        headingAr: '1. بنية كود الآردوينو وتهيئة زري اللاعبَين',
        contentAr: 'كل برنامج آردوينو يبدأ بدالة `void setup()` التي تنفذ مرة واحدة لضبط المنافذ: نجعل المصباح والطنان مخرجين (OUTPUT)، ونضبط زر اللاعب 1 وزر اللاعب 2 كمدخلين مع مقاومة الشد الداخلية `INPUT_PULLUP` حتى لا تتذبذب القراءة.',
        codeExample: `void setup() {
  pinMode(LED_PIN, OUTPUT);      // مصباح الإشارة
  pinMode(P1_BTN, INPUT_PULLUP); // زر اللاعب 1 (الأزرق - D2)
  pinMode(P2_BTN, INPUT_PULLUP); // زر اللاعب 2 (الأخضر - D3)
}`,
        noteAr: 'تذكر: مع INPUT_PULLUP يصبح الزر عند الضغط LOW وعند تركه HIGH.',
      },
      {
        headingAr: '2. لماذا نستخدم millis() بدلاً من delay() في اللعب الثنائي؟',
        contentAr: 'لو استخدمنا `delay(3000)`، يتجمد الآردوينو ولا يستطيع رؤية أي لاعب يغش ويضغط قبل الضوء! أما `millis()` فتسمح لنا بكتابة حلقة تراقب **الزرّين معاً** آلاف المرات في الثانية؛ فلو تسرّع اللاعب 1 أو اللاعب 2 نخسره فوراً!',
        codeExample: `while (millis() - waitStart < waitDuration) {
  if (digitalRead(P1_BTN) == LOW) { /* تسرّع اللاعب 1 وخسر! */ }
  if (digitalRead(P2_BTN) == LOW) { /* تسرّع اللاعب 2 وخسر! */ }
}`,
        noteAr: 'ثانية واحدة = 1000 ملي ثانية (ms). أسرع اللاعبين يضغطون خلال 180–260 ملي ثانية!',
      },
      {
        headingAr: '3. حسم الفائز والخاسر بدقة المعالج',
        contentAr: 'بعد اشتعال المصباح الأحمر، تنتظر الحلقة حتى يضغط **أحد** الزرّين. أول من يصل جهده إلى LOW يتوقف عنده العداد، فيفوز بالسباق ويُسجل الآخر كأبطأ وخاسر!',
      },
    ],
  },

  components: [
    {
      id: 'arduino-uno',
      nameAr: 'لوحة آردوينو UNO R3',
      nameEn: 'Arduino UNO R3 Board',
      count: 1,
      descriptionAr: 'العقل الإلكتروني الذي يحكم بين اللاعبَين ويقيس الزمن.',
      roleAr: 'مراقبة الزرّين، تشغيل الإشارة، وحساب الفائز بالملي ثانية.',
      icon: 'Cpu',
    },
    {
      id: 'btn-p1',
      nameAr: 'زر اللاعب 1 الأزرق (P1 Button)',
      nameEn: 'Player 1 Blue Button',
      count: 1,
      descriptionAr: 'الزر الخاص باللاعب الأول في المواجهة الثنائية.',
      roleAr: 'متصل بالمنفذ الرقمي D2 (مع خاصية INPUT_PULLUP).',
      icon: 'CircleDot',
    },
    {
      id: 'btn-p2',
      nameAr: 'زر اللاعب 2 الأخضر (P2 Button)',
      nameEn: 'Player 2 Green Button',
      count: 1,
      descriptionAr: 'الزر الخاص باللاعب الثاني في المواجهة الثنائية.',
      roleAr: 'متصل بالمنفذ الرقمي D3 (مع خاصية INPUT_PULLUP).',
      icon: 'Zap',
    },
    {
      id: 'led-signal',
      nameAr: 'مصباح LED أحمر فاقع',
      nameEn: 'Red Signal LED',
      count: 1,
      descriptionAr: 'الإشارة البصرية التي تعلن لحظة السماح بالضغط لكلا اللاعبين.',
      roleAr: 'القطب الموجب متصل بالمنفذ الرقمي D8 عبر مقاومة 220 أوم.',
      icon: 'Sun',
    },
    {
      id: 'resistor-220',
      nameAr: 'مقاومة كربونية 220 أوم',
      nameEn: '220Ω Resistor',
      count: 1,
      descriptionAr: 'لحماية مصباح الـ LED من التلف بسبب التيار الزائد.',
      roleAr: 'توضع على التوالي بين منفذ D8 ومصباح الـ LED.',
      icon: 'Activity',
    },
    {
      id: 'buzzer',
      nameAr: 'طنان صوتي بيزو Buzzer',
      nameEn: 'Piezo Buzzer',
      count: 1,
      descriptionAr: 'يصدر نغمة الانطلاق، وصفارة الخطأ للمتسرع، ونغمة الفوز.',
      roleAr: 'متصل بالمنفذ الرقمي D9 والطرف الآخر بالأرضي GND.',
      icon: 'Volume2',
    },
    {
      id: 'breadboard',
      nameAr: 'لوحة تجارب Breadboard',
      nameEn: 'Solderless Breadboard',
      count: 1,
      descriptionAr: 'قاعدة لتوصيل الزرّين والمصباح والطنان بدون لحام.',
      roleAr: 'توزيع التوصيلات ومسارات الأرضي GND.',
      icon: 'Grid',
    },
    {
      id: 'jumper-wires',
      nameAr: 'أسلاك توصيل مرنة Jumper Wires',
      nameEn: 'Male-to-Male Jumper Wires',
      count: 7,
      descriptionAr: 'أسلاك ملونة لتوصيل عناصر اللاعبَين باللوحة.',
      roleAr: 'أزرق للاعب 1، أخضر للاعب 2، أحمر للضوء، أصفر للصوت، وأسود للأرضي.',
      icon: 'Cable',
    },
  ],

  circuit: {
    descriptionAr: 'نوصّل زرّين متماثلين للاعب الأول (أزرق على D2) واللاعب الثاني (أخضر على D3) باستخدام INPUT_PULLUP، مع مصباح إشارة أحمر مشترك (D8) وطنان صوتي (D9).',
    wiringSteps: [
      {
        step: 1,
        instructionAr: 'وصّل خط الأرضي الأزرق في لوحة التجارب بمنفذ GND في الآردوينو باستخدام سلك أسود.',
        color: '#1E293B',
        from: 'Arduino GND',
        to: 'Breadboard Negative Rail (-)',
      },
      {
        step: 2,
        instructionAr: 'ضع مصباح LED الأحمر، ووصّل الطرف الطويل (+) بالمنفذ D8 عبر مقاومة 220Ω، والطرف القصير (-) بخط GND.',
        color: '#EF4444',
        from: 'Arduino D8 -> 220Ω',
        to: 'LED Anode (+) / LED Cathode to GND',
        cautionAr: 'الطرف الطويل للـ LED هو الموجب دائماً.',
      },
      {
        step: 3,
        instructionAr: 'ثبّت زر اللاعب الأول (الأزرق) على اللوحة. وصّل أحد طرفيه بمنفذ D2 والطرف المقابل بخط GND.',
        color: '#3B82F6',
        from: 'Arduino D2',
        to: 'Player 1 Button Pin A (Pin B -> GND)',
      },
      {
        step: 4,
        instructionAr: 'ثبّت زر اللاعب الثاني (الأخضر) بجانبه. وصّل أحد طرفيه بمنفذ D3 والطرف المقابل بخط GND.',
        color: '#10B981',
        from: 'Arduino D3',
        to: 'Player 2 Button Pin A (Pin B -> GND)',
      },
      {
        step: 5,
        instructionAr: 'وصّل الطرف الموجب للطنان الصوتي Buzzer بالمنفذ D9، والطرف السالب بخط GND.',
        color: '#F59E0B',
        from: 'Arduino D9',
        to: 'Buzzer Positive (+) / Buzzer Negative to GND',
      },
    ],
  },

  code: {
    brokenCode: `// ⚠️ كود غليتش المعطوب للتحدّي الثنائي (مليء بالأخطاء!)
const int P1_BTN = 2;    // زر اللاعب 1 (الأزرق)
const int P2_BTN = 3;    // زر اللاعب 2 (الأخضر)
const int LED_PIN = 8;
const int BUZZER_PIN = 9;

void setup() {
  Serial.begin(9600);
  pinMode(P1_BTN, INPUT);   // ثغرة 1: زر عائم بلا INPUT_PULLUP!
  pinMode(P2_BTN, INPUT);   // زر عائم للاعب الثاني أيضاً!
  // ثغرة 2: نسي تعريف pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  Serial.println("Get Ready 1v1!");

  // ثغرة 3: delay تجمد الآردوينو ولا تكشف من تسرّع قبل الإشارة!
  delay(random(2000, 4500));

  digitalWrite(LED_PIN, HIGH);
  tone(BUZZER_PIN, 1000, 100);
  unsigned long startTime = millis();

  // انتظار أول من يضغط من اللاعبَين
  while (digitalRead(P1_BTN) == HIGH && digitalRead(P2_BTN) == HIGH) {
    // انتظار...
  }

  unsigned long endTime = millis();
  digitalWrite(LED_PIN, LOW);

  // ثغرة 4: معادلة مقلوبة تعطي زمناً سالباً مشوهاً!
  unsigned long reactionTime = startTime - endTime;
  Serial.print("Speed: ");
  Serial.println(reactionTime);
  delay(2000);
}`,
    brokenCodeExplanationAr: 'هذا الكود يحتوي على 4 أخطاء ارتكبها غليتش: نسي INPUT_PULLUP للأزرار، ونسي مخرج LED، واستخدم delay التي تعطل كشف التسرع، وقلب معادلة الزمن!',
    bugsList: [
      {
        line: 9,
        bugAr: 'استخدام INPUT بدلاً من INPUT_PULLUP لزرّي اللاعبَين.',
        fixAr: 'تغييرها إلى INPUT_PULLUP على المنفذين D2 و D3 لتثبيت الجهد.',
        impactAr: 'تظهر ضغطات وهمية عشوائية تجعل اللاعب يخسر دون أن يلمس الزر!',
      },
      {
        line: 11,
        bugAr: 'نسيان تعريف pinMode(LED_PIN, OUTPUT) في setup().',
        fixAr: 'إضافة السطر: pinMode(LED_PIN, OUTPUT); داخل setup().',
        impactAr: 'لا يضيء المصباح الأحمر بوضوح فلا يعرف اللاعبان متى يبدآن!',
      },
      {
        line: 18,
        bugAr: 'استخدام delay() التجميدية للانتظار العشوائي.',
        fixAr: 'استبدالها بحلقة millis() تراقب زري اللاعبَين معاً لكشف الانطلاق المبكر.',
        impactAr: 'يمكن لأحد اللاعبَين الغش والضغط مبكراً قبل الإشارة دون خسارة!',
      },
      {
        line: 33,
        bugAr: 'معادلة الزمن مقلوبة: startTime - endTime.',
        fixAr: 'تصحيحها إلى: reactionTime = endTime - startTime;',
        impactAr: 'تخرج سرعة الفائز برقم ضخم خاطئ بدلاً من الملي ثانية الحقيقية.',
      },
    ],
    repairedCode: `/*
  ======================================================
  🏆 تحدّي الأسرع (1 ضد 1) — الأول يفوز والأخير يخسر!
  المبتكرون الصغار | Young Innovators (Arduino UNO R3)
  ======================================================
*/

const int P1_BTN = 2;     // زر اللاعب 1 الأزرق (INPUT_PULLUP)
const int P2_BTN = 3;     // زر اللاعب 2 الأخضر (INPUT_PULLUP)
const int LED_PIN = 8;    // مصباح الإشارة المشترك
const int BUZZER_PIN = 9; // الطنان الصوتي

void setup() {
  Serial.begin(9600);

  pinMode(P1_BTN, INPUT_PULLUP);
  pinMode(P2_BTN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  randomSeed(analogRead(A0));

  Serial.println("======================================");
  Serial.println("🏁 تحدّي 1 ضد 1 جاهز!");
  Serial.println("الأول بعد الضوء يفوز — والأخير أو المتسرّع يخسر!");
  Serial.println("======================================");
}

void loop() {
  Serial.println("\\n⏳ استعدا! جولة جديدة تبدأ خلال لحظات...");
  delay(1500);

  unsigned long waitDuration = random(2000, 4501);
  unsigned long waitStart = millis();

  // مراقبة اللاعبَين معاً لكشف من يتسرّع قبل اشتعال اللمبة!
  while (millis() - waitStart < waitDuration) {
    if (digitalRead(P1_BTN) == LOW) {
      Serial.println("❌ تسرّع اللاعب 1 (الأزرق) قبل الإشارة وخسر! 🏆 الفائز: اللاعب 2");
      tone(BUZZER_PIN, 200, 600);
      delay(2000);
      return;
    }
    if (digitalRead(P2_BTN) == LOW) {
      Serial.println("❌ تسرّع اللاعب 2 (الأخضر) قبل الإشارة وخسر! 🏆 الفائز: اللاعب 1");
      tone(BUZZER_PIN, 200, 600);
      delay(2000);
      return;
    }
  }

  // إشارة البداية للسباق!
  digitalWrite(LED_PIN, HIGH);
  tone(BUZZER_PIN, 1200, 120);
  unsigned long startTime = millis();

  int winner = 0;
  // ننتظر حتى يضغط أحد اللاعبَين أولاً
  while (winner == 0) {
    if (digitalRead(P1_BTN) == LOW) {
      winner = 1;
    } else if (digitalRead(P2_BTN) == LOW) {
      winner = 2;
    }
    if (millis() - startTime > 4000) break;
  }

  unsigned long endTime = millis();
  digitalWrite(LED_PIN, LOW);

  if (winner == 0) {
    Serial.println("⏳ انتهى الوقت دون ضغط أي لاعب!");
    return;
  }

  unsigned long reactionTime = endTime - startTime;

  Serial.println("--------------------------------------");
  if (winner == 1) {
    Serial.print("🏆 فاز اللاعب 1 (الأزرق) بزمن ");
    Serial.print(reactionTime);
    Serial.println(" ms! — 😢 خسر اللاعب 2 (الأبطأ)");
  } else {
    Serial.print("🏆 فاز اللاعب 2 (الأخضر) بزمن ");
    Serial.print(reactionTime);
    Serial.println(" ms! — 😢 خسر اللاعب 1 (الأبطأ)");
  }
  playVictoryMelody();
  Serial.println("--------------------------------------");
  delay(2000);
}

void playVictoryMelody() {
  tone(BUZZER_PIN, 523, 100); delay(120);
  tone(BUZZER_PIN, 659, 100); delay(120);
  tone(BUZZER_PIN, 784, 150); delay(170);
}`,
    repairedCodeExplanationAr: 'يراقب الكود المصحح زري اللاعبَين (D2 و D3) في وقت واحد: من يتسرع قبل اللمبة يخسر فوراً، وبعد الإشارة يحدد أول ضغطة ليفوز صاحبها ويخسر الأبطأ!',
  },

  challengeLevels: [
    {
      level: 'explorer',
      titleAr: 'مستوى المستكشف',
      titleEn: 'Explorer Tier',
      targetAudienceAr: 'للمبتدئين — تجربة المواجهة الأولى على اللوحة.',
      goalAr: 'توصيل زري اللاعبَين واللمبة والطنان وإقامة سباق 1 ضد 1 على Serial Monitor.',
      tasksAr: [
        'توصيل زر اللاعب 1 (D2) وزر اللاعب 2 (D3) ومصباح D8 بدقة.',
        'نسخ الكود السليم ورفعه على لوحة آردوينو عبر كابل USB.',
        'لعب 5 جولات بين لاعبين ومشاهدة الفائز والخاسر في كل جولة.',
      ],
      hintAr: 'تأكد من ضبط سرعة Serial Monitor على 9600 Baud.',
    },
    {
      level: 'builder',
      titleAr: 'مستوى البنّاء',
      titleEn: 'Builder Tier',
      targetAudienceAr: 'للمتوسطين — إضافة نظام نقاط لبطولة من 5 جولات.',
      goalAr: 'حساب مجموع نقاط اللاعب 1 واللاعب 2 وإعلان بطل الكأس بعد 5 نقاط!',
      tasksAr: [
        'إنشاء متغيرين: `int p1Score = 0;` و `int p2Score = 0;`.',
        'زيادة نقطة للفائز في كل جولة (ونقطة للخصم إذا تسرّع أحدهم قبل الضوء).',
        'طباعة لوحة النتائج بعد كل جولة وإعلان البطل النهائي عند الوصول لـ 5 نقاط.',
      ],
      hintAr: 'استخدم `if (p1Score >= 5)` لتشغيل نغمة طويلة وتصفير النقاط لبداية دوري جديد.',
    },
    {
      level: 'inventor',
      titleAr: 'مستوى المخترع',
      titleEn: 'Inventor Tier',
      targetAudienceAr: 'للمتقدمين — إضافة لمبة فوز لكل لاعب!',
      goalAr: 'توصيل LED أزرق خاص باللاعب 1 (D6) وLED أخضر خاص باللاعب 2 (D7) ليضيء مصباح الفائز وحده!',
      tasksAr: [
        'توصيل LED أزرق على D6 وLED أخضر على D7 مع مقاومات 220Ω.',
        'جعل مصباح الفائز يومض 3 مرات احتفالية عند حسم الجولة.',
        'إضافة نغمة مختلفة قليلاً لفوز اللاعب 1 ونغمة مميزة للاعب 2.',
      ],
      hintAr: 'استخدم حلقة `for (int i = 0; i < 3; i++)` لوميض LED الفائز.',
    },
  ],

  quiz: [
    {
      id: 'q1',
      questionAr: 'ما هو الدور الحاسم لدالة `void setup()` في برنامج الآردوينو؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'تتكرر ملايين المرات لمراقبة أزرار اللاعبَين.',
          isCorrect: false,
          explanationAr: 'غير صحيح! الدالة التي تتكرر بلا توقف هي loop(). أما setup فتنفذ لمرة واحدة فقط.',
        },
        {
          id: 'opt-b',
          textAr: 'تنفذ لمرة واحدة فقط عند بدء التشغيل لتهيئة المنافذ والاتصال التسلسلي.',
          isCorrect: true,
          explanationAr: 'إجابة ممتازة! دالة setup() مصممة للأوامر التأسيسية التي نحتاجها مرة واحدة مثل pinMode و Serial.begin.',
        },
        {
          id: 'opt-c',
          textAr: 'تقوم بإيقاف تشغيل المعالج لتوفير الطاقة.',
          isCorrect: false,
          explanationAr: 'خطأ! المعالج يعمل بشكل نشط بعدها لينتقل إلى loop().',
        },
      ],
    },
    {
      id: 'q2',
      questionAr: 'لماذا فضّلنا استخدام دالة `millis()` بدلاً من `delay()` في سباق 1 ضد 1؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'لأن millis() لا تجمد المعالج وتسمح بمراقبة زرّي اللاعبَين معاً لكشف من يتسرّع قبل الإشارة.',
          isCorrect: true,
          explanationAr: 'صحيح 100%! دالة delay() تجمد المعالج، بينما millis() تتيح مراقبة الزرين لحظياً.',
        },
        {
          id: 'opt-b',
          textAr: 'لأن millis() تجعل مصباح الـ LED يضيء بلون أزرق.',
          isCorrect: false,
          explanationAr: 'خطأ! لون المصباح يعتمد على نوعه الفيزيائي.',
        },
        {
          id: 'opt-c',
          textAr: 'لأن delay() تستهلك طاقة إضافية.',
          isCorrect: false,
          explanationAr: 'غير دقيق! الفارق الجوهري هو تجمد تنفيذ الأوامر مع delay().',
        },
      ],
    },
    {
      id: 'q3',
      questionAr: 'في كود غليتش المعطوب، ما هي نتيجة المعادلة: `reactionTime = startTime - endTime`؟',
      category: 'find-bug',
      codeSnippet: `unsigned long startTime = 2500;
unsigned long endTime = 2740;
unsigned long reactionTime = startTime - endTime;`,
      options: [
        {
          id: 'opt-a',
          textAr: 'ستعطي 240 ملي ثانية بشكل صحيح.',
          isCorrect: false,
          explanationAr: 'خطأ! startTime أصغر من endTime، وبالتالي الناتج سيكون سالباً.',
        },
        {
          id: 'opt-b',
          textAr: 'ستعطي رقماً مشوهاً ضخماً بسبب طفح المتغير غير السالب (Underflow) لأن startTime أصغر من endTime.',
          isCorrect: true,
          explanationAr: 'رائع يا صائد الثغرات! نوع unsigned long لا يقبل الأرقام السالبة، وطرح كبير من صغير يسبب دوران القيمة.',
        },
        {
          id: 'opt-c',
          textAr: 'سيحترق مصباح الـ LED فوراً.',
          isCorrect: false,
          explanationAr: 'طبعاً لا! هذا خطأ حسابي برمجي فقط.',
        },
      ],
    },
    {
      id: 'q4',
      questionAr: 'عند ضبط زري اللاعبَين باستخدام `INPUT_PULLUP`، ما القيمة التي تقرأها `digitalRead()` عند الضغط؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'تقرأ LOW (أي صفر منطقي 0V).',
          isCorrect: true,
          explanationAr: 'إجابة صحيحة! مقاومة الشد تجعل المنفذ HIGH عادةً، وعند ضغط الزر المتصل بـ GND يصبح LOW.',
        },
        {
          id: 'opt-b',
          textAr: 'تقرأ HIGH دائماً ولا تتغير أبداً.',
          isCorrect: false,
          explanationAr: 'خطأ! تتغير القيمة إلى LOW فور ضغط الزر.',
        },
        {
          id: 'opt-c',
          textAr: 'تقرأ قيمة عشوائية متذبذبة.',
          isCorrect: false,
          explanationAr: 'هذا يحدث فقط مع INPUT العادية، أما INPUT_PULLUP فتثبت الإشارة.',
        },
      ],
    },
    {
      id: 'q5',
      questionAr: 'ما الفائدة من السطر `randomSeed(analogRead(A0));` قبل بدء جولات التحدّي؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'تشغيل مروحة التبريد في الآردوينو.',
          isCorrect: false,
          explanationAr: 'آردوينو UNO لا يحتوي على مروحة تبريد.',
        },
        {
          id: 'opt-b',
          textAr: 'ضمان أوقات انتظار عشوائية مختلفة في كل تشغيل حتى لا يحفظ اللاعبان التوقيت.',
          isCorrect: true,
          explanationAr: 'إجابة ممتازة! بذلك يصبح الانتظار مفاجئاً وعادلاً للطرفين.',
        },
        {
          id: 'opt-c',
          textAr: 'مسح النقاط تلقائياً.',
          isCorrect: false,
          explanationAr: 'لا، هو يغذي مولد الأرقام العشوائية ببذرة عشوائية.',
        },
      ],
    },
  ],
};
