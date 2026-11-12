import React, { useState, useEffect } from 'react';
import { storageService } from './services/storage/localStorage';
import { StudentProfile } from './types/student';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home/HomePage';
import { AdventureMap } from './pages/AdventureMap/AdventureMap';
import { LessonPage } from './pages/Lesson/LessonPage';
import { CreateProfileModal } from './components/common/CreateProfileModal';
import { soundFx } from './services/sound/webAudio';

const BASE_TITLE = 'المبتكرون الصغار | Young Innovators';

export const App: React.FC = () => {
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => storageService.getProfiles());
  const [activeProfile, setActiveProfile] = useState<StudentProfile>(() => storageService.getActiveProfile());
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedLessonWeek, setSelectedLessonWeek] = useState<number>(1);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState<boolean>(false);

  // Dynamic page title for SEO & tab clarity
  useEffect(() => {
    const titles: Record<string, string> = {
      home: BASE_TITLE,
      map: `خريطة التعلّم — ${BASE_TITLE}`,
      lesson: `الحصة ${selectedLessonWeek} — ${BASE_TITLE}`,
    };
    document.title = titles[currentTab] || BASE_TITLE;

    // Update meta description dynamically
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const descriptions: Record<string, string> = {
        home: 'منصة تعليمية تفاعلية للأطفال من 8 إلى 14 سنة لتعلّم البرمجة والإلكترونيات وبناء مشاريع آردوينو حقيقية عبر 24 مهمة مقسمة على 6 أشهر من المغامرات.',
        map: 'استكشف 6 عوالم و24 مهمة تعليمية في رحلة المبتكرون الصغار لتعلّم البرمجة والآردوينو.',
        lesson: `الحصة ${selectedLessonWeek}: تعلّم البرمجة والإلكترونيات مع أنشطة تفاعلية ومشاريع آردوينو حقيقية في منصة المبتكرون الصغار.`,
      };
      metaDesc.setAttribute('content', descriptions[currentTab] || descriptions.home);
    }
  }, [currentTab, selectedLessonWeek]);

  // Refresh active profile from storage
  const refreshProfiles = () => {
    const updatedProfiles = storageService.getProfiles();
    setProfiles(updatedProfiles);
    setActiveProfile(storageService.getActiveProfile());
  };

  const handleOpenLesson = (week: number) => {
    soundFx.playClick();
    setSelectedLessonWeek(week);
    setCurrentTab('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6] text-[#203447] flex flex-col font-sans selection:bg-[#30A89A]/20 selection:text-[#203447]">
      {/* Platform Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeProfile={activeProfile}
        profiles={profiles}
        onProfileChange={(newP) => {
          setActiveProfile(newP);
          refreshProfiles();
        }}
        onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
      />

      {/* Main Page Canvas Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        {currentTab === 'home' && (
          <HomePage
            activeProfile={activeProfile}
            onNavigateToMap={() => {
              setCurrentTab('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToLesson={handleOpenLesson}
          />
        )}

        {currentTab === 'map' && (
          <AdventureMap
            activeProfile={activeProfile}
            onSelectLesson={handleOpenLesson}
          />
        )}

        {currentTab === 'lesson' && (
          <LessonPage
            weekNumber={selectedLessonWeek}
            onBackToMap={() => setCurrentTab('map')}
          />
        )}
      </main>

      {/* Platform Footer */}
      <Footer />

      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onProfileCreated={(p) => {
          setActiveProfile(p);
          refreshProfiles();
        }}
      />
    </div>
  );
};

export default App;

