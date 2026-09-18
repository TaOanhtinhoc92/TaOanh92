import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ApplyActivity } from '../types';
import { soundManager } from '../utils/soundEffects';
import { HeartHandshake, Sparkles, ChevronDown, ChevronUp, CheckCircle, ArrowRight, MessageSquareQuote } from 'lucide-react';

interface ApplyViewProps {
  activities: ApplyActivity[];
  isTeacherMode: boolean;
  onComplete?: () => void;
}

export const ApplyView: React.FC<ApplyViewProps> = ({ activities, isTeacherMode, onComplete }) => {
  const [expandedResponses, setExpandedResponses] = useState<{ [key: string]: boolean }>({});
  const [studentNotes, setStudentNotes] = useState<{ [key: string]: string }>({});

  const toggleExpand = (id: string) => {
    soundManager.playClick();
    setExpandedResponses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="apply-container" className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <HeartHandshake className="w-7 h-7 text-teal-100" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-100 bg-white/10 px-2.5 py-1 rounded-full">
              Bước 4 • Vận Dụng Thực Tế
            </span>
            <h2 className="text-2xl font-bold font-display mt-1">Đưa Bài Học Vào Đời Sống</h2>
          </div>
        </div>
        <p className="mt-3 text-teal-50 text-sm md:text-base leading-relaxed">
          🌱 Vận dụng những kiến thức và kĩ năng đã học vào chăm sóc cây xanh tại nhà, sử dụng dụng cụ an toàn và giúp đỡ gia đình.
        </p>
      </div>

      {/* Applied Situations List */}
      <div className="space-y-5">
        {activities.map((act, idx) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5"
          >
            {/* Situation Header */}
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 text-sm font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800">
                  {act.title}
                </h3>
              </div>
            </div>

            {/* Situation Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <MessageSquareQuote className="w-4 h-4 text-teal-600" />
                <span>Tình huống thực tế:</span>
              </div>
              <p className="text-slate-700 text-base leading-relaxed pl-6">
                {act.situation}
              </p>
            </div>

            {/* Prompt for student */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-amber-950 font-semibold text-base leading-relaxed">
              ❓ <span className="underline decoration-amber-400 decoration-2">Câu hỏi xử lý:</span> {act.prompt}
            </div>

            {/* Student Note Taking Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ý kiến / Phương án của em:
              </label>
              <textarea
                value={studentNotes[act.id] || ''}
                onChange={(e) => setStudentNotes({ ...studentNotes, [act.id]: e.target.value })}
                placeholder="Gõ nhanh câu trả lời hoặc cách xử lý của em vào đây..."
                rows={2}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              />
            </div>

            {/* Expandable Sample Response (Hidden by default for teaching in class) */}
            <div>
              <button
                id={`btn-apply-toggle-${act.id}`}
                type="button"
                onClick={() => toggleExpand(act.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer border ${
                  expandedResponses[act.id]
                    ? 'bg-teal-100/90 text-teal-950 border-teal-300 shadow-xs'
                    : 'bg-teal-50 hover:bg-teal-100/70 text-teal-900 border-teal-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>
                    {expandedResponses[act.id]
                      ? 'Gợi ý xử lý tình huống mẫu (SGK)'
                      : 'Bấm để xem Gợi ý phương án hay / xử lý tình huống'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      expandedResponses[act.id]
                        ? 'bg-teal-200 text-teal-800'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {expandedResponses[act.id] ? 'Đang mở' : 'Mặc định ẩn khi dạy'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-teal-800 shrink-0">
                  <span>{expandedResponses[act.id] ? 'Thu gọn' : 'Mở xem'}</span>
                  {expandedResponses[act.id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {expandedResponses[act.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 p-4 rounded-xl bg-white border border-teal-200 text-slate-700 text-sm md:text-base leading-relaxed space-y-1 shadow-xs"
                >
                  <div className="flex items-center justify-between font-bold text-teal-800 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      <span>Phương án tham khảo (Giáo viên phân tích):</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleExpand(act.id)}
                      className="text-xs text-slate-400 hover:text-slate-600 font-medium underline cursor-pointer"
                    >
                      Thu gọn / Ẩn gợi ý
                    </button>
                  </div>
                  <p className="pl-5 leading-relaxed text-slate-800">{act.sampleResponse}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button
          id="btn-apply-to-challenge"
          onClick={() => {
            soundManager.playSuccess();
            if (onComplete) onComplete();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Chuyển sang Thử Thách & Trò Chơi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
