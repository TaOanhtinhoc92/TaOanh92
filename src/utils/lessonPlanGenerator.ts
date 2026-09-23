/**
 * Lesson Plan Generator according to Circular 2345/BGDĐT - GDPT 2018
 * Re-exports the strict generator to maintain backwards compatibility
 */

export {
  getStoredTeacherProfile,
  saveTeacherProfile,
  getFormattedDateHeader as getFormattedDate,
  generateStrictCV2345LessonPlan as generateDefaultLessonPlan,
  generateStrictCV2345LessonPlan,
} from './lessonPlanStrictGenerator';
