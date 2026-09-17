import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { curriculumParts, allPeriods } from '../data/curriculum';
import { soundManager } from '../utils/soundEffects';
import { X, Search, CheckCircle2, ChevronRight, BookOpen, Sparkles, Filter, Award } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPeriodNumber: number;
  onSelectPeriod: (periodNumber: number) => void;
  completedPeriods: number[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPeriodNumber,
  onSelectPeriod,
  completedPeriods,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSemesterTab, setActiveSemesterTab] = useState<'all' | 'hk1' | 'hk2'>('all');

  const filteredParts = curriculumParts.map((part) => {
    // Semester tab filter
    if (activeSemesterTab === 'hk1' && part.partNumber !== 1) return null;
    if (activeSemesterTab === 'hk2' && part.partNumber !== 2) return null;

    // Search term filter
    const filteredLessons = part.lessons.map((lesson) => {
      const matchLesson = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
      const filteredP = lesson.periods.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matchLesson ||
          `tiết ${p.periodNumber}`.includes(searchTerm.toLowerCase())
      );
      return { ...lesson, periods: filteredP };
    }).filter((l) => l.periods.length > 0);

    return { ...part, lessons: filteredLessons };
  }).filter(Boolean);

  const totalCompleted = completedPeriods.length;
  const progressPercent = Math.round((totalCompleted / 35) * 100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: -380 }}
          animate={{ x: 0 }}
          exit={{ x: -380 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col border-r border-slate-200"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-emerald-200" />
                <h3 className="font-bold text-lg font-display">Phân Phối 35 Tiết Dạy</h3>
              </div>
              <button
                id="btn-close-sidebar"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Progress */}
            <div className="mt-4 pt-3 border-t border-white/15">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-100 mb-1.5">
                <span>Tiến độ chương trình:</span>
                <span>{totalCompleted} / 35 Tiết ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50/70 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-search-periods"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm bài học, số tiết, hoa, rô-bốt..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Semester Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveSemesterTab('all');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSemesterTab === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Tất cả (35 tiết)
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveSemesterTab('hk1');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSemesterTab === 'hk1' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Học kì 1 (20 tiết)
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveSemesterTab('hk2');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSemesterTab === 'hk2' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Học kì 2 (15 tiết)
              </button>
            </div>
          </div>

          {/* Periods List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {filteredParts.map((part) => part && (
              <div key={part.id} className="space-y-3">
                {/* Part Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-1.5 px-2 rounded-lg border-l-4 border-emerald-600">
                  <h4 className="font-extrabold text-xs text-emerald-800 uppercase tracking-wider">
                    {part.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {part.periodRange}
                  </span>
                </div>

                {/* Lessons in Part */}
                <div className="space-y-3 pl-1">
                  {part.lessons.map((lesson) => (
                    <div key={lesson.id} className="space-y-1">
                      <div className="text-xs font-bold text-slate-700 flex items-center justify-between px-2 py-1 bg-slate-100 rounded-md">
                        <span className="line-clamp-1">{lesson.title}</span>
                        {lesson.sgkPage > 0 && (
                          <span className="text-[10px] text-slate-500 shrink-0 font-medium ml-2">
                            Trang {lesson.sgkPage}
                          </span>
                        )}
                      </div>

                      {/* Periods in Lesson */}
                      <div className="space-y-1 pt-0.5">
                        {lesson.periods.map((period) => {
                          const isCurrent = period.periodNumber === currentPeriodNumber;
                          const isCompleted = completedPeriods.includes(period.periodNumber);

                          return (
                            <button
                              key={period.id}
                              id={`sidebar-period-${period.periodNumber}`}
                              onClick={() => {
                                soundManager.playClick();
                                onSelectPeriod(period.periodNumber);
                                onClose();
                              }}
                              className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span
                                  className={`w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-[11px] shrink-0 ${
                                    isCurrent
                                      ? 'bg-white/20 text-white'
                                      : isCompleted
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {period.periodNumber}
                                </span>
                                <span className="line-clamp-1 text-xs">
                                  {period.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {isCompleted && (
                                  <CheckCircle2
                                    className={`w-4 h-4 ${
                                      isCurrent ? 'text-white' : 'text-emerald-600'
                                    }`}
                                  />
                                )}
                                <ChevronRight
                                  className={`w-3.5 h-3.5 ${
                                    isCurrent ? 'text-white/80' : 'text-slate-400'
                                  }`}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium shrink-0">
            Sách giáo khoa Công nghệ lớp 4 • Kết nối tri thức
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
