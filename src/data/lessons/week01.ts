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
      descriptionAr: 'فهم بنية الكود، مراقبة زرّين في نفس الوقت بـ millis()، وسر العشوائية العادلة.',
    },
    {
      stage: 'lab',
      titleAr: 'مختبر آردوينو والتوصيل العملي',
      duration: 55,
      icon: 'Cpu',
      descriptionAr: 'توصيل زري اللاعبَين والمصباح والطنان حسب مراحل الكود، وتجربة تحدّي 1 ضد 1.',
    },
    {
      stage: 'break',
      titleAr: 'استراحة المبتكر الذكي',
      duration: 5,
      icon: 'Coffee',
      descriptionAr: 'تمارين إطالة خفيفة مع روبو بعد التركيب العملي لتجديد التركيز.',
    },
    {
      stage: 'games',
      titleAr: 'لعبة صائد الأخطاء البرمجية',
      duration: 15,
      icon: 'Gamepad2',
      descriptionAr: 'تطبيق عملي ممتع لصيد أخطاء غليتش البرمجية بعد فهم الدارة والكود الكامل.',
    },
    {
      stage: 'quiz',
      titleAr: 'التحدي النهائي واختبر نفسك',
      duration: 15,
      icon: 'Award',
      descriptionAr: 'إجراء الاختبار التفاعلي للتحقق من إتقان كل مفاهيم الدرس.',
    },
  ],

  objectivesAr: [
    'نفرق بين أوامر البداية `setup()` وأوامر التكرار `loop()`.',
    'نقوم بقراءة زر اللاعب الأول (D2) وزر اللاعب الثاني (D3) بـ `INPUT_PULLUP`.',
    'نستعمل `millis()` لمراقبة اللاعبَين معاً بدون تجميد اللعبة.',
    'نكتشف الأخطاء الأربعة في الكود ونشغّل تحدّي 1 ضد 1!',
  ],

  conceptsAr: [
    'أوامر البداية setup() والتكرار loop()',
    'زرّان للاعبَين مع INPUT_PULLUP',
    'ساعة millis() لمراقبة السباق',
    'الأرقام العشوائية random()',
    'اكتشاف الأخطاء وإصلاحها',
  ],

  arduinoRoleAr: 'لوحة آردوينو تعمل كحكم نزيه بين لاعبين: تراقب الزرّين، تشعل اللمبة فجأة، وتعلن الفائز الأسرع بالملي ثانية!',

  story: {
    titleAr: 'غليتش يخرّب بطولة 1 ضد 1!',
    characterSpeaker: 'robo',
    contentAr: [
      'أهلاً يا أبطال المستقبل! أنا صديقكم "روبو" 🤖.',
      'اليوم عندنا سباق حماس بين صديقَين (1 ضد 1): زر أزرق للاعب 1 وزر أخضر للاعب 2! من يضغط أولاً بعد اشتعال اللمبة يفوز، والمتأخر أو المتسرّع قبل الضوء يخسر!',
      'لكن "غليتش" المشاغب 👾 عبث بالكود فأفسد الأزرار، وأطفأ اللمبة، وجمّد السباق بـ delay، وقلب حساب الوقت!',
      'دوركم الآن لتصلحوا الأخطاء الأربعة وتركّبوا الدارة حتى يبدأ التحدي!',
    ],
    glitchActionAr: 'خرب غليتش إعدادات الأزرار، ونسي تعريف اللمبة، وجمّد اللعبة بـ delay، وقلب حساب الوقت!',
    callToActionAr: 'هل أنتم مستعدون؟ هيا لنكتشف الفكرة ثم نركّب الدارة!',
  },

  theory: {
    titleAr: 'كيف تعمل لعبة التحدّي؟ 💡',
    summaryAr: '4 أفكار بسيطة وسريعة تجعل سباق 1 ضد 1 عادلاً وممتعاً:',
    sections: [
      {
        headingAr: '1. أوامر البداية في setup() 🛠️',
        contentAr: 'في `void setup()` نخبّر الآردوينو بأماكن القطع: اللمبة والجرس كمخرج (OUTPUT)، وزرّي اللاعبَين مع `INPUT_PULLUP` حتى يعطي كل زر قراءة واضحة وسليمة.',
        codeExample: `void setup() {
  pinMode(LED_PIN, OUTPUT);      // مصباح الإشارة
  pinMode(P1_BTN, INPUT_PULLUP); // زر اللاعب 1 (الأزرق - D2)
  pinMode(P2_BTN, INPUT_PULLUP); // زر اللاعب 2 (الأخضر - D3)
}`,
        noteAr: 'تذكر: عند الضغط على الزر تصبح القراءة LOW، وعند تركه تكون HIGH.',
      },
      {
        headingAr: '2. ساعة millis() السريعة ⏱️',
        contentAr: 'أمر `delay()` يجعل الآردوينو يتوقف ولا ينتبه لو غش أحد اللاعبين وضغط مبكراً! أما `millis()` فتعمل مثل ساعة توقيت لا تتوقف: تراقب الزرّين معاً لتمسك المتسرّع فوراً.',
        codeExample: `while (millis() - waitStart < waitDuration) {
  if (digitalRead(P1_BTN) == LOW) { /* خسر اللاعب 1 بالتسرّع! */ }
  if (digitalRead(P2_BTN) == LOW) { /* خسر اللاعب 2 بالتسرّع! */ }
}`,
        noteAr: 'الثانية الواحدة = 1000 ملي ثانية (ms)!',
      },
      {
        headingAr: '3. كيف نعرف الفائز والخاسر؟ 🏆',
        contentAr: 'بمجرد أن تشتعل اللمبة الحمراء، ينتظر الآردوينو أول ضغطة: من يضغط أولاً يفوز فوراً، واللاعب الثاني يخسر!',
      },
      {
        headingAr: '4. مفاجأة الوقت العشوائي 🎲',
        contentAr: 'حتى لا يحفظ اللاعبان وقت اشتعال اللمبة، نكتب `randomSeed(analogRead(A0));` قبل `random()` فتتغير أوقات الانتظار في كل جولة.',
        codeExample: `randomSeed(analogRead(A0)); // لتغيير الوقت في كل مرة
unsigned long waitDuration = random(2000, 4501);`,
        noteAr: 'بهذه الحيلة لا أحد يعرف متى ستشتعل اللمبة!',
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
    descriptionAr: 'نوصّل زرّين متماثلين للاعب الأول (أزرق على D2) واللاعب الثاني (أخضر على D3)، مع لمبة حمراء (D8) وجرس صوتي (D9).',
    wiringSteps: [
      {
        step: 1,
        instructionAr: 'وصّل خط السالب الأزرق (-) في لوحة التجارب بمنفذ GND في الآردوينو بسلك أسود.',
        color: '#1E293B',
        from: 'Arduino GND',
        to: 'الخط السالب (-)',
      },
      {
        step: 2,
        instructionAr: 'ضع اللمبة الحمراء، ووصّل الرجل الطويلة (+) بالمنفذ D8 عبر مقاومة 220Ω، والرجل القصيرة (-) بالخط السالب.',
        color: '#EF4444',
        from: 'Arduino D8 -> 220Ω',
        to: 'الرجل الطويلة (+) / القصيرة للسالب',
        cautionAr: 'تذكر: الرجل الطويلة في اللمبة هي الموجب (+) دائماً.',
      },
      {
        step: 3,
        instructionAr: 'ثبّت زر اللاعب الأول (الأزرق)، ووصّل طرفه بمنفذ D2 والطرف الآخر بالخط السالب (-).',
        color: '#3B82F6',
        from: 'Arduino D2',
        to: 'زر اللاعب 1 الأزرق',
      },
      {
        step: 4,
        instructionAr: 'ثبّت زر اللاعب الثاني (الأخضر) بجانبه، ووصّل طرفه بمنفذ D3 والطرف الآخر بالخط السالب (-).',
        color: '#10B981',
        from: 'Arduino D3',
        to: 'زر اللاعب 2 الأخضر',
      },
      {
        step: 5,
        instructionAr: 'وصّل الطرف الموجب (+) للجرس بمنفذ D9، والطرف السالب (-) بالخط السالب.',
        color: '#F59E0B',
        from: 'Arduino D9',
        to: 'الجرس الصوتي (+)',
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
      difficulty: 'easy',
      questionAr: 'في برنامج الآردوينو، ما وظيفة دالة `void setup()`؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'تتكرر باستمرار لمراقبة أزرار اللاعبَين.',
          isCorrect: false,
          explanationAr: 'الدالة التي تتكرر هي `loop()`، أما `setup()` فتعمل مرة واحدة فقط في البداية!',
        },
        {
          id: 'opt-b',
          textAr: 'تعمل مرة واحدة في البداية لتعريف أماكن الأزرار واللمبة والجرس.',
          isCorrect: true,
          explanationAr: 'أحسنت! `setup()` تهيّئ المنافذ والشاشة مرة واحدة عند التشغيل.',
        },
        {
          id: 'opt-c',
          textAr: 'تُطفئ الآردوينو لتوفير الطاقة.',
          isCorrect: false,
          explanationAr: 'بل يبدأ الآردوينو بها ثم ينتقل مباشرة إلى `loop()`!',
        },
      ],
    },
    {
      id: 'q2',
      difficulty: 'easy',
      questionAr: 'في مشروع تحدّي `1 ضد 1`، في أي منفذين نوصل زر اللاعب الأول الأزرق وزر اللاعب الثاني الأخضر؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'اللاعب 1 في `D2` واللاعب 2 في `D3`.',
          isCorrect: true,
          explanationAr: 'ممتاز! الأزرق على `D2` والأخضر على `D3` كما برمجناهما في الكود.',
        },
        {
          id: 'opt-b',
          textAr: 'الزرّان معاً في المنفذ `D8` فقط.',
          isCorrect: false,
          explanationAr: 'المنفذ `D8` مخصّص للمبة الحمراء، ولكل لاعب منفذ خاص (`D2` و`D3`)!',
        },
        {
          id: 'opt-c',
          textAr: 'اللاعب 1 في `GND` واللاعب 2 في `D9`.',
          isCorrect: false,
          explanationAr: '`D9` للجرس الصوتي، أما أزرار اللاعبَين فتتصل بـ `D2` و`D3`.',
        },
      ],
    },
    {
      id: 'q3',
      difficulty: 'easy',
      questionAr: 'لماذا نضع مقاومة `220Ω` مع اللمبة الحمراء المتصلة بالمنفذ `D8`؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'لتغيير لون اللمبة من الأحمر إلى الأزرق.',
          isCorrect: false,
          explanationAr: 'المقاومة لا تغيّر لون اللمبة بل تحميها من الكهرباء الزائدة!',
        },
        {
          id: 'opt-b',
          textAr: 'لتخفيف الكهرباء الزائدة وحماية اللمبة من الاحتراق.',
          isCorrect: true,
          explanationAr: 'رائع! المقاومة تعمل كحارس يمنع مرور تيار قوي يتلف اللمبة الحمراء.',
        },
        {
          id: 'opt-c',
          textAr: 'لإصدار صوت الجرس بدل الضوء.',
          isCorrect: false,
          explanationAr: 'الجرس موصول في `D9`، أما مقاومة `220Ω` فوظيفتها حماية اللمبة فقط.',
        },
      ],
    },
    {
      id: 'q4',
      difficulty: 'medium',
      questionAr: 'عند تركيب اللمبة والأزرار والجرس (`D9`) على لوحة التجارب، ما فائدة السلك الأسود القادم من `GND`؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'يعطي كل القطع خط السالب `(-)` المشترك ليكتمل مسار الكهرباء.',
          isCorrect: true,
          explanationAr: 'بطل! بدون توصيل `GND` بالخط السالب لا تكتمل الدارة ولا تعمل اللمبة أو الأزرار.',
        },
        {
          id: 'opt-b',
          textAr: 'يجعل وقت اللعبة أطول في كل جولة.',
          isCorrect: false,
          explanationAr: '`GND` مسؤول عن السالب وإغلاق الدارة الكهربائية وليس عن التوقيت!',
        },
        {
          id: 'opt-c',
          textAr: 'يُستخدم فقط لتزيين لوحة التجارب.',
          isCorrect: false,
          explanationAr: 'بل هو أهم سلك مشترك لرجوع الكهرباء وإكمال الدارة!',
        },
      ],
    },
    {
      id: 'q5',
      difficulty: 'medium',
      questionAr: 'عند ضبط زر اللاعب باستخدام `INPUT_PULLUP`، متى تكون قراءته `LOW`؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'عندما يضغط اللاعب على الزر.',
          isCorrect: true,
          explanationAr: 'صحيح! الزر مع `INPUT_PULLUP` يكون `HIGH` عادةً، وعند الضغط يصبح `LOW`.',
        },
        {
          id: 'opt-b',
          textAr: 'لا تتغير القراءة أبداً وتبقى `HIGH`.',
          isCorrect: false,
          explanationAr: 'تتغير إلى `LOW` بمجرد أن يضغط اللاعب على الزر.',
        },
        {
          id: 'opt-c',
          textAr: 'تعطي أرقاماً عشوائية.',
          isCorrect: false,
          explanationAr: '`INPUT_PULLUP` تحمي الزر من القراءات العشوائية!',
        },
      ],
    },
    {
      id: 'q6',
      difficulty: 'medium',
      questionAr: 'لماذا استعملنا `millis()` بدل `delay()` أثناء انتظار اشتعال اللمبة في سباق `1 ضد 1`؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'لأن `millis()` لا تجمّد الآردوينو وتسمح بمراقبة اللاعبَين معاً لكشف المتسرّع.',
          isCorrect: true,
          explanationAr: 'ممتاز! `delay()` تجمّد اللوحة، بينما `millis()` تراقب الزرّين طول الوقت.',
        },
        {
          id: 'opt-b',
          textAr: 'لأن `millis()` تغيّر لون اللمبة إلى الأزرق.',
          isCorrect: false,
          explanationAr: 'غير صحيح، لون اللمبة لا يتغير بالكود!',
        },
        {
          id: 'opt-c',
          textAr: 'لأن `delay()` تستهلك بطارية أكثر.',
          isCorrect: false,
          explanationAr: 'السبب الحقيقي هو أن `delay()` توقف المعالج عن رؤية ضغطات اللاعبين!',
        },
      ],
    },
    {
      id: 'q7',
      difficulty: 'hard',
      questionAr: 'لماذا نكتب `randomSeed(analogRead(A0));` قبل `random()` في كود التحدّي؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'لتشغيل مروحة التبريد.',
          isCorrect: false,
          explanationAr: 'آردوينو لا يحتوي على مروحة تبريد.',
        },
        {
          id: 'opt-b',
          textAr: 'لجعل أوقات الانتظار تتغير في كل جولة فلا يحفظها اللاعبان.',
          isCorrect: true,
          explanationAr: 'أحسنت! هكذا يكون توقيت اشتعال اللمبة مفاجئاً وعادلاً في كل مرة.',
        },
        {
          id: 'opt-c',
          textAr: 'لمسح نقاط اللاعبَين.',
          isCorrect: false,
          explanationAr: 'لا، وظيفته تغيير أوقات الانتظار العشوائية في كل لعبة.',
        },
      ],
    },
    {
      id: 'q8',
      difficulty: 'hard',
      questionAr: 'تحدّي صائد الثغرات: ما مشكلة السطر الأخير في كود حساب سرعة الفائز؟',
      category: 'find-bug',
      codeSnippet: `unsigned long startTime = 2500;
unsigned long endTime = 2740;
unsigned long reactionTime = startTime - endTime;`,
      options: [
        {
          id: 'opt-a',
          textAr: 'سيعطي `240` ملي ثانية بشكل سليم.',
          isCorrect: false,
          explanationAr: 'لا، لأننا طرحنا رقم النهاية الكبير (`2740`) من رقم البداية الصغير (`2500`)!',
        },
        {
          id: 'opt-b',
          textAr: 'سيعطي رقماً ضخماً خاطئاً لأننا طرحنا الكبير من الصغير بدل `endTime - startTime`.',
          isCorrect: true,
          explanationAr: 'رائع يا صائد الثغرات! دائماً نحسب الوقت بطرح البداية من النهاية: `endTime - startTime`.',
        },
        {
          id: 'opt-c',
          textAr: 'ستنطفئ اللوحة فوراً.',
          isCorrect: false,
          explanationAr: 'لا، هو خطأ حسابي فقط في الكود!',
        },
      ],
    },
  ],
};
