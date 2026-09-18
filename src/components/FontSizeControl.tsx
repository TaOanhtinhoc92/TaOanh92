import React, { useState, useRef, useEffect } from 'react';
import { FontSizeLevel, FontSizeOption } from '../types';
import { soundManager } from '../utils/soundEffects';
import {
  Type,
  Check,
  RotateCcw,
  Sparkles,
  Monitor,
  Tv,
  ChevronDown,
} from 'lucide-react';

interface FontSizeControlProps {
  fontSize: FontSizeLevel;
  onChangeFontSize: (level: FontSizeLevel) => void;
}

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  {
    level: 'normal',
    label: 'Vừa (Tiêu chuẩn)',
    percentage: '100%',
    description: 'Màn hình máy tính cá nhân / laptop của giáo viên',
    recommendation: 'Soạn giáo án & xem gần',
  },
  {
    level: 'large',
    label: 'Lớn',
    percentage: '115%',
    description: 'Phòng học nhỏ, học sinh ngồi dãy bàn đầu và giữa',
    recommendation: 'Màn hình 15 – 24 inch',
  },
  {
    level: 'xlarge',
    label: 'Rất lớn (Chiếu xa)',
    percentage: '130%',
    description: 'Học sinh ngồi cuối lớp và xa bảng vẫn đọc rõ ràng',
    recommendation: 'Khuyên dùng cho máy chiếu & TV lớp học',
  },
  {
    level: 'huge',
    label: 'Cực lớn (Tối đa)',
    percentage: '145%',
    description: 'Hội trường lớn, màn hình xa bảng hoặc học sinh có thị lực kém',
    recommendation: 'Tầm nhìn từ 7 – 15 mét',
  },
];

const ORDERED_LEVELS: FontSizeLevel[] = ['normal', 'large', 'xlarge', 'huge'];

export const FontSizeControl: React.FC<FontSizeControlProps> = ({
  fontSize,
  onChangeFontSize,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentIndex = ORDERED_LEVELS.indexOf(fontSize);
  const currentOption = FONT_SIZE_OPTIONS.find((o) => o.level === fontSize) || FONT_SIZE_OPTIONS[0];

  const handleDecrease = () => {
    if (currentIndex > 0) {
      soundManager.playClick();
      onChangeFontSize(ORDERED_LEVELS[currentIndex - 1]);
    }
  };

  const handleIncrease = () => {
    if (currentIndex < ORDERED_LEVELS.length - 1) {
      soundManager.playClick();
      onChangeFontSize(ORDERED_LEVELS[currentIndex + 1]);
    }
  };

  const handleSelect = (level: FontSizeLevel) => {
    soundManager.playClick();
    onChangeFontSize(level);
  };

  const handleReset = () => {
    soundManager.playClick();
    onChangeFontSize('normal');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Header Button */}
      <button
        id="btn-font-size-control"
        type="button"
        onClick={() => {
          soundManager.playClick();
          setIsOpen((prev) => !prev);
        }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
          fontSize !== 'normal'
            ? 'bg-amber-50 text-amber-900 border border-amber-300 ring-2 ring-amber-200'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
        }`}
        title="Tùy chỉnh cỡ chữ để học sinh nhìn rõ từ xa"
        aria-expanded={isOpen}
      >
        <Type className={`w-4 h-4 ${fontSize !== 'normal' ? 'text-amber-600' : 'text-slate-600'}`} />
        <span className="hidden sm:inline">Cỡ chữ:</span>
        <span
          className={`font-extrabold px-1.5 py-0.5 rounded text-[11px] ${
            fontSize === 'xlarge' || fontSize === 'huge'
              ? 'bg-amber-500 text-white shadow-xs'
              : fontSize === 'large'
              ? 'bg-amber-200 text-amber-900'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {currentOption.percentage}
          {fontSize === 'xlarge' && ' 🔭'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          id="popover-font-size"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header of Popover */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  Cỡ chữ giảng dạy từ xa
                </h3>
                <p className="text-[11px] text-slate-500">
                  Giúp học sinh ngồi cuối lớp nhìn rõ trên máy chiếu
                </p>
              </div>
            </div>
            {fontSize !== 'normal' && (
              <button
                id="btn-font-size-reset"
                onClick={handleReset}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đặt lại cỡ chữ mặc định (100%)"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>

          {/* Quick Stepper Controls: A- / Indicator / A+ */}
          <div className="my-3.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
            <button
              id="btn-font-decrease"
              onClick={handleDecrease}
              disabled={currentIndex === 0}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Thu nhỏ chữ (Phím [)"
            >
              <span className="text-sm font-black">A-</span>
              <span className="text-[11px] text-slate-500">Giảm</span>
            </button>

            <div className="text-center px-2">
              <div className="text-base font-extrabold text-slate-900">
                {currentOption.percentage}
              </div>
              <div className="text-[10px] font-semibold text-emerald-700">
                {currentOption.label}
              </div>
            </div>

            <button
              id="btn-font-increase"
              onClick={handleIncrease}
              disabled={currentIndex === ORDERED_LEVELS.length - 1}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs shadow-2xs transition-all cursor-pointer"
              title="Phóng to chữ (Phím ])"
            >
              <span className="text-sm font-black">A+</span>
              <span className="text-[11px] text-slate-500">Tăng</span>
            </button>
          </div>

          {/* Preset Options List */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Mức khuyến nghị theo không gian lớp:
            </div>
            {FONT_SIZE_OPTIONS.map((opt) => {
              const isSelected = fontSize === opt.level;
              return (
                <button
                  key={opt.level}
                  id={`btn-font-option-${opt.level}`}
                  onClick={() => handleSelect(opt.level)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 shadow-2xs ring-1 ring-amber-300'
                      : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-900 font-extrabold' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.percentage}
                      </span>
                      {opt.level === 'xlarge' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          Chuẩn máy chiếu
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {opt.description}
                    </p>
                  </div>

                  <div className="mt-0.5 flex-shrink-0">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Keyboard shortcut footnote */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-slate-400" />
              <span>Phím tắt giảng dạy:</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-slate-600">
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300">[</kbd> giảm / <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300">]</kbd> tăng
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
