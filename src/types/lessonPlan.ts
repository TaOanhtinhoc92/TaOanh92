/**
 * Type definitions for Kế hoạch bài dạy (Giáo án) theo chuẩn Công văn 2345/BGDĐT - GDPT 2018
 * Môn Công nghệ 4 - Bộ sách Kết nối tri thức với cuộc sống
 */

export interface LessonPlanActivityStep {
  id: string;
  name: string; // e.g. "1. Mở đầu (Khởi động)"
  time: string; // e.g. "3 – 5 phút"
  objective?: string; // Không hiển thị trong phần III theo quy định
  product?: string;
  teacherActivities: string; // Hoạt động của Giáo viên
  studentActivities: string; // Hoạt động của Học sinh
}

export interface LessonPlanObjectives {
  specializedCompetencies: string[]; // Năng lực đặc thù (Nhận thức, Giao tiếp, Đánh giá/Thực hành công nghệ)
  generalCompetencies: string[]; // Năng lực chung (Tự chủ, Hợp tác, Sáng tạo)
  qualities: string[]; // Phẩm chất chủ yếu (Chăm chỉ, Trách nhiệm, Trung thực, Nhân ái)
}

export interface LessonPlanEquipment {
  teacher: string[]; // Đồ dùng của Giáo viên
  student: string[]; // Đồ dùng của Học sinh
}

export interface LessonPlanPostNotes {
  adjustments: string; // Nội dung cần bổ sung / điều chỉnh
  studentProgress: string; // Mức độ tiếp thu bài học của học sinh
  supportPlan: string; // Biện pháp hỗ trợ học sinh còn gặp khó khăn
}

export interface LessonPlanSignatures {
  departmentHead: string; // Chức danh tổ trưởng chuyên môn
  teacher: string; // Tên giáo viên giảng dạy
}

export interface TeacherProfile {
  schoolName: string;
  className: string;
  teacherName: string;
}

export interface LessonPlanCV2345 {
  periodNumber: number; // 1 to 35
  lessonId: string;
  
  // Header administrative information
  schoolName: string;
  className: string;
  teacherName: string;
  teachingDate: string;
  subject: string;
  lessonTitle: string;
  periodTitle: string;
  totalPeriods: number;
  periodIndexInLesson: number;
  duration: string;
  sgkPage: string;

  // I. YÊU CẦU CẦN ĐẠT
  objectives: LessonPlanObjectives;

  // II. ĐỒ DÙNG DẠY HỌC
  equipment: LessonPlanEquipment;

  // III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (Bảng 2 cột chuẩn CV 2345)
  activities: LessonPlanActivityStep[];

  // IV. ĐIỀU CHỈNH SAU BÀI DẠY
  postLessonNotes: LessonPlanPostNotes;

  // V. CHỮ KÝ DUYỆT
  signatures: LessonPlanSignatures;

  isCustomized?: boolean;
  lastSavedAt?: number;
}
