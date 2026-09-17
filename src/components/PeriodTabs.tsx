import React from 'react';
import { Period } from '../types';
import { soundManager } from '../utils/soundEffects';
import { Sparkles, BookOpen, Award, HeartHandshake, Trophy, BookmarkCheck, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export type ActivityStep = 'warmup' | 'explore' | 'practice' | 'apply' | 'challenge' | 'remember';

interface PeriodTabsProps {
  currentPeriod: Period;
  activeStep: ActivityStep;
  onSelectStep: (step: ActivityStep) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export const PeriodTabs: React.FC<PeriodTabsProps> = ({
  currentPeriod,
  activeStep,
  onSelectStep,
  onPrevPeriod,
  onNextPeriod,
  canPrev,
  canNext,
}) => {
  const steps: { id: ActivityStep; label: string; icon: any; color: string }[] = [
    { id: 'warmup', label: '1. Khởi động', icon: Sparkles, color: 'text-amber-500' },
    { id: 'explore', label: '2. Khám phá', icon: BookOpen, color: 'text-emerald-500' },
    { id: 'practice', label: '3. Luyện tập', icon: Award, color: 'text-indigo-500' },
    { id: 'apply', label: '4. Vận dụng', icon: HeartHandshake, color: 'text-teal-500' },
    { id: 'challenge', label: '5. Thử thách', icon: Trophy, color: 'text-rose-500' },
    { id: 'remember', label: '6. Ghi nhớ', icon: BookmarkCheck, color: 'text-orange-500' },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3.5 space-y-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        {/* Period Title & Duration */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              id="btn-prev-period-tab"
              onClick={() => {
                soundManager.playClick();
                onPrevPeriod();
              }}
              disabled={!canPrev}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                canPrev
                  ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  : 'border-slate-200 text-slate-300 opacity-50 cursor-not-allowed'
              }`}
              title="Tiết trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Tiết {currentPeriod.periodNumber} / 35
            </span>

            <button
              id="btn-next-period-tab"
              onClick={() => {
                soundManager.playClick();
                onNextPeriod();
              }}
              disabled={!canNext}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                canNext
                  ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  : 'border-slate-200 text-slate-300 opacity-50 cursor-not-allowed'
              }`}
              title="Tiết sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base md:text-lg font-bold text-slate-900 line-clamp-1">
            {currentPeriod.title}
          </h2>

          <span className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            {currentPeriod.duration || '35 phút'}
          </span>
        </div>

        {/* 6 Step Activity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {steps.map((st) => {
            const Icon = st.icon;
            const isActive = activeStep === st.id;

            return (
              <button
                key={st.id}
                id={`tab-${st.id}`}
                onClick={() => {
                  soundManager.playClick();
                  onSelectStep(st.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : st.color}`} />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
