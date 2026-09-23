import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Period } from '../types';
import {
  LessonPlanCV2345,
  LessonPlanActivityStep,
  TeacherProfile,
} from '../types/lessonPlan';
import { allPeriods, getPeriodByNumber } from '../data/curriculum';
import {
  getLessonPlan,
  saveLessonPlan,
  resetLessonPlanToDefault,
  isPlanCustomized,
} from '../utils/lessonPlanStorage';
import {
  exportLessonPlanToWord,
  formatLessonPlanToPlainText,
  printLessonPlan,
} from '../utils/lessonPlanExport';
import { soundManager } from '../utils/soundEffects';
import {
  X,
  Download,
  Edit3,
  Eye,
  Save,
  RotateCcw,
  Printer,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Calendar,
  User,
  School,
  Sparkles,
  Info,
  CheckCircle2,
  ListOrdered,
  Layers,
} from 'lucide-react';

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeriodNumber: number;
}

export const LessonPlanModal: React.FC<LessonPlanModalProps> = ({
  isOpen,
  onClose,
  initialPeriodNumber,
}) => {
  const [selectedPeriodNum, setSelectedPeriodNum] = useState<number>(initialPeriodNumber);
  const [plan, setPlan] = useState<LessonPlanCV2345 | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeEditTab, setActiveEditTab] = useState<'info' | 'objectives' | 'equipment' | 'activities' | 'notes'>('activities');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Sync selected period when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPeriodNum(initialPeriodNumber);
      setIsEditing(false);
      setHasChanges(false);
    }
  }, [isOpen, initialPeriodNumber]);

  // Load lesson plan whenever period changes
  useEffect(() => {
    if (selectedPeriodNum >= 1 && selectedPeriodNum <= 35) {
      const loaded = getLessonPlan(selectedPeriodNum);
      setPlan(loaded);
      setHasChanges(false);
    }
  }, [selectedPeriodNum]);

  if (!isOpen || !plan) return null;

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDownloadWord = () => {
    soundManager.playSuccess();
    exportLessonPlanToWord(plan);
    showToast(`Đã tải về Giáo án Tiết ${plan.periodNumber} file Word (.doc) thành công!`);
  };

  const handleCopyText = async () => {
    try {
      soundManager.playClick();
      const text = formatLessonPlanToPlainText(plan);
      await navigator.clipboard.writeText(text);
      showToast('Đã sao chép toàn bộ văn bản giáo án vào Clipboard!');
    } catch {
      showToast('Không thể tự động sao chép, vui lòng thử lại.', 'info');
    }
  };

  const handlePrint = () => {
    soundManager.playClick();
    printLessonPlan(plan);
  };

  const handleSave = () => {
    try {
      soundManager.playSuccess();
      saveLessonPlan(plan);
      setHasChanges(false);
      setIsEditing(false);
      showToast(`Đã lưu giáo án Tiết ${plan.periodNumber} vào bộ nhớ trình duyệt!`);
    } catch {
      showToast('Lỗi khi lưu giáo án.', 'info');
    }
  };

  const handleReset = () => {
    if (window.confirm(`Bạn có chắc muốn khôi phục lại Kế hoạch bài dạy mặc định cho Tiết ${plan.periodNumber}? Mọi chỉnh sửa trước đó của tiết này sẽ được thiết lập lại.`)) {
      soundManager.playClick();
      const resetPlan = resetLessonPlanToDefault(plan.periodNumber);
      setPlan(resetPlan);
      setHasChanges(false);
      showToast(`Đã khôi phục Giáo án Tiết ${plan.periodNumber} về bản chuẩn ban đầu.`);
    }
  };

  // Field change helpers for Edit Mode
  const updatePlanField = <K extends keyof LessonPlanCV2345>(field: K, value: LessonPlanCV2345[K]) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
    setHasChanges(true);
  };

  const updateActivityStep = (index: number, stepField: keyof LessonPlanActivityStep, value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const newActs = [...prev.activities];
      newActs[index] = { ...newActs[index], [stepField]: value };
      return { ...prev, activities: newActs };
    });
    setHasChanges(true);
  };

  const updateObjectiveItem = (
    category: 'specializedCompetencies' | 'generalCompetencies' | 'qualities',
    idx: number,
    value: string
  ) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const list = [...prev.objectives[category]];
      list[idx] = value;
      return {
        ...prev,
        objectives: {
          ...prev.objectives,
          [category]: list,
        },
      };
    });
    setHasChanges(true);
  };

  const updateEquipmentItem = (category: 'teacher' | 'student', idx: number, value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const list = [...prev.equipment[category]];
      list[idx] = value;
      return {
        ...prev,
        equipment: {
          ...prev.equipment,
          [category]: list,
        },
      };
    });
    setHasChanges(true);
  };

  const updatePostNote = (field: 'adjustments' | 'studentProgress' | 'supportPlan', value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        postLessonNotes: {
          ...prev.postLessonNotes,
          [field]: value,
        },
      };
    });
    setHasChanges(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[96vh] flex flex-col border border-slate-200 overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-emerald-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Chuẩn Công văn 2345/BGDĐT - GDPT 2018
                </span>
                {plan.isCustomized && (
                  <span className="text-[11px] font-bold text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Đã lưu chỉnh sửa riêng
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display mt-0.5 text-white">
                Kế hoạch bài dạy (Giáo án chi tiết 35 tiết)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Period Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 transition-all text-xs font-semibold">
              <BookOpen className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="hidden md:inline text-white/80">Chọn tiết:</span>
              <select
                id="select-lesson-plan-period"
                value={selectedPeriodNum}
                onChange={(e) => {
                  soundManager.playClick();
                  setSelectedPeriodNum(Number(e.target.value));
                }}
                className="bg-transparent text-white font-bold cursor-pointer outline-hidden pr-2"
              >
                {allPeriods.map((p) => (
                  <option key={p.periodNumber} value={p.periodNumber} className="bg-slate-900 text-white">
                    Tiết {p.periodNumber}: {p.title.replace(/^Tiết \d+:\s*/, '')}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-close-lesson-plan-modal"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Đóng cửa sổ giáo án"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          {/* Left: Mode Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              id="btn-tab-preview-plan"
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsEditing(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                !isEditing
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem trước văn bản</span>
            </button>

            <button
              id="btn-tab-edit-plan"
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsEditing(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                isEditing
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa giáo án</span>
              {hasChanges && <span className="w-2 h-2 rounded-full bg-amber-400" />}
            </button>
          </div>

          {/* Right: Actions (Download Word, Save, Reset, Print, Copy) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {isEditing && (
              <>
                <button
                  id="btn-save-lesson-plan"
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-xs"
                  title="Lưu lại các thay đổi của giáo án vào trình duyệt"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi</span>
                </button>

                <button
                  id="btn-reset-lesson-plan"
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-semibold transition-all cursor-pointer"
                  title="Khôi phục lại kế hoạch bài dạy ban đầu theo chuẩn dữ liệu SGK"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Tự tạo lại mặc định</span>
                </button>
              </>
            )}

            {/* Word Download Button (Primary) */}
            <button
              id="btn-download-word-doc"
              type="button"
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold transition-all cursor-pointer shadow-xs hover:shadow-md"
              title="Tải về file Microsoft Word (.doc) căn lề chuẩn 2cm, Times New Roman 13pt"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>Tải về file Word (.doc)</span>
            </button>

            {/* Print / PDF Button */}
            <button
              id="btn-print-lesson-plan"
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold transition-all cursor-pointer"
              title="In hoặc lưu thành PDF định dạng giấy A4"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">In / PDF</span>
            </button>

            {/* Copy Structured Text Button */}
            <button
              id="btn-copy-lesson-plan"
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold transition-all cursor-pointer"
              title="Sao chép toàn bộ văn bản giáo án vào Clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Sao chép văn bản</span>
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between transition-all animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body Content: Preview Mode vs Edit Mode */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-200/60">
          {!isEditing ? (
            /* PREVIEW MODE: Styled as authentic A4 sheet with Times New Roman & formal layout */
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 md:p-14 shadow-lg rounded-2xl border border-slate-300 font-serif text-slate-900 text-[14px] sm:text-[15px] leading-relaxed select-text">
              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-black pb-4 mb-6 gap-4">
                <div>
                  <p className="font-bold text-base uppercase tracking-tight">{plan.schoolName}</p>
                  <p className="font-bold text-sm">Lớp: {plan.className}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{plan.teacherName}</p>
                  <p className="italic text-xs text-slate-600">{plan.teachingDate.startsWith('Thứ') ? plan.teachingDate : `Thứ ….., ${plan.teachingDate}`}</p>
                </div>
              </div>

              {/* Title Section */}
              <div className="text-center my-6 space-y-1">
                <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-900">
                  KHUNG KẾ HOẠCH BÀI DẠY
                </h1>
                <p className="italic text-xs sm:text-sm text-slate-600">
                  {plan.teachingDate.startsWith('Thứ') ? plan.teachingDate : `Thứ ….., ${plan.teachingDate}`}
                </p>
                <p className="font-bold text-sm sm:text-base text-slate-800">
                  Tên môn học/ Hoạt động giáo dục: {plan.subject}
                </p>
                <p className="font-extrabold text-base sm:text-lg text-emerald-950">
                  TÊN BÀI: {plan.lessonTitle}
                </p>
                <p className="font-bold text-sm text-slate-700">
                  {plan.periodTitle} ({plan.totalPeriods} tiết - Dạy tiết {plan.periodIndexInLesson})
                </p>
                <p className="italic text-xs sm:text-sm text-slate-600">
                  Thời lượng: {plan.duration} • {plan.sgkPage}
                </p>
              </div>

              {/* I. YÊU CẦU CẦN ĐẠT */}
              <section className="space-y-3 my-6">
                <h2 className="font-bold text-base uppercase text-slate-900 border-b border-slate-300 pb-1">
                  I. YÊU CẦU CẦN ĐẠT
                </h2>

                <div className="space-y-1 pl-2">
                  <p className="font-bold text-slate-900">1. Năng lực đặc thù:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {plan.objectives.specializedCompetencies.map((comp, idx) => (
                      <li key={idx} className="text-justify">{comp}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pl-2">
                  <p className="font-bold text-slate-900">2. Năng lực chung:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {plan.objectives.generalCompetencies.map((comp, idx) => (
                      <li key={idx} className="text-justify">{comp}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pl-2">
                  <p className="font-bold text-slate-900">3. Phẩm chất:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {plan.objectives.qualities.map((q, idx) => (
                      <li key={idx} className="text-justify">{q}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* II. ĐỒ DÙNG DẠY HỌC */}
              <section className="space-y-3 my-6">
                <h2 className="font-bold text-base uppercase text-slate-900 border-b border-slate-300 pb-1">
                  II. ĐỒ DÙNG DẠY HỌC
                </h2>
                <p className="text-xs text-slate-500 italic pl-2">
                  - Chỉ ghi dụng cụ đặc thù phục vụ cho tiết dạy. Không ghi những ĐDDH hay dụng cụ sử dụng thường ngày như: thước, bảng, phấn, SGK, SGV, tài liệu, PPT...
                </p>

                <div className="space-y-1 pl-2">
                  <p className="font-bold text-slate-900">1. Dụng cụ đặc thù của Giáo viên:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {plan.equipment.teacher.map((eq, idx) => (
                      <li key={idx} className="text-justify">{eq}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pl-2">
                  <p className="font-bold text-slate-900">2. Dụng cụ đặc thù của Học sinh:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {plan.equipment.student.map((eq, idx) => (
                      <li key={idx} className="text-justify">{eq}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (Bảng 2 cột) */}
              <section className="space-y-3 my-6">
                <h2 className="font-bold text-base uppercase text-slate-900 border-b border-slate-300 pb-1">
                  III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU
                </h2>
                <p className="text-xs text-slate-500 italic pl-2">
                  (Chia thành 2 cột: Cột Hoạt động của giáo viên và Cột Hoạt động của học sinh; HĐ của GV có câu hỏi thì HĐ của HS có câu trả lời cụ thể)
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-black my-3 text-sm sm:text-[14px]">
                    <tbody>
                      {plan.activities.map((act, actIdx) => (
                        <React.Fragment key={act.id}>
                          {/* Step Banner */}
                          <tr className="bg-slate-100 font-bold border border-black">
                            <td colSpan={2} className="p-2.5 sm:p-3 border border-black">
                              <span className="uppercase font-extrabold text-emerald-950 text-sm sm:text-base">
                                {act.name} ({act.time})
                              </span>
                            </td>
                          </tr>

                          {/* Column Headers */}
                          <tr className="bg-slate-50 font-bold text-center border border-black">
                            <th className="w-1/2 p-2.5 border border-black text-slate-800 uppercase tracking-tight text-xs sm:text-sm">
                              Hoạt động của Giáo viên
                            </th>
                            <th className="w-1/2 p-2.5 border border-black text-slate-800 uppercase tracking-tight text-xs sm:text-sm">
                              Hoạt động của Học sinh
                            </th>
                          </tr>

                          {/* Column Contents */}
                          <tr className="border border-black align-top">
                            <td className="p-3 border border-black whitespace-pre-line text-justify leading-relaxed text-slate-800">
                              {act.teacherActivities}
                            </td>
                            <td className="p-3 border border-black whitespace-pre-line text-justify leading-relaxed text-slate-800">
                              {act.studentActivities}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* IV. ĐIỀU CHỈNH SAU BÀI DẠY */}
              <section className="space-y-2 my-6">
                <h2 className="font-bold text-base uppercase text-slate-900 border-b border-slate-300 pb-1">
                  IV. ĐIỀU CHỈNH SAU BÀI DẠY (nếu có)
                </h2>
                <div className="space-y-1.5 pl-2 text-justify">
                  <p>
                    <span className="font-bold">1. Nội dung / Phương pháp cần điều chỉnh:</span>{' '}
                    {plan.postLessonNotes.adjustments || '................................................................................................................................'}
                  </p>
                  <p>
                    <span className="font-bold">2. Mức độ tiếp thu của học sinh:</span>{' '}
                    {plan.postLessonNotes.studentProgress || '................................................................................................................................'}
                  </p>
                  <p>
                    <span className="font-bold">3. Dự kiến biện pháp hỗ trợ học sinh gặp khó khăn:</span>{' '}
                    {plan.postLessonNotes.supportPlan || '................................................................................................................................'}
                  </p>
                </div>
              </section>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-center pt-8 mt-8 border-t border-slate-200">
                <div>
                  <p className="font-bold uppercase text-slate-900">TỔ TRƯỞNG CHUYÊN MÔN</p>
                  <p className="italic text-xs text-slate-600">(Ký và ghi rõ họ tên)</p>
                  <div className="h-20" />
                  <p className="font-medium text-slate-700">...................................................</p>
                </div>
                <div>
                  <p className="italic text-xs text-slate-600">Ngày ...... tháng ...... năm 20....</p>
                  <p className="font-bold uppercase text-slate-900">GIÁO VIÊN GIẢNG DẠY</p>
                  <p className="italic text-xs text-slate-600">(Ký và ghi rõ họ tên)</p>
                  <div className="h-20" />
                  <p className="font-bold text-slate-900">
                    {plan.teacherName ? plan.teacherName.replace(/^Giáo viên:\s*/i, '') : '...................................................'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE: Intuitive form controls */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Edit Sub-tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-300">
                <button
                  type="button"
                  onClick={() => setActiveEditTab('activities')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeEditTab === 'activities'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>5 Hoạt động sư phạm (Bảng 2 cột)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEditTab('info')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeEditTab === 'info'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Thông tin trường, lớp & GV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEditTab('objectives')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeEditTab === 'objectives'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>I. Yêu cầu cần đạt (Mục tiêu)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEditTab('equipment')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeEditTab === 'equipment'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>II. Đồ dùng dạy học</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEditTab('notes')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeEditTab === 'notes'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>IV. Điều chỉnh sau bài dạy (nếu có)</span>
                </button>
              </div>

              {/* Tab 1: Administrative Info */}
              {activeEditTab === 'info' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <School className="w-4 h-4 text-indigo-600" />
                    <span>Thông tin hành chính bài dạy (Áp dụng và lưu chung cho các tiết)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tên trường tiểu học:</label>
                      <input
                        type="text"
                        value={plan.schoolName}
                        onChange={(e) => updatePlanField('schoolName', e.target.value)}
                        placeholder="VD: Trường Tiểu học Kim Đồng"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Lớp dạy:</label>
                      <input
                        type="text"
                        value={plan.className}
                        onChange={(e) => updatePlanField('className', e.target.value)}
                        placeholder="VD: Lớp 4A"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Họ và tên Giáo viên:</label>
                      <input
                        type="text"
                        value={plan.teacherName}
                        onChange={(e) => updatePlanField('teacherName', e.target.value)}
                        placeholder="VD: Cô Nguyễn Thị Mai"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ngày dạy (DD/MM/YYYY):</label>
                      <input
                        type="text"
                        value={plan.teachingDate}
                        onChange={(e) => updatePlanField('teachingDate', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Tên bài học:</label>
                      <input
                        type="text"
                        value={plan.lessonTitle}
                        onChange={(e) => updatePlanField('lessonTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tiết dạy:</label>
                      <input
                        type="text"
                        value={plan.periodTitle}
                        onChange={(e) => updatePlanField('periodTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Trang SGK:</label>
                      <input
                        type="text"
                        value={plan.sgkPage}
                        onChange={(e) => updatePlanField('sgkPage', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Objectives */}
              {activeEditTab === 'objectives' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>I. Yêu cầu cần đạt (Mục tiêu bài dạy theo chuẩn GDPT 2018)</span>
                  </h3>

                  {/* Specialized Competencies */}
                  <div className="space-y-2">
                    <label className="block font-bold text-emerald-900 text-xs">
                      1. Năng lực đặc thù (Nhận thức, Giao tiếp, Đánh giá/Thực hành công nghệ):
                    </label>
                    {plan.objectives.specializedCompetencies.map((comp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={comp}
                          onChange={(e) => updateObjectiveItem('specializedCompetencies', idx, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>

                  {/* General Competencies */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block font-bold text-indigo-900 text-xs">
                      2. Năng lực chung (Tự chủ - tự học, Giao tiếp - hợp tác, Giải quyết vấn đề - sáng tạo):
                    </label>
                    {plan.objectives.generalCompetencies.map((comp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <textarea
                          rows={2}
                          value={comp}
                          onChange={(e) => updateObjectiveItem('generalCompetencies', idx, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Qualities */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block font-bold text-amber-900 text-xs">
                      3. Phẩm chất chủ yếu (Chăm chỉ, Trách nhiệm, Trung thực, Yêu lao động):
                    </label>
                    {plan.objectives.qualities.map((q, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <textarea
                          rows={2}
                          value={q}
                          onChange={(e) => updateObjectiveItem('qualities', idx, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Equipment */}
              {activeEditTab === 'equipment' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span>II. Đồ dùng dạy học (Chỉ ghi dụng cụ đặc thù)</span>
                    </h3>
                    <p className="text-xs text-amber-700 italic mt-1">
                      * Lưu ý chuẩn CV 2345: Chỉ ghi dụng cụ đặc thù phục vụ cho tiết dạy. Không ghi những ĐDDH hay dụng cụ sử dụng thường ngày như: thước, bảng, phấn, SGK, SGV, tài liệu, PPT...
                    </p>
                  </div>

                  {/* Teacher Equipment */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-800 text-xs">
                      1. Dụng cụ đặc thù của Giáo viên:
                    </label>
                    {plan.equipment.teacher.map((eq, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={eq}
                          onChange={(e) => updateEquipmentItem('teacher', idx, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Student Equipment */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <label className="block font-bold text-slate-800 text-xs">
                      2. Dụng cụ đặc thù của Học sinh:
                    </label>
                    {plan.equipment.student.map((eq, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={eq}
                          onChange={(e) => updateEquipmentItem('student', idx, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: 5 Pedagogical Steps (Bảng 2 cột) */}
              {activeEditTab === 'activities' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed shadow-2xs">
                    <p className="font-bold flex items-center gap-1.5 text-amber-950 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Quy tắc sư phạm Công văn 2345 (Giáo án chuẩn mực):
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mỗi hoạt động phân định rõ 4 thao tác: <b>a) Chuyển giao nhiệm vụ học tập</b>; <b>b) Tổ chức học sinh thực hiện nhiệm vụ</b>; <b>c) Tổ chức báo cáo & thảo luận</b>; <b>d) Nhận xét, đánh giá kết quả</b>.</li>
                      <li><b>Hoạt động của GV có câu hỏi thì Hoạt động của HS phải có câu trả lời cụ thể</b> (tránh ghi chung chung "HS trả lời").</li>
                      <li>Kế hoạch bài dạy biên soạn chi tiết để khi giáo viên nghỉ, đồng nghiệp khác cầm lên có thể dạy ngay được!</li>
                    </ul>
                  </div>

                  {plan.activities.map((act, idx) => (
                    <div
                      key={act.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                    >
                      <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-800">
                            {act.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-semibold">Thời lượng:</span>
                          <input
                            type="text"
                            value={act.time}
                            onChange={(e) => updateActivityStep(idx, 'time', e.target.value)}
                            className="w-24 px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-bold text-slate-700 text-center"
                          />
                        </div>
                      </div>

                      <div className="p-4 space-y-4 text-xs">
                        {/* 2-Column Activities (GV vs HS) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              HOẠT ĐỘNG CỦA GIÁO VIÊN:
                            </label>
                            <textarea
                              rows={8}
                              value={act.teacherActivities}
                              onChange={(e) => updateActivityStep(idx, 'teacherActivities', e.target.value)}
                              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono text-[12px] leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              HOẠT ĐỘNG CỦA HỌC SINH:
                            </label>
                            <textarea
                              rows={8}
                              value={act.studentActivities}
                              onChange={(e) => updateActivityStep(idx, 'studentActivities', e.target.value)}
                              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono text-[12px] leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Post Notes */}
              {activeEditTab === 'notes' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>IV. Điều chỉnh sau bài dạy (nếu có)</span>
                  </h3>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      1. Nội dung / Phương pháp cần bổ sung, điều chỉnh:
                    </label>
                    <textarea
                      rows={3}
                      value={plan.postLessonNotes.adjustments}
                      onChange={(e) => updatePostNote('adjustments', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      2. Mức độ tiếp thu bài học của học sinh:
                    </label>
                    <textarea
                      rows={3}
                      value={plan.postLessonNotes.studentProgress}
                      onChange={(e) => updatePostNote('studentProgress', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      3. Dự kiến biện pháp hỗ trợ học sinh gặp khó khăn:
                    </label>
                    <textarea
                      rows={3}
                      value={plan.postLessonNotes.supportPlan}
                      onChange={(e) => updatePostNote('supportPlan', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-bold text-emerald-800">Tiết {plan.periodNumber} / 35</span>
            <span>•</span>
            <span className="text-slate-500 hidden sm:inline">{plan.periodTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi giáo án</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-blue-200" />
              <span>Tải file Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
