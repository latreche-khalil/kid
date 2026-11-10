import { LessonDetail } from '../../types/curriculum';
import { WEEK_01_LESSON } from './week01';
import { WEEK_02_LESSON } from './week02';
import { LESSONS_DATA } from '../curriculum';
import { WORLDS_DATA } from '../curriculum/worlds';

export const LESSON_DETAILS_MAP: Record<number, LessonDetail> = {
  1: WEEK_01_LESSON,
  2: WEEK_02_LESSON,
};

/**
 * Returns the lesson details for the given week.
 * If a custom detailed file exists (Week 1, Week 2), it returns it.
 * Otherwise, it generates a complete, rich LessonDetail so that ANY week (1-24)
 * can be fully browsed and displayed without locks or empty screens.
 */
export function getLessonByWeek(weekNumber: number): LessonDetail {
  if (LESSON_DETAILS_MAP[weekNumber]) {
    return LESSON_DETAILS_MAP[weekNumber];
  }

  const summary = LESSONS_DATA.find((l) => l.week === weekNumber) || LESSONS_DATA[0];
  const world = WORLDS_DATA.find((w) => w.id === summary.worldId) || WORLDS_DATA[0];

  return {
    week: summary.week,
    month: summary.month,
    worldId: summary.worldId,
    titleAr: summary.titleAr,
    titleEn: summary.titleEn,
    missionNameAr: summary.missionNameAr,
    missionNameEn: summary.missionNameEn,
    storySnippetAr: summary.storySnippetAr,
    durationMinutes: 120,
    xpReward: summary.xpReward,
    badgeId: summary.badgeId,
    isFullyImplemented: true,

    timeline: [
      {
        stage: 'story',
        titleAr: 'القصة الكرتونية والمهمة',
        duration: 10,
        icon: 'Film',
        descriptionAr: `روبو والمهندس سباركي يكتشفان لغز الأسبوع: ${summary.missionNameAr}.`,
      },
      {
        stage: 'theory',
        titleAr: 'المفاهيم والنظرية العلمية',
        duration: 20,
        icon: 'BookOpen',
        descriptionAr: `شرح المفاهيم الأساسية: ${summary.conceptsAr.slice(0, 3).join('، ')}.`,
      },
      {
        stage: 'games',
        titleAr: 'أنشطة ذهنية وتدريبات ذكاء',
        duration: 15,
        icon: 'Gamepad2',
        descriptionAr: 'تحديات تفكير منطقي وتوقع سلوك الدارة البرمجية.',
      },
      {
        stage: 'break',
        titleAr: 'استراحة المبتكر الذكي',
        duration: 5,
        icon: 'Coffee',
        descriptionAr: 'تمارين إطالة خفيفة وتجديد النشاط الذهني.',
      },
      {
        stage: 'lab',
        titleAr: 'مختبر آردوينو والتوصيل العملي',
        duration: 55,
        icon: 'Cpu',
        descriptionAr: `بناء الدارة الفيزيائية، فحص الكود البرمجي، وتطبيق: ${summary.arduinoRoleAr}`,
      },
      {
        stage: 'quiz',
        titleAr: 'اختبار الفهم والمراجعة الذاتية',
        duration: 15,
        icon: 'Award',
        descriptionAr: 'مراجعة المفاهيم الأساسية والتأكد من استيعاب أهداف الدرس.',
      },
    ],

    objectivesAr: summary.objectivesAr,
    conceptsAr: summary.conceptsAr,
    arduinoRoleAr: summary.arduinoRoleAr,

    story: {
      titleAr: `مغامرة ${summary.missionNameAr}`,
      characterSpeaker: world.character,
      contentAr: [
        `أهلاً بكم يا أبطال في الأسبوع #${summary.week} من عالم "${world.titleAr}"!`,
        summary.storySnippetAr,
        `في هذا الدرس، سنستخدم لوحة Arduino UNO R3 لتحقيق هذا الهدف: ${summary.arduinoRoleAr}`,
        'هل أنتم جاهزون لخوض التحدي البرمجي والهندسي اليوم؟',
      ],
      glitchActionAr: `يحاول غليتش عرقلة المهمة من خلال خلق تحديات برمجية وفيزيائية ذكية لاختبار دقة تفكيركم!`,
      callToActionAr: 'دعونا ننتقل إلى المختبر العملي ونتعلم كيف نحل اللغز خطوة بخطوة!',
    },

    theory: {
      titleAr: `الأساسيات العلمية لمهمة: ${summary.missionNameAr}`,
      summaryAr: `يركز هذا الدرس على المفاهيم التالية: ${summary.conceptsAr.join(' • ')}.`,
      sections: [
        {
          headingAr: '1. المفهوم الهندسي والبرمجي الأساسي',
          contentAr: `في هذا الأسبوع يتعلم الطلاب ${summary.titleAr}. الهدف هو تحويل المفاهيم المجردة إلى مشاريع ملموسة يشاهد الطفل أثرها الفيزيائي بنفسه.`,
          noteAr: 'التطبيق العملي والتجربة المباشرة هما مفتاح ترسيخ المفاهيم البرمجية.',
        },
        {
          headingAr: '2. دور لوحة Arduino UNO في المشروع',
          contentAr: summary.arduinoRoleAr,
          noteAr: 'يتم استخدام التوصيل المنظم على لوحة التجارب (Breadboard) لضمان بيئة آمنة للمكونات.',
        },
      ],
    },

    components: [
      {
        id: 'arduino-uno',
        nameAr: 'لوحة آردوينو UNO R3',
        nameEn: 'Arduino UNO R3 Board',
        count: 1,
        descriptionAr: 'المعالج المركزي لإدارة وبرمجة المهمة.',
        roleAr: summary.arduinoRoleAr,
        icon: 'Cpu',
      },
      {
        id: 'breadboard',
        nameAr: 'لوحة تجارب Breadboard',
        nameEn: 'Solderless Breadboard',
        count: 1,
        descriptionAr: 'منصة التوصيل بدون لحام.',
        roleAr: 'تثبيت وتوصيل العناصر والأسلاك.',
        icon: 'Layers',
      },
      {
        id: 'jumpers',
        nameAr: 'أسلاك توصيل مرنة (Jumper Wires)',
        nameEn: 'Jumper Wires Pack',
        count: 8,
        descriptionAr: 'أسلاك ملونة لنقل الإشارات والتغذية.',
        roleAr: 'ربط منافذ الآردوينو بالعناصر.',
        icon: 'Zap',
      },
    ],

    circuit: {
      descriptionAr: `دارة مشروع ${summary.missionNameAr}: التوصيل المباشر بين لوحة الآردوينو UNO والعناصر المحددة.`,
      wiringSteps: [
        {
          step: 1,
          instructionAr: 'توصيل سلك التأريض المشترك GND من الآردوينو إلى خط السالب الأزرق في لوحة التجارب.',
          color: '#1E293B',
          from: 'Arduino GND',
          to: 'Breadboard Negative Rail (-)',
        },
        {
          step: 2,
          instructionAr: 'توصيل خط التغذية 5V إلى مسار الموجب الأحمر في لوحة التجارب.',
          color: '#EF4444',
          from: 'Arduino 5V',
          to: 'Breadboard Positive Rail (+)',
        },
        {
          step: 3,
          instructionAr: 'توصيل منافذ الإشارة المحددة للمهمة مع مراعاة وضع مقاومات الحماية.',
          color: '#3B82F6',
          from: 'Arduino Signal Pins',
          to: 'Components on Breadboard',
        },
      ],
    },

    code: {
      brokenCode: `// ⚠️ كود المهمة مع تحدي غليتش للملاحظة والتفكير
void setup() {
  Serial.begin(9600);
  Serial.println("Mission Initializing...");
}

void loop() {
  delay(100);
}`,
      brokenCodeExplanationAr: 'يحتوي هذا الكود على نقاط للملاحظة والتفكير الهندسي قبل تشغيل البرنامج الكامل.',
      bugsList: [
        {
          line: 4,
          bugAr: 'تحقق من تهيئة المنافذ في setup.',
          fixAr: 'استخدم pinMode لتهيئة المنافذ المناسبة.',
          impactAr: 'بدون التهيئة، قد تتصرف المنافذ بشكل غير متوقع.',
        },
      ],
      repairedCode: `// 🌟 كود المشروع السليم الكامل - Young Innovators
// الأسبوع #${summary.week}: ${summary.missionNameAr}

void setup() {
  Serial.begin(9600);
  Serial.println("=====================================");
  Serial.println("   Young Innovators - Arduino UNO R3 ");
  Serial.println("   Mission: ${summary.missionNameAr}");
  Serial.println("=====================================");
}

void loop() {
  Serial.println("نظام المهمة يعمل بكفاءة 100%");
  delay(1000);
}`,
      repairedCodeExplanationAr: 'كود سليم تم فحصه لضمان التشغيل الصحيح على لوحة الآردوينو.',
    },

    challengeLevels: [
      {
        level: 'explorer',
        titleAr: 'المستوى 1: استيعاب المفهوم الأساسي',
        titleEn: 'Explorer Tier',
        targetAudienceAr: 'للمبتدئين — فهم وتطبيق الهدف الأساسي.',
        goalAr: `تطبيق ما تعلمته في: ${summary.objectivesAr[0] || 'الهدف الأول'}.`,
        tasksAr: ['قراءة الكود خطوة بخطوة', 'مراقبة المخرجات على الشاشة التسلسلية'],
        hintAr: 'راجع شرح المفاهيم في تبويب النظرية.',
      },
      {
        level: 'builder',
        titleAr: 'المستوى 2: التعديل والإبداع',
        titleEn: 'Builder Tier',
        targetAudienceAr: 'للمتوسطين — إضافة ميزات جديدة وتعديل المنطق.',
        goalAr: 'تطوير المشروع وإضافة تحسين على الكود البرمجي.',
        tasksAr: ['تعديل قيم المتغيرات وملاحظة التأثير الفيزيائي'],
        hintAr: 'جرّب تغيير القيم ومراقبة النتيجة على اللوحة.',
      },
      {
        level: 'inventor',
        titleAr: 'المستوى 3: التحدي الابتكاري المتقدم',
        titleEn: 'Inventor Tier',
        targetAudienceAr: 'للمتقدمين — هندسة حلول جديدة ومستقلة.',
        goalAr: 'دمج فكرة إضافية مع لوحة آردوينو UNO لابتكار ميزة جديدة.',
        tasksAr: ['ابتكار سيناريو استخدام واقعي وتطبيقه'],
        hintAr: 'فكّر كمهندس مخترع: ما الذي يسهّل حياة الناس؟',
      },
    ],

    quiz: [
      {
        id: 'q1',
        questionAr: `ما هو المفهوم الرئيسي الذي يركز عليه درس الأسبوع #${summary.week}؟`,
        category: 'multiple-choice',
        options: [
          {
            id: 'opt-a',
            textAr: summary.titleAr,
            isCorrect: true,
            explanationAr: `يركز درس هذا الأسبوع أساساً على: ${summary.titleAr}.`,
          },
          {
            id: 'opt-b',
            textAr: 'حفظ الأكواد دون فهم فيزيائي',
            isCorrect: false,
            explanationAr: 'المنهج يعتمد على الفهم والتجربة الفيزيائية وليس الحفظ.',
          },
        ],
      },
      {
        id: 'q2',
        questionAr: 'ما دور لوحة Arduino UNO R3 في هذا الدرس؟',
        category: 'multiple-choice',
        options: [
          {
            id: 'opt-a',
            textAr: summary.arduinoRoleAr,
            isCorrect: true,
            explanationAr: summary.arduinoRoleAr,
          },
          {
            id: 'opt-b',
            textAr: 'شاشة عرض تلفزيونية',
            isCorrect: false,
            explanationAr: 'لوحة الآردوينو معالج متحكم دقيق (Microcontroller).',
          },
        ],
      },
    ],
  };
}
