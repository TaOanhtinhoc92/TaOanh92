import React, { useState, useRef } from 'react';
import { VisualMediaItem, MediaType } from '../types';
import {
  addCustomMedia,
  addCustomVideoFromFile,
  compressImageFile,
  getEmbedVideoUrl,
} from '../utils/mediaManager';
import {
  generateVideoThumbnail,
  formatFileSize,
  formatDuration,
} from '../utils/indexedDbStorage';
import { soundManager } from '../utils/soundEffects';
import {
  X,
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
  Play,
  Film,
  HardDrive,
  Clock,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodNumber: number;
  onMediaAdded: (newItem: VisualMediaItem) => void;
}

type TabType = 'upload-video' | 'upload-image' | 'video-url' | 'image-url';

export const AddMediaModal: React.FC<AddMediaModalProps> = ({
  isOpen,
  onClose,
  periodNumber,
  onMediaAdded,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload-video');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [author, setAuthor] = useState('Giáo viên lớp học');
  const [urlInput, setUrlInput] = useState('');

  // Image upload states
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | null>(null);

  // Video upload states
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setCaption('');
    setUrlInput('');
    setUploadedDataUrl(null);
    if (videoPreviewUrl) {
      try {
        URL.revokeObjectURL(videoPreviewUrl);
      } catch (_) {}
    }
    setUploadedVideoFile(null);
    setVideoPreviewUrl(null);
    setVideoThumbnailUrl(null);
    setVideoDuration(0);
    setErrorMsg(null);
  };

  const handleClose = () => {
    soundManager.playClick();
    resetForm();
    onClose();
  };

  // Handler for Image File Selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsProcessingFile(true);
      setErrorMsg(null);
      const compressed = await compressImageFile(file);
      setUploadedDataUrl(compressed);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err) {
      setErrorMsg('Không thể xử lý ảnh này, vui lòng thử ảnh khác.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Handler for Video File Selection from Computer/Phone
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Supported video types
    const validExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.m4v', '.mkv'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!file.type.startsWith('video/') && !hasValidExt) {
      setErrorMsg('Vui lòng chọn tệp video hợp lệ (.MP4, .WEBM, .MOV, .M4V).');
      return;
    }

    // Check size limit: 300MB
    if (file.size > 300 * 1024 * 1024) {
      setErrorMsg('Tệp video vượt quá 300MB. Thầy/Cô vui lòng chọn video ngắn hơn hoặc nén video để trình chiếu mượt.');
      return;
    }

    try {
      setIsProcessingFile(true);
      setErrorMsg(null);
      setUploadedVideoFile(file);

      // Create preview URL
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      const preview = URL.createObjectURL(file);
      setVideoPreviewUrl(preview);

      // Automatically generate video thumbnail and duration
      const meta = await generateVideoThumbnail(file);
      if (meta.thumbnailUrl) {
        setVideoThumbnailUrl(meta.thumbnailUrl);
      }
      if (meta.duration) {
        setVideoDuration(meta.duration);
      }

      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(`Video: ${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)}`);
      }
    } catch (err) {
      console.error('Error reading video file:', err);
      setErrorMsg('Không thể xử lý tệp video này. Thầy/Cô hãy thử định dạng MP4 hoặc WebM.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSave = async () => {
    setErrorMsg(null);

    // Case 1: Upload Video from Computer
    if (activeTab === 'upload-video') {
      if (!uploadedVideoFile) {
        setErrorMsg('Vui lòng chọn tệp video từ máy tính hoặc điện thoại.');
        return;
      }
      if (!title.trim()) {
        setErrorMsg('Vui lòng nhập tên / tiêu đề cho video.');
        return;
      }

      try {
        setIsSaving(true);
        const newItem = await addCustomVideoFromFile({
          file: uploadedVideoFile,
          periodNumber,
          title: title.trim(),
          caption: caption.trim() || undefined,
          author: author.trim() || 'Video thực tế giáo viên',
          thumbnailUrl: videoThumbnailUrl || undefined,
          duration: videoDuration,
        });

        soundManager.playCorrect();
        onMediaAdded(newItem);
        handleClose();
      } catch (err) {
        console.error('Failed to save video:', err);
        setErrorMsg('Không thể lưu video vào bộ nhớ máy. Vui lòng kiểm tra dung lượng còn lại trên máy.');
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // Case 2: Upload Image from Computer
    if (activeTab === 'upload-image') {
      if (!uploadedDataUrl) {
        setErrorMsg('Vui lòng tải ảnh lên từ máy tính hoặc điện thoại.');
        return;
      }
      if (!title.trim()) {
        setErrorMsg('Vui lòng nhập tên / tiêu đề cho ảnh.');
        return;
      }

      const newItem = addCustomMedia({
        periodNumber,
        type: 'image',
        url: uploadedDataUrl,
        title: title.trim(),
        caption: caption.trim() || undefined,
        author: author.trim() || 'Ảnh chụp từ máy giáo viên',
      });

      soundManager.playCorrect();
      onMediaAdded(newItem);
      handleClose();
      return;
    }

    // Case 3: Video URL (YouTube or Direct Video URL)
    if (activeTab === 'video-url') {
      if (!urlInput.trim()) {
        setErrorMsg('Vui lòng nhập đường link Video YouTube hoặc liên kết video.');
        return;
      }
      if (!title.trim()) {
        setErrorMsg('Vui lòng nhập tên / tiêu đề cho video.');
        return;
      }

      const newItem = addCustomMedia({
        periodNumber,
        type: 'video',
        url: urlInput.trim(),
        title: title.trim(),
        caption: caption.trim() || undefined,
        author: author.trim() || 'Video từ Internet',
      });

      soundManager.playCorrect();
      onMediaAdded(newItem);
      handleClose();
      return;
    }

    // Case 4: Image URL
    if (activeTab === 'image-url') {
      if (!urlInput.trim()) {
        setErrorMsg('Vui lòng nhập đường link hình ảnh (URL).');
        return;
      }
      if (!title.trim()) {
        setErrorMsg('Vui lòng nhập tên / tiêu đề cho hình ảnh.');
        return;
      }

      const newItem = addCustomMedia({
        periodNumber,
        type: 'image',
        url: urlInput.trim(),
        title: title.trim(),
        caption: caption.trim() || undefined,
        author: author.trim() || 'Ảnh từ Internet',
      });

      soundManager.playCorrect();
      onMediaAdded(newItem);
      handleClose();
    }
  };

  const videoEmbed = activeTab === 'video-url' && urlInput ? getEmbedVideoUrl(urlInput) : null;

  return (
    <div
      id="modal-add-media"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Chèn Tư Liệu Ảnh & Video Thực Tế</h2>
              <p className="text-xs text-emerald-100">
                Bổ sung tư liệu sinh động cho Tiết {periodNumber} (lưu trữ trực tiếp trên máy)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đóng (Hủy)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs (4 Sources) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50 p-2 gap-1.5 text-xs font-bold">
          {/* Tab 1: Video File from Device (NEW) */}
          <button
            id="tab-upload-video"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('upload-video');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'upload-video'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Tải video từ máy</span>
          </button>

          {/* Tab 2: Image File from Device */}
          <button
            id="tab-upload-image"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('upload-image');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'upload-image'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Tải ảnh từ máy</span>
          </button>

          {/* Tab 3: YouTube / Video URL */}
          <button
            id="tab-video-url"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('video-url');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'video-url'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>YouTube / Link</span>
          </button>

          {/* Tab 4: Image URL */}
          <button
            id="tab-image-url"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('image-url');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'image-url'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Dán link ảnh</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: Upload Video from Computer / Mobile */}
          {activeTab === 'upload-video' && (
            <div className="space-y-3">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="file-video-upload-input"
              />

              {!uploadedVideoFile ? (
                <div
                  id="dropzone-upload-video"
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50/80 rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Film className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Bấm vào đây để chọn video từ máy tính hoặc điện thoại
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Hỗ trợ định dạng <span className="font-semibold text-rose-700">MP4, WebM, MOV, M4V</span> (quay bằng điện thoại, tải từ Zalo/máy tính)
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-[11px] font-semibold">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Lưu trữ cục bộ an toàn, phát mượt trên máy chiếu không cần mạng</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Video Player Preview */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video flex items-center justify-center shadow-md">
                    {videoPreviewUrl && (
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full h-full object-contain"
                      >
                        Trình duyệt không hỗ trợ xem trước video.
                      </video>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                        setUploadedVideoFile(null);
                        setVideoPreviewUrl(null);
                        setVideoThumbnailUrl(null);
                        setVideoDuration(0);
                        if (videoInputRef.current) videoInputRef.current.value = '';
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer z-10"
                      title="Chọn video khác"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video Metadata Tag */}
                  <div className="flex items-center justify-between flex-wrap gap-2 p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 font-bold text-rose-900">
                        <FileCheck className="w-4 h-4 text-rose-600" />
                        <span className="truncate max-w-[200px]">{uploadedVideoFile.name}</span>
                      </div>
                      <span className="text-slate-500">•</span>
                      <span className="font-semibold text-slate-700">
                        {formatFileSize(uploadedVideoFile.size)}
                      </span>
                      {videoDuration > 0 && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {formatDuration(videoDuration)}
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Đổi tệp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Upload Image from Computer / Mobile */}
          {activeTab === 'upload-image' && (
            <div className="space-y-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-image-upload-input"
              />

              {!uploadedDataUrl ? (
                <div
                  id="dropzone-upload-image"
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Bấm vào đây để tải ảnh thật từ máy tính hoặc điện thoại
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Hỗ trợ chụp ảnh học sinh thực hành, chậu hoa lớp trồng, mô hình lắp ráp (JPG, PNG, WEBP)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-56">
                  <img
                    src={uploadedDataUrl}
                    alt="Xem trước ảnh"
                    className="max-h-56 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedDataUrl(null);
                      if (imageInputRef.current) imageInputRef.current.value = '';
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
                    title="Chọn ảnh khác"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Video URL / YouTube */}
          {activeTab === 'video-url' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Đường dẫn Video YouTube hoặc link video:
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-[11px] text-slate-500 italic">
                Hệ thống tự động nhúng khung phát video YouTube chuẩn 16:9 sắc nét ngay trong bài giảng.
              </p>

              {videoEmbed && videoEmbed.isYouTube && (
                <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black shadow-sm">
                  <iframe
                    src={videoEmbed.embedUrl}
                    title="Xem trước video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Image URL */}
          {activeTab === 'image-url' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Đường dẫn liên kết hình ảnh (URL trên web):
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/anh-hoa-hong.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {urlInput && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                  <img
                    src={urlInput}
                    alt="Xem trước"
                    className="max-h-48 w-auto object-contain"
                    onError={() => setErrorMsg('Đường link ảnh không truy cập được hoặc bị chặn CORS.')}
                  />
                </div>
              )}
            </div>
          )}

          {/* Common Fields: Title, Caption, Author */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Tên / Tiêu đề tư liệu: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  activeTab === 'upload-video' || activeTab === 'video-url'
                    ? 'Ví dụ: Video hướng dẫn siết ốc tua vít, Video học sinh tưới hoa...'
                    : 'Ví dụ: Chậu hoa cúc lớp 4A trồng, Chi tiết thanh chữ U thật...'
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Caption / Teacher guide */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Gợi ý quan sát cho học sinh (chú thích bài học):
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ví dụ: Các em chú ý quan sát cách cầm tua vít vuông góc, kiểm tra ren ốc..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
              />
            </div>

            {/* Author */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Nguồn / Người đăng:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ví dụ: Cô Oanh, Nhóm 2 lớp 4A, Tư liệu thực tế..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            {activeTab === 'upload-video' && '🎬 Video được lưu an toàn trong trình duyệt của máy'}
            {activeTab === 'upload-image' && '📷 Ảnh được tối ưu hóa mượt mà cho máy chiếu'}
            {activeTab === 'video-url' && '🔴 Nhúng video YouTube trực tiếp'}
            {activeTab === 'image-url' && '🔗 Tải ảnh từ đường dẫn mạng'}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              id="btn-save-new-media"
              type="button"
              onClick={handleSave}
              disabled={isProcessingFile || isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu video...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Lưu vào bài học</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
