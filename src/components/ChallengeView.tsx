import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChallengeItem } from '../types';
import { soundManager } from '../utils/soundEffects';
import { Trophy, Star, CheckCircle2, XCircle, ArrowRight, RotateCcw, Flame, Sparkles } from 'lucide-react';

interface ChallengeViewProps {
  challenges: ChallengeItem[];
  isTeacherMode: boolean;
  onComplete?: () => void;
  triggerConfetti?: () => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenges,
  isTeacherMode,
  onComplete,
  triggerConfetti,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [idx: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [idx: number]: boolean }>({});
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);

  const currentItem = challenges[currentIdx];

  const handleSelect = (optIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined && !isTeacherMode) return;

    const isCorrect = optIdx === currentItem.correctIndex;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [currentIdx]: true }));

    if (isCorrect) {
      soundManager.playCorrect();
      setStars((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      if (triggerConfetti) triggerConfetti();
    } else {
      soundManager.playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < challenges.length - 1) {
      soundManager.playClick();
      setCurrentIdx((prev) => prev + 1);
    } else if (onComplete) {
      soundManager.playSuccess();
      if (triggerConfetti) triggerConfetti();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      soundManager.playClick();
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIdx(0);
    setStars(0);
    setStreak(0);
  };

  if (!currentItem) return null;

  return (
    <div id="challenge-container" className="max-w-4xl mx-auto space-y-6">
      {/* Game HUD Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Trophy className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-100 bg-white/10 px-2.5 py-1 rounded-full">
                Bước 5 • Đấu Trường Thử Thách
              </span>
              <h2 className="text-2xl font-bold font-display mt-1">Vượt Chướng Ngại Vật Kĩ Thuật</h2>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
              <span>{stars} / {challenges.length} Sao</span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-1.5 text-orange-200 font-bold">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span>Chuỗi: {streak}</span>
            </div>
          </div>
        </div>

        {/* Progress Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
          {challenges.map((c, idx) => (
            <button
              key={c.id}
              id={`challenge-pill-${idx}`}
              onClick={() => {
                soundManager.playClick();
                setCurrentIdx(idx);
              }}
              className={`flex-1 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentIdx
                  ? 'bg-amber-300 scale-y-125'
                  : selectedAnswers[idx] !== undefined
                  ? selectedAnswers[idx] === c.correctIndex
                    ? 'bg-emerald-400'
                    : 'bg-rose-300'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6"
        >
          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
              Câu hỏi {currentIdx + 1} / {challenges.length}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
              {currentItem.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {currentItem.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              const isCorrect = currentItem.correctIndex === optIdx;
              const showResult = isSelected || isTeacherMode;

              let cardStyle = 'border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 bg-white text-slate-700';

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
                  id={`challenge-opt-${optIdx}`}
                  onClick={() => handleSelect(optIdx)}
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

          {/* Explanation Box */}
          {(showExplanation[currentIdx] || isTeacherMode) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm md:text-base space-y-1"
            >
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>Giải thích:</span>
              </div>
              <p className="leading-relaxed pl-6">{currentItem.explanation}</p>
            </motion.div>
          )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              id="btn-challenge-reset"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Chơi lại
            </button>

            <div className="flex items-center gap-3">
              <button
                id="btn-challenge-prev"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentIdx === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                }`}
              >
                Câu trước
              </button>

              <button
                id="btn-challenge-next"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-md shadow-rose-600/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{currentIdx === challenges.length - 1 ? 'Chuyển sang Ghi Nhớ' : 'Câu tiếp theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
