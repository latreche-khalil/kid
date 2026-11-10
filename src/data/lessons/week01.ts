import { LessonDetail } from '../../types/curriculum';

export const WEEK_01_LESSON: LessonDetail = {
  week: 1,
  month: 1,
  worldId: 1,
  titleAr: 'قراءة الكود واكتشاف الأخطاء البرمجية',
  titleEn: 'Code Reading & Debugging',
  missionNameAr: 'صائدو الثغرات — لعبة سرعة الاستجابة',
  missionNameEn: 'Bug Hunters — Reaction Time Game',
  storySnippetAr: 'غليتش أفسد كود لعبة سرعة الاستجابة الخاصة بروبو! ساعدنا في فحص الكود واكتشاف الثغرات وإعادة تشغيل التحدي.',
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
      descriptionAr: 'اكتشاف تخريب غليتش لبرنامج روبو ومعرفة هدف المغامرة اليوم.',
    },
    {
      stage: 'theory',
      titleAr: 'المفاهيم والنظرية التأسيسية',
      duration: 20,
      icon: 'BookOpen',
      descriptionAr: 'فهم بنية الكود، القياس الزمني بدالة millis()، ومفهوم تصحيح الأخطاء Debugging.',
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
      descriptionAr: 'توصيل الأزرار والمصباح والطنان، وفحص الكود المعطوب، ثم رفع الكود السليم واختبار السرعة.',
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
    'فهم كيفية قياس الزمن الحقيقي بالملي ثانية باستخدام دالة millis() بدلاً من دالة delay() التوقيفية.',
    'تتبع الكود البرمجي خطوة بخطوة لاكتشاف الأخطاء المنطقية والنحوية.',
    'بناء دارة إلكترونية تفاعلية تحتوي على زرين ومصباح LED وطنان صوتي Buzzer.',
    'برمجة نظام كشف الانطلاق المبكر (False Start Anti-Cheat) لمنع الغش.',
  ],

  conceptsAr: [
    'المتغيرات وأنواعها الأساسية (int, unsigned long, bool)',
    'توليد الأرقام العشوائية باستخدام random()',
    'الشروط المنطقية (if - else)',
    'قياس الوقت اللحظي غير المعطل بدالة millis()',
    'التصحيح البرمجي واكتشاف الثغرات (Debugging)',
  ],

  arduinoRoleAr: 'لوحة آردوينو UNO تعمل كحكم دقيق في سباق سرعة رد الفعل: تنتظر زمناً عشوائياً، وتطلق إشارة الضوء والصوت، ثم تحسب الفارق الزمني اللحظي بالملي ثانية فور ضغط المتسابق للزر.',

  story: {
    titleAr: 'غليتش يخرّب ساعة الصفر!',
    characterSpeaker: 'robo',
    contentAr: [
      'مرحباً بكم يا أبطال المستقبل! أنا صديقكم "روبو" 🤖.',
      'كنت أستعد لتنظيم بطولة "أسرع منعكس عصبي" بين طلاب الأكاديمية لاختبار سرعة رد الفعل، وكتبت برنامجاً يضيء مصباحاً بعد وقت عشوائي ثم يحسب الزمن حتى يضغط المتسابق على زره.',
      'ولكن فجأة... تسلل "غليتش" المشاغب 👾 وعبث بالشفرة البرمجية! أصبحت اللعبة تعطي قيماً سالبة للوقت، ولا تنتبه لمن يغش ويضغط الزر قبل أن يضيء المصباح، بل وتجمدت اللوحة بالكامل بسبب دالة delay!',
      'أنا بحاجة إلى عقولكم النيرة وخبرتكم كصائدي ثغرات لنكشف خطايا غليتش البرمجية الأربعة، ونعيد بناء الدارة ونشغل اللعبة لنرى من بينكم صاحب أسرع رد فعل!',
    ],
    glitchActionAr: 'قام غليتش بتخريب 4 أسطر جوهرية في البرنامج، وقام بقلب معادلة حساب الوقت ليجعل النتيجة تخرج بالسالب، وعطل حماية الانطلاق المبكر!',
    callToActionAr: 'هل أنتم مستعدون لتحدي غليتش؟ فلنبدأ بفهم الدارة وتشريح الكود فوراً!',
  },

  theory: {
    titleAr: 'الأساسيات العلمية والبرمجية للمشروع',
    summaryAr: 'لبناء لعبة رد الفعل، نحتاج لفهم كيفية قياس الزمن الرقمي، ومبدأ القراءة المدخلة، والفرق الحاسم بين millis و delay.',
    sections: [
      {
        headingAr: '1. بنية كود الآردوينو: الدالتان التوأم',
        contentAr: 'كل برنامج في آردوينو يتكون حتماً من دالتين رئيسيتين: دالة `void setup()` التي تنفذ لمرة واحدة فقط عند تشغيل اللوحة أو إعادة تشغيلها لضبط المنافذ، ودالة `void loop()` التي تتكرر بلا نهاية طالما أن اللوحة متصلة بالطاقة الكهربائية.',
        codeExample: `void setup() {
  pinMode(LED_PIN, OUTPUT);    // نحدد أن المنفذ مخرج
  pinMode(BTN_PIN, INPUT_PULLUP); // نحدد أن المنفذ مدخل مع مقاومة شد
}

void loop() {
  // كود يتكرر ملايين المرات في الثانية!
}`,
        noteAr: 'تذكر: نضع أوامر التهيئة لمرة واحدة فقط في setup، أما منطق المراقبة المستمرة فنضعه في loop.',
      },
      {
        headingAr: '2. لماذا نستخدم millis() بدلاً من delay()؟',
        contentAr: 'عند استخدام دالة `delay(3000)`، يتوقف معالج الآردوينو تماماً عن التفكير ولا يستطيع قراءة أي زر أو استشعار أي حركة خلال تلك الـ 3 ثوانٍ! هذا يسمى "الكود المانع Blocking". أما دالة `millis()` فهي مثل ساعة توقيف تعمل في خلفية المعالج دون إيقافه، تخبرنا بعدد الملي ثانية التي مرت منذ تشغيل الآردوينو.',
        codeExample: `unsigned long startTime = millis(); // يسجل اللحظة الحالية بدقة بالغة`,
        noteAr: 'الدقة: ثانية واحدة = 1000 ملي ثانية (ms). رد الفعل البشري الطبيعي يتراوح بين 200 إلى 300 ملي ثانية.',
      },
      {
        headingAr: '3. منع الغش: كشف الانطلاق المبكر (False Start)',
        contentAr: 'إذا ضغط اللاعب على زر الاستجابة قبل أن يشتعل المصباح أصلاً، فهذا غش أو انطلاق مبكر! يجب على الكود مراقبة الزر طوال فترة الانتظار العشوائية، وإذا استشعر ضغطة مبكرة، يطلق صفارة تحذيرية ويلغي الجولة.',
      },
    ],
  },

  components: [
    {
      id: 'arduino-uno',
      nameAr: 'لوحة آردوينو UNO R3',
      nameEn: 'Arduino UNO R3 Board',
      count: 1,
      descriptionAr: 'العقل الإلكتروني المتحكم الذي يدير المؤقتات والمخارج الرقمية.',
      roleAr: 'معالجة زمن الاستجابة وإطلاق الإشارات.',
      icon: 'Cpu',
    },
    {
      id: 'btn-start',
      nameAr: 'زر البدء (Push Button 1)',
      nameEn: 'Start Push Button',
      count: 1,
      descriptionAr: 'زر ضاغط يبدأ الجولة الجديدة عند ضغطه من المتسابق أو الحكم.',
      roleAr: 'متصل بالمنفذ الرقمي D2 (مع خاصية INPUT_PULLUP).',
      icon: 'CircleDot',
    },
    {
      id: 'btn-react',
      nameAr: 'زر الاستجابة (Push Button 2)',
      nameEn: 'Reaction Push Button',
      count: 1,
      descriptionAr: 'الزر الذي يجب على اللاعب ضغطه بأقصى سرعة فور رؤية الضوء.',
      roleAr: 'متصل بالمنفذ الرقمي D3 (مع خاصية INPUT_PULLUP).',
      icon: 'Zap',
    },
    {
      id: 'led-signal',
      nameAr: 'مصباح LED أحمر فاقع',
      nameEn: 'Red Signal LED',
      count: 1,
      descriptionAr: 'الإشارة البصرية التي تنبه اللاعب بأن ساعة الصفر قد بدأت.',
      roleAr: 'القطب الموجب متصل بالمنفذ الرقمي D8 عبر مقاومة 220 أوم.',
      icon: 'Sun',
    },
    {
      id: 'resistor-220',
      nameAr: 'مقاومة كربونية 220 أوم',
      nameEn: '220Ω Resistor',
      count: 1,
      descriptionAr: 'لحماية مصباح الـ LED من التلف بسبب التيار الكهربائي الزائد.',
      roleAr: 'توضع على التوالي بين منفذ D8 والمصعد الأنود للـ LED.',
      icon: 'Activity',
    },
    {
      id: 'buzzer',
      nameAr: 'طنان صوتي بيزو Buzzer',
      nameEn: 'Piezo Buzzer',
      count: 1,
      descriptionAr: 'يصدر نغمة البداية وصوت الإنذار عند التسرع ونغمة الفوز السريعة.',
      roleAr: 'متصل بالمنفذ الرقمي D9 والطرف الآخر بالأرضي GND.',
      icon: 'Volume2',
    },
    {
      id: 'breadboard',
      nameAr: 'لوحة تجارب Breadboard',
      nameEn: 'Solderless Breadboard',
      count: 1,
      descriptionAr: 'قاعدة لتوصيل الأسلاك والعناصر الإلكترونية بدون لحام.',
      roleAr: 'توزيع التوصيلات ومسارات الأرضي GND.',
      icon: 'Grid',
    },
    {
      id: 'jumper-wires',
      nameAr: 'أسلاك توصيل مرنة Jumper Wires',
      nameEn: 'Male-to-Male Jumper Wires',
      count: 7,
      descriptionAr: 'أسلاك بألوان مختلفة لتوصيل اللوحة بالعناصر.',
      roleAr: 'أحمر (موجب)، أسود/أزرق (أرضي GND)، أصفر وأخضر (إشارات الأزرار).',
      icon: 'Cable',
    },
  ],

  circuit: {
    descriptionAr: 'توصيل دارة لعبة سرعة الاستجابة يعتمد على استغلال ميزة المقاومات الداخلية المدمجة في الآردوينو (INPUT_PULLUP)، مما يسهل التوصيل حيث يوصل أحد طرفي الزر بالمنفذ الرقمي والطرف الآخر بالأرضي GND مباشرة دون الحاجة لمقاومات خارجية للأزرار!',
    wiringSteps: [
      {
        step: 1,
        instructionAr: 'قم بتوصيل خط الأرضي الأزرق في لوحة التجارب (Breadboard Ground Rail) بمنفذ GND في لوحة الآردوينو باستخدام سلك أسود.',
        color: '#1E293B',
        from: 'Arduino GND',
        to: 'Breadboard Negative Rail (-)',
      },
      {
        step: 2,
        instructionAr: 'ضع مصباح LED على لوحة التجارب. وصل الطرف الطويل (الأنود الموجب) بالمنفذ الرقمي D8 عبر مقاومة 220 أوم، والطرف القصير (الكاثود السالب) بخط الأرضي GND.',
        color: '#EF4444',
        from: 'Arduino D8 -> 220Ω',
        to: 'LED Anode (+) / LED Cathode to GND',
        cautionAr: 'احرص على ألا تخلط بين طرفي الـ LED، فالطرف الطويل هو الموجب دائماً.',
      },
      {
        step: 3,
        instructionAr: 'ثبّت زر البدء (Start Button) في منتصف لوحة التجارب. وصل أحد أطرافه بمنفذ D2، والطرف المقابل بخط الأرضي GND.',
        color: '#3B82F6',
        from: 'Arduino D2',
        to: 'Start Button Pin A (Pin B -> GND)',
      },
      {
        step: 4,
        instructionAr: 'ثبّت زر الاستجابة (Reaction Button) في الجانب الآخر. وصل أحد أطرافه بمنفذ D3، والطرف المقابل بخط الأرضي GND.',
        color: '#10B981',
        from: 'Arduino D3',
        to: 'Reaction Button Pin A (Pin B -> GND)',
      },
      {
        step: 5,
        instructionAr: 'وصل الطرف الموجب للطنان الصوتي Buzzer بالمنفذ D9، والطرف السالب بخط الأرضي GND.',
        color: '#F59E0B',
        from: 'Arduino D9',
        to: 'Buzzer Positive (+) / Buzzer Negative to GND',
      },
    ],
  },

  code: {
    brokenCode: `// ⚠️ كود غليتش المعطوب المليء بالأخطاء والكمائن!
const int START_BTN = 2;
const int REACT_BTN = 3;
const int LED_PIN = 8;
const int BUZZER_PIN = 9;

void setup() {
  Serial.begin(9600);
  pinMode(START_BTN, INPUT);       // ثغرة 1: هل استخدم مقاومة شد؟
  pinMode(REACT_BTN, INPUT);       // زر عائم بدون تثبيت جهد!
  // ثغرة 2: نسي تعريف pinMode للـ LED!
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("Game Loaded... Maybe?");
}

void loop() {
  // انتظار زر البدء
  if (digitalRead(START_BTN) == HIGH) {
    Serial.println("Ready... Wait for LED!");
    
    // ثغرة 3: توقف كامل بـ delay يمنع كشف الغش المبكر!
    delay(random(2000, 5000));
    
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1000, 100);
    unsigned long startTime = millis();
    
    // انتظار ضغط زر الاستجابة
    while (digitalRead(REACT_BTN) == HIGH) {
      // انتظار...
    }
    
    unsigned long endTime = millis();
    digitalWrite(LED_PIN, LOW);
    
    // ثغرة 4: معادلة مقلوبة تعطي زمناً سالباً مستحيلاً!
    unsigned long reactionTime = startTime - endTime;
    
    Serial.print("Reaction Time: ");
    Serial.print(reactionTime);
    Serial.println(" ms");
  }
}`,
    brokenCodeExplanationAr: 'هذا الكود يبدو بريئاً للوهلة الأولى، لكنه يحتوي على 4 كوارث برمجية ارتكبها غليتش تمنعه من العمل بشكل صحيح!',
    bugsList: [
      {
        line: 9,
        bugAr: 'استخدام INPUT بدلاً من INPUT_PULLUP للأزرار.',
        fixAr: 'تغييرها إلى INPUT_PULLUP لتفعيل المقاومة الداخلية حتى لا تصبح القراءة عائمة وعشوائية (Floating Pin).',
        impactAr: 'بدون مقاومة الشد، يقرأ الزر قيماً متذبذبة عشوائية بمجرد اقتراب يدك منه دون ضغطه!',
      },
      {
        line: 11,
        bugAr: 'نسيان تعريف pinMode(LED_PIN, OUTPUT) في setup.',
        fixAr: 'إضافة السطر: pinMode(LED_PIN, OUTPUT); داخل دالة setup().',
        impactAr: 'المصباح يضيء بشكل خافت جداً أو لا يضيء نهائياً لأن المنفذ لم يُضبط كمنفذ طاقة مخرج.',
      },
      {
        line: 20,
        bugAr: 'استخدام دالة delay() التجميدية للانتظار العشوائي.',
        fixAr: 'استبدالها بحلقة فحص ذكية تراقب زر الاستجابة أثناء الانتظار لكشف الانطلاق المبكر (False Start).',
        impactAr: 'اللاعب يستطيع الضغط على الزر قبل إضاءة المصباح ولا ينكشف أمره لأن المعالج في حالة سبات!',
      },
      {
        line: 34,
        bugAr: 'معادلة حساب الوقت مقلوبة: startTime - endTime.',
        fixAr: 'تصحيح المعادلة لتصبح: reactionTime = endTime - startTime;',
        impactAr: 'تفيض المتغيرات غير السالبة (unsigned long) لتظهر قيمة رد الفعل بملايين الملي ثانية المشوهة!',
      },
    ],
    repairedCode: `/*
  ======================================================
  🏆 برنامج صائدو الثغرات — لعبة سرعة الاستجابة الرسمية
  المبتكرون الصغار | Young Innovators
  المتحكم: Arduino UNO R3
  ======================================================
*/

const int START_BTN_PIN = 2;  // زر بدء الجولة (INPUT_PULLUP)
const int REACT_BTN_PIN = 3;  // زر الاستجابة السريعة (INPUT_PULLUP)
const int LED_PIN = 8;        // مصباح إشارة البداية
const int BUZZER_PIN = 9;     // الطنان الصوتي للتنبيه والنغمات

void setup() {
  Serial.begin(9600);
  
  // ضبط المنافذ بدقة
  pinMode(START_BTN_PIN, INPUT_PULLUP);
  pinMode(REACT_BTN_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // بذر مولد الأرقام العشوائية من منفذ تناظري غير متصل لضمان عشوائية حقيقية
  randomSeed(analogRead(A0));
  
  // نغمة ترحيبية جاهزة
  tone(BUZZER_PIN, 523, 150); // نغمة دو
  delay(180);
  tone(BUZZER_PIN, 659, 200); // نغمة مي
  
  Serial.println("======================================");
  Serial.println("🚀 لعبة سرعة الاستجابة جاهزة ومحمية!");
  Serial.println("اضغط زر البدء (D2) لبدء جولة جديدة...");
  Serial.println("======================================");
}

void loop() {
  // عند استخدام INPUT_PULLUP: الضغط يعطي LOW، وعدم الضغط يعطي HIGH
  if (digitalRead(START_BTN_PIN) == LOW) {
    // مانع اهتزاز الزر (Debounce)
    delay(50);
    while (digitalRead(START_BTN_PIN) == LOW); // انتظر حتى يرفع إصبعه
    
    Serial.println("\\n🎯 بدأت الجولة! استعد وركّز بصرك على المصباح...");
    
    // زمن انتظار عشوائي بين 2000 إلى 5000 ملي ثانية
    unsigned long waitDuration = random(2000, 5001);
    unsigned long waitStart = millis();
    bool falseStartDetected = false;
    
    // مراقبة ذكية أثناء فترة الانتظار لكشف الانطلاق المبكر
    while (millis() - waitStart < waitDuration) {
      if (digitalRead(REACT_BTN_PIN) == LOW) {
        falseStartDetected = true;
        break; // ضبط اللاعب متلبساً بالغش!
      }
    }
    
    // معالجة الانطلاق المبكر (False Start)
    if (falseStartDetected) {
      Serial.println("❌ انطلاق مبكر! ضغطت الزر قبل إضاءة الضوء!");
      // صفارة إنذار منخفضة
      tone(BUZZER_PIN, 200, 600);
      delay(600);
      Serial.println("ألغيت الجولة. حاول ثانية والتزم بالقواعد!");
      return; // خروج والعودة للانتظار
    }
    
    // تشغيل المصباح وصفارة الانطلاق في نفس اللحظة بالضبط
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1200, 100);
    unsigned long startTime = millis();
    
    // انتظار ضغط اللاعب على زر الاستجابة (مع مهلة أمان 3 ثوانٍ)
    while (digitalRead(REACT_BTN_PIN) == HIGH) {
      if (millis() - startTime > 3000) {
        Serial.println("⏳ انتهى الوقت! لم تضغط الزر بالسرعة المطلوبة.");
        digitalWrite(LED_PIN, LOW);
        return;
      }
    }
    
    // تسجيل لحظة الضغط وإطفاء المصباح فوراً
    unsigned long endTime = millis();
    digitalWrite(LED_PIN, LOW);
    
    // المعادلة الصحيحة تماماً: زمن النهاية ناقص زمن البداية
    unsigned long reactionTime = endTime - startTime;
    
    // عرض النتيجة
    Serial.println("--------------------------------------");
    Serial.print("⚡ زمن استجابتك الفائق: ");
    Serial.print(reactionTime);
    Serial.println(" ملي ثانية (ms)!");
    
    // تقييم السرعة بنغمات احتفالية
    if (reactionTime < 220) {
      Serial.println("🏆 لقبك: البرق الخارق (Lightning Reflexes)!");
      playVictoryMelody();
    } else if (reactionTime < 320) {
      Serial.println("👏 لقبك: الفهد السريع (Fast Cheetah)!");
      tone(BUZZER_PIN, 880, 250);
    } else {
      Serial.println("🐢 لقبك: السلحفاة المتأملة! تدرب أكثر لتصبح أسرع.");
      tone(BUZZER_PIN, 440, 300);
    }
    Serial.println("--------------------------------------");
    delay(1000); // مهلة قبل الجولة التالية
  }
}

// دالة العزف الاحتفالي للفائزين السريعين
void playVictoryMelody() {
  tone(BUZZER_PIN, 523, 100); delay(120);
  tone(BUZZER_PIN, 659, 100); delay(120);
  tone(BUZZER_PIN, 784, 100); delay(120);
  tone(BUZZER_PIN, 1046, 300); delay(350);
}`,
    repairedCodeExplanationAr: 'تم إصلاح المشاكل الأربع بالكامل: تفعيل INPUT_PULLUP، وضبط منفذ LED، وبناء حلقة فحص غير مانعة بالـ millis تكشف الانطلاق المبكر، وحساب زمن الاستجابة الصحيح مع نغمات فوز تفاعلية!',
  },

  challengeLevels: [
    {
      level: 'explorer',
      titleAr: 'مستوى المستكشف',
      titleEn: 'Explorer Tier',
      targetAudienceAr: 'للمبتدئين — خطوات إرشادية واضحة لفهم فكرة المشروع.',
      goalAr: 'توصيل دارة اللعبة على لوحة التجارب والتأكد من عمل المصباح والزرين وقراءة سرعة الاستجابة على شاشة Serial Monitor.',
      tasksAr: [
        'توصيل خطوط الأرضي ومصباح الـ LED والزرين وفق المخطط بدقة.',
        'نسخ الكود المصحح ورفعه على لوحة آردوينو عبر كابل الـ USB.',
        'فتح شاشة Serial Monitor وضبط السرعة على 9600 Baud.',
        'تسجيل 3 قراءات متتالية لسرعة استجابتك ومقارنتها مع زميلك.',
      ],
      hintAr: 'تأكد من اختيار المنفذ الصحيح (COM Port) في برنامج Arduino IDE قبل رفع الكود.',
    },
    {
      level: 'builder',
      titleAr: 'مستوى البنّاء',
      titleEn: 'Builder Tier',
      targetAudienceAr: 'للمتوسطين — تعديل الكود وإضافة ميزات جديدة ملموسة.',
      goalAr: 'تعديل البرنامج لإضافة فترات انتظار أطول، وتصنيف درجات السرعة إلى 5 مستويات مختلفة بأصوات مميزة.',
      tasksAr: [
        'تعديل دالة الانتظار العشوائي لتصبح بين ثانية واحدة و 7 ثوانٍ: random(1000, 7001).',
        'إضافة شرط سرعة جديد للمحترفين تحت 180 ملي ثانية يعزف نغمة تيت-تيت سريعة جداً.',
        'إضافة عداد للجولات الناجحة يطبع رقم المحاولة (مثلاً: الجولة رقم #3).',
      ],
      hintAr: 'أنشئ متغيراً جديداً باسم `int roundCount = 0;` خارج الدوال وزده بمقدار 1 في كل ضغطة بداية.',
    },
    {
      level: 'inventor',
      titleAr: 'مستوى المخترع',
      titleEn: 'Inventor Tier',
      targetAudienceAr: 'للمتقدمين — هندسة حلول برمجية مستقلة وتطوير النظام بالكامل.',
      goalAr: 'برمجة نظام بطولة ثنائي (2-Player Multiplayer) بحيث يتنافس لاعبان بزرين منفصلين ويحدد الآردوينو الفائز بالملي ثانية!',
      tasksAr: [
        'إضافة زر لاعب ثانٍ على المنفذ D4 ومصباح LED ثانٍ على المنفذ D7.',
        'تعديل حلقة الرصد لتسجيل من ضغط زرّه أولاً بدقة وإعلان اسم الفائز في Serial Monitor.',
        'إطلاق صفارة احتفالية مخصصة لجهة الفائز مع وميض مصباحه الفائز 3 مرات متتالية.',
      ],
      hintAr: 'استخدم شرط `if (digitalRead(P1_BTN) == LOW && digitalRead(P2_BTN) == HIGH)` لتحديد من سبق الآخر بدقة المعالج.',
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
          textAr: 'تتكرر ملايين المرات لمراقبة الأزرار.',
          isCorrect: false,
          explanationAr: 'غير صحيح! الدالة التي تتكرر بلا توقف هي loop(). أما setup فتنفذ لمرة واحدة فقط.',
        },
        {
          id: 'opt-b',
          textAr: 'تنفذ لمرة واحدة فقط عند بدء التشغيل لتهيئة المنافذ والاتصال التسلسلي.',
          isCorrect: true,
          explanationAr: 'إجابة ممتازة! دالة setup() مصممة خصيصاً للأوامر التأسيسية التي نحتاجها مرة واحدة مثل pinMode و Serial.begin.',
        },
        {
          id: 'opt-c',
          textAr: 'تقوم بإيقاف تشغيل المعالج لتوفير الطاقة.',
          isCorrect: false,
          explanationAr: 'خطأ! المعالج يعمل بشكل نشط بعدها مباشرة لينتقل إلى دالة loop().',
        },
      ],
    },
    {
      id: 'q2',
      questionAr: 'لماذا فضّلنا استخدام دالة `millis()` بدلاً من `delay()` في مراقبة زمن الاستجابة؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'لأن millis() لا تجمد المعالج وتسمح لنا برصد الانطلاق المبكر للغشاشين لحظياً.',
          isCorrect: true,
          explanationAr: 'صحيح 100%! دالة delay() تسبب توقفاً تاماً للمعالج (Blocking)، بينما millis() تسمح لنا بالاستمرار في قراءة الأزرار بدقة.',
        },
        {
          id: 'opt-b',
          textAr: 'لأن millis() تجعل مصباح الـ LED يضيء بلون أزرق.',
          isCorrect: false,
          explanationAr: 'خطأ! لون المصباح يعتمد على نوعه الفيزيائي وليس على دوال التوقيت.',
        },
        {
          id: 'opt-c',
          textAr: 'لأن delay() تستهلك بطارية اللوحة بينما millis() لا تستهلك أي طاقة.',
          isCorrect: false,
          explanationAr: 'غير دقيق! كلاهما ينفذ على نفس المعالج، ولكن الفرق الجوهري هو تجمد تنفيذ التعليمات الأخرى.',
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
          explanationAr: 'رائع يا صائد الثغرات! نوع unsigned long لا يقبل الأرقام السالبة، وطرح عدد كبير من عدد صغير يسبب دوران القيمة إلى ملايين غير منطقية.',
        },
        {
          id: 'opt-c',
          textAr: 'سيحترق مصباح الـ LED فوراً.',
          isCorrect: false,
          explanationAr: 'طبعاً لا! هذا خطأ حسابي في ذاكرة المعالج ولا يسبب أي ضرر فيزيائي للعناصر.',
        },
      ],
    },
    {
      id: 'q4',
      questionAr: 'عند ضبط المنفذ باستخدام `INPUT_PULLUP`، ما هي القيمة التي تقرأها دالة `digitalRead()` عند الضغط على الزر المتصل بالأرضي؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'تقرأ LOW (أي صفر منطقي 0V).',
          isCorrect: true,
          explanationAr: 'إجابة صحيحة وذكية! مقاومة الشد تجعل المنفذ دائماً HIGH في الحالة العادية، وعند ضغط الزر المتصل بالأرضي يتدفق الجهد للأرضي فيقرأ المنفذ LOW.',
        },
        {
          id: 'opt-b',
          textAr: 'تقرأ HIGH دائماً ولا تتغير أبداً.',
          isCorrect: false,
          explanationAr: 'خطأ! تتغير القيمة إلى LOW فور ضغط الزر وتلامسه مع مسار GND.',
        },
        {
          id: 'opt-c',
          textAr: 'تقرأ قيمة عشوائية متذبذبة.',
          isCorrect: false,
          explanationAr: 'هذا يحدث فقط لو استخدمنا INPUT العادية بدون مقاومة شد، أما INPUT_PULLUP فتضمن استقرار الإشارة تماماً.',
        },
      ],
    },
    {
      id: 'q5',
      questionAr: 'ما الفائدة من كتابة السطر: `randomSeed(analogRead(A0));` في بداية البرنامج؟',
      category: 'multiple-choice',
      options: [
        {
          id: 'opt-a',
          textAr: 'تشغيل مروحة التبريد المدمجة في الآردوينو.',
          isCorrect: false,
          explanationAr: 'آردوينو UNO لا يحتوي على مراوح تبريد مدمجة.',
        },
        {
          id: 'opt-b',
          textAr: 'استغلال الضجيج الكهرومغناطيسي العشوائي في المنفذ غير المتصل لضمان أوقات انتظار غير متكررة في كل تشغيل.',
          isCorrect: true,
          explanationAr: 'إجابة مبهرة! بدون randomSeed، سيولد الحاسوب نفس تسلسل الأرقام العشوائية في كل مرة نعيد تشغيله، مما يتيح للاعب حفظ التوقيت والغش!',
        },
        {
          id: 'opt-c',
          textAr: 'إعادة ضبط ذاكرة الفلاش بالكامل.',
          isCorrect: false,
          explanationAr: 'لا، هذا السطر فقط يغذي دالة توليد الأرقام العشوائية بقيمة بداية فريدة.',
        },
      ],
    },
  ],
};

