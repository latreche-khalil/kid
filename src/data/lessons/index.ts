import { LessonDetail } from '../../types/curriculum';
import { WEEK_01_LESSON } from './week01';

export const LESSON_DETAILS_MAP: Record<number, LessonDetail> = {
  1: WEEK_01_LESSON,
};

export function getLessonByWeek(weekNumber: number): LessonDetail | null {
  return LESSON_DETAILS_MAP[weekNumber] || null;
}

