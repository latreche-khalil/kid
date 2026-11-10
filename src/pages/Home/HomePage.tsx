import React from 'react';
import { Sparkles, Trophy, Award, ArrowLeft, ArrowRight, Play, BookOpen, Cpu, CheckCircle2, Star, Zap } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { LESSONS_DATA } from '../../data/curriculum';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { BADGES_DATA } from '../../data/badges';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { soundFx } from '../../services/sound/webAudio';

interface HomePageProps {
  activeProfile: StudentProfile;
  onNavigateToMap: () => void;
  onNavigateToLesson: (week: number) => void;
  onNavigateToGames: () => void;
  onNavigateToAchievements: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activeProfile,
  onNavigateToMap,
  onNavigateToLesson,
  onNavigateToGames,
  onNavigateToAchievements,
}) => {
  const currentWeek = activeProfile.progress.currentWeek;
  const currentLesson = LESSONS_DATA.find((l) => l.week === currentWeek) || LESSONS_DATA[0];
  const currentWorld = WORLDS_DATA.find((w) => w.id === currentLesson.worldId) || WORLDS_DATA[0];

  const completedCount = activeProfile.progress.completedWeeks.length;
  const progressPercent = Math.round((completedCount / 24) * 100);

  const earnedBadges = BADGES_DATA.filter((b) =>
    activeProfile.progress.earnedBadgeIds.includes(b.id)
  );

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section inspired by Reference Image */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-card p-6 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (Text & CTAs) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Friendly Greeting Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black">
              <span className="text-amber-500">✦</span>
              <span>مرحباً بك يا {activeProfile.nickname || activeProfile.name}!</span>
            </div>

            {/* Big Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
              مستقبلٌ مشرق <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B5A] to-orange-500">
                يبدأ بالاختراع والبرمجة
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl font-medium">
              نحن لا نقدم مجرد دروس نظرية جافة، بل رحلة تفاعلية حية تبني فيها دوائر الآردوينو UNO بيديك، تطارد أخطاء غليتش البرمجية، وتتحكم بالروبوتات وعوالم الذكاء الاصطناعي.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToLesson(currentWeek);
                }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#FF5B5A] hover:bg-[#E84A5F] active:scale-95 text-white font-black text-sm shadow-coral-glow transition-all"
              >
                <span>متابعة المهمة الحالية (أسبوع {currentWeek})</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToMap();
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-all"
              >
                <span>استكشاف خريطة العوالم</span>
                <span className="text-indigo-500">←</span>
              </button>
            </div>

            {/* Social Proof / Stats Pill */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                  🤖
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                  ⚡
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                  🧠
                </div>
              </div>
              <span className="font-bold text-slate-700">أكثر من 24 مهمة عملية متكاملة مع Arduino UNO R3</span>
            </div>
          </div>

          {/* Right Column: Character Collage on Geometric Block Background */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Colorful Geometric Block Frame (as seen in Reference image) */}
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-tr from-amber-300 via-orange-300 to-rose-300 p-2 shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Inner White Frame */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white to-slate-50 p-6 flex flex-col items-center justify-center relative">
                <CharacterAvatar character="robo" size="xl" expression="excited" />

                {/* Floating Admission Completed Pill (from Reference) */}
                <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-3 border border-slate-100 shadow-xl flex items-center gap-3 animate-bounce">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">مبتكر نشط ومبدع!</div>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{activeProfile.progress.xp} XP مجمّعة</span>
                    </div>
                  </div>
                </div>

                {/* Floating Star Accent */}
                <div className="absolute -top-2 -left-2 text-rose-500 text-2xl animate-spin">
                  ✦
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Progress Dashboard Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Current World & Mission */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700">
                العالم الحالي • الشهر {currentWorld.month}
              </span>
              <CharacterAvatar character={currentWorld.character} size="sm" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">{currentWorld.titleAr}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{currentWorld.subtitleAr}</p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-400 font-bold">المهمة النشطة:</div>
            <div className="font-bold text-sm text-slate-900 mt-0.5">{currentLesson.missionNameAr}</div>
            <button
              onClick={() => onNavigateToLesson(currentWeek)}
              className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>فتح الدرس الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Curriculum Completion */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">إجمالي تقدم الرحلة</span>
              <span className="text-lg font-black text-amber-600 font-mono">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-[#FF5B5A] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 font-bold pt-1">
              <span>{completedCount} مهمة مكتملة</span>
              <span>24 مهمة إجمالية</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center font-medium">
            🎯 الأسبوع التالي: {LESSONS_DATA[currentWeek]?.missionNameAr || 'بطولة الابتكار الختامية'}
          </div>
        </div>

        {/* Card 3: Badges & Rewards */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">الأوسمة المحصودة</span>
              <span className="text-xs font-bold text-amber-600">
                {earnedBadges.length} من {BADGES_DATA.length}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-800">قاعة الأوسمة والتكريم</h3>
          </div>

          <div className="flex items-center gap-2 py-2">
            {BADGES_DATA.slice(0, 4).map((badge) => {
              const isEarned = activeProfile.progress.earnedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                    isEarned
                      ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-300 opacity-60'
                  }`}
                  title={badge.titleAr}
                >
                  <Award className="w-6 h-6" />
                </div>
              );
            })}
          </div>

          <button
            onClick={onNavigateToAchievements}
            className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-colors"
          >
            عرض كافة الأوسمة والإنجازات ←
          </button>
        </div>
      </section>

      {/* Educational Pillars (Inspired by 'Our Program' in reference image) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5B5A]">
              <span>🔥</span>
              <span>ركائز التعلم التفاعلي</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              كيف يتعلم الأطفال مثل المهندسين الحقيقيين؟
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#FF5B5A] flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800">1. تفكيك الشفرات وتصحيح الأخطاء</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              لا نكتفي بإعطاء الكود الجاهز، بل يتعلم الطالب كيف يقرأ الكود سطراً بسطر ويكتشف ثغرات غليتش البرمجية بنفسه.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800">2. عتاد فيزيائي حقيقي (Arduino UNO)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              توصيل الأزرار، الحساسات، المحركات، والمصابيح على لوحة التجارب ليرى الطالب نتيجة أسطر الكود تتجسد فيزيائياً في العالم الحقيقي.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800">3. ثلاثة مستويات للتحدي في كل حصة</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              المستكشف (Explorer)، البنّاء (Builder)، والمخترع (Inventor)؛ ليجد كل طالب في قاعة الدرس التحدي المناسب لقدراته دون فصل أو عزلة.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

