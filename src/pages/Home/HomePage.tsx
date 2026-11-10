import React from 'react';
import { Sparkles, ArrowLeft, BookOpen, Cpu, CheckCircle2, Star, Zap, Eye, Map, Layers } from 'lucide-react';
import { StudentProfile } from '../../types/student';
import { LESSONS_DATA } from '../../data/curriculum';
import { WORLDS_DATA } from '../../data/curriculum/worlds';
import { CharacterAvatar } from '../../components/characters/CharacterAvatars';
import { soundFx } from '../../services/sound/webAudio';

interface HomePageProps {
  activeProfile: StudentProfile;
  onNavigateToMap: () => void;
  onNavigateToLesson: (week: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToMap,
  onNavigateToLesson,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section inspired by Reference Image */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-card p-6 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (Text & CTAs) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Friendly Greeting Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black">
              <span className="text-emerald-500">✦</span>
              <span>منصة Young Innovators • وضع العرض والاستعراض المفتوح</span>
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
              رحلة تعليمية ممتدة لـ 6 أشهر للأطفال من سن 7 إلى 14 عاماً، تمزج بين برمجة Arduino UNO، والتفكير الحاسوبي، والإلكترونيات، والذكاء الاصطناعي، والمحاكاة ثلاثية الأبعاد التفاعلية.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToMap();
                }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#FF5B5A] hover:bg-[#E84A5F] active:scale-95 text-white font-black text-sm shadow-coral-glow transition-all"
              >
                <Map className="w-4 h-4" />
                <span>استعراض خريطة المنهج (24 أسبوعاً)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onNavigateToLesson(1);
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-all"
              >
                <span>دخول الدرس الأول مباشرة</span>
                <span className="text-indigo-500">←</span>
              </button>
            </div>

            {/* Platform Feature Highlights */}
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
              <span className="font-bold text-slate-700">كافة الدروس الـ 24 والمختبرات ثلاثية الأبعاد متاحة للعرض الفوري</span>
            </div>
          </div>

          {/* Right Column: Character Showcase on Geometric Block Frame */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Colorful Geometric Block Frame (as seen in Reference image) */}
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-tr from-amber-300 via-orange-300 to-rose-300 p-2 shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Inner White Frame */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white to-slate-50 p-6 flex flex-col items-center justify-center relative">
                <CharacterAvatar character="robo" size="xl" expression="excited" />

                {/* Floating Showcase Pill (from Reference) */}
                <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-3 border border-slate-100 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">وضع الاستعراض المفتوح</div>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>24 درساً مفتوحاً بالكامل</span>
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

      {/* 3 Pillars Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 6 Educational Worlds */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700">
                المنهج المتكامل
              </span>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800">6 عوالم تعليمية متصلة</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              من التفكير البرمجي، إلى الخوارزميات، والإلكترونيات، وهندسة الروبوتات، وبايثون وعلم البيانات، وصولاً للذكاء الاصطناعي.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateToMap()}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>تصفح خريطة العوالم الستة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: 24 Weekly Lessons */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800">
                المهمات العملية
              </span>
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800">24 درساً مع Arduino UNO</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              تطبيق فيزيائي وكود برمجي حقيقي لكل درس، مع جدول زمني مقسم إلى 6 مراحل زمنية لكل جلسة مدتها ساعتان.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateToLesson(1)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>معاينة درس صائدو الثغرات (W1)</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: 3D Simulation Workbench */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800">
                المحاكاة ثلاثية الأبعاد
              </span>
              <Cpu className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800">مختبر الدوائر 3D والمحاكي</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              لوحة تجارب Breadboard، وأسلاك ثلاثية الأبعاد، ومحاكي آردوينو حقيقي يربط الكود بالسلوك الفيزيائي للمكونات.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateToLesson(1)}
              className="w-full py-2.5 rounded-xl bg-[#FF5B5A] hover:bg-[#E84A5F] text-white font-bold text-xs shadow-coral-glow transition-all flex items-center justify-center gap-2"
            >
              <span>تشغيل المحاكي ثلاثي الأبعاد</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6 Worlds Quick Directory */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">استعراض عوالم المنهج الستة</h2>
            <p className="text-xs text-slate-500">اختر أي شهر للانتقال واستكشاف دروسه الأربعة فوراً</p>
          </div>
          <button
            onClick={() => onNavigateToMap()}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>عرض الخريطة التفاعلية كاملة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORLDS_DATA.map((world) => {
            const worldLessons = LESSONS_DATA.filter((l) => l.worldId === world.id);
            return (
              <div
                key={world.id}
                onClick={() => onNavigateToLesson(worldLessons[0]?.week || 1)}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: world.accentBg }}
                  >
                    <CharacterAvatar character={world.character} size="sm" />
                  </div>
                  <div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                      style={{ backgroundColor: world.themeColor }}
                    >
                      الشهر {world.month}
                    </span>
                    <h3 className="font-black text-slate-900 text-base mt-1 group-hover:text-[#FF5B5A] transition-colors">
                      {world.titleAr}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {world.storyAr}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-400">4 مهمات أسبوعية</span>
                  <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>استعراض الدروس</span>
                    <ArrowLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
