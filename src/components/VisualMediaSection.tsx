import React, { useState } from 'react';
import { VisualMediaItem } from '../types';
import { soundManager } from '../utils/soundEffects';
import { MediaViewerModal } from './MediaViewerModal';
import { AddMediaModal } from './AddMediaModal';
import {
  deleteMediaItem,
  hasDeletedDefaultMedia,
  restoreDefaultMediaForPeriod,
} from '../utils/mediaManager';
import { formatDuration } from '../utils/indexedDbStorage';
import {
  Camera,
  Play,
  Plus,
  Sparkles,
  Maximize2,
  Trash2,
  Tv,
  Image as ImageIcon,
  Film,
  HardDrive,
  Clock,
  AlertTriangle,
  RotateCcw,
  Info,
} from 'lucide-react';

interface VisualMediaSectionProps {
  periodNumber: number;
  mediaList: VisualMediaItem[];
  onRefreshMedia: () => void;
  isTeacherMode: boolean;
}

export const VisualMediaSection: React.FC<VisualMediaSectionProps> = ({
  periodNumber,
  mediaList,
  onRefreshMedia,
  isTeacherMode,
}) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState<VisualMediaItem | null>(null);

  const hasDeletedCurated = hasDeletedDefaultMedia(periodNumber);

  const handleDelete = (id: string) => {
    deleteMediaItem(id);
    soundManager.playClick();
    onRefreshMedia();
  };

  const handleConfirmDelete = () => {
    if (!itemPendingDelete) return;
    handleDelete(itemPendingDelete.id);
    setItemPendingDelete(null);
  };

  const handleRestoreDefaults = () => {
    soundManager.playClick();
    restoreDefaultMediaForPeriod(periodNumber);
    onRefreshMedia();
  };

  return (
    <div id="visual-media-section" className="space-y-4">
      {/* Section Header with Add Media CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-2xl border border-emerald-200/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-800">
                Góc Trực Quan: Ảnh & Video Thực Tế
              </h4>
              <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {mediaList.length} tư liệu
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hình ảnh thực tế và video mẫu giúp học sinh quan sát sinh động. Thầy/Cô có thể xóa ảnh/video nếu chưa phù hợp.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasDeletedCurated && (
            <button
              onClick={handleRestoreDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="Khôi phục lại các ảnh/video mặc định ban đầu của tiết này"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Khôi phục tư liệu gốc</span>
            </button>
          )}

          <button
            id="btn-add-real-media"
            onClick={() => {
              soundManager.playClick();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Tải video hoặc ảnh thật từ máy hoặc chèn link YouTube"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Chèn ảnh / video của bạn</span>
          </button>
        </div>
      </div>

      {/* Restore Banner Notice if some defaults were deleted */}
      {hasDeletedCurated && (
        <div className="flex items-center justify-between p-2.5 px-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-800">
          <span className="flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            Có tư liệu mặc định đã được xóa khỏi tiết này để phù hợp với lớp học.
          </span>
          <button
            onClick={handleRestoreDefaults}
            className="font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            Khôi phục lại
          </button>
        </div>
      )}

      {/* Media Items Grid */}
      {mediaList.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <Camera className="w-10 h-10 mx-auto text-slate-300" />
          <div>
            <p className="font-semibold text-sm text-slate-700">Chưa có ảnh hoặc video nào hiển thị trong tiết này.</p>
            <p className="text-xs text-slate-400 mt-1">
              Thầy/Cô có thể tải lên tư liệu từ máy tính hoặc khôi phục lại tư liệu mặc định nếu đã xóa.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            {hasDeletedCurated && (
              <button
                onClick={handleRestoreDefaults}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Khôi phục tư liệu gốc</span>
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm ảnh hoặc video</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaList.map((item, idx) => {
            const isVideo = item.type === 'video';

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between hover:border-emerald-300"
              >
                {/* Thumbnail Header Area */}
                <div
                  className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedMediaIndex(idx);
                  }}
                >
                  <img
                    src={
                      item.thumbnailUrl
                        ? item.thumbnailUrl
                        : isVideo
                        ? item.url.includes('youtube')
                          ? `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80`
                          : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
                        : item.url
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 group-hover:from-black/80 transition-colors" />

                  {/* Media Type Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs text-white flex items-center gap-1 ${
                        isVideo ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                    >
                      {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      {isVideo ? 'Video' : 'Ảnh thật'}
                    </span>
                    {item.isCustom && (
                      <span className="text-[10px] font-extrabold text-amber-900 bg-amber-300 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.fileId || item.url.startsWith('idb://') ? 'Từ máy' : 'Tự thêm'}
                      </span>
                    )}
                  </div>

                  {/* Quick Delete Button on Thumbnail Top-Right */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      setItemPendingDelete(item);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white/90 hover:text-white backdrop-blur-xs transition-colors cursor-pointer z-10 opacity-80 hover:opacity-100 shadow-sm"
                    title="Xóa tư liệu này nếu thấy chưa phù hợp"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Video Duration Pill */}
                  {isVideo && item.duration && item.duration > 0 && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded-md flex items-center gap-1 shadow-xs border border-white/10">
                      <Clock className="w-2.5 h-2.5 text-slate-300" />
                      <span>{formatDuration(item.duration)}</span>
                    </div>
                  )}

                  {/* Play / Expand icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {isVideo ? (
                      <div className="w-11 h-11 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h5
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedMediaIndex(idx);
                      }}
                      className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {item.title}
                    </h5>
                    {item.caption && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[120px] font-medium">
                      {item.author || 'Tư liệu thực tế'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Clear Delete Button on Card Bottom */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playClick();
                          setItemPendingDelete(item);
                        }}
                        className="px-2 py-1 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Xóa tư liệu này khỏi bài học nếu chưa phù hợp"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>

                      {/* View Button */}
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setSelectedMediaIndex(idx);
                        }}
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{isVideo ? 'Xem video' : 'Phóng to'}</span>
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Viewer Modal */}
      {selectedMediaIndex !== null && (
        <MediaViewerModal
          isOpen={selectedMediaIndex !== null}
          onClose={() => setSelectedMediaIndex(null)}
          mediaList={mediaList}
          initialIndex={selectedMediaIndex}
          onDeleteMedia={(id) => {
            handleDelete(id);
          }}
          onDeleteCustomMedia={(id) => {
            handleDelete(id);
          }}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      )}

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        periodNumber={periodNumber}
        onMediaAdded={() => {
          onRefreshMedia();
        }}
      />

      {/* In-App Delete Confirmation Modal */}
      {itemPendingDelete && (
        <div
          id="confirm-delete-modal"
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Xóa tư liệu khỏi bài học?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Thầy/Cô thấy {itemPendingDelete.type === 'video' ? 'video' : 'hình ảnh'}{' '}
                <strong className="text-rose-700 font-bold">"{itemPendingDelete.title}"</strong>{' '}
                chưa phù hợp với học sinh? Sau khi xóa, tư liệu sẽ được gỡ khỏi bài học.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setItemPendingDelete(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                Giữ lại
              </button>

              <button
                id="btn-confirm-delete"
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
