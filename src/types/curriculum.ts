export type DifficultyLevel = 'explorer' | 'builder' | 'inventor';

export interface World {
  id: number;
  month: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  storyAr: string;
  themeColor: string;
  accentBg: string;
  icon: string;
  character: 'robo' | 'brainy' | 'sparky' | 'buggy' | 'glitch';
  unlockedByDefault?: boolean;
}

export interface LessonSummary {
  week: number;
  month: number;
  worldId: number;
  titleAr: string;
  titleEn: string;
  missionNameAr: string;
  missionNameEn: string;
  storySnippetAr: string;
  objectivesAr: string[];
  conceptsAr: string[];
  arduinoRoleAr: string;
  xpReward: number;
  badgeId: string;
  isFullyImplemented?: boolean;
}

export interface ComponentItem {
  id: string;
  nameAr: string;
  nameEn: string;
  count: number;
  descriptionAr: string;
  roleAr: string;
  icon: string;
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  questionAr: string;
  codeSnippet?: string;
  difficulty?: QuizDifficulty;
  options: {
    id: string;
    textAr: string;
    isCorrect: boolean;
    explanationAr: string;
  }[];
  category: 'multiple-choice' | 'predict-output' | 'find-bug' | 'true-false';
}

export interface InventorChallengeIdea {
  id: string;
  titleAr: string;
  descriptionAr: string;
  badgeAr: string;
}

export interface InventorChallengeData {
  titleAr: string;
  character: 'robo' | 'glitch';
  scenarioAr: string;
  questionAr: string;
  starterPromptAr: string;
  keySignals: {
    keywords: string[];
    labelAr: string;
  }[];
  ideas: InventorChallengeIdea[];
  hintAr: string;
}

export interface LessonDetail extends LessonSummary {
  durationMinutes: number;
  timeline: {
    stage: string;
    titleAr: string;
    duration: number; // minutes
    icon: string;
    descriptionAr: string;
  }[];
  story: {
    titleAr: string;
    characterSpeaker: 'robo' | 'brainy' | 'sparky' | 'buggy' | 'glitch';
    contentAr: string[];
    glitchActionAr: string;
    callToActionAr: string;
  };
  theory: {
    titleAr: string;
    summaryAr: string;
    planStepsAr?: string[];
    sections: {
      headingAr: string;
      contentAr: string;
      bulletPointsAr?: string[];
      codeExample?: string;
      noteAr?: string;
    }[];
  };
  components: ComponentItem[];
  circuit: {
    descriptionAr: string;
    wiringSteps: {
      step: number;
      instructionAr: string;
      color: string;
      from: string;
      to: string;
      cautionAr?: string;
    }[];
  };
  code: {
    brokenCode: string;
    brokenCodeExplanationAr: string;
    bugsList: {
      line: number;
      bugAr: string;
      fixAr: string;
      impactAr: string;
    }[];
    repairedCode: string;
    repairedCodeExplanationAr: string;
  };
  challengeLevels: {
    level: DifficultyLevel;
    titleAr: string;
    titleEn: string;
    targetAudienceAr: string;
    goalAr: string;
    tasksAr: string[];
    hintAr: string;
    codeSnippet?: string;
  }[];
  inventorChallenge?: InventorChallengeData;
  quiz: QuizQuestion[];
}

