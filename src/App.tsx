import React, { useState, useEffect } from 'react';
import { storageService } from './services/storage/localStorage';
import { StudentProfile } from './types/student';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home/HomePage';
import { AdventureMap } from './pages/AdventureMap/AdventureMap';
import { MissionsPage } from './pages/Missions/MissionsPage';
import { LessonPage } from './pages/Lesson/LessonPage';
import { GamesPage } from './pages/Games/GamesPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { AchievementsPage } from './pages/Achievements/AchievementsPage';
import { InstructorDashboard } from './pages/Instructor/InstructorDashboard';
import { ClassroomMode } from './components/classroom/ClassroomMode';
import { CreateProfileModal } from './components/common/CreateProfileModal';
import { Arduino3DExplorer } from './components/simulator/Arduino3DExplorer';
import { CircuitPlayground3D } from './components/simulator/CircuitPlayground3D';
import { getLessonByWeek } from './data/lessons';
import { soundFx } from './services/sound/webAudio';

export const App: React.FC = () => {
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => storageService.getProfiles());
  const [activeProfile, setActiveProfile] = useState<StudentProfile>(() => storageService.getActiveProfile());
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedLessonWeek, setSelectedLessonWeek] = useState<number>(1);
  const [sim3dMode, setSim3dMode] = useState<'board' | 'playground'>('playground');
  const [isClassroomModeOpen, setIsClassroomModeOpen] = useState<boolean>(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState<boolean>(false);

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

  const activeLessonDetail = getLessonByWeek(selectedLessonWeek) || getLessonByWeek(1)!;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1B4B] flex flex-col font-sans selection:bg-[#FF5B5A]/20 selection:text-[#FF5B5A]">
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
        onOpenClassroom={() => setIsClassroomModeOpen(true)}
        onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
      />

      {/* Main Page Canvas Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomePage
            activeProfile={activeProfile}
            onNavigateToMap={() => {
              setCurrentTab('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToLesson={handleOpenLesson}
            onNavigateToGames={() => {
              setCurrentTab('games');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAchievements={() => {
              setCurrentTab('achievements');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'map' && (
          <AdventureMap
            activeProfile={activeProfile}
            onSelectLesson={handleOpenLesson}
          />
        )}

        {currentTab === 'missions' && (
          <MissionsPage
            activeProfile={activeProfile}
            onSelectLesson={handleOpenLesson}
          />
        )}

        {currentTab === 'simulator3d' && (
          <div className="space-y-6">
            {/* 3D Mode Selector Pills */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-lg mx-auto">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSim3dMode('playground');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all ${
                  sim3dMode === 'playground'
                    ? 'bg-[#FF5B5A] text-white shadow-coral-glow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ مختبر الدوائر ولوحة التجارب (المرحلة 2)
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSim3dMode('board');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all ${
                  sim3dMode === 'board'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔍 مستكشف لوحة Arduino UNO 3D (المرحلة 1)
              </button>
            </div>

            {sim3dMode === 'playground' ? <CircuitPlayground3D /> : <Arduino3DExplorer />}
          </div>
        )}

        {currentTab === 'lesson' && (
          <LessonPage
            weekNumber={selectedLessonWeek}
            onBackToMap={() => setCurrentTab('map')}
            onOpenClassroom={() => setIsClassroomModeOpen(true)}
          />
        )}

        {currentTab === 'games' && <GamesPage />}

        {currentTab === 'projects' && (
          <ProjectsPage
            activeProfile={activeProfile}
            onRefreshProfile={refreshProfiles}
          />
        )}

        {currentTab === 'achievements' && (
          <AchievementsPage activeProfile={activeProfile} />
        )}

        {currentTab === 'instructor' && (
          <InstructorDashboard
            profiles={profiles}
            activeProfile={activeProfile}
            onProfileChange={(p) => {
              setActiveProfile(p);
              refreshProfiles();
            }}
            onRefreshProfiles={refreshProfiles}
            onOpenClassroom={() => setIsClassroomModeOpen(true)}
            onOpenLesson={handleOpenLesson}
            onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
          />
        )}
      </main>

      {/* Platform Footer */}
      <Footer />

      {/* Fullscreen Classroom Mode Overlay */}
      {isClassroomModeOpen && (
        <ClassroomMode
          lesson={activeLessonDetail}
          onClose={() => setIsClassroomModeOpen(false)}
        />
      )}

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

