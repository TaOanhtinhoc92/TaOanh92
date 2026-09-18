import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PracticeActivity } from '../types';
import { soundManager } from '../utils/soundEffects';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
  Award,
  Layers,
  ArrowUp,
  ArrowDown,
  X,
  HelpCircle,
  Tag,
} from 'lucide-react';

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

  // Global dictionary of user answers per activity ID
  const [userAnswers, setUserAnswers] = useState<{
    [actId: string]: {
      multipleChoice?: number;
      trueFalse?: { [stmtIdx: number]: boolean };
      matchedPairs?: { [leftId: string]: string };
      userOrder?: string[];
      classifiedItems?: { [itemId: string]: string };
      filledBlanks?: { [blankIdx: number]: string };
    };
  }>({});

  // Teacher answer reveal state
  const [revealedAnswers, setRevealedAnswers] = useState<{ [actId: string]: boolean }>({});

  // Is checked (user pressed "Kiểm tra kết quả")
  const [checkedStatus, setCheckedStatus] = useState<{ [actId: string]: boolean }>({});

  // Matching interactive selection states
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Fill-in-the-blank targeted blank state
  const [activeBlankIdx, setActiveBlankIdx] = useState<number | null>(null);

  // Drag-drop selected item to classify
  const [selectedUnassignedItem, setSelectedUnassignedItem] = useState<string | null>(null);

  const currentAct = activities[currentIdx];
  const actAnswers = userAnswers[currentAct?.id] || {};

  // Color palette for matching pairs
  const pairColors = [
    { bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', dot: 'bg-indigo-600', name: 'Xanh dương' },
    { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600', name: 'Xanh lá' },
    { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-600', name: 'Vàng hổ phách' },
    { bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-600', name: 'Đỏ hồng' },
    { bg: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-600', name: 'Tím hoa cà' },
    { bg: 'bg-teal-100 text-teal-800 border-teal-300', dot: 'bg-teal-600', name: 'Xanh ngọc' },
  ];

  // Helper to update specific answer field for current activity
  const updateCurrentAnswer = (patch: Partial<typeof actAnswers>) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentAct.id]: {
        ...(prev[currentAct.id] || {}),
        ...patch,
      },
    }));
  };

  // 1. Multiple-choice handler
  const handleMultipleChoice = (optionIdx: number) => {
    soundManager.playClick();
    updateCurrentAnswer({ multipleChoice: optionIdx });
  };

  // 2. True-False handler
  const handleStatementChoice = (stmtIdx: number, val: boolean) => {
    soundManager.playClick();
    const currentTf = actAnswers.trueFalse || {};
    const updated = { ...currentTf, [stmtIdx]: val };
    updateCurrentAnswer({ trueFalse: updated });
  };

  // 3. Matching handler (Bi-directional)
  const handleLeftClick = (leftId: string) => {
    soundManager.playClick();
    const matched = actAnswers.matchedPairs || {};

    // If already paired, clicking allows removing pairing
    if (matched[leftId]) {
      const copy = { ...matched };
      delete copy[leftId];
      updateCurrentAnswer({ matchedPairs: copy });
      setSelectedLeft(null);
      return;
    }

    // If student already selected a Right item, connect them!
    if (selectedRight) {
      // Remove any existing connection with this right item
      const cleaned = Object.fromEntries(
        Object.entries(matched).filter(([_, r]) => r !== selectedRight)
      );
      cleaned[leftId] = selectedRight;
      updateCurrentAnswer({ matchedPairs: cleaned });
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }

    // Otherwise toggle select left
    setSelectedLeft((prev) => (prev === leftId ? null : leftId));
  };

  const handleRightClick = (rightId: string) => {
    soundManager.playClick();
    const matched = actAnswers.matchedPairs || {};

    // Check if right item is already matched
    const existingLeft = Object.keys(matched).find((l) => matched[l] === rightId);
    if (existingLeft) {
      const copy = { ...matched };
      delete copy[existingLeft];
      updateCurrentAnswer({ matchedPairs: copy });
      setSelectedRight(null);
      return;
    }

    // If student already selected a Left item, connect them!
    if (selectedLeft) {
      const copy = { ...matched };
      copy[selectedLeft] = rightId;
      updateCurrentAnswer({ matchedPairs: copy });
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }

    // Otherwise toggle select right
    setSelectedRight((prev) => (prev === rightId ? null : rightId));
  };

  // 4. Ordering handler
  const handleToggleStep = (stepId: string) => {
    soundManager.playClick();
    const currentOrder = actAnswers.userOrder || [];
    if (currentOrder.includes(stepId)) {
      const updated = currentOrder.filter((id) => id !== stepId);
      updateCurrentAnswer({ userOrder: updated });
    } else {
      const updated = [...currentOrder, stepId];
      updateCurrentAnswer({ userOrder: updated });
    }
  };

  const handleMoveStep = (stepIndex: number, direction: 'up' | 'down') => {
    soundManager.playClick();
    const currentOrder = [...(actAnswers.userOrder || [])];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[stepIndex];
    currentOrder[stepIndex] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;
    updateCurrentAnswer({ userOrder: currentOrder });
  };

  // 5. Drag-drop / Classification handler
  const handleAssignItemToGroup = (itemId: string, groupId: string) => {
    soundManager.playClick();
    const currentClassified = actAnswers.classifiedItems || {};
    const updated = { ...currentClassified, [itemId]: groupId };
    updateCurrentAnswer({ classifiedItems: updated });
    setSelectedUnassignedItem(null);
  };

  const handleRemoveItemFromGroup = (itemId: string) => {
    soundManager.playClick();
    const currentClassified = { ...(actAnswers.classifiedItems || {}) };
    delete currentClassified[itemId];
    updateCurrentAnswer({ classifiedItems: currentClassified });
  };

  // 6. Fill-blank handler
  // Parse sentence into segments and extract placeholder count
  const parsedSentenceSegments = useMemo(() => {
    if (!currentAct?.sentence) return [];
    let blankIndexCounter = 0;
    return currentAct.sentence.split(/(\[.*?\])/).map((segment) => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const rawContent = segment.slice(1, -1);
        const blankIdx = blankIndexCounter++;
        return {
          isPlaceholder: true,
          blankIdx,
          rawWord: rawContent,
        };
      }
      return {
        isPlaceholder: false,
        text: segment,
      };
    });
  }, [currentAct?.sentence]);

  const handleWordBankClick = (word: string) => {
    soundManager.playClick();
    if (!currentAct.blanks) return;

    const currentFilled = actAnswers.filledBlanks || {};

    // Target blank: either the student clicked one, or the first empty one
    let targetIdx = activeBlankIdx;
    if (targetIdx === null || currentFilled[targetIdx] !== undefined) {
      const firstEmpty = currentAct.blanks.find(
        (b) => currentFilled[b.placeholderIndex] === undefined
      );
      if (firstEmpty) {
        targetIdx = firstEmpty.placeholderIndex;
      } else {
        // All blanks full; if a blank is active, overwrite it
        targetIdx = activeBlankIdx ?? 0;
      }
    }

    const updated = { ...currentFilled, [targetIdx]: word };
    updateCurrentAnswer({ filledBlanks: updated });

    // Auto-advance active blank to next empty blank
    const nextEmpty = currentAct.blanks.find(
      (b) => b.placeholderIndex > targetIdx! && updated[b.placeholderIndex] === undefined
    );
    setActiveBlankIdx(nextEmpty ? nextEmpty.placeholderIndex : null);
  };

  const handleClearBlank = (blankIdx: number) => {
    soundManager.playClick();
    const currentFilled = { ...(actAnswers.filledBlanks || {}) };
    delete currentFilled[blankIdx];
    updateCurrentAnswer({ filledBlanks: currentFilled });
    setActiveBlankIdx(blankIdx);
  };

  // Check activity correctness
  const isChecked = checkedStatus[currentAct?.id] || false;
  const isTeacherRevealed = revealedAnswers[currentAct?.id] || false;

  const checkCurrentActivity = () => {
    setCheckedStatus((prev) => ({ ...prev, [currentAct.id]: true }));

    // Evaluate correctness
    let isFullyCorrect = false;

    if (currentAct.type === 'multiple-choice') {
      isFullyCorrect = actAnswers.multipleChoice === currentAct.correctIndex;
    } else if (currentAct.type === 'true-false' && currentAct.statements) {
      const tf = actAnswers.trueFalse || {};
      isFullyCorrect = currentAct.statements.every(
        (stmt, idx) => tf[idx] === stmt.isCorrect
      );
    } else if (currentAct.type === 'matching' && currentAct.pairs) {
      const matched = actAnswers.matchedPairs || {};
      isFullyCorrect =
        Object.keys(matched).length === currentAct.pairs.length &&
        currentAct.pairs.every((p) => matched[p.leftId] === p.rightId);
    } else if (currentAct.type === 'ordering' && currentAct.steps) {
      const uOrder = actAnswers.userOrder || [];
      const correctSorted = [...currentAct.steps].sort((a, b) => a.correctOrder - b.correctOrder);
      isFullyCorrect =
        uOrder.length === currentAct.steps.length &&
        uOrder.every((id, idx) => id === correctSorted[idx]?.id);
    } else if (currentAct.type === 'drag-drop' && currentAct.items) {
      const classified = actAnswers.classifiedItems || {};
      isFullyCorrect =
        Object.keys(classified).length === currentAct.items.length &&
        currentAct.items.every((it) => classified[it.id] === it.groupId);
    } else if (currentAct.type === 'fill-blank' && currentAct.blanks) {
      const fb = actAnswers.filledBlanks || {};
      isFullyCorrect = currentAct.blanks.every(
        (b) => fb[b.placeholderIndex]?.trim().toLowerCase() === b.correctWord.trim().toLowerCase()
      );
    }

    if (isFullyCorrect) {
      soundManager.playSuccess();
      if (triggerConfetti) triggerConfetti();
    } else {
      soundManager.playWrong();
    }
  };

  const handleResetCurrent = () => {
    soundManager.playClick();
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentAct.id];
      return copy;
    });
    setCheckedStatus((prev) => ({ ...prev, [currentAct.id]: false }));
    setRevealedAnswers((prev) => ({ ...prev, [currentAct.id]: false }));
    setSelectedLeft(null);
    setSelectedRight(null);
    setSelectedUnassignedItem(null);
    setActiveBlankIdx(null);
  };

  const handleNext = () => {
    if (currentIdx < activities.length - 1) {
      soundManager.playClick();
      setCurrentIdx((prev) => prev + 1);
      setSelectedLeft(null);
      setSelectedRight(null);
      setSelectedUnassignedItem(null);
      setActiveBlankIdx(null);
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
      setSelectedRight(null);
      setSelectedUnassignedItem(null);
      setActiveBlankIdx(null);
    }
  };

  if (!currentAct) return null;

  return (
    <div id="practice-container" className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Award className="w-7 h-7 text-indigo-100" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-100 bg-white/10 px-2.5 py-1 rounded-full">
                Bước 3 • Luyện Tập & Củng Cố
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display mt-1">Hệ Thống Bài Tập Tương Tác</h2>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/15 backdrop-blur-sm p-1.5 rounded-xl">
            {activities.map((act, idx) => {
              const hasAnswer = userAnswers[act.id] !== undefined;
              return (
                <button
                  key={act.id}
                  id={`practice-step-${idx}`}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentIdx(idx);
                    setSelectedLeft(null);
                    setSelectedRight(null);
                    setSelectedUnassignedItem(null);
                    setActiveBlankIdx(null);
                  }}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                    idx === currentIdx
                      ? 'bg-white text-indigo-700 shadow-md scale-105'
                      : hasAnswer
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title={`Bài tập ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-indigo-100 text-xs sm:text-sm flex-wrap gap-2">
          <span>🎯 Thực hiện đủ 5 bài tập để củng cố vững chắc bài học hôm nay!</span>
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
          className="bg-white rounded-2xl p-5 sm:p-7 md:p-8 border border-slate-200 shadow-sm space-y-6"
        >
          {/* Question Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                Bài tập {currentIdx + 1} • {currentAct.type.toUpperCase()}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-snug mt-2">
                {currentAct.question}
              </h3>
            </div>

            {/* Teacher Reveal Button */}
            {isTeacherMode && (
              <button
                id="btn-teacher-reveal-practice"
                onClick={() => {
                  soundManager.playClick();
                  setRevealedAnswers((prev) => ({
                    ...prev,
                    [currentAct.id]: !prev[currentAct.id],
                  }));
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                  isTeacherRevealed
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isTeacherRevealed ? 'Đang hiện đáp án GV' : 'Xem đáp án GV'}</span>
              </button>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 1. Multiple-choice Exercise */}
          {/* ========================================================================= */}
          {currentAct.type === 'multiple-choice' && currentAct.options && (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-indigo-600 font-semibold italic">
                👉 Nhấp chọn 1 phương án trả lời đúng (có thể chọn lại bất cứ lúc nào):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentAct.options.map((opt, optIdx) => {
                  const isSelected = actAnswers.multipleChoice === optIdx;
                  const isCorrect = currentAct.correctIndex === optIdx;
                  const showResult = isChecked || isTeacherRevealed;

                  let cardStyle = 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 bg-white text-slate-700';

                  if (showResult) {
                    if (isCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm font-semibold ring-2 ring-emerald-300';
                    } else if (isSelected) {
                      cardStyle = 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm ring-2 ring-indigo-200';
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
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed flex-1">{opt}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. True-False Exercise */}
          {/* ========================================================================= */}
          {currentAct.type === 'true-false' && currentAct.statements && (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-indigo-600 font-semibold italic">
                👉 Xác định mỗi nhận định dưới đây là Đúng hay Sai:
              </p>
              <div className="space-y-3">
                {currentAct.statements.map((stmt, sIdx) => {
                  const userChoice = actAnswers.trueFalse?.[sIdx];
                  const showResult = isChecked || isTeacherRevealed;
                  const isCorrect = userChoice === stmt.isCorrect;

                  return (
                    <div
                      key={sIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between flex-wrap gap-4 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-[240px]">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                          {stmt.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {[
                          { label: 'Đúng', val: true },
                          { label: 'Sai', val: false },
                        ].map(({ label, val }) => {
                          const isSelected = userChoice === val;
                          const isAnswer = stmt.isCorrect === val;
                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400';

                          if (showResult) {
                            if (isAnswer) {
                              btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold ring-2 ring-emerald-200';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-600 border-rose-600 text-white font-bold';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-indigo-600 border-indigo-600 text-white font-bold ring-2 ring-indigo-200';
                          }

                          return (
                            <button
                              key={String(val)}
                              id={`practice-tf-${sIdx}-${val}`}
                              onClick={() => handleStatementChoice(sIdx, val)}
                              className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${btnStyle}`}
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. Matching Exercise (Bi-directional interactive) */}
          {/* ========================================================================= */}
          {currentAct.type === 'matching' && currentAct.leftItems && currentAct.rightItems && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-900 flex items-center justify-between flex-wrap gap-2">
                <span className="font-medium">
                  👉 <strong>Hướng dẫn nối:</strong> Bấm 1 ô ở <strong>Cột A</strong> rồi bấm 1 ô ở <strong>Cột B</strong> (hoặc ngược lại). Bấm vào ô đã nối để hủy kết nối.
                </span>
                {selectedLeft && (
                  <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
                    Đã chọn Cột A, hãy nhấp ô Cột B tương ứng
                  </span>
                )}
                {selectedRight && (
                  <span className="bg-purple-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
                    Đã chọn Cột B, hãy nhấp ô Cột A tương ứng
                  </span>
                )}
              </div>

              {/* Matched Summary Badges if any */}
              {Object.keys(actAnswers.matchedPairs || {}).length > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-slate-500">Các cặp đã nối:</span>
                  {Object.entries(actAnswers.matchedPairs || {}).map(([lId, rId], idx) => {
                    const lItem = currentAct.leftItems?.find((i) => i.id === lId);
                    const rItem = currentAct.rightItems?.find((i) => i.id === rId);
                    const color = pairColors[idx % pairColors.length];
                    const isPairCorrect = currentAct.pairs?.some(
                      (p) => p.leftId === lId && p.rightId === rId
                    );
                    const showFeedback = isChecked || isTeacherRevealed;

                    return (
                      <span
                        key={lId}
                        className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 shadow-2xs ${
                          showFeedback
                            ? isPairCorrect
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                            : color.bg
                        }`}
                      >
                        <span className="truncate max-w-[120px]">{lItem?.text}</span>
                        <span>↔</span>
                        <span className="truncate max-w-[120px]">{rItem?.text}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = { ...(actAnswers.matchedPairs || {}) };
                            delete copy[lId];
                            updateCurrentAnswer({ matchedPairs: copy });
                          }}
                          className="hover:opacity-70 cursor-pointer ml-1"
                          title="Hủy nối cặp này"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left column */}
                <div className="space-y-2.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>Cột A</span>
                  </h4>
                  {currentAct.leftItems.map((left, idx) => {
                    const isSelected = selectedLeft === left.id;
                    const matchedRightId = actAnswers.matchedPairs?.[left.id];
                    const isMatched = matchedRightId !== undefined;
                    const pairIndex = Object.keys(actAnswers.matchedPairs || {}).indexOf(left.id);
                    const color = pairIndex !== -1 ? pairColors[pairIndex % pairColors.length] : null;

                    // Teacher reveal pair
                    const correctRightId = currentAct.pairs?.find((p) => p.leftId === left.id)?.rightId;
                    const isCorrect = matchedRightId === correctRightId;
                    const showFeedback = isChecked || isTeacherRevealed;

                    return (
                      <button
                        key={left.id}
                        id={`matching-left-${left.id}`}
                        onClick={() => handleLeftClick(left.id)}
                        className={`w-full p-3.5 sm:p-4 rounded-xl border-2 text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md ring-2 ring-indigo-300 scale-[1.01]'
                            : showFeedback && isMatched
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                              : 'border-rose-500 bg-rose-50 text-rose-900 font-semibold'
                            : isMatched && color
                            ? `${color.bg} shadow-xs font-semibold`
                            : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isMatched && (
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {pairIndex + 1}
                            </span>
                          )}
                          <span>{left.text}</span>
                        </div>

                        {showFeedback && isMatched && (
                          isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                          )
                        )}
                        {!showFeedback && isMatched && (
                          <span className="text-[11px] font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-md border border-indigo-200">
                            Đã nối
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="space-y-2.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>Cột B</span>
                  </h4>
                  {currentAct.rightItems.map((right) => {
                    const isSelected = selectedRight === right.id;
                    const matchedLeftId = Object.keys(actAnswers.matchedPairs || {}).find(
                      (l) => actAnswers.matchedPairs?.[l] === right.id
                    );
                    const isMatched = !!matchedLeftId;
                    const pairIndex = matchedLeftId
                      ? Object.keys(actAnswers.matchedPairs || {}).indexOf(matchedLeftId)
                      : -1;
                    const color = pairIndex !== -1 ? pairColors[pairIndex % pairColors.length] : null;

                    const correctLeftId = currentAct.pairs?.find((p) => p.rightId === right.id)?.leftId;
                    const isCorrect = matchedLeftId === correctLeftId;
                    const showFeedback = isChecked || isTeacherRevealed;

                    return (
                      <button
                        key={right.id}
                        id={`matching-right-${right.id}`}
                        onClick={() => handleRightClick(right.id)}
                        className={`w-full p-3.5 sm:p-4 rounded-xl border-2 text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-md ring-2 ring-purple-300 scale-[1.01]'
                            : showFeedback && isMatched
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                              : 'border-rose-500 bg-rose-50 text-rose-900 font-semibold'
                            : isMatched && color
                            ? `${color.bg} shadow-xs font-semibold`
                            : selectedLeft
                            ? 'border-indigo-300 bg-indigo-50/30 hover:bg-indigo-100 hover:border-indigo-500'
                            : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isMatched && (
                            <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {pairIndex + 1}
                            </span>
                          )}
                          <span>{right.text}</span>
                        </div>

                        {showFeedback && isMatched && (
                          isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
                          )
                        )}
                        {!showFeedback && isMatched && (
                          <span className="text-[11px] font-bold text-purple-700 bg-white/80 px-2 py-0.5 rounded-md border border-purple-200">
                            Đã nối
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. Ordering Exercise */}
          {/* ========================================================================= */}
          {currentAct.type === 'ordering' && currentAct.steps && (
            <div className="space-y-5 pt-2">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-900">
                👉 Nhấp chọn các bước theo đúng thứ tự 1, 2, 3, 4 để hoàn thành quy trình. Bạn có thể bấm mũi tên để đổi chỗ các bước.
              </div>

              {/* Selected Steps Sequence */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">
                  Trình tự bạn đã sắp xếp ({actAnswers.userOrder?.length || 0} / {currentAct.steps.length} bước):
                </h4>

                {(actAnswers.userOrder || []).length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center text-slate-400 text-sm">
                    Chưa có bước nào được chọn. Hãy nhấp vào các bước bên dưới để xếp thứ tự!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {actAnswers.userOrder!.map((stepId, orderIdx) => {
                      const stepItem = currentAct.steps?.find((s) => s.id === stepId);
                      const isStepCorrect = stepItem?.correctOrder === orderIdx + 1;
                      const showFeedback = isChecked || isTeacherRevealed;

                      return (
                        <div
                          key={stepId}
                          className={`p-3.5 rounded-xl border-2 flex items-center justify-between gap-3 transition-all ${
                            showFeedback
                              ? isStepCorrect
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                                : 'border-rose-400 bg-rose-50 text-rose-950 font-semibold'
                              : 'border-indigo-400 bg-indigo-50/80 text-indigo-950 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {orderIdx + 1}
                            </span>
                            <span className="text-sm sm:text-base">{stepItem?.text}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              disabled={orderIdx === 0}
                              onClick={() => handleMoveStep(orderIdx, 'up')}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Chuyển lên trước"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={orderIdx === actAnswers.userOrder!.length - 1}
                              onClick={() => handleMoveStep(orderIdx, 'down')}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Chuyển xuống sau"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStep(stepId)}
                              className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Gỡ khỏi danh sách"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pool of Available Steps */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Kho các bước (Bấm để thêm vào thứ tự):
                </h4>
                <div className="space-y-2">
                  {currentAct.steps.map((step) => {
                    const isAdded = (actAnswers.userOrder || []).includes(step.id);
                    return (
                      <button
                        key={step.id}
                        id={`order-step-${step.id}`}
                        onClick={() => handleToggleStep(step.id)}
                        className={`w-full p-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isAdded
                            ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">
                            •
                          </span>
                          <span>{step.text}</span>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {isAdded ? 'Đã xếp' : '+ Thêm bước'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. Drag-Drop / Category Classification Exercise */}
          {/* ========================================================================= */}
          {currentAct.type === 'drag-drop' && currentAct.groups && currentAct.items && (
            <div className="space-y-6 pt-2">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-900">
                👉 Phân loại các mục bên dưới vào đúng nhóm tương ứng. Bạn có thể bấm nút <strong>"+ Nhóm"</strong> trên từng mục, hoặc nhấp mục rồi bấm vào nhóm muốn xếp.
              </div>

              {/* Unassigned Items Pool */}
              {(() => {
                const classified = actAnswers.classifiedItems || {};
                const unassignedItems = currentAct.items.filter((it) => !classified[it.id]);

                return (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-600" />
                        <span>Các mục chờ phân loại ({unassignedItems.length}):</span>
                      </h4>
                      {unassignedItems.length === 0 && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã phân loại hết các mục!
                        </span>
                      )}
                    </div>

                    {unassignedItems.length === 0 ? (
                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium text-center">
                        Tuyệt vời! Thầy/Cô và các em hãy bấm <strong>"Kiểm tra kết quả"</strong> bên dưới để xem độ chính xác.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {unassignedItems.map((item) => {
                          const isSelected = selectedUnassignedItem === item.id;
                          return (
                            <div
                              key={item.id}
                              className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-2 shadow-2xs ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200'
                                  : 'border-slate-200 bg-white hover:border-indigo-300'
                              }`}
                            >
                              <span
                                onClick={() => setSelectedUnassignedItem(isSelected ? null : item.id)}
                                className="text-sm font-medium text-slate-800 flex-1 cursor-pointer leading-snug"
                              >
                                {item.text}
                              </span>

                              {/* Quick Group Assign Buttons */}
                              <div className="flex items-center gap-1 shrink-0">
                                {currentAct.groups?.map((grp, gIdx) => (
                                  <button
                                    key={grp.id}
                                    type="button"
                                    onClick={() => handleAssignItemToGroup(item.id, grp.id)}
                                    className="px-2 py-1 rounded-lg text-[11px] font-bold border transition-all hover:scale-105 cursor-pointer bg-slate-50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 border-slate-300"
                                    title={`Chuyển vào ${grp.title}`}
                                  >
                                    + Nhóm {gIdx + 1}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Target Groups Containers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAct.groups.map((group, gIdx) => {
                  const classified = actAnswers.classifiedItems || {};
                  // If teacher revealed, show correct grouping; else show student choices
                  const groupItems = isTeacherRevealed
                    ? currentAct.items?.filter((it) => it.groupId === group.id) || []
                    : currentAct.items?.filter((it) => classified[it.id] === group.id) || [];

                  return (
                    <div
                      key={group.id}
                      onClick={() => {
                        if (selectedUnassignedItem) {
                          handleAssignItemToGroup(selectedUnassignedItem, group.id);
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 space-y-3 min-h-[160px] flex flex-col justify-between transition-all ${
                        group.color || 'bg-slate-50 border-slate-300 text-slate-800'
                      } ${
                        selectedUnassignedItem
                          ? 'ring-2 ring-indigo-400 cursor-pointer hover:scale-[1.01]'
                          : ''
                      }`}
                    >
                      <div>
                        {/* Group Header */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-black/10">
                          <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-black/10 text-[11px] font-extrabold flex items-center justify-center">
                              {gIdx + 1}
                            </span>
                            <span>{group.title}</span>
                          </h4>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 shadow-2xs">
                            {groupItems.length} mục
                          </span>
                        </div>

                        {/* Items in this group */}
                        <div className="space-y-2 mt-3">
                          {groupItems.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-black/20 text-center text-xs text-black/50 font-medium">
                              Chưa có mục nào trong nhóm này.
                              {selectedUnassignedItem && (
                                <p className="text-indigo-700 font-bold mt-1">
                                  👉 Nhấp vào đây để thêm mục đã chọn!
                                </p>
                              )}
                            </div>
                          ) : (
                            groupItems.map((item) => {
                              const isCorrectGroup = item.groupId === group.id;
                              const showFeedback = isChecked || isTeacherRevealed;

                              return (
                                <div
                                  key={item.id}
                                  className={`p-2.5 px-3 rounded-xl border shadow-2xs text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 transition-all ${
                                    showFeedback
                                      ? isCorrectGroup
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                                        : 'bg-rose-50 border-rose-400 text-rose-950'
                                      : 'bg-white/95 border-black/10 text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                    <span>{item.text}</span>
                                  </div>

                                  {showFeedback && (
                                    isCorrectGroup ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                    )
                                  )}

                                  {!isTeacherRevealed && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveItemFromGroup(item.id);
                                      }}
                                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                      title="Bỏ mục này về kho"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Drop guidance helper */}
                      {selectedUnassignedItem && (
                        <div className="pt-2 text-center text-xs font-bold text-indigo-700 bg-white/60 rounded-lg p-1">
                          + Thêm vào nhóm này
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. Fill-Blank Exercise */}
          {/* ========================================================================= */}
          {currentAct.type === 'fill-blank' && currentAct.sentence && (
            <div className="space-y-6 pt-2">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-900">
                👉 Nhấp vào từ ở <strong>Ngân hàng từ khóa</strong> bên dưới để điền vào chỗ trống. Bạn cũng có thể nhấp vào ô trống để sửa hoặc chọn từ khác.
              </div>

              {/* Interactive Sentence Container */}
              <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200 text-base sm:text-lg leading-loose sm:leading-loose text-slate-800">
                {parsedSentenceSegments.map((seg, idx) => {
                  if (seg.isPlaceholder) {
                    const blankIdx = seg.blankIdx!;
                    const userFilledWord = actAnswers.filledBlanks?.[blankIdx];
                    const correctWord = currentAct.blanks?.find(
                      (b) => b.placeholderIndex === blankIdx
                    )?.correctWord;

                    const isTargeted = activeBlankIdx === blankIdx;
                    const showFeedback = isChecked || isTeacherRevealed;
                    const isWordCorrect =
                      userFilledWord?.trim().toLowerCase() === correctWord?.trim().toLowerCase();

                    // If teacher revealed and user didn't answer, show correct word
                    const displayedWord = isTeacherRevealed
                      ? correctWord
                      : userFilledWord;

                    return (
                      <span
                        key={idx}
                        onClick={() => {
                          if (userFilledWord && !isTeacherRevealed) {
                            handleClearBlank(blankIdx);
                          } else {
                            setActiveBlankIdx(blankIdx);
                          }
                        }}
                        className={`inline-flex items-center gap-1 mx-1.5 px-3 py-1 rounded-xl border-2 font-bold cursor-pointer transition-all ${
                          showFeedback
                            ? isWordCorrect || isTeacherRevealed
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                              : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                            : displayedWord
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : isTargeted
                            ? 'bg-white text-indigo-600 border-indigo-600 ring-2 ring-indigo-300 min-w-[100px] justify-center'
                            : 'bg-white text-indigo-400 border-dashed border-indigo-300 hover:border-indigo-500 min-w-[100px] justify-center'
                        }`}
                        title={displayedWord ? 'Bấm để xóa từ này' : 'Bấm để chọn chỗ trống này'}
                      >
                        <span>{displayedWord || `[ Ô ${blankIdx + 1} ]`}</span>
                        {displayedWord && !showFeedback && (
                          <X className="w-3 h-3 text-white/80 hover:text-white" />
                        )}
                        {showFeedback && (isWordCorrect || isTeacherRevealed) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                        {showFeedback && !isWordCorrect && !isTeacherRevealed && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </span>
                    );
                  }

                  return <span key={idx}>{seg.text}</span>;
                })}
              </div>

              {/* Word Bank */}
              {currentAct.wordBank && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Ngân hàng từ khóa (Bấm vào từ để điền):
                    </span>
                    {activeBlankIdx !== null && (
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Đang chọn chỗ trống số {activeBlankIdx + 1}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {currentAct.wordBank.map((word, wIdx) => {
                      const isUsed = Object.values(actAnswers.filledBlanks || {}).includes(word);
                      return (
                        <button
                          key={wIdx}
                          id={`word-bank-${wIdx}`}
                          onClick={() => handleWordBankClick(word)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                            isUsed
                              ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 shadow-none'
                              : 'bg-white hover:bg-indigo-50 border-slate-300 text-slate-800 hover:border-indigo-500 hover:scale-105 shadow-xs'
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

          {/* ========================================================================= */}
          {/* Explanation / Answer Key Box */}
          {/* ========================================================================= */}
          {(isChecked || isTeacherRevealed) && currentAct.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 text-emerald-950 text-sm sm:text-base space-y-1.5"
            >
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Giải thích & Kiến thức chuẩn SGK:</span>
              </div>
              <p className="leading-relaxed pl-7 text-emerald-900">{currentAct.explanation}</p>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* Bottom Actions Bar */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <button
                id="btn-practice-reset"
                onClick={handleResetCurrent}
                className="flex items-center gap-1.5 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-slate-200"
                title="Làm lại bài tập này"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại</span>
              </button>

              <button
                id="btn-practice-check"
                onClick={checkCurrentActivity}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kiểm tra kết quả</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-practice-prev"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentIdx === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Bài trước</span>
              </button>

              <button
                id="btn-practice-next"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] cursor-pointer"
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
