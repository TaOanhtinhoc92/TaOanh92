import React, { useState, useRef } from 'react';
import { VisualMediaItem } from '../types';
import {
  CustomIllustrationMedia,
  saveCustomIllustrationImageFile,
  saveCustomIllustrationVideoFile,
  saveCustomIllustrationYouTube,
  saveCustomIllustrationImageUrl,
  saveCustomIllustration,
} from '../utils/customIllustrationManager';
import { getEmbedVideoUrl } from '../utils/mediaManager';
import { formatFileSize, formatDuration } from '../utils/indexedDbStorage';
import { soundManager } from '../utils/soundEffects';
import {
  X,
  Upload,
  Video,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Play,
  Film,
  HardDrive,
  Clock,
  Check,
  AlertCircle,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';

interface ChangeIllustrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodNumber: number;
  activityId: string;
  activityTitle?: string;
  lessonMediaList: VisualMediaItem[];
  onSaved: (newMedia: CustomIllustrationMedia) => void;
}

type TabKey = 'upload-image' | 'upload-video' | 'youtube' | 'image-url' | 'lesson-library';

export const ChangeIllustrationModal: React.FC<ChangeIllustrationModalProps> = ({
  isOpen,
  onClose,
  periodNumber,
  activityId,
  activityTitle,
  lessonMediaList,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('upload-image');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [urlInput, setUrlInput] = useState('');

  // Image upload
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Video upload
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Lesson library pick
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<VisualMediaItem | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setCaption('');
    setUrlInput('');
    setUploadedImageFile(null);
    setImagePreviewUrl(null);
    if (videoPreviewUrl) {
      try {
        URL.revokeObjectURL(videoPreviewUrl);
      } catch (_) {}
    }
    setUploadedVideoFile(null);
    setVideoPreviewUrl(null);
    setVideoDuration(0);
    setSelectedLibraryItem(null);
    setErrorMsg(null);
  };

  const handleClose = () => {
    soundManager.playClick();
    resetForm();
    onClose();
  };

  // Image Selection Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh tối đa là 15MB.');
      return;
    }

    setErrorMsg(null);
    setUploadedImageFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreviewUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Video Selection Handler
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMsg('Vui lòng chọn tệp video hợp lệ (MP4, WebM, MOV).');
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setErrorMsg('Dung lượng tệp video vượt quá 150MB. Vui lòng chọn tệp nhỏ hơn hoặc dùng liên kết YouTube.');
      return;
    }

    setErrorMsg(null);
    setUploadedVideoFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    if (videoPreviewUrl) {
      try {
        URL.revokeObjectURL(videoPreviewUrl);
      } catch (_) {}
    }
    const tempUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(tempUrl);

    // Get duration
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = tempUrl;
    tempVideo.onloadedmetadata = () => {
      setVideoDuration(tempVideo.duration || 0);
    };
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      let savedResult: CustomIllustrationMedia | null = null;

      if (activeTab === 'upload-image') {
        if (!uploadedImageFile) {
          setErrorMsg('Vui lòng chọn một tệp hình ảnh từ máy tính.');
          setIsProcessing(false);
          return;
        }
        savedResult = await saveCustomIllustrationImageFile(
          periodNumber,
          activityId,
          uploadedImageFile,
          title,
          caption
        );
      } else if (activeTab === 'upload-video') {
        if (!uploadedVideoFile) {
          setErrorMsg('Vui lòng chọn một tệp video từ máy tính.');
          setIsProcessing(false);
          return;
        }
        savedResult = await saveCustomIllustrationVideoFile(
          periodNumber,
          activityId,
          uploadedVideoFile,
          title,
          caption
        );
      } else if (activeTab === 'youtube') {
        const trimmedUrl = urlInput.trim();
        if (!trimmedUrl) {
          setErrorMsg('Vui lòng nhập đường dẫn video YouTube.');
          setIsProcessing(false);
          return;
        }
        const { isYouTube } = getEmbedVideoUrl(trimmedUrl);
        if (!isYouTube) {
          setErrorMsg('Đường dẫn không phải định dạng video YouTube hợp lệ.');
          setIsProcessing(false);
          return;
        }
        savedResult = saveCustomIllustrationYouTube(
          periodNumber,
          activityId,
          trimmedUrl,
          title,
          caption
        );
      } else if (activeTab === 'image-url') {
        const trimmedUrl = urlInput.trim();
        if (!trimmedUrl || !trimmedUrl.startsWith('http')) {
          setErrorMsg('Vui lòng nhập đường dẫn ảnh hợp lệ (bắt đầu bằng http:// hoặc https://).');
          setIsProcessing(false);
          return;
        }
        savedResult = saveCustomIllustrationImageUrl(
          periodNumber,
          activityId,
          trimmedUrl,
          title,
          caption
        );
      } else if (activeTab === 'lesson-library') {
        if (!selectedLibraryItem) {
          setErrorMsg('Vui lòng nhấp chọn một hình ảnh hoặc video trong danh sách bên dưới.');
          setIsProcessing(false);
          return;
        }
        savedResult = saveCustomIllustration(periodNumber, activityId, {
          type: selectedLibraryItem.type === 'video' ? 'video' : 'image',
          url: selectedLibraryItem.url,
          thumbnailUrl: selectedLibraryItem.thumbnailUrl || selectedLibraryItem.url,
          title: title || selectedLibraryItem.title,
          caption: caption || selectedLibraryItem.caption,
          isYouTube: selectedLibraryItem.isYouTube,
          fileId: selectedLibraryItem.fileId,
        });
      }

      if (savedResult) {
        soundManager.playSuccess();
        onSaved(savedResult);
        handleClose();
      }
    } catch (err: any) {
      console.error('Error saving custom illustration:', err);
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi lưu nội dung trực quan. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const ytPreview = activeTab === 'youtube' && urlInput ? getEmbedVideoUrl(urlInput) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Thay Đổi Hình Ảnh Hoặc Chèn Video</h3>
              <p className="text-xs text-emerald-100">
                {activityTitle ? `Áp dụng cho: ${activityTitle}` : 'Làm cho hoạt động học tập thêm sinh động'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto p-1.5 gap-1 shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('upload-image');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'upload-image'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tải ảnh từ máy</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('upload-video');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'upload-video'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tải video từ máy</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('youtube');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-rose-600" />
            <span>Chèn video YouTube</span>
          </button>

          {lessonMediaList.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveTab('lesson-library');
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'lesson-library'
                  ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Thư viện bài học ({lessonMediaList.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('image-url');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'image-url'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Liên kết ảnh web</span>
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: Upload Image from Computer */}
          {activeTab === 'upload-image' && (
            <div className="space-y-4">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />

              {!imagePreviewUrl ? (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/70 hover:bg-emerald-50/40 transition-all group space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Bấm vào đây để chọn ảnh chụp thực tế từ máy tính
                  </p>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ định dạng JPG, PNG, WEBP (tối đa 15MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56 flex items-center justify-center group">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="max-h-56 w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold shadow-md hover:bg-emerald-50 cursor-pointer"
                    >
                      Chọn ảnh khác
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImageFile(null);
                        setImagePreviewUrl(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 cursor-pointer"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Upload Video from Computer */}
          {activeTab === 'upload-video' && (
            <div className="space-y-4">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={handleVideoChange}
              />

              {!videoPreviewUrl ? (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/70 hover:bg-indigo-50/40 transition-all group space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Bấm vào đây để chọn tệp video minh họa từ máy tính
                  </p>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ tệp MP4, WebM, MOV. Tệp được lưu trực tiếp an toàn trên máy của bạn (IndexedDB).
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video max-h-56 flex items-center justify-center">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {uploadedVideoFile && (
                    <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                        Dung lượng: {formatFileSize(uploadedVideoFile.size)}
                      </span>
                      {videoDuration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          Thời lượng: {formatDuration(videoDuration)}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="text-indigo-600 font-bold hover:underline cursor-pointer"
                      >
                        Đổi video khác
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: YouTube Video URL */}
          {activeTab === 'youtube' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Đường dẫn liên kết Video YouTube:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 pr-20"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => setUrlInput('')}
                      className="absolute right-2 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 Thầy/Cô chỉ cần copy link video trên YouTube và dán vào đây, hệ thống sẽ tự động chuyển thành video phát bài giảng chuẩn.
                </p>
              </div>

              {ytPreview && ytPreview.isYouTube && (
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video max-h-56 bg-black">
                  <iframe
                    src={ytPreview.embedUrl}
                    title="YouTube Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Image Web URL */}
          {activeTab === 'image-url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Đường dẫn liên kết hình ảnh trực tuyến (URL):
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/hinh-anh.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {urlInput && urlInput.startsWith('http') && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56 flex items-center justify-center">
                  <img
                    src={urlInput}
                    alt="Web Preview"
                    className="max-h-56 w-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={() => setErrorMsg('Không thể tải trước ảnh từ URL này. Vui lòng kiểm tra lại link.')}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Pick from Lesson Media Library */}
          {activeTab === 'lesson-library' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-medium">
                👉 Chọn nhanh 1 ảnh hoặc video đã có trong kho học liệu của bài học này để thay thế cho hình vẽ SGK:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
                {lessonMediaList.map((item) => {
                  const isSelected = selectedLibraryItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedLibraryItem(item);
                        if (!title) setTitle(item.title);
                        if (!caption) setCaption(item.caption || '');
                      }}
                      className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-300 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-emerald-400 bg-slate-50'
                      }`}
                    >
                      <div className="aspect-video bg-slate-200 relative overflow-hidden">
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-white/90 text-indigo-700 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{item.type === 'video' ? 'Video' : 'Ảnh'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Common Metadata Fields */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tiêu đề / Tên hình ảnh/video (Tùy chọn):
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Cây Lưỡi Hổ thực tế trong phòng khách"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Chú thích hướng dẫn quan sát (Tùy chọn):
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="VD: Các em hãy quan sát hình dáng lá, viền vàng đặc trưng..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý lưu tệp...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Áp dụng vào bài học</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
