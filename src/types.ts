/**
 * Type definitions for Công nghệ 4 - Interactive Classroom Teaching App
 * Bộ sách Kết nối tri thức với cuộc sống - Chuẩn 35 tiết phân phối chương trình
 */

export type DifficultyLevel = 1 | 2 | 3; // 1: Cơ bản, 2: Thông hiểu, 3: Vận dụng

export interface WarmUpItem {
  id: string;
  type: 'image-guess' | 'quiz' | 'true-false' | 'mini-game';
  title: string;
  question: string;
  illustrationKey?: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  hint?: string;
}

export interface WarmUpSection {
  title: string;
  leadIn: string;
  items: WarmUpItem[];
}

export interface ExploreActivity {
  id: string;
  title: string; // e.g. "Hoạt động 1: Quan sát Hình 1..."
  sgkReference?: string; // e.g. "SGK trang 6, Hình 1"
  illustrationKey?: string;
  task: string; // Nhiệm vụ: Giáo viên giao nhiệm vụ cho học sinh
  promptQuestions: string[]; // Câu hỏi gợi mở cho học sinh suy nghĩ & thảo luận
  answer: string; // Đáp án hiển thị khi bấm "Hiện đáp án"
  keyTakeaway: string; // Kiến thức chốt chuẩn SGK hiển thị khi bấm "Chốt kiến thức"
}

export interface BaseExercise {
  id: string;
  level: DifficultyLevel;
  question: string;
  explanation: string;
  illustrationKey?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: string[];
  correctIndex: number;
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  statements: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface DragDropGroupExercise extends BaseExercise {
  type: 'drag-drop';
  groups: {
    id: string;
    title: string;
    color?: string;
  }[];
  items: {
    id: string;
    text: string;
    groupId: string;
  }[];
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  leftItems: { id: string; text: string }[];
  rightItems: { id: string; text: string }[];
  pairs: { leftId: string; rightId: string }[];
}

export interface OrderingExercise extends BaseExercise {
  type: 'ordering';
  steps: {
    id: string;
    text: string;
    correctOrder: number; // 1-based
  }[];
}

export interface ImageSelectExercise extends BaseExercise {
  type: 'image-select';
  options: {
    id: string;
    label: string;
    description: string;
    isCorrect: boolean;
    illustrationKey: string;
  }[];
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  sentence: string; // Contains placeholder like [chống đỡ] or ___
  wordBank: string[];
  blanks: {
    placeholderIndex: number;
    correctWord: string;
  }[];
}

export type PracticeExercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | DragDropGroupExercise
  | MatchingExercise
  | OrderingExercise
  | ImageSelectExercise
  | FillBlankExercise;

export interface ApplyTask {
  id: string;
  title: string; // "🌟 Em hãy thử"
  situation: string; // Tình huống thực tiễn
  prompt: string; // Yêu cầu hành động / câu hỏi thảo luận
  guideForTeacher?: string; // Gợi ý tổ chức cho giáo viên
  sampleResponse?: string; // Định hướng câu trả lời từ học sinh
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RememberSection {
  title: string; // "🧠 Em cần nhớ"
  corePoints: string[];
  sgkQuote?: string;
}

export interface EvaluationCriterion {
  id: string;
  criterion: string; // Tiêu chí đánh giá
  weight?: string;
}

export interface Period {
  id: string;
  periodNumber: number; // 1 to 35
  lessonId: string;
  title: string;
  duration: string; // "35 phút"
  objectives: string[];
  teacherGuide: {
    preparation: string[];
    teachingMethods: string[];
    notes: string;
  };
  warmUp: WarmUpSection;
  explore: ExploreActivity[];
  practice: PracticeExercise[];
  apply: ApplyTask[];
  challenge: ChallengeQuestion[];
  remember: RememberSection;
  rubric?: EvaluationCriterion[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  sgkPage: number;
  totalPeriods: number;
  periodRange: string; // e.g. "Tiết 1 – 3"
  periods: Period[];
}

export interface Topic {
  id: string;
  title: string;
  themeName: string; // "PHẦN MỘT: CÔNG NGHỆ VÀ ĐỜI SỐNG"
  description: string;
  totalPeriods: number;
  lessons: Lesson[];
}

export interface TeachingProgress {
  [periodId: string]: 'not-started' | 'teaching' | 'completed';
}

export interface TeachingScore {
  [periodId: string]: number; // High score in challenge
}

// Convenience Type Aliases
export type WarmUpActivity = WarmUpSection;
export type PracticeActivity = PracticeExercise;
export type ApplyActivity = ApplyTask;
export type ChallengeItem = ChallengeQuestion;

export interface CurriculumPart {
  id: string;
  partNumber: number;
  title: string;
  subtitle: string;
  totalPeriods: number;
  periodRange: string;
  lessons: Lesson[];
}

export type FontSizeLevel = 'normal' | 'large' | 'xlarge' | 'huge';

export interface FontSizeOption {
  level: FontSizeLevel;
  label: string;
  percentage: string;
  description: string;
  recommendation: string;
}

export type MediaType = 'image' | 'video';

export interface VisualMediaItem {
  id: string;
  periodNumber: number;
  type: MediaType;
  url: string;
  title: string;
  caption?: string;
  isCustom?: boolean;
  addedAt?: number;
  author?: string;
  thumbnailUrl?: string;
  fileId?: string;
  fileSize?: number;
  duration?: number;
}
