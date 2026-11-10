import { StudentProfile, StudentProgress, StudentProject } from '../../types/student';

const STORAGE_KEY_PROFILES = 'young_innovators_profiles_v1';
const STORAGE_KEY_ACTIVE_ID = 'young_innovators_active_profile_v1';

const DEFAULT_INITIAL_PROFILES: StudentProfile[] = [
  {
    id: 'student-1',
    name: 'سارة المهندس',
    nickname: 'سارة الذكية',
    avatarSeed: 'sparky',
    ageGroup: '10-12',
    joinedDate: '2026-09-01',
    progress: {
      completedWeeks: [],
      currentWeek: 1,
      xp: 45,
      earnedBadgeIds: [],
      quizScores: {},
      projects: [],
      gameHighScores: { bug_hunter: 120 },
      lastActive: new Date().toISOString(),
    },
  },
  {
    id: 'student-2',
    name: 'أحمد المبتكر',
    nickname: 'فهد الأكواد',
    avatarSeed: 'robo',
    ageGroup: '10-12',
    joinedDate: '2026-09-01',
    progress: {
      completedWeeks: [],
      currentWeek: 1,
      xp: 20,
      earnedBadgeIds: [],
      quizScores: {},
      projects: [],
      gameHighScores: {},
      lastActive: new Date().toISOString(),
    },
  },
  {
    id: 'student-3',
    name: 'ليلى الباحثة',
    nickname: 'نجمة الخوارزميات',
    avatarSeed: 'brainy',
    ageGroup: '7-9',
    joinedDate: '2026-09-05',
    progress: {
      completedWeeks: [],
      currentWeek: 1,
      xp: 10,
      earnedBadgeIds: [],
      quizScores: {},
      projects: [],
      gameHighScores: {},
      lastActive: new Date().toISOString(),
    },
  },
];

class StorageService {
  private isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  // Load all profiles
  getProfiles(): StudentProfile[] {
    if (!this.isAvailable()) return DEFAULT_INITIAL_PROFILES;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (!data) {
        this.saveProfiles(DEFAULT_INITIAL_PROFILES);
        return DEFAULT_INITIAL_PROFILES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse profiles from localStorage', e);
      return DEFAULT_INITIAL_PROFILES;
    }
  }

  // Save all profiles
  saveProfiles(profiles: StudentProfile[]): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles to localStorage', e);
    }
  }

  // Get active profile ID
  getActiveProfileId(): string {
    if (!this.isAvailable()) return DEFAULT_INITIAL_PROFILES[0].id;
    try {
      const id = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (id) return id;
      return DEFAULT_INITIAL_PROFILES[0].id;
    } catch {
      return DEFAULT_INITIAL_PROFILES[0].id;
    }
  }

  // Set active profile ID
  setActiveProfileId(id: string): void {
    if (!this.isAvailable()) return;
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  }

  // Get active profile object
  getActiveProfile(): StudentProfile {
    const profiles = this.getProfiles();
    const activeId = this.getActiveProfileId();
    const found = profiles.find((p) => p.id === activeId);
    return found || profiles[0] || DEFAULT_INITIAL_PROFILES[0];
  }

  // Create a new student profile
  createProfile(name: string, nickname: string, ageGroup: string, avatarSeed: string): StudentProfile {
    const profiles = this.getProfiles();
    const newProfile: StudentProfile = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      nickname: nickname.trim() || name.trim(),
      avatarSeed,
      ageGroup,
      joinedDate: new Date().toISOString().split('T')[0],
      progress: {
        completedWeeks: [],
        currentWeek: 1,
        xp: 0,
        earnedBadgeIds: [],
        quizScores: {},
        projects: [],
        gameHighScores: {},
        lastActive: new Date().toISOString(),
      },
    };

    profiles.push(newProfile);
    this.saveProfiles(profiles);
    this.setActiveProfileId(newProfile.id);
    return newProfile;
  }

  // Update progress for a profile
  updateProgress(profileId: string, partialProgress: Partial<StudentProgress>): StudentProfile | null {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profileId);
    if (index === -1) return null;

    const currentProfile = profiles[index];
    profiles[index] = {
      ...currentProfile,
      progress: {
        ...currentProfile.progress,
        ...partialProgress,
        lastActive: new Date().toISOString(),
      },
    };

    this.saveProfiles(profiles);
    return profiles[index];
  }

  // Complete a mission/week
  completeMission(profileId: string, week: number, xpReward: number, badgeId?: string): StudentProfile | null {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profileId);
    if (index === -1) return null;

    const profile = profiles[index];
    const completedSet = new Set(profile.progress.completedWeeks);
    const badgesSet = new Set(profile.progress.earnedBadgeIds);

    const isFirstTime = !completedSet.has(week);
    completedSet.add(week);

    if (badgeId) {
      badgesSet.add(badgeId);
    }

    const nextWeek = Math.min(24, Math.max(profile.progress.currentWeek, week + 1));
    const newXp = isFirstTime ? profile.progress.xp + xpReward : profile.progress.xp;

    profiles[index] = {
      ...profile,
      progress: {
        ...profile.progress,
        completedWeeks: Array.from(completedSet).sort((a, b) => a - b),
        currentWeek: nextWeek,
        xp: newXp,
        earnedBadgeIds: Array.from(badgesSet),
        lastActive: new Date().toISOString(),
      },
    };

    this.saveProfiles(profiles);
    return profiles[index];
  }

  // Record quiz score
  recordQuizScore(profileId: string, week: number, scorePercent: number): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profileId);
    if (index === -1) return;

    const profile = profiles[index];
    profiles[index] = {
      ...profile,
      progress: {
        ...profile.progress,
        quizScores: {
          ...profile.progress.quizScores,
          [week]: Math.max(profile.progress.quizScores[week] || 0, scorePercent),
        },
        lastActive: new Date().toISOString(),
      },
    };

    this.saveProfiles(profiles);
  }

  // Add a student project to portfolio
  addProject(profileId: string, projectData: Omit<StudentProject, 'id' | 'completedAt'>): StudentProject {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profileId);
    const newProject: StudentProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      completedAt: new Date().toISOString().split('T')[0],
    };

    if (index !== -1) {
      const profile = profiles[index];
      profiles[index] = {
        ...profile,
        progress: {
          ...profile.progress,
          xp: profile.progress.xp + 50, // bonus XP for project submission
          projects: [newProject, ...profile.progress.projects],
          lastActive: new Date().toISOString(),
        },
      };
      this.saveProfiles(profiles);
    }

    return newProject;
  }

  // Export all platform data as JSON
  exportDataAsJSON(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      activeProfileId: this.getActiveProfileId(),
      profiles: this.getProfiles(),
    };
    return JSON.stringify(payload, null, 2);
  }

  // Import platform data from JSON
  importDataFromJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.profiles)) {
        this.saveProfiles(parsed.profiles);
        if (parsed.activeProfileId) {
          this.setActiveProfileId(parsed.activeProfileId);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  // Reset all to defaults
  resetAll(): void {
    if (!this.isAvailable()) return;
    localStorage.removeItem(STORAGE_KEY_PROFILES);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
  }
}

export const storageService = new StorageService();

