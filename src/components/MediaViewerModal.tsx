import React, { useState, useEffect } from 'react';
import { VisualMediaItem } from '../types';
import { getEmbedVideoUrl } from '../utils/mediaManager';
import { resolvePlayableMediaUrl, formatDuration, formatFileSize } from '../utils/indexedDbStorage';
import { soundManager } from '../utils/soundEffects';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Play,
  Image as ImageIcon,
  Tv,
  Trash2,
  Sparkles,
  Info,
  HardDrive,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: VisualMediaItem[];
  initialIndex?: number;
  onDeleteMedia?: (id: string) => void;
  onDeleteCustomMedia?: (id: string) => void;
  onOpenAddModal?: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  initialIndex = 0,
  onDeleteMedia,
  onDeleteCustomMedia,
  onOpenAddModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playableUrl, setPlayableUrl] = useState<string>('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  const currentItem = mediaList[currentIndex] || mediaList[0];

  useEffect(() => {
    if (!currentItem) return;
    let isCancelled = false;
    resolvePlayableMediaUrl(currentItem.url, currentItem.fileId).then((url) => {
      if (!isCancelled) {
        setPlayableUrl(url);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [currentItem]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && mediaList.length > 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && mediaList.length > 1) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, mediaList.length]);

  if (!isOpen || mediaList.length === 0) return null;

  const { isYouTube, embedUrl } = getEmbedVideoUrl(currentItem.url);

  const handlePrev = () => {
    soundManager.playClick();
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNext = () => {
    soundManager.playClick();
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

  const toggleZoom = () => {
    soundManager.playClick();
    setZoomLevel((prev) => (prev === 1 ? 1.6 : 1));
  };

  return (
    <div
      id="modal-media-viewer"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between text-white animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="p-4 sm:px-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-emerald-400">
            {currentItem.type === 'video' ? (
              <Play className="w-5 h-5 fill-current" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {currentItem.type === 'video' ? 'Video Thực Tế' : 'Ảnh Chụp Thật'}
              </span>
              {currentItem.isCustom && (
                <span className="text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {currentItem.fileId || currentItem.url.startsWith('idb://')
                    ? 'Video tải từ máy'
                    : 'Ảnh/Video của giáo viên'}
                </span>
              )}
              {currentItem.duration && currentItem.duration > 0 && (
                <span className="text-xs text-slate-300 bg-black/50 border border-white/15 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formatDuration(currentItem.duration)}
                </span>
              )}
              {currentItem.fileSize && (
                <span className="text-xs text-slate-400 font-mono">
                  {formatFileSize(currentItem.fileSize)}
                </span>
              )}
              <span className="text-xs text-slate-400">
                {currentIndex + 1} / {mediaList.length}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1 mt-0.5">
              {currentItem.title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentItem.type === 'image' && (
            <button
              onClick={toggleZoom}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title={zoomLevel > 1 ? 'Thu nhỏ lại' : 'Phóng to ảnh (160%)'}
            >
              {zoomLevel > 1 ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </button>
          )}

          {(onDeleteMedia || onDeleteCustomMedia) && (
            <button
              onClick={() => {
                soundManager.playClick();
                setIsConfirmingDelete(true);
              }}
              className="px-3 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/60 text-rose-200 hover:text-white border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Xóa tư liệu này nếu thấy chưa phù hợp"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Xóa tư liệu</span>
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Đóng (phím Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Media Presentation Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Navigation Arrow Left */}
        {mediaList.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
            title="Tư liệu trước (phím ←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Media Container */}
        <div className="max-w-5xl max-h-[70vh] w-full h-full flex items-center justify-center">
          {currentItem.type === 'video' ? (
            <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              {isYouTube ? (
                <iframe
                  src={embedUrl}
                  title={currentItem.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  key={playableUrl || currentItem.url}
                  src={playableUrl || currentItem.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Trình duyệt không hỗ trợ xem video trực tiếp.
                </video>
              )}
            </div>
          ) : (
            <div
              className={`transition-transform duration-200 max-h-[70vh] flex items-center justify-center ${
                zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={toggleZoom}
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={playableUrl || currentItem.url}
                alt={currentItem.title}
                className="max-h-[68vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/15 select-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation Arrow Right */}
        {mediaList.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
            title="Tư liệu sau (phím →)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Information & Thumbnails Bar */}
      <div className="p-4 sm:px-8 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col gap-3">
        {/* Caption & Observation note */}
        {currentItem.caption && (
          <div className="max-w-3xl mx-auto text-center bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              💡 {currentItem.caption}
            </p>
            {currentItem.author && (
              <span className="text-xs text-slate-400 mt-1 block">
                Nguồn: {currentItem.author}
              </span>
            )}
          </div>
        )}

        {/* Thumbnail Filmstrip */}
        {mediaList.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {mediaList.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setZoomLevel(1);
                  setCurrentIndex(idx);
                }}
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === currentIndex
                    ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105'
                    : 'border-white/20 opacity-60 hover:opacity-90'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white relative">
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-current text-emerald-400" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* In-App Delete Confirmation Modal Overlay */}
      {isConfirmingDelete && (
        <div
          id="delete-confirm-overlay"
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Xóa tư liệu khỏi bài học?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Thầy/Cô thấy {currentItem.type === 'video' ? 'video' : 'hình ảnh'}{' '}
                <strong className="text-rose-700 font-bold">"{currentItem.title}"</strong>{' '}
                chưa phù hợp với học sinh? Sau khi xóa, tư liệu sẽ không còn hiển thị trong bài học này nữa.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsConfirmingDelete(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                Giữ lại
              </button>

              <button
                id="btn-confirm-delete-viewer"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  const deleteFn = onDeleteMedia || onDeleteCustomMedia;
                  if (deleteFn) {
                    deleteFn(currentItem.id);
                  }
                  setIsConfirmingDelete(false);
                  if (mediaList.length <= 1) {
                    onClose();
                  } else {
                    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
                  }
                }}
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
