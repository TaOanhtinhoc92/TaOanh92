import React, { useState } from 'react';
import { VisualMediaItem, Period } from '../types';
import { soundManager } from '../utils/soundEffects';
import { VisualMediaSection } from './VisualMediaSection';
import { AddMediaModal } from './AddMediaModal';
import {
  X,
  Camera,
  Film,
  Sparkles,
  Plus,
  Play,
  Maximize2,
  Info,
} from 'lucide-react';

interface MediaCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: Period;
  mediaList: VisualMediaItem[];
  onRefreshMedia: () => void;
  isTeacherMode: boolean;
}

export const MediaCenterModal: React.FC<MediaCenterModalProps> = ({
  isOpen,
  onClose,
  period,
  mediaList,
  onRefreshMedia,
  isTeacherMode,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      id="modal-media-center"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs">
              <Camera className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Tiết {period.periodNumber}
                </span>
                <span className="text-xs text-emerald-100 font-medium">
                  {mediaList.length} tư liệu trực quan
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display mt-0.5">
                Thư Viện Ảnh Thật & Video Thực Tế: {period.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsAddModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Chèn thêm ảnh/video</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3 text-slate-600 text-xs sm:text-sm">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold text-slate-800">
                Hỗ trợ giáo viên trình chiếu trực quan cho học sinh trên lớp
              </p>
              <p className="text-slate-500 mt-0.5">
                Bấm vào bất kỳ bức ảnh nào để phóng to toàn màn hình máy chiếu, hoặc bấm xem video hướng dẫn thao tác thực tế. Thầy/Cô có thể tự tải ảnh thực tế chụp tại lớp học hoặc dán link video YouTube bất cứ lúc nào.
              </p>
            </div>
          </div>

          <VisualMediaSection
            periodNumber={period.periodNumber}
            mediaList={mediaList}
            onRefreshMedia={onRefreshMedia}
            isTeacherMode={isTeacherMode}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            💡 Phím tắt: Bấm vào ảnh để mở chế độ trình chiếu toàn màn hình.
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>

      {/* Embedded Add Media Modal */}
      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        periodNumber={period.periodNumber}
        onMediaAdded={() => {
          onRefreshMedia();
        }}
      />
    </div>
  );
};
