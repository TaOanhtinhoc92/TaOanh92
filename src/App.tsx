/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { getPeriodByNumber, allPeriods } from './data/curriculum';
import { soundManager } from './utils/soundEffects';
import { ConfettiCanvas, ConfettiHandle } from './components/ConfettiCanvas';
import { Header } from './components/Header';
import { PeriodTabs, ActivityStep } from './components/PeriodTabs';
import { Sidebar } from './components/Sidebar';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { WarmUpView } from './components/WarmUpView';
import { ExploreView } from './components/ExploreView';
import { PracticeView } from './components/PracticeView';
import { ApplyView } from './components/ApplyView';
import { ChallengeView } from './components/ChallengeView';
import { RememberView } from './components/RememberView';
import { MediaCenterModal } from './components/MediaCenterModal';
import { getMediaForPeriod } from './utils/mediaManager';
import { AlertCircle, HelpCircle, Keyboard, Sparkles, Type, Camera } from 'lucide-react';
import { FontSizeLevel } from './types';

const STORAGE_KEY_PERIOD = 'congnghe4_current_period';
const STORAGE_KEY_COMPLETED = 'congnghe4_completed_periods';
const STORAGE_KEY_TEACHER_MODE = 'congnghe4_teacher_mode';
const STORAGE_KEY_FONT_SIZE = 'congnghe4_font_size';

const FONT_LEVELS: FontSizeLevel[] = ['normal', 'large', 'xlarge', 'huge'];

