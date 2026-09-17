import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WarmUpActivity, WarmUpItem } from '../types';
import { soundManager } from '../utils/soundEffects';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Eye, HelpCircle } from 'lucide-react';

interface WarmUpViewProps {
  warmUp: WarmUpActivity;
  isTeacherMode: boolean;
  onComplete?: () => void;
}

export const WarmUpView: React.FC<WarmUpViewProps> = ({ warmUp, isTeacherMode, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | boolean }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
  const [revealAll, setRevealAll] = useState(false);

  const currentItem: WarmUpItem | undefined = warmUp.items[currentIndex];

  const handleSelectOption = (itemIndex: number, optionIndex: number | boolean, isCorrect: boolean) => {
    if (selectedAnswers[itemIndex] !== undefined && !isTeacherMode) return;

    setSelectedAnswers((prev) => ({ ...prev, [itemIndex]: optionIndex }));
    setShowExplanation((prev) => ({ ...prev, [itemIndex]: true }));

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex < warmUp.items.length - 1) {
      soundManager.playClick();
      setCurrentIndex((prev) => prev + 1);
    } else if (onComplete) {
      soundManager.playSuccess();
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      soundManager.playClick();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setRevealAll(false);
  };

  if (!currentItem) return null;

  return (
    <div id="warmup-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-7 h-7 text-amber-100 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-100 bg-white/10 px-2.5 py-1 rounded-full">
                Bước 1 • Khởi Động
              </span>
              <h2 className="text-2xl font-bold font-display mt-1">{warmUp.title}</h2>
            </div>
          </div>

          {/* Question Index Pills */}
          <div className="flex items-center gap-2 bg-black/15 backdrop-blur-sm p-1.5 rounded-xl">
            {warmUp.items.map((_, idx) => (
              <button
                key={idx}
                id={`warmup-step-${idx}`}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIndex(idx);
                }}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
                  idx === currentIndex
                    ? 'bg-white text-orange-600 shadow-md scale-105'
                    : selectedAnswers[idx] !== undefined
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Lead-in Text */}
        <p className="mt-4 text-amber-50 text-base md:text-lg leading-relaxed bg-black/10 p-3.5 rounded-xl border border-white/10">
          💬 {warmUp.leadIn}
        </p>
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6"
        >
          {/* Question Title & Prompt */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                <HelpCircle className="w-3.5 h-3.5" />
                Câu {currentIndex + 1} / {warmUp.items.length}: {currentItem.title}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                {currentItem.question}
              </h3>
            </div>

            {/* Teacher Reveal Button */}
            {isTeacherMode && (
              <button
                id="btn-teacher-reveal-warmup"
                onClick={() => {
                  soundManager.playClick();
                  setRevealAll((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                {revealAll ? 'Ẩn đáp án' : 'Hiện đáp án GV'}
              </button>
            )}
          </div>

          {/* Interactive Choices */}
          {currentItem.type === 'true-false' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { label: 'Đúng', val: true, color: 'emerald' },
                { label: 'Sai', val: false, color: 'rose' },
              ].map(({ label, val }) => {
                const isSelected = selectedAnswers[currentIndex] === val;
                const isCorrect = currentItem.correctAnswer === val;
                const showResult = isSelected || revealAll;

                let btnStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 bg-white text-slate-700';

                if (showResult) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-800 shadow-sm';
                  }
                }

                return (
                  <button
                    key={String(val)}
                    id={`warmup-tf-${val}`}
                    onClick={() => handleSelectOption(currentIndex, val, isCorrect)}
                    className={`p-5 rounded-xl border-2 font-bold text-lg text-center transition-all flex items-center justify-center gap-3 cursor-pointer ${btnStyle}`}
                  >
                    {showResult && (
                      isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : isSelected ? <XCircle className="w-6 h-6 text-rose-600" /> : null
                    )}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {currentItem.options?.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isCorrect = currentItem.correctAnswer === optIdx;
                const showResult = isSelected || revealAll;

                let cardStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 bg-white text-slate-700';

                if (showResult) {
                  if (isCorrect) {
                    cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm font-semibold';
                  } else if (isSelected) {
                    cardStyle = 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    id={`warmup-opt-${optIdx}`}
                    onClick={() => handleSelectOption(currentIndex, optIdx, isCorrect)}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        showResult && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : showResult && isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-base leading-relaxed flex-1">{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Explanation Box */}
          {(showExplanation[currentIndex] || revealAll) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm md:text-base space-y-1"
            >
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Giải thích chi tiết:</span>
              </div>
              <p className="leading-relaxed pl-6">{currentItem.explanation}</p>
            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              id="btn-warmup-reset"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại
            </button>

            <div className="flex items-center gap-3">
              <button
                id="btn-warmup-prev"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Câu trước
              </button>

              <button
                id="btn-warmup-next"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{currentIndex === warmUp.items.length - 1 ? 'Chuyển sang Khám Phá' : 'Câu tiếp theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
