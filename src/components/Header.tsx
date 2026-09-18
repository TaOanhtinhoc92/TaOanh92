import React from 'react';
import { Lesson, Period, FontSizeLevel } from '../types';
import { soundManager } from '../utils/soundEffects';
import { FontSizeControl } from './FontSizeControl';
import {
  Menu,
  GraduationCap,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  BookOpen,
  FileText,
  Sparkles,
  Layers,
  Camera,
} from 'lucide-react';

interface HeaderProps {
  currentPeriod: Period;
  currentLesson: Lesson;
  isTeacherMode: boolean;
  onToggleTeacherMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSidebar: () => void;
  onOpenTeacherGuide: () => void;
  onOpenMediaHub: () => void;
  mediaCount: number;
  fontSize: FontSizeLevel;
  onChangeFontSize: (level: FontSizeLevel) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPeriod,
  currentLesson,
  isTeacherMode,
  onToggleTeacherMode,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onOpenSidebar,
  onOpenTeacherGuide,
  onOpenMediaHub,
  mediaCount,
  fontSize,
  onChangeFontSize,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Hamburger & Branding */}
        <div className="flex items-center gap-3">
          <button
            id="btn-open-sidebar"
            onClick={() => {
              soundManager.playClick();
              onOpenSidebar();
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer flex items-center gap-2"
            title="Danh mục 35 tiết học"
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-slate-600">
              Mục lục
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-display font-black text-lg shadow-sm">
              C4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Công Nghệ 4
                </span>
                <span className="text-xs font-semibold text-slate-500 hidden md:inline">
                  Kết nối tri thức với cuộc sống
                </span>
              </div>
              <h1 className="text-sm md:text-base font-bold text-slate-800 line-clamp-1">
                {currentLesson.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Side: Tools & Mode Toggles */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Classroom Font Size Control for Remote Viewing */}
          <FontSizeControl
            fontSize={fontSize}
            onChangeFontSize={onChangeFontSize}
          />

          {/* Pedagogical Guide Button */}
          <button
            id="btn-open-pedagogy"
            onClick={() => {
              soundManager.playClick();
              onOpenTeacherGuide();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Mục tiêu & Kế hoạch bài dạy"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="hidden lg:inline">Giáo án</span>
          </button>

          {/* Visual Media Hub Button */}
          <button
            id="btn-open-media-center"
            onClick={() => {
              soundManager.playClick();
              onOpenMediaHub();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Thư viện ảnh thật & video trực quan của bài học"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Ảnh & Video</span>
            {mediaCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                {mediaCount}
              </span>
            )}
          </button>

          {/* Teacher Mode Toggle */}
          <button
            id="btn-toggle-teacher-mode"
            onClick={() => {
              soundManager.playClick();
              onToggleTeacherMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isTeacherMode
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Bật/Tắt Chế độ giáo viên (hiện đáp án và gợi ý sư phạm)"
          >
            <GraduationCap className={`w-4 h-4 ${isTeacherMode ? 'text-amber-300' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{isTeacherMode ? 'Chế độ GV: BẬT' : 'Chế độ GV'}</span>
            <span className="sm:hidden">{isTeacherMode ? 'GV: BẬT' : 'GV'}</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            id="btn-toggle-sound"
            onClick={() => {
              onToggleMute();
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Classroom Projector / Fullscreen Mode */}
          <button
            id="btn-toggle-fullscreen"
            onClick={() => {
              soundManager.playClick();
              onToggleFullscreen();
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer hidden md:flex"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình / Máy chiếu'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

