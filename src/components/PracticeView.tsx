import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PracticeActivity } from '../types';
import { soundManager } from '../utils/soundEffects';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Eye, Sparkles, Award } from 'lucide-react';

interface PracticeViewProps {
  activities: PracticeActivity[];
  isTeacherMode: boolean;
  onComplete?: () => void;
  triggerConfetti?: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  activities,
  isTeacherMode,
  onComplete,
  triggerConfetti,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: string]: boolean }>({});

  // Matching state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ [leftId: string]: string }>({});

  // Ordering state
  const [userOrder, setUserOrder] = useState<string[]>([]);

  // Fill in blank state
  const [filledBlanks, setFilledBlanks] = useState<{ [blankIdx: number]: string }>({});

  const currentAct = activities[currentIdx];

  // Helper for multiple-choice
  const handleMultipleChoice = (optionIdx: number) => {
    if (userAnswers[currentAct.id] !== undefined && !isTeacherMode) return;
    const isCorrect = optionIdx === currentAct.correctIndex;
    setUserAnswers((prev) => ({ ...prev, [currentAct.id]: optionIdx }));
    setShowExplanation((prev) => ({ ...prev, [currentAct.id]: true }));

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  // Helper for true-false statements
  const handleStatementChoice = (stmtIdx: number, val: boolean) => {
    const current = (userAnswers[currentAct.id] as { [idx: number]: boolean }) || {};
    const updated = { ...current, [stmtIdx]: val };
    setUserAnswers((prev) => ({ ...prev, [currentAct.id]: updated }));
    soundManager.playClick();
  };

  // Helper for matching
  const handleLeftClick = (leftId: string) => {
    soundManager.playClick();
    setSelectedLeft(leftId);
  };

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft) return;
    soundManager.playClick();
    const updated = { ...matchedPairs, [selectedLeft]: rightId };
    setMatchedPairs(updated);
    setUserAnswers((prev) => ({ ...prev, [currentAct.id]: updated }));
    setSelectedLeft(null);
  };

  // Helper for ordering
  const handleStepClick = (stepId: string) => {
    soundManager.playClick();
    if (userOrder.includes(stepId)) {
      setUserOrder(userOrder.filter((id) => id !== stepId));
    } else {
      const updated = [...userOrder, stepId];
      setUserOrder(updated);
      setUserAnswers((prev) => ({ ...prev, [currentAct.id]: updated }));
    }
  };

  // Helper for fill-blank
  const handleWordBankClick = (word: string) => {
    soundManager.playClick();
    if (!currentAct.blanks) return;

    // Find the first unfilled blank
    const firstEmptyIndex = currentAct.blanks.findIndex(
      (b) => filledBlanks[b.placeholderIndex] === undefined
    );

    if (firstEmptyIndex !== -1) {
      const blankIndex = currentAct.blanks[firstEmptyIndex].placeholderIndex;
      const updated = { ...filledBlanks, [blankIndex]: word };
      setFilledBlanks(updated);
      setUserAnswers((prev) => ({ ...prev, [currentAct.id]: updated }));
    }
  };

  const handleClearBlank = (blankIdx: number) => {
    soundManager.playClick();
    const updated = { ...filledBlanks };
    delete updated[blankIdx];
    setFilledBlanks(updated);
  };

  // Check answers
  const checkCurrentActivity = () => {
    setShowExplanation((prev) => ({ ...prev, [currentAct.id]: true }));
    soundManager.playSuccess();
    if (triggerConfetti) triggerConfetti();
  };

  const handleResetCurrent = () => {
    soundManager.playClick();
    const updated = { ...userAnswers };
    delete updated[currentAct.id];
    setUserAnswers(updated);
    setMatchedPairs({});
    setUserOrder([]);
    setFilledBlanks({});
    setShowExplanation((prev) => ({ ...prev, [currentAct.id]: false }));
  };

  const handleNext = () => {
    if (currentIdx < activities.length - 1) {
      soundManager.playClick();
      setCurrentIdx((prev) => prev + 1);
      setSelectedLeft(null);
      setMatchedPairs({});
      setUserOrder([]);
      setFilledBlanks({});
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
      setSelectedLeft(null);
      setMatchedPairs({});
      setUserOrder([]);
      setFilledBlanks({});
    }
  };

  if (!currentAct) return null;

  return (
    <div id="practice-container" className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Award className="w-7 h-7 text-indigo-100" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-100 bg-white/10 px-2.5 py-1 rounded-full">
                Bước 3 • Luyện Tập & Củng Cố
              </span>
              <h2 className="text-2xl font-bold font-display mt-1">Hệ Thống Bài Tập Tương Tác</h2>
            </div>
          </div>

          {/* 5-Exercise Navigation Pills */}
          <div className="flex items-center gap-2 bg-black/15 backdrop-blur-sm p-1.5 rounded-xl">
            {activities.map((act, idx) => (
              <button
                key={act.id}
                id={`practice-step-${idx}`}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIdx(idx);
                  setSelectedLeft(null);
                  setMatchedPairs({});
                  setUserOrder([]);
                  setFilledBlanks({});
                }}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition-all flex items-center justify-center cursor-pointer ${
                  idx === currentIdx
                    ? 'bg-white text-indigo-700 shadow-md scale-105'
                    : userAnswers[act.id] !== undefined
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-indigo-100 text-sm">
          <span>🎯 Hoàn thành 5 bài tập tương tác để đạt danh hiệu Kĩ sư / Thợ làm vườn nhí!</span>
          <span className="font-semibold bg-white/15 px-3 py-1 rounded-lg">
            Mức độ: {currentAct.level === 1 ? '⭐ Nhận biết' : currentAct.level === 2 ? '⭐⭐ Thông hiểu' : '⭐⭐⭐ Vận dụng'}
          </span>
        </div>
      </div>

      {/* Main Interactive Exercise Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAct.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6"
        >
          {/* Question Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                Bài tập {currentIdx + 1} • {currentAct.type.toUpperCase()}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug mt-2">
                {currentAct.question}
              </h3>
            </div>

            {/* Teacher Reveal Button */}
            {isTeacherMode && (
              <button
                id="btn-teacher-reveal-practice"
                onClick={() => {
                  soundManager.playClick();
                  setRevealedAnswers((prev) => ({ ...prev, [currentAct.id]: !prev[currentAct.id] }));
                  setShowExplanation((prev) => ({ ...prev, [currentAct.id]: true }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                {revealedAnswers[currentAct.id] ? 'Ẩn đáp án' : 'Hiện đáp án GV'}
              </button>
            )}
          </div>

          {/* 1. Multiple-choice Type */}
          {currentAct.type === 'multiple-choice' && currentAct.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {currentAct.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentAct.id] === optIdx;
                const isCorrect = currentAct.correctIndex === optIdx;
                const showResult = isSelected || revealedAnswers[currentAct.id];

                let cardStyle = 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 bg-white text-slate-700';

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
                    id={`practice-opt-${optIdx}`}
                    onClick={() => handleMultipleChoice(optIdx)}
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

          {/* 2. True-False Type */}
          {currentAct.type === 'true-false' && currentAct.statements && (
            <div className="space-y-3 pt-2">
              {currentAct.statements.map((stmt, sIdx) => {
                const userChoice = (userAnswers[currentAct.id] as { [idx: number]: boolean })?.[sIdx];
                const showResult = userChoice !== undefined || revealedAnswers[currentAct.id];
                const isCorrect = userChoice === stmt.isCorrect;

                return (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between flex-wrap gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-[240px]">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="text-base text-slate-800 leading-relaxed font-medium">
                        {stmt.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {[
                        { label: 'Đúng', val: true },
                        { label: 'Sai', val: false },
                      ].map(({ label, val }) => {
                        const selected = userChoice === val;
                        const isAnswer = stmt.isCorrect === val;
                        let btnColor = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400';

                        if (showResult) {
                          if (isAnswer) {
                            btnColor = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                          } else if (selected) {
                            btnColor = 'bg-rose-600 border-rose-600 text-white font-bold';
                          }
                        }

                        return (
                          <button
                            key={String(val)}
                            id={`practice-tf-${sIdx}-${val}`}
                            onClick={() => handleStatementChoice(sIdx, val)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${btnColor}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. Matching Type */}
          {currentAct.type === 'matching' && currentAct.leftItems && currentAct.rightItems && (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-indigo-600 font-semibold italic">
                👉 Nhấp chọn 1 ô bên trái rồi nhấp chọn 1 ô bên phải tương ứng để nối đôi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cột A</h4>
                  {currentAct.leftItems.map((left) => {
                    const isSelected = selectedLeft === left.id;
                    const isMatched = matchedPairs[left.id] !== undefined;

                    return (
                      <button
                        key={left.id}
                        id={`matching-left-${left.id}`}
                        onClick={() => handleLeftClick(left.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left text-sm md:text-base font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md ring-2 ring-indigo-200'
                            : isMatched
                            ? 'border-emerald-400 bg-emerald-50/50 text-emerald-900'
                            : 'border-slate-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <span>{left.text}</span>
                        {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cột B</h4>
                  {currentAct.rightItems.map((right) => {
                    const matchedLeftId = Object.keys(matchedPairs).find((l) => matchedPairs[l] === right.id);
                    const isMatched = !!matchedLeftId;

                    return (
                      <button
                        key={right.id}
                        id={`matching-right-${right.id}`}
                        onClick={() => handleRightClick(right.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left text-sm md:text-base font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isMatched
                            ? 'border-emerald-400 bg-emerald-50/50 text-emerald-900'
                            : selectedLeft
                            ? 'border-indigo-300 bg-indigo-50/20 hover:bg-indigo-100/50 hover:border-indigo-500'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <span>{right.text}</span>
                        {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. Ordering Type */}
          {currentAct.type === 'ordering' && currentAct.steps && (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-indigo-600 font-semibold italic">
                👉 Nhấp vào các bước theo đúng thứ tự 1, 2, 3, 4 để sắp xếp quy trình:
              </p>
              <div className="space-y-2.5">
                {currentAct.steps.map((step) => {
                  const orderIndex = userOrder.indexOf(step.id);
                  const isSelected = orderIndex !== -1;

                  return (
                    <button
                      key={step.id}
                      id={`order-step-${step.id}`}
                      onClick={() => handleStepClick(step.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left font-medium text-base transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                          : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isSelected ? orderIndex + 1 : '•'}
                      </span>
                      <span className="flex-1 leading-relaxed">{step.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Drag-drop / Classification Type */}
          {currentAct.type === 'drag-drop' && currentAct.groups && currentAct.items && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAct.groups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-4 rounded-xl border-2 ${group.color} space-y-3 min-h-[140px]`}
                  >
                    <h4 className="font-bold text-sm md:text-base border-b border-black/10 pb-2">
                      {group.title}
                    </h4>
                    <div className="space-y-2">
                      {currentAct.items
                        ?.filter((item) => item.groupId === group.id)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-black/10 shadow-sm text-sm font-semibold flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                            <span>{item.text}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Fill-blank Type */}
          {currentAct.type === 'fill-blank' && currentAct.sentence && (
            <div className="space-y-5 pt-2">
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-base md:text-lg leading-loose text-slate-800">
                {currentAct.sentence.split(/(\[.*?\])/).map((segment, segIdx) => {
                  if (segment.startsWith('[') && segment.endsWith(']')) {
                    const placeholderIdx = segIdx;
                    const filledWord = filledBlanks[placeholderIdx];

                    return (
                      <span
                        key={segIdx}
                        onClick={() => filledWord && handleClearBlank(placeholderIdx)}
                        className={`inline-block mx-1.5 px-3 py-1 rounded-lg border-2 font-bold cursor-pointer transition-all ${
                          filledWord
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : 'bg-white text-indigo-400 border-dashed border-indigo-300 min-w-[90px] text-center'
                        }`}
                      >
                        {filledWord || '_______'}
                      </span>
                    );
                  }
                  return <span key={segIdx}>{segment}</span>;
                })}
              </div>

              {/* Word Bank */}
              {currentAct.wordBank && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ngân hàng từ khóa (Bấm để điền vào chỗ trống):
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentAct.wordBank.map((word, wIdx) => {
                      const isUsed = Object.values(filledBlanks).includes(word);
                      return (
                        <button
                          key={wIdx}
                          id={`word-bank-${wIdx}`}
                          disabled={isUsed}
                          onClick={() => handleWordBankClick(word)}
                          className={`px-3.5 py-2 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                            isUsed
                              ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white hover:bg-indigo-50 border-slate-300 text-slate-700 hover:border-indigo-400 hover:scale-105 shadow-sm'
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explanation Box */}
          {(showExplanation[currentAct.id] || revealedAnswers[currentAct.id]) && currentAct.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950 text-sm md:text-base space-y-1"
            >
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Giải thích & Kiến thức chuẩn:</span>
              </div>
              <p className="leading-relaxed pl-6">{currentAct.explanation}</p>
            </motion.div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                id="btn-practice-reset"
                onClick={handleResetCurrent}
                className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại
              </button>
              <button
                id="btn-practice-check"
                onClick={checkCurrentActivity}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Kiểm tra kết quả
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-practice-prev"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentIdx === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                }`}
              >
                Bài trước
              </button>

              <button
                id="btn-practice-next"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{currentIdx === activities.length - 1 ? 'Chuyển sang Vận Dụng' : 'Bài tiếp theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
