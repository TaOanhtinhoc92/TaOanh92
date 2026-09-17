import React from 'react';
import { motion } from 'motion/react';
import { RememberSection } from '../types';
import { soundManager } from '../utils/soundEffects';
import { BookmarkCheck, CheckCircle2, Quote, Award, Sparkles, ArrowRight } from 'lucide-react';

interface RememberViewProps {
  remember: RememberSection;
  periodNumber: number;
  onCompletePeriod: () => void;
  triggerConfetti?: () => void;
  hasNextPeriod: boolean;
}

export const RememberView: React.FC<RememberViewProps> = ({
  remember,
  periodNumber,
  onCompletePeriod,
  triggerConfetti,
  hasNextPeriod,
}) => {
  return (
    <div id="remember-container" className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <BookmarkCheck className="w-7 h-7 text-amber-100" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-100 bg-white/10 px-2.5 py-1 rounded-full">
              Bước 6 • Ghi Nhớ & Đánh Giá
            </span>
            <h2 className="text-2xl font-bold font-display mt-1">{remember.title}</h2>
          </div>
        </div>
        <p className="mt-3 text-amber-50 text-sm md:text-base leading-relaxed">
          🌟 Tổng kết toàn bộ những kiến thức cốt lõi và kĩ năng quan trọng nhất mà em đã xuất sắc chiếm lĩnh trong tiết {periodNumber}!
        </p>
      </div>

      {/* Main Core Points Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg md:text-xl pb-2 border-b border-slate-100">
          <Award className="w-6 h-6 text-amber-500" />
          <span>Kiến thức trọng tâm cần nhớ:</span>
        </div>

        {/* Bullet points */}
        <div className="space-y-4">
          {remember.corePoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-slate-800 font-medium text-base md:text-lg leading-relaxed flex-1">
                {point}
              </p>
            </motion.div>
          ))}
        </div>

        {/* SGK Quote Box (if present) */}
        {remember.sgkQuote && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Quote className="w-4 h-4 text-amber-600" />
              <span>Ghi nhớ nguyên văn SGK Công nghệ 4:</span>
            </div>
            <p className="italic font-semibold text-base md:text-lg leading-relaxed pl-6">
              "{remember.sgkQuote}"
            </p>
          </div>
        )}

        {/* Completion Celebration Button */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <button
            id="btn-celebrate-cheer"
            onClick={() => {
              soundManager.playFanfare();
              if (triggerConfetti) triggerConfetti();
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
            <span>Thưởng hoa điểm 10 & Pháo hoa 🎊</span>
          </button>

          <button
            id="btn-finish-period"
            onClick={() => {
              soundManager.playFanfare();
              if (triggerConfetti) triggerConfetti();
              onCompletePeriod();
            }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>{hasNextPeriod ? 'Hoàn thành & Sang Tiết tiếp theo' : 'Hoàn thành Tiết học'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
