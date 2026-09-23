/**
 * Storage manager for CV 2345 Lesson Plans
 * Uses the strict template requested by the User:
 * - Specific equipment only (no thước, bảng, phấn, SGK, SGV, PPT)
 * - 2-column table with 4 operations (a, b, c, d)
 * - Questions by teacher MUST have specific answers by students
 * - Detailed so a substitute teacher can teach immediately
 */

import { LessonPlanCV2345, TeacherProfile } from '../types/lessonPlan';
import {
  generateStrictCV2345LessonPlan,
  getStoredTeacherProfile,
  saveTeacherProfile,
} from './lessonPlanStrictGenerator';

const STORAGE_PREFIX = 'congnghe4_cv2345_plan_period_v2_';

/**
 * Get lesson plan for a period. Loads from localStorage if teacher made edits,
 * or generates the default plan automatically.
 */
export function getLessonPlan(periodNumber: number): LessonPlanCV2345 {
  try {
    const key = `${STORAGE_PREFIX}${periodNumber}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: LessonPlanCV2345 = JSON.parse(raw);
      if (parsed && parsed.periodNumber === periodNumber && parsed.activities) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Failed to read stored lesson plan for period ${periodNumber}`, err);
  }

  // Fallback to strict auto-generated default
  const defaultPlan = generateStrictCV2345LessonPlan(periodNumber);
  if (!defaultPlan) {
    throw new Error(`Period ${periodNumber} does not exist in curriculum.`);
  }
  return defaultPlan;
}

/**
 * Save customized lesson plan for a period
 */
export function saveLessonPlan(plan: LessonPlanCV2345): void {
  try {
    const key = `${STORAGE_PREFIX}${plan.periodNumber}`;
    const updatedPlan: LessonPlanCV2345 = {
      ...plan,
      isCustomized: true,
      lastSavedAt: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(updatedPlan));

    // Also update common teacher profile so subsequent periods inherit it
    if (plan.schoolName || plan.className || plan.teacherName) {
      saveTeacherProfile({
        schoolName: plan.schoolName,
        className: plan.className,
        teacherName: plan.teacherName,
      });
    }
  } catch (err) {
    console.error(`Failed to save lesson plan for period ${plan.periodNumber}`, err);
    throw err;
  }
}

/**
 * Check if teacher has customized this period's plan
 */
export function isPlanCustomized(periodNumber: number): boolean {
  try {
    const key = `${STORAGE_PREFIX}${periodNumber}`;
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Reset a period's plan back to system default
 */
export function resetLessonPlanToDefault(periodNumber: number): LessonPlanCV2345 {
  try {
    const key = `${STORAGE_PREFIX}${periodNumber}`;
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Failed to remove stored plan for period ${periodNumber}`, err);
  }

  const profile = getStoredTeacherProfile();
  const defaultPlan = generateStrictCV2345LessonPlan(periodNumber, profile);
  if (!defaultPlan) {
    throw new Error(`Period ${periodNumber} does not exist in curriculum.`);
  }
  return defaultPlan;
}