export default function App() {
  const confettiRef = useRef<ConfettiHandle>(null);

  // Current period number (1 to 35)
  const [currentPeriodNumber, setCurrentPeriodNumber] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PERIOD);
    const num = saved ? parseInt(saved, 10) : 1;
    return num >= 1 && num <= 35 ? num : 1;
  });

  // Current step in the 6-step teaching model
  const [activeStep, setActiveStep] = useState<ActivityStep>('warmup');

  // Teacher mode toggle
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_TEACHER_MODE) === 'true';
  });

  // Sound mute state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Classroom Font Scaling for Projector & Remote Viewing
  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
    if (saved && FONT_LEVELS.includes(saved as FontSizeLevel)) {
      return saved as FontSizeLevel;
    }
    return 'normal';
  });

  // Temporary toast for font size change feedback
  const [fontToast, setFontToast] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  // Sidebar, Teacher Guide and Visual Media Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [mediaRefreshKey, setMediaRefreshKey] = useState<number>(0);

  // Completed periods array
  const [completedPeriods, setCompletedPeriods] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply font scale to documentElement
  useEffect(() => {
    const root = document.documentElement;
    FONT_LEVELS.forEach((lvl) => root.classList.remove(`font-scale-${lvl}`));
    root.classList.add(`font-scale-${fontSize}`);
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, fontSize);

    if (!isFirstRender.current) {
      const labels: Record<FontSizeLevel, string> = {
        normal: 'Cỡ chữ: Vừa (100% - Tiêu chuẩn)',
        large: 'Cỡ chữ: Lớn (115% - Giảng dạy gần)',
        xlarge: 'Cỡ chữ: Rất lớn (130% - Chiếu xa / Cuối lớp nhìn rõ)',
        huge: 'Cỡ chữ: Cực lớn (145% - Tầm nhìn xa tối đa)',
      };
      setFontToast(labels[fontSize]);
      const timer = setTimeout(() => {
        setFontToast(null);
      }, 2400);
      return () => clearTimeout(timer);
    } else {
      isFirstRender.current = false;
    }
  }, [fontSize]);

  // Save current period to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PERIOD, currentPeriodNumber.toString());
  }, [currentPeriodNumber]);

  // Save teacher mode to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEACHER_MODE, isTeacherMode.toString());
  }, [isTeacherMode]);

  // Save completed periods to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedPeriods));
  }, [completedPeriods]);

  // Keyboard navigation for teachers during classroom presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        const stepOrder: ActivityStep[] = ['warmup', 'explore', 'practice', 'apply', 'challenge', 'remember'];
        const currentIdx = stepOrder.indexOf(activeStep);
        if (currentIdx < stepOrder.length - 1) {
          soundManager.playClick();
          setActiveStep(stepOrder[currentIdx + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const stepOrder: ActivityStep[] = ['warmup', 'explore', 'practice', 'apply', 'challenge', 'remember'];
        const currentIdx = stepOrder.indexOf(activeStep);
        if (currentIdx > 0) {
          soundManager.playClick();
          setActiveStep(stepOrder[currentIdx - 1]);
        }
      } else if (e.key === ']') {
        // Increase font size
        setFontSize((prev) => {
          const idx = FONT_LEVELS.indexOf(prev);
          if (idx < FONT_LEVELS.length - 1) {
            soundManager.playClick();
            return FONT_LEVELS[idx + 1];
          }
          return prev;
        });
      } else if (e.key === '[') {
        // Decrease font size
        setFontSize((prev) => {
          const idx = FONT_LEVELS.indexOf(prev);
          if (idx > 0) {
            soundManager.playClick();
            return FONT_LEVELS[idx - 1];
          }
          return prev;
        });
      } else if (e.key.toLowerCase() === 't') {
        soundManager.playClick();
        setIsTeacherMode((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      } else if (e.key.toLowerCase() === 'v') {
        soundManager.playClick();
        setIsMediaModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep]);

  // Get active period data
  const periodData = getPeriodByNumber(currentPeriodNumber) || getPeriodByNumber(1)!;
  const { period, lesson, part } = periodData;

  // Real Visual Media for current period (auto-recalculates when mediaRefreshKey updates)
  const currentMediaList = getMediaForPeriod(currentPeriodNumber);

  // Navigation handlers
  const handleSelectPeriod = (num: number) => {
    if (num >= 1 && num <= 35) {
      setCurrentPeriodNumber(num);
      setActiveStep('warmup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPeriod = () => {
    if (currentPeriodNumber > 1) {
      handleSelectPeriod(currentPeriodNumber - 1);
    }
  };

  const handleNextPeriod = () => {
    if (currentPeriodNumber < 35) {
      handleSelectPeriod(currentPeriodNumber + 1);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const triggerConfetti = () => {
    confettiRef.current?.fire();
  };

  const handleCompletePeriod = () => {
    if (!completedPeriods.includes(currentPeriodNumber)) {
      setCompletedPeriods((prev) => [...prev, currentPeriodNumber]);
    }
    triggerConfetti();

    // Advance to next period if available
    if (currentPeriodNumber < 35) {
      setTimeout(() => {
        handleSelectPeriod(currentPeriodNumber + 1);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-200">
      {/* Confetti Particle Layer */}
      <ConfettiCanvas ref={confettiRef} />

      {/* Top Application Header */}
      <Header
        currentPeriod={period}
        currentLesson={lesson}
        isTeacherMode={isTeacherMode}
        onToggleTeacherMode={() => setIsTeacherMode((prev) => !prev)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        onOpenMediaHub={() => setIsMediaModalOpen(true)}
        mediaCount={currentMediaList.length}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
      />

      {/* 6-Step Period Navigation Tabs */}
      <PeriodTabs
        currentPeriod={period}
        activeStep={activeStep}
        onSelectStep={(step) => {
          setActiveStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPrevPeriod={handlePrevPeriod}
        onNextPeriod={handleNextPeriod}
        canPrev={currentPeriodNumber > 1}
        canNext={currentPeriodNumber < 35}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Lesson Breadcrumb & Subject Info */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-emerald-700">{part.title}</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">{lesson.title}</span>
            <span>•</span>
            <span className="bg-slate-200/80 px-2 py-0.5 rounded text-slate-800 font-bold">
              Tiết {period.periodNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isTeacherMode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Đang hiển thị gợi ý & đáp án sư phạm
              </span>
            )}
          </div>
        </div>

        {/* Step Views */}
        {activeStep === 'warmup' && (
          <WarmUpView
            warmUp={period.warmUp}
            isTeacherMode={isTeacherMode}
            onComplete={() => setActiveStep('explore')}
          />
        )}

        {activeStep === 'explore' && (
          <ExploreView
            activities={period.explore}
            isTeacherMode={isTeacherMode}
            onComplete={() => setActiveStep('practice')}
            periodNumber={period.periodNumber}
          />
        )}

        {activeStep === 'practice' && (
          <PracticeView
            activities={period.practice}
            isTeacherMode={isTeacherMode}
            onComplete={() => setActiveStep('apply')}
            triggerConfetti={triggerConfetti}
          />
        )}

        {activeStep === 'apply' && (
          <ApplyView
            activities={period.apply}
            isTeacherMode={isTeacherMode}
            onComplete={() => setActiveStep('challenge')}
          />
        )}

        {activeStep === 'challenge' && (
          <ChallengeView
            challenges={period.challenge}
            isTeacherMode={isTeacherMode}
            onComplete={() => setActiveStep('remember')}
            triggerConfetti={triggerConfetti}
          />
        )}

        {activeStep === 'remember' && (
          <RememberView
            remember={period.remember}
            periodNumber={period.periodNumber}
            onCompletePeriod={handleCompletePeriod}
            triggerConfetti={triggerConfetti}
            hasNextPeriod={currentPeriodNumber < 35}
          />
        )}
      </main>

      {/* Classroom Footer Toolbar & Keyboard Helper */}
      <footer className="bg-white border-t border-slate-200 px-4 py-3 text-slate-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Công Nghệ 4</span>
            <span>—</span>
            <span>Bộ sách Kết nối tri thức với cuộc sống (35 tiết chuẩn)</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
                →
              </kbd>
              <span>Chuyển bước</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
                T
              </kbd>
              <span>Chế độ GV</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
                M
              </kbd>
              <span>Bật/Tắt tiếng</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
                [
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
                ]
              </kbd>
              <span>Cỡ chữ chiếu xa</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[10px] text-slate-700">
                V
              </kbd>
              <span>Ảnh & Video thật</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Font Size Change Toast Notification */}
      {fontToast && (
        <div
          id="toast-font-size-change"
          className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none"
        >
          <Type className="w-4 h-4 text-amber-400" />
          <span>{fontToast}</span>
        </div>
      )}

      {/* Curriculum 35-Period Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPeriodNumber={currentPeriodNumber}
        onSelectPeriod={handleSelectPeriod}
        completedPeriods={completedPeriods}
      />

      {/* Pedagogical Plan & Teacher Guide Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
        period={period}
      />

      {/* Visual Media Center Modal (Real Photos & Educational Videos) */}
      <MediaCenterModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        period={period}
        mediaList={currentMediaList}
        onRefreshMedia={() => setMediaRefreshKey((prev) => prev + 1)}
        isTeacherMode={isTeacherMode}
      />
    </div>
  );
}
