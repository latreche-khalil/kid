import { LessonDetail } from '../../types/curriculum';

export const WEEK_01_LESSON: LessonDetail = {
  week: 1,
  month: 1,
  worldId: 1,
  titleAr: 'قراءة الكود واكتشاف الأخطاء البرمجية',
  titleEn: 'Code Reading & Debugging',
  missionNameAr: 'صائدو الثغرات — تحدّي الأسرع (أصفر ضد أحمر)',
  missionNameEn: 'Bug Hunters — Speed Duel (Yellow vs Red)',
  storySnippetAr: 'غليتش أفسد كود تحدّي السرعة بين اللاعبَين! أصلِح الكود ليتنافس الصديقان: زر أصفر مع لمبة صفراء ضد زر أحمر مع لمبة حمراء، والأسرع تشتعل لمبته فوراً!',
  durationMinutes: 120,
  xpReward: 150,
  badgeId: 'bug-hunter',
  isFullyImplemented: true,

  timeline: [
    {
      stage: 'story',
      titleAr: 'القصة',
      duration: 10,
      icon: 'Film',
      descriptionAr: 'قصة قصيرة تقدم المشكلة وتثير فضولك.',
    },
    {
      stage: 'theory',
      titleAr: 'اكتشف الفكرة',
      duration: 15,
      icon: 'BookOpen',
      descriptionAr: 'فهم فكرة اليوم بتجربة تفاعلية بسيطة.',
    },
    {
      stage: 'lab',
      titleAr: 'المختبر العملي',
      duration: 55,
      icon: 'Cpu',
      descriptionAr: 'استكشاف 3D، تجهيز القطع، التوصيل والبرمجة، والتجربة.',
    },
    {
      stage: 'break',
      titleAr: 'استراحة',
      duration: 5,
      icon: 'Coffee',
      descriptionAr: 'مؤقت بسيط للراحة.',
    },
    {
      stage: 'games',
      titleAr: 'اللعبة الذكية',
      duration: 15,
      icon: 'Gamepad2',
      descriptionAr: 'لعبة تفاعلية مرتبطة بمفهوم الحصة.',
    },
    {
      stage: 'quiz',
      titleAr: 'اختبر نفسك وابتكر',
      duration: 20,
      icon: 'Award',
      descriptionAr: 'اختبار قصير ثم تحدي إبداعي بثلاثة مستويات.',
    },
  ],

  objectivesAr: [
    'نفرق بين أوامر البداية `setup()` وأوامر التكرار `loop()`.',
    'نقوم بقراءة زر اللاعب الأصفر (D2) وزر اللاعب الأحمر (D3) بـ `INPUT_PULLUP`.',
    'نتحكم بإشعال لمبة الفائز: الصفراء (D4) للاعب 1 أو الحمراء (D5) للاعب 2.',
    'نستعمل `millis()` لتحديد أسرع ضغطة وإعلان الفائز بالملي ثانية!',
  ],

  conceptsAr: [
    'أوامر البداية setup() والتكرار loop()',
    'زرّان مع INPUT_PULLUP (أصفر وأحمر)',
    'إشعال لمبة الفائز (صفراء D4 وحمراء D5)',
    'ساعة millis() لحساب سرعة الضغط',
    'اكتشاف الأخطاء وإصلاحها',
  ],

  arduinoRoleAr: 'لوحة آردوينو تعمل كحكم نزيه: بعد صفارة البداية، تراقب الزرين وأول من يضغط تشعل لمبته الخاصة فوراً وتعلن فوزه!',

  story: {
    titleAr: 'غليتش يخرّب سباق السرعة!',
    characterSpeaker: 'robo',
    contentAr: [
      'أهلاً يا بطل! اليوم نُطلق سباق التحدي: زر أصفر بجانبه لمبة صفراء ضد زر أحمر بجانبه لمبة حمراء.',
      'والذي يضغط أولاً بعد صفارة البداية تشتعل لمبته الخاصة فوراً ويُعلن فائزاً!',
      'لكن المشاغب غليتش عبث بالكود فأفسد الأزرار ولم تعد اللمبات تشتعل!',
    ],
    glitchActionAr: 'عطّل غليتش إعدادات الأزرار واللمبات وجمّد السباق بأمر delay()!',
    callToActionAr: 'كيف نصلح الكود حتى تشتعل لمبة اللاعب الأسرع فور ضغطه؟',
  },

  theory: {
    titleAr: 'فكرة اليوم وخطة لعبة التحدّي 💡',
    summaryAr: 'نفهم أولاً خطة عمل السباق وأفكاره الأساسية على شكل نقاط مبسطة، قبل الانتقال للتركيب والكود.',
    planStepsAr: [
      'التجهيز: يتعرّف الآردوينو على مكان زر اللاعب الأول (الأزرق)، زر اللاعب الثاني (الأخضر)، اللمبة الحمراء، والجرس.',
      'الانتظار مع المراقبة: يختار الآردوينو وقتاً سرياً مفاجئاً قبل الإشارة، ويراقب الزرّين معاً ليكشف أي متسرّع!',
      'إشارة الانطلاق: تشتعل اللمبة الحمراء ويصدر الجرس صوت البداية، ويبدأ عدّاد الزمن فوراً.',
      'الحسم والنتيجة: أول لاعب يضغط يفوز بالجولة ويخسر الأبطأ، ثم يحسب الآردوينو زمن الفوز بالملي ثانية.',
    ],
    sections: [
      {
        headingAr: '1. تقسيم العمل: التجهيز ثم اللعب 🛠️',
        contentAr: 'يعمل الآردوينو في أي مشروع وفق خطوتين واضحتين مثل التحضير قبل المباراة:',
        bulletPointsAr: [
          'مرحلة البداية (`setup`): تعمل مرة واحدة فقط لتحديد وظيفة كل قطعة (الأزرار للاستقبال، واللمبة والجرس للإخراج).',
          'مرحلة التكرار (`loop`): تعمل باستمرار لإعادة جولات التحدّي بين اللاعبَين واحدة تلو الأخرى.',
        ],
        noteAr: 'فكّر فيها هكذا: تجهّز الملعب مرة واحدة في البداية، ثم تلعب جولات كثيرة بالداخل!',
      },
      {
        headingAr: '2. كيف يراقب الحكم اللاعبَين معاً بدون توقف؟ ⏱️',
        contentAr: 'تخيّل لو أغمض الحكم عينيه لـ 3 ثوانٍ؛ سيغش أحد اللاعبَين ويضغط قبل الإشارة! الآردوينو يتفادى هذا بهذه الطريقة:',
        bulletPointsAr: [
          'الانتظار الجامد (`delay`) يجعل اللوحة تتوقف ولا تنتبه لضغطات الأزرار أثناء الانتظار.',
          'الساعة المستمرة (`millis`) تظلّ تحسب الوقت وتراقب زر اللاعب 1 وزر اللاعب 2 في نفس اللحظة.',
          'إذا لمس أحد اللاعبَين زره قبل اشتعال اللمبة، يكشفه الآردوينو فوراً ويعلن خسارته بالتسرّع.',
        ],
        noteAr: 'الثانية الواحدة تساوي 1000 ملي ثانية (`ms`)، لذا يقيس الآردوينو سرعتك بدقة عالية!',
      },
      {
        headingAr: '3. قراءة الأزرار ومفاجأة الوقت العشوائي 🎲',
        contentAr: 'لكي تكون لعبة `1 ضد 1` عادلة ومثيرة في كل جولة نعتمد على فكرتين:',
        bulletPointsAr: [
          'تثبيت إشارة الأزرار (`INPUT_PULLUP`): يحمي الزر من القراءات الوهمية، فلا يعطي إشارة إلا عند الضغط الحقيقي.',
          'التوقيت المفاجئ المتغير: يغيّر الآردوينو مدة الانتظار في كل جولة (مثلاً بين ثانيتين و4 ثوانٍ ونصف) حتى لا يحفظها اللاعبان.',
        ],
        noteAr: 'كل جولة لها توقيت مختلف — انتبه بعينيك إلى اللمبة الحمراء ولا تتسرع!',
      },
      {
        headingAr: '4. كيف نعرف الفائز ونحسب سرعته؟ 🏆',
        contentAr: 'بمجرد اشتعال اللمبة الحمراء تبدأ لحظة الحسم:',
        bulletPointsAr: [
          'يحفظ الآردوينو وقت لحظة اشتعال اللمبة (وقت البداية).',
          'أول زر ينضغط يوقف السباق فوراً ويُسجّل وقت الضغطة (وقت النهاية).',
          'يحسب السرعة بطرح البداية من النهاية: الزمن = وقت النهاية − وقت البداية.',
        ],
        noteAr: 'الرقم الأصغر يعني استجابة أسرع؛ مثلاً `240 ms` أسرع من `380 ms`!',
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
      nameAr: 'زر اللاعب 1 الأصفر (P1 Button)',
      nameEn: 'Player 1 Yellow Button',
      count: 1,
      descriptionAr: 'الزر الخاص باللاعب الأول في المواجهة الثنائية.',
      roleAr: 'متصل بالمنفذ الرقمي D2 (مع خاصية INPUT_PULLUP).',
      icon: 'CircleDot',
    },
    {
      id: 'led-p1',
      nameAr: 'مصباح LED أصفر (لمبة اللاعب 1)',
      nameEn: 'Player 1 Yellow LED',
      count: 1,
      descriptionAr: 'يوضع بجانب الزر الأصفر ليشتعل فوراً عندما يفوز اللاعب الأول.',
      roleAr: 'القطب الموجب متصل بالمنفذ D4 عبر مقاومة 220 أوم.',
      icon: 'Sun',
    },
    {
      id: 'btn-p2',
      nameAr: 'زر اللاعب 2 الأحمر (P2 Button)',
      nameEn: 'Player 2 Red Button',
      count: 1,
      descriptionAr: 'الزر الخاص باللاعب الثاني في المواجهة الثنائية.',
      roleAr: 'متصل بالمنفذ الرقمي D3 (مع خاصية INPUT_PULLUP).',
      icon: 'Zap',
    },
    {
      id: 'led-p2',
      nameAr: 'مصباح LED أحمر (لمبة اللاعب 2)',
      nameEn: 'Player 2 Red LED',
      count: 1,
      descriptionAr: 'يوضع بجانب الزر الأحمر ليشتعل فوراً عندما يفوز اللاعب الثاني.',
      roleAr: 'القطب الموجب متصل بالمنفذ D5 عبر مقاومة 220 أوم.',
      icon: 'Sun',
    },
    {
      id: 'resistor-220',
      nameAr: 'مقاومتان كربونيتان 220 أوم',
      nameEn: '2x 220Ω Resistors',
      count: 2,
      descriptionAr: 'لحماية المصباحين الأصفر والأحمر من التلف بسبب التيار الزائد.',
      roleAr: 'توضع كل مقاومة على التوالي مع أحد المصباحين.',
      icon: 'Activity',
    },
    {
      id: 'buzzer',
      nameAr: 'طنان صوتي بيزو Buzzer',
      nameEn: 'Piezo Buzzer',
      count: 1,
      descriptionAr: 'يطلق صفارة البداية ونغمة الفوز لمن يضغط أولاً.',
      roleAr: 'متصل بالمنفذ الرقمي D9 والطرف الآخر بالأرضي GND.',
      icon: 'Volume2',
    },
    {
      id: 'breadboard',
      nameAr: 'لوحة تجارب Breadboard',
      nameEn: 'Solderless Breadboard',
      count: 1,
      descriptionAr: 'قاعدة لتوصيل الزرّين والمصباحين والطنان بدون لحام.',
      roleAr: 'توزيع التوصيلات ومسارات الأرضي GND.',
      icon: 'Grid',
    },
    {
      id: 'jumper-wires',
      nameAr: 'أسلاك توصيل مرنة Jumper Wires',
      nameEn: 'Male-to-Male Jumper Wires',
      count: 8,
      descriptionAr: 'أسلاك ملونة لتوصيل عناصر الدارة باللوحة.',
      roleAr: 'أصفر للاعب 1، أحمر للاعب 2، برتقالي للصوت، وأسود للأرضي.',
      icon: 'Cable',
    },
  ],

  circuit: {
    descriptionAr: 'نوصّل زر اللاعب 1 الأصفر (D2) ومصباحه الأصفر (D4)، وزر اللاعب 2 الأحمر (D3) ومصباحه الأحمر (D5)، مع طنان صوتي (D9).',
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
        instructionAr: 'ثبّت زر اللاعب الأول (الأصفر)، ووصّل طرفه بمنفذ D2 والطرف الآخر بالخط السالب (-).',
        color: '#EAB308',
        from: 'Arduino D2',
        to: 'زر اللاعب 1 الأصفر',
      },
      {
        step: 3,
        instructionAr: 'ضع اللمبة الصفراء بجانب الزر الأصفر: وصّل رجلها الطويلة (+) بمنفذ D4، وقصيرتها (-) عبر مقاومة 220Ω للسالب.',
        color: '#EAB308',
        from: 'Arduino D4 -> 220Ω',
        to: 'لمبة اللاعب 1 الصفراء',
        cautionAr: 'تذكر: الرجل الطويلة في اللمبة هي الموجب (+) دائماً.',
      },
      {
        step: 4,
        instructionAr: 'ثبّت زر اللاعب الثاني (الأحمر)، ووصّل طرفه بمنفذ D3 والطرف الآخر بالخط السالب (-).',
        color: '#EF4444',
        from: 'Arduino D3',
        to: 'زر اللاعب 2 الأحمر',
      },
      {
        step: 5,
        instructionAr: 'ضع اللمبة الحمراء بجانب الزر الأحمر: وصّل رجلها الطويلة (+) بمنفذ D5، وقصيرتها (-) عبر مقاومة 220Ω للسالب.',
        color: '#EF4444',
        from: 'Arduino D5 -> 220Ω',
        to: 'لمبة اللاعب 2 الحمراء',
        cautionAr: 'تأكد من تركيب المقاومة 220Ω لحماية اللمبة من الاحتراق.',
      },
      {
        step: 6,
        instructionAr: 'وصّل الطرف الموجب (+) للجرس الصوتي بمنفذ D9، والطرف السالب (-) بالخط السالب.',
        color: '#F59E0B',
        from: 'Arduino D9',
        to: 'الجرس الصوتي (+)',
      },
    ],
  },

  code: {
    brokenCode: `// ⚠️ كود غليتش المعطوب للتحدّي (أصفر ضد أحمر)
const int BTN_YELLOW = 2; // زر اللاعب الأصفر
const int BTN_RED    = 3; // زر اللاعب الأحمر
const int LED_YELLOW = 4; // لمبة اللاعب الأصفر
const int LED_RED    = 5; // لمبة اللاعب الأحمر
const int BUZZER_PIN = 9;

void setup() {
  Serial.begin(9600);
  pinMode(BTN_YELLOW, INPUT); // ⚠️ ثغرة: زر عائم بلا INPUT_PULLUP!
  pinMode(BTN_RED,    INPUT); // ⚠️ ثغرة: زر عائم أيضاً!
  // ⚠️ ثغرة: نسي غليتش تفعيل مخرجي اللمبتين LED_YELLOW و LED_RED!
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  // ⚠️ ثغرة: delay تجمد اللوحة فلا يمكن التقاط ضغطات اللاعبين!
  delay(3000);
  tone(BUZZER_PIN, 1000, 100);

  // الكود لا يشعل لمبة من يضغط أولاً!
}`,
    brokenCodeExplanationAr: 'هذا الكود يحتوي على أخطاء غليتش: نسي INPUT_PULLUP للأزرار، ونسي تفعيل مخرجي اللمبتين D4 و D5، واستخدم delay التجميدية!',
    bugsList: [
      {
        line: 10,
        bugAr: 'استخدام INPUT بدلاً من INPUT_PULLUP لزرّي اللاعبَين.',
        fixAr: 'تغييرها إلى INPUT_PULLUP على المنفذين D2 و D3 لتثبيت القراءة.',
        impactAr: 'تظهر ضغطات عشوائية خاطئة تجعل اللمبة تشتعل دون لمس الزر!',
      },
      {
        line: 12,
        bugAr: 'نسيان تعريف pinMode(LED_YELLOW, OUTPUT) و pinMode(LED_RED, OUTPUT).',
        fixAr: 'إضافة سطري تهيئة المصباحين كمخرجين للضوء في setup().',
        impactAr: 'لا تشتعل لمبة اللاعب الأصفر ولا لمبة اللاعب الأحمر عند الفوز!',
      },
      {
        line: 18,
        bugAr: 'استخدام delay() التجميدية للانتظار.',
        fixAr: 'استبدالها بمراقبة سريعة ومباشرة لأزرار اللاعبين.',
        impactAr: 'تتوقف اللوحة ولا تشعر بمن ضغط أولاً.',
      },
    ],
    repairedCode: `/*
  ======================================================
  🏆 تحدّي الأسرع (1 ضد 1) — لمبة الفائز تشتعل فوراً!
  زر أصفر + لمبة صفراء (D2 / D4) ضد زر أحمر + لمبة حمراء (D3 / D5)
  المبتكرون الصغار | Young Innovators (Arduino UNO R3)
  ======================================================
*/

const int BTN_YELLOW = 2; // زر اللاعب 1 (الأصفر)
const int BTN_RED    = 3; // زر اللاعب 2 (الأحمر)
const int LED_YELLOW = 4; // لمبة اللاعب 1 (الصفراء)
const int LED_RED    = 5; // لمبة اللاعب 2 (الحمراء)
const int BUZZER_PIN = 9; // الطنان الصوتي

void setup() {
  Serial.begin(9600);

  pinMode(BTN_YELLOW, INPUT_PULLUP);
  pinMode(BTN_RED,    INPUT_PULLUP);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED,    OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  Serial.println("======================================");
  Serial.println("🏁 تحدّي الأسرع (أصفر ضد أحمر) جاهز!");
  Serial.println("من يضغط أولاً بعد الصفارة تشتعل لمبته ويفوز!");
  Serial.println("======================================");
}

void loop() {
  // إطفاء المصباحين في بداية كل جولة
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED,    LOW);

  Serial.println("\\n⏳ استعدا! انتظروا صفارة الانطلاق...");
  delay(random(2000, 4000));

  // صفارة الانطلاق (طوووط!)
  tone(BUZZER_PIN, 1200, 200);
  unsigned long startTime = millis();

  int winner = 0;
  // مراقبة من يضغط أولاً من اللاعبَين
  while (winner == 0) {
    if (digitalRead(BTN_YELLOW) == LOW) {
      winner = 1;
    } else if (digitalRead(BTN_RED) == LOW) {
      winner = 2;
    }
    if (millis() - startTime > 5000) break;
  }

  unsigned long reactionTime = millis() - startTime;

  // إشعال لمبة الفائز وحده
  if (winner == 1) {
    digitalWrite(LED_YELLOW, HIGH); // اشتعال اللمبة الصفراء
    Serial.print("🏆 فاز اللاعب الأصفر بزمن ");
    Serial.print(reactionTime);
    Serial.println(" ms واشتعلت لمبته الصفراء!");
    tone(BUZZER_PIN, 800, 300);
  } else if (winner == 2) {
    digitalWrite(LED_RED, HIGH); // اشتعال اللمبة الحمراء
    Serial.print("🏆 فاز اللاعب الأحمر بزمن ");
    Serial.print(reactionTime);
    Serial.println(" ms واشتعلت لمبته الحمراء!");
    tone(BUZZER_PIN, 800, 300);
  } else {
    Serial.println("⏳ انتهى الوقت دون أن يضغط أحد!");
  }

  delay(3000);
}`,
    repairedCodeExplanationAr: 'يراقب الكود زري اللاعبين: زر أصفر على D2 وزر أحمر على D3. عند إطلاق صفارة البداية، أول من يضغط يكتشفه الآردوينو فوراً ويشعل لمبته الخاصة (الصفراء D4 أو الحمراء D5) احتفالاً بفوزه!',
  },

  challengeLevels: [
    {
      level: 'explorer',
      titleAr: 'مستوى المستكشف',
      titleEn: 'Explorer Tier',
      targetAudienceAr: 'للمبتدئين — تجربة المواجهة الأولى على اللوحة.',
      goalAr: 'توصيل زري اللاعبين واللمبتين الصفراء والحمراء وخوض تحدّي الأسرع.',
      tasksAr: [
        'توصيل زر اللاعب 1 (D2) ومصباحه الأصفر (D4).',
        'توصيل زر اللاعب 2 (D3) ومصباحه الأحمر (D5).',
        'لعب 5 جولات ومشاهدة اشتعال لمبة الفائز في كل جولة.',
      ],
      hintAr: 'تأكد من تركيب مقاومات 220Ω مع المصباحين لحمايتهما.',
    },
    {
      level: 'builder',
      titleAr: 'مستوى البنّاء',
      titleEn: 'Builder Tier',
      targetAudienceAr: 'للمتوسطين — إضافة نظام نقاط لبطولة من 5 جولات.',
      goalAr: 'حساب مجموع نقاط اللاعب الأصفر واللاعب الأحمر وإعلان الفائز بعد 5 نقاط!',
      tasksAr: [
        'إنشاء متغيرين: `int yellowScore = 0;` و `int redScore = 0;`.',
        'زيادة نقطة للفائز في كل جولة مع وميض لمبته مرتين.',
        'طباعة لوحة النتائج بعد كل جولة وإعلان البطل النهائي عند 5 نقاط.',
      ],
      hintAr: 'استخدم `if (yellowScore >= 5)` لتشغيل نغمة طويلة وتصفير النقاط لدوري جديد.',
    },
    {
      level: 'inventor',
      titleAr: 'مستوى المخترع',
      titleEn: 'Inventor Tier',
      targetAudienceAr: 'للمتقدمين — احتفالية خاصة بلمبة الفائز!',
      goalAr: 'جعل لمبة الفائز تومض 3 مرات احتفالية مع نغمة مخصصة لكل لاعب!',
      tasksAr: [
        'جعل لمبة اللاعب الأصفر تومض 3 مرات بنغمة حماسية عند فوزه.',
        'جعل لمبة اللاعب الأحمر تومض 3 مرات بنغمة مميزة عند فوزه.',
        'إطفاء لمبة الخاسر تماماً ليبقى التركيز على البطل.',
      ],
      hintAr: 'استخدم حلقة `for (int i = 0; i < 3; i++)` لوميض لمبة الفائز.',
    },
  ],

  inventorChallenge: {
    titleAr: 'طوّر لعبة تحدّي السرعة بطريقتك!',
    character: 'robo',
    scenarioAr:
      'نجحت في تشغيل لعبة التحدي واشتعال لمبة الفائز! الآن يريد روبو إضافة ميزة ذكية: حفظ أسرع زمن استجابة، أو دوري من 5 نقاط.',
    questionAr: 'روبو يريد تطوير اللعبة حتى تحفظ أفضل نتيجة (أقل زمن استجابة) حققها أي لاعب. كيف ستصمم وتضيف هذه الخاصية؟',
    starterPromptAr: 'اكتب فكرتك هنا بالعربية أو بكود C++ (مثال: ننشئ متغيراً لحفظ أفضل وقت ثم نقارن به)...',
    keySignals: [
      { keywords: ['متغير', 'best', 'record', 'int', 'long', 'score'], labelAr: 'تخزين القيمة في متغير' },
      { keywords: ['<', 'أقل', 'أصغر', 'مقارنة', 'if', 'شرط'], labelAr: 'مقارنة الوقت الجديد بالأفضل' },
      { keywords: ['serial', 'اطبع', 'عرض', 'println', 'نغمة', 'led'], labelAr: 'إعلان الرقم القياسي للاعبين' },
    ],
    ideas: [
      {
        id: 'best-time',
        titleAr: '🏆 حفظ أسرع زمن (Best Time)',
        descriptionAr: 'تحديث الرقم القياسي كلما حقق لاعب استجابة أسرع من المحاولات السابقة.',
        badgeAr: 'تحدي الذاكرة',
      },
      {
        id: 'score-league',
        titleAr: '🥇 دوري من 5 نقاط',
        descriptionAr: 'عدّاد نقاط للاعب الأصفر واللاعب الأحمر يعلن البطل الكبير عند الوصول إلى 5 نقاط.',
        badgeAr: 'تحدي المنافسة',
      },
      {
        id: 'winner-effects',
        titleAr: '✨ مؤثرات احتفالية للبطل',
        descriptionAr: 'وميض لمبة الفائز 5 مرات مع معزوفة نصر مميزة!',
        badgeAr: 'تحدي المؤثرات',
      },
    ],
    hintAr:
      'فكّر في صندوق تخزين اسمه bestTime يبدأ برقم كبير (مثل 9999)، وفي كل جولة نسأل: هل reactionTime < bestTime؟ إن كان أصغر نحفظه ونحتفل برقم قياسي جديد!',
  },

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
          textAr: 'تعمل مرة واحدة في البداية لتعريف أماكن الأزرار واللمبات والجرس.',
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
      questionAr: 'في مشروع التحدّي، في أي منفذين نوصل زر اللاعب الأصفر وزر اللاعب الأحمر؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'الزر الأصفر في `D2` والزر الأحمر في `D3`.',
          isCorrect: true,
          explanationAr: 'ممتاز! الأصفر على `D2` والأحمر على `D3` مع تفعيل خاصية INPUT_PULLUP.',
        },
        {
          id: 'opt-b',
          textAr: 'الزرّان معاً في منفذ واحد فقط.',
          isCorrect: false,
          explanationAr: 'لكل لاعب زر منفصل في منفذ مستقل (`D2` و`D3`) حتى يعرف الآردوينو من ضغط أولاً!',
        },
        {
          id: 'opt-c',
          textAr: 'اللاعب الأول في `GND` واللاعب الثاني في `5V`.',
          isCorrect: false,
          explanationAr: 'المنافذ الرقمية للأزرار هي `D2` و`D3`.',
        },
      ],
    },
    {
      id: 'q3',
      difficulty: 'easy',
      questionAr: 'لماذا نضع مقاومة `220Ω` مع مصابيح الـ LED؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'لتغيير لون اللمبة من الأصفر إلى الأحمر.',
          isCorrect: false,
          explanationAr: 'المقاومة لا تغيّر لون اللمبة بل تحميها من الكهرباء الزائدة!',
        },
        {
          id: 'opt-b',
          textAr: 'لتخفيف الكهرباء الزائدة وحماية اللمبة من الاحتراق.',
          isCorrect: true,
          explanationAr: 'رائع! المقاومة تعمل كحارس يمنع مرور تيار قوي يتلف مصباح الـ LED.',
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
      questionAr: 'عند تركيب المصباحين والأزرار والجرس على لوحة التجارب، ما فائدة السلك الأسود القادم من `GND`؟',
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
