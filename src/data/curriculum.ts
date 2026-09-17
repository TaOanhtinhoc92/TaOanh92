import { CurriculumPart, Lesson, Period } from '../types';
import { part1Lessons } from './lessons/part1_lessons';
import { part1MaterialsAndPlanting } from './lessons/part1_materials_planting';
import { part1PracticeAndCare } from './lessons/part1_practice_and_care';
import { part2Lessons } from './lessons/part2_lessons';
import { part2BapBenhAndRobot } from './lessons/part2_bapbenh_and_robot';
import { part2RobotAndFinal } from './lessons/part2_robot_and_final';

// Tất cả các bài học Phần 1: Công nghệ và đời sống (20 tiết, Tiết 1 - 20)
export const allPart1Lessons: Lesson[] = [
  ...part1Lessons,
  ...part1MaterialsAndPlanting,
  ...part1PracticeAndCare,
];

// Tất cả các bài học Phần 2: Thủ công kĩ thuật (15 tiết, Tiết 21 - 35)
export const allPart2Lessons: Lesson[] = [
  ...part2Lessons,
  ...part2BapBenhAndRobot,
  ...part2RobotAndFinal,
];

// Toàn bộ danh sách 9 bài + 4 kì đánh giá
export const allLessons: Lesson[] = [
  ...allPart1Lessons,
  ...allPart2Lessons,
];

// Cấu trúc 2 Phần lớn của SGK Công nghệ 4
export const curriculumParts: CurriculumPart[] = [
  {
    id: 'phan-1',
    partNumber: 1,
    title: 'Phần 1: CÔNG NGHỆ VÀ ĐỜI SỐNG',
    subtitle: 'Khám phá thế giới hoa và cây cảnh, kĩ thuật gieo trồng và chăm sóc',
    totalPeriods: 20,
    periodRange: 'Tiết 1 – 20 (Học kì 1)',
    lessons: allPart1Lessons,
  },
  {
    id: 'phan-2',
    partNumber: 2,
    title: 'Phần 2: THỦ CÔNG KĨ THUẬT',
    subtitle: 'Làm quen bộ lắp ghép mô hình kĩ thuật, lắp ghép bập bênh và rô-bốt',
    totalPeriods: 15,
    periodRange: 'Tiết 21 – 35 (Học kì 2)',
    lessons: allPart2Lessons,
  },
];

// Trích xuất toàn bộ danh sách phẳng 35 tiết học
export const allPeriods: Period[] = allLessons.flatMap((lesson) => lesson.periods);

// Helper tìm kiếm tiết học theo số tiết (1 - 35)
export function getPeriodByNumber(periodNumber: number): { period: Period; lesson: Lesson; part: CurriculumPart } | undefined {
  for (const part of curriculumParts) {
    for (const lesson of part.lessons) {
      const period = lesson.periods.find((p) => p.periodNumber === periodNumber);
      if (period) {
        return { period, lesson, part };
      }
    }
  }
  return undefined;
}

// Helper tìm bài học theo ID
export function getLessonById(lessonId: string): Lesson | undefined {
  return allLessons.find((l) => l.id === lessonId);
}
