export interface StudentBadge {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  icon: string;
  category: 'programming' | 'electronics' | 'robotics' | 'python' | 'ai' | 'special';
  earnedAt?: string;
  xpValue: number;
}

export interface StudentProject {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  weekRef: number;
  componentsUsed: string[];
  codeSnippet: string;
  challengesSolvedAr: string;
  completedAt: string;
  ratingStars: number;
  tags: string[];
}

export interface StudentProgress {
  completedWeeks: number[];
  currentWeek: number;
  xp: number;
  earnedBadgeIds: string[];
  quizScores: Record<number, number>; // week -> score %
  projects: StudentProject[];
  gameHighScores: Record<string, number>;
  lastActive: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  nickname: string;
  avatarSeed: string; // 'robo' | 'sparky' | 'brainy' | 'astro' | 'coder'
  ageGroup: string; // '7-9' | '10-12' | '13-14'
  joinedDate: string;
  progress: StudentProgress;
}

export interface PlatformState {
  activeProfileId: string;
  profiles: StudentProfile[];
  classroomMode: boolean;
  selectedLanguage: 'ar' | 'en';
}

