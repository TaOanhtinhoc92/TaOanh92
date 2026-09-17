import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExploreActivity } from '../types';
import { Illustration } from './Illustrations';
import { soundManager } from '../utils/soundEffects';
import { BookOpen, HelpCircle, CheckCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface ExploreViewProps {
  activities: ExploreActivity[];
  isTeacherMode: boolean;
  onComplete?: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ activities, isTeacherMode, onComplete }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});

  const toggleRevealAnswer = (id: string) => {
    soundManager.playClick();
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentAct = activities[activeTab] || activities[0];

  return (
    <div id="explore-container" className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <BookOpen className="w-7 h-7 text-emerald-100" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100 bg-white/10 px-2.5 py-1 rounded-full">
                Bước 2 • Khám Phá Kiến Thức
              </span>
              <h2 className="text-2xl font-bold font-display mt-1">Khám Phá Cùng Sách Giáo Khoa</h2>
            </div>
          </div>

          {/* Activity Switcher Tabs */}
          {activities.length > 1 && (
            <div className="flex items-center gap-2 bg-black/15 backdrop-blur-sm p-1.5 rounded-xl">
              {activities.map((act, idx) => (
                <button
                  key={act.id}
                  id={`explore-tab-${idx}`}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab(idx);
                  }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                    idx === activeTab
                      ? 'bg-white text-emerald-800 shadow-md scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Hoạt động {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 text-emerald-50 text-sm md:text-base leading-relaxed">
          📖 Quan sát tranh ảnh, thảo luận cùng bạn bè và giáo viên để chiếm lĩnh kiến thức trọng tâm của bài học.
        </p>
      </div>

      {/* Main Exploration Card */}
      {currentAct && (
        <motion.div
          key={currentAct.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6"
        >
          {/* Activity Title & SGK Tag */}
          <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Khám phá {activeTab + 1} / {activities.length}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                {currentAct.title}
              </h3>
            </div>
            {currentAct.sgkReference && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                <BookOpen className="w-3.5 h-3.5" />
                {currentAct.sgkReference}
              </span>
            )}
          </div>

          {/* Interactive Illustration */}
          {currentAct.illustrationKey && (
            <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col items-center">
              <Illustration name={currentAct.illustrationKey} className="w-full max-w-md h-auto" />
              <span className="text-xs text-slate-500 font-medium mt-3 italic">
                Hình ảnh minh họa chuẩn theo bài học SGK Công nghệ 4
              </span>
            </div>
          )}

          {/* Task / Nhiệm vụ học tập */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm md:text-base">
              <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Nhiệm vụ học tập của em:</span>
            </div>
            <p className="text-slate-700 text-base md:text-lg leading-relaxed pl-7">
              {currentAct.task}
            </p>
          </div>

          {/* Teacher Prompt Questions */}
          {currentAct.promptQuestions && currentAct.promptQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Câu hỏi gợi mở thảo luận:</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 pl-2">
                {currentAct.promptQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 text-slate-700 text-sm md:text-base transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revealable Suggested Answer */}
          <div className="pt-2">
            <button
              id={`btn-reveal-answer-${currentAct.id}`}
              onClick={() => toggleRevealAnswer(currentAct.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-sm md:text-base transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{revealedAnswers[currentAct.id] || isTeacherMode ? 'Gợi ý câu trả lời & Phân tích SGK' : 'Bấm để xem Gợi ý câu trả lời'}</span>
              </div>
              {revealedAnswers[currentAct.id] || isTeacherMode ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {(revealedAnswers[currentAct.id] || isTeacherMode) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 mt-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-sm md:text-base leading-relaxed space-y-2"
              >
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Nội dung trả lời chuẩn:
                </div>
                <p className="pl-5 leading-relaxed">{currentAct.answer}</p>
              </motion.div>
            )}
          </div>

          {/* Key Takeaway / Chốt kiến thức SGK */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 md:p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-base md:text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                📌
              </div>
              <span>Chốt kiến thức bài học (SGK)</span>
            </div>
            <p className="text-amber-950 font-semibold text-base md:text-lg leading-relaxed pl-10">
              {currentAct.keyTakeaway}
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {activeTab > 0 && (
                <button
                  id="btn-explore-prev-tab"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab((prev) => prev - 1);
                  }}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Hoạt động trước
                </button>
              )}
              {activeTab < activities.length - 1 && (
                <button
                  id="btn-explore-next-tab"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab((prev) => prev + 1);
                  }}
                  className="px-4 py-2 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Hoạt động tiếp theo
                </button>
              )}
            </div>

            <button
              id="btn-explore-to-practice"
              onClick={() => {
                soundManager.playSuccess();
                if (onComplete) onComplete();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] cursor-pointer ml-auto"
            >
              <span>Chuyển sang Luyện Tập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
