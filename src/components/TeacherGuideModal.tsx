import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Period } from '../types';
import { soundManager } from '../utils/soundEffects';
import { X, BookOpen, Target, Wrench, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: Period;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
  period,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <FileText className="w-6 h-6 text-indigo-100" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-200">
                  Chế độ Giáo Viên • Hướng Dẫn Sư Phạm
                </span>
                <h3 className="text-xl font-bold font-display mt-0.5">
                  {period.title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm md:text-base leading-relaxed">
            {/* Objectives */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-indigo-900 text-base">
                <Target className="w-5 h-5 text-indigo-600" />
                <span>1. Mục tiêu bài dạy (Yêu cầu cần đạt):</span>
              </div>
              <div className="space-y-2 pl-4">
                {period.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation */}
            {period.teacherGuide?.preparation && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Wrench className="w-5 h-5 text-amber-600" />
                  <span>2. Chuẩn bị đồ dùng và thiết bị dạy học:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                  {period.teacherGuide.preparation.map((prep, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 text-xs md:text-sm flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{prep}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Methods */}
            {period.teacherGuide?.teachingMethods && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>3. Phương pháp dạy học tích cực gợi ý:</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-4">
                  {period.teacherGuide.teachingMethods.map((meth, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs md:text-sm font-semibold"
                    >
                      {meth}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pedagogical Notes */}
            {period.teacherGuide?.notes && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Lưu ý sư phạm & An toàn lớp học:</span>
                </div>
                <p className="text-amber-950 text-sm leading-relaxed pl-7">
                  {period.teacherGuide.notes}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Đã hiểu & Bắt đầu giảng dạy
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
