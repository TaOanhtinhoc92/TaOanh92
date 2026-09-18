import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExploreActivity, VisualMediaItem } from '../types';
import { Illustration } from './Illustrations';
import { VisualMediaSection } from './VisualMediaSection';
import { ChangeIllustrationModal } from './ChangeIllustrationModal';
import { getMediaForPeriod } from '../utils/mediaManager';
import {
  CustomIllustrationMedia,
  loadCustomIllustration,
  removeCustomIllustration,
} from '../utils/customIllustrationManager';
import { resolvePlayableMediaUrl } from '../utils/indexedDbStorage';
import { soundManager } from '../utils/soundEffects';
import {
  BookOpen,
  HelpCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Camera,
  Image as ImageIcon,
  Film,
  Columns,
  RotateCcw,
  Maximize2,
  X,
  Play,
  Eye,
  EyeOff,
  BookmarkCheck,
} from 'lucide-react';

interface ExploreViewProps {
  activities: ExploreActivity[];
  isTeacherMode: boolean;
  onComplete?: () => void;
  periodNumber: number;
}

type MediaDisplayMode = 'sgk' | 'real' | 'both';

export const ExploreView: React.FC<ExploreViewProps> = ({
  activities,
  isTeacherMode,
  onComplete,
  periodNumber,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  const [revealedTakeaways, setRevealedTakeaways] = useState<{ [key: string]: boolean }>({});
  const [mediaList, setMediaList] = useState<VisualMediaItem[]>([]);
  const [displayMode, setDisplayMode] = useState<MediaDisplayMode>('sgk');

  // Custom visual replacement for current activity illustration
  const [customVisual, setCustomVisual] = useState<CustomIllustrationMedia | null>(null);
  const [customVisualPlayableUrl, setCustomVisualPlayableUrl] = useState<string>('');
  const [showOriginalSgk, setShowOriginalSgk] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);

  const currentAct = activities[activeTab] || activities[0];

  // Load media whenever periodNumber changes
  const refreshMedia = () => {
    setMediaList(getMediaForPeriod(periodNumber));
  };

  useEffect(() => {
    refreshMedia();
  }, [periodNumber]);

  // Load custom visual for the current activity
  const refreshCustomVisual = async () => {
    if (!currentAct) return;
    const visual = loadCustomIllustration(periodNumber, currentAct.id);
    setCustomVisual(visual);
    setShowOriginalSgk(false);

    if (visual) {
      const resolved = await resolvePlayableMediaUrl(visual.url, visual.fileId);
      setCustomVisualPlayableUrl(resolved);
    } else {
      setCustomVisualPlayableUrl('');
    }
  };

  useEffect(() => {
    refreshCustomVisual();
  }, [periodNumber, currentAct?.id]);

  const handleRevertToOriginal = async () => {
    if (!currentAct) return;
    soundManager.playClick();
    await removeCustomIllustration(periodNumber, currentAct.id);
    setCustomVisual(null);
    setCustomVisualPlayableUrl('');
    setShowOriginalSgk(false);
  };

  const toggleRevealAnswer = (id: string) => {
    soundManager.playClick();
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRevealTakeaway = (id: string) => {
    if (!revealedTakeaways[id]) {
      soundManager.playSuccess();
    } else {
      soundManager.playClick();
    }
    setRevealedTakeaways((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="explore-container" className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <BookOpen className="w-7 h-7 text-emerald-100" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100 bg-white/10 px-2.5 py-1 rounded-full">
                Bước 2 • Khám Phá Kiến Thức
              </span>
              <h2 className="text-2xl font-bold font-display mt-1">Khám Phá Cùng Sách Giáo Khoa</h2>
            </div>
          </div>

          {/* Activity Switcher Tabs */}
          {activities.length > 1 && (
            <div className="flex items-center gap-2 bg-black/15 backdrop-blur-sm p-1.5 rounded-xl">
              {activities.map((act, idx) => (
                <button
                  key={act.id}
                  id={`explore-tab-${idx}`}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab(idx);
                  }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                    idx === activeTab
                      ? 'bg-white text-emerald-800 shadow-md scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Hoạt động {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 text-emerald-50 text-sm md:text-base leading-relaxed">
          📖 Quan sát tranh ảnh, kết hợp hình vẽ SGK và ảnh/video thực tế để giúp các em học sinh chiếm lĩnh kiến thức trọng tâm.
        </p>
      </div>

      {/* Main Exploration Card */}
      {currentAct && (
        <motion.div
          key={currentAct.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6"
        >
          {/* Activity Title & SGK Tag */}
          <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Khám phá {activeTab + 1} / {activities.length}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                {currentAct.title}
              </h3>
            </div>
            {currentAct.sgkReference && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                <BookOpen className="w-3.5 h-3.5" />
                {currentAct.sgkReference}
              </span>
            )}
          </div>

          {/* Visual Display Mode Selector: SGK Drawing vs Real Photo/Video */}
          <div className="flex items-center justify-between flex-wrap gap-2 p-2 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 px-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Chế độ quan sát trực quan:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                id="btn-mode-sgk"
                onClick={() => {
                  soundManager.playClick();
                  setDisplayMode('sgk');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  displayMode === 'sgk'
                    ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hình vẽ & Minh họa</span>
              </button>

              <button
                id="btn-mode-real"
                onClick={() => {
                  soundManager.playClick();
                  setDisplayMode('real');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  displayMode === 'real'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Ảnh & Video thật ({mediaList.length})</span>
              </button>

              <button
                id="btn-mode-both"
                onClick={() => {
                  soundManager.playClick();
                  setDisplayMode('both');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  displayMode === 'both'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Xem song song</span>
              </button>
            </div>
          </div>

          {/* Visual Presentation Area: SGK Drawing or Custom Image/Video */}
          {(displayMode === 'sgk' || displayMode === 'both') && (currentAct.illustrationKey || customVisual) && (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex flex-col items-center relative group shadow-2xs">
                {/* Top Action Bar for the Illustration Box */}
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-200/90 flex-wrap gap-2">
                  {/* Left Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {customVisual && !showOriginalSgk ? (
                      customVisual.type === 'video' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <Film className="w-3.5 h-3.5 text-rose-600" />
                          Video minh họa sinh động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          Hình ảnh trực quan thực tế
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                        Hình vẽ minh họa SGK
                      </span>
                    )}

                    {customVisual && (
                      <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                        {showOriginalSgk ? '(Đang xem hình vẽ SGK gốc)' : '(Đã chèn nội dung sinh động)'}
                      </span>
                    )}
                  </div>

                  {/* Right Control Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Toggle between Custom Visual and Original SGK Drawing */}
                    {customVisual && (
                      <button
                        type="button"
                        id="btn-toggle-original-sgk"
                        onClick={() => {
                          soundManager.playClick();
                          setShowOriginalSgk(!showOriginalSgk);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                      >
                        {showOriginalSgk ? 'Xem ảnh/video đã thay' : 'Xem lại hình SGK gốc'}
                      </button>
                    )}

                    {/* Revert button */}
                    {customVisual && (
                      <button
                        type="button"
                        id="btn-revert-original-sgk"
                        onClick={handleRevertToOriginal}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Xóa nội dung đã thay và khôi phục hình vẽ SGK gốc"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Khôi phục SGK</span>
                      </button>
                    )}

                    {/* Primary Button: Change Image / Insert Video */}
                    <button
                      type="button"
                      id="btn-change-illustration"
                      onClick={() => {
                        soundManager.playClick();
                        setIsChangeModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer hover:scale-105"
                      title="Thay đổi hình ảnh khác hoặc chèn video minh họa"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{customVisual ? 'Đổi ảnh / video khác' : 'Đổi ảnh khác hoặc chèn video sinh động'}</span>
                    </button>
                  </div>
                </div>

                {/* Main Media Content Display */}
                {customVisual && !showOriginalSgk ? (
                  <div className="w-full flex flex-col items-center space-y-3">
                    {customVisual.type === 'video' ? (
                      customVisual.isYouTube ? (
                        <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-black">
                          <iframe
                            src={customVisual.url}
                            title={customVisual.title || 'Video minh họa'}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-black flex items-center justify-center">
                          <video
                            src={customVisualPlayableUrl || customVisual.url}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )
                    ) : (
                      <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 flex items-center justify-center group/img">
                        <img
                          src={customVisualPlayableUrl || customVisual.url}
                          alt={customVisual.title || 'Ảnh minh họa'}
                          className="max-h-96 w-full object-contain cursor-zoom-in"
                          onClick={() => setSelectedFullImage(customVisualPlayableUrl || customVisual.url)}
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedFullImage(customVisualPlayableUrl || customVisual.url)}
                          className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-semibold"
                        >
                          <Maximize2 className="w-4 h-4" />
                          <span>Xem phóng to</span>
                        </button>
                      </div>
                    )}

                    <div className="text-center space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-slate-800">
                        {customVisual.title}
                      </h4>
                      {customVisual.caption && (
                        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto italic">
                          {customVisual.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    {currentAct.illustrationKey && (
                      <Illustration name={currentAct.illustrationKey} className="w-full max-w-md h-auto" />
                    )}
                    <span className="text-xs text-slate-500 font-medium mt-3 italic text-center">
                      Hình ảnh minh họa chuẩn theo bài học SGK Công nghệ 4
                    </span>
                  </div>
                )}
              </div>

              {/* Teaser CTA to switch to Real Visual Media */}
              {displayMode === 'sgk' && mediaList.length > 0 && !customVisual && (
                <div
                  onClick={() => {
                    soundManager.playClick();
                    setDisplayMode('real');
                  }}
                  className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl border border-emerald-200 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white group-hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-emerald-900">
                        Bài học có {mediaList.length} ảnh chụp và video thực tế giúp học sinh quan sát trực quan hơn
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Bấm vào đây để chuyển sang xem kho ảnh thật và video mẫu
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    Xem ảnh thật →
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Real Media Section: Shown when 'real' or 'both' is active */}
          {(displayMode === 'real' || displayMode === 'both') && (
            <div className="rounded-2xl border border-emerald-200/80 p-4 sm:p-5 bg-slate-50/70">
              <VisualMediaSection
                periodNumber={periodNumber}
                mediaList={mediaList}
                onRefreshMedia={refreshMedia}
                isTeacherMode={isTeacherMode}
              />
            </div>
          )}

          {/* Task / Nhiệm vụ học tập */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm md:text-base">
              <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Nhiệm vụ học tập của em:</span>
            </div>
            <p className="text-slate-700 text-base md:text-lg leading-relaxed pl-7">
              {currentAct.task}
            </p>
          </div>

          {/* Teacher Prompt Questions */}
          {currentAct.promptQuestions && currentAct.promptQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Câu hỏi gợi mở thảo luận:</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 pl-2">
                {currentAct.promptQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 text-slate-700 text-sm md:text-base transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revealable Suggested Answer (Hidden by default for classroom teaching) */}
          <div className="pt-2 space-y-2">
            <button
              id={`btn-reveal-answer-${currentAct.id}`}
              type="button"
              onClick={() => toggleRevealAnswer(currentAct.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm md:text-base transition-all cursor-pointer border ${
                revealedAnswers[currentAct.id]
                  ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border-emerald-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${revealedAnswers[currentAct.id] ? 'bg-emerald-200/70 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {revealedAnswers[currentAct.id] ? (
                    <Eye className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>
                      {revealedAnswers[currentAct.id]
                        ? 'Gợi ý câu trả lời & Phân tích SGK'
                        : 'Bấm để xem Gợi ý câu trả lời & Phân tích SGK'}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        revealedAnswers[currentAct.id]
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {revealedAnswers[currentAct.id] ? 'Đang hiển thị' : 'Mặc định ẩn khi dạy'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
                <span>{revealedAnswers[currentAct.id] ? 'Thu gọn' : 'Mở xem'}</span>
                {revealedAnswers[currentAct.id] ? (
                  <ChevronUp className="w-5 h-5 text-emerald-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </button>

            {revealedAnswers[currentAct.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -4 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-5 bg-slate-50/90 rounded-2xl border border-emerald-200 text-slate-700 text-sm md:text-base leading-relaxed space-y-2 shadow-xs"
              >
                <div className="font-bold text-emerald-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Nội dung trả lời chuẩn (SGK):</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRevealAnswer(currentAct.id)}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium underline cursor-pointer"
                  >
                    Thu gọn / Ẩn gợi ý
                  </button>
                </div>
                <p className="pl-5 leading-relaxed text-slate-800">{currentAct.answer}</p>
              </motion.div>
            )}
          </div>

          {/* Key Takeaway / Chốt kiến thức SGK (Hidden by default for classroom teaching) */}
          <div className="pt-2">
            {!revealedTakeaways[currentAct.id] ? (
              <button
                id={`btn-reveal-takeaway-${currentAct.id}`}
                type="button"
                onClick={() => toggleRevealTakeaway(currentAct.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 hover:from-amber-100 hover:via-orange-100 hover:to-amber-100 border-2 border-dashed border-amber-400 text-amber-950 font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-110 transition-transform shrink-0">
                    📌
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-amber-900">
                        Bấm để Chốt kiến thức bài học (SGK)
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-800">
                        Mặc định ẩn khi dạy trên lớp
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 font-normal mt-0.5">
                      Nhấn vào đây để hiện kết luận trọng tâm cho cả lớp sau khi học sinh đã thảo luận xong
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 group-hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-xs whitespace-nowrap shrink-0">
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Chốt kiến thức</span>
                </div>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-400 rounded-2xl p-5 md:p-6 shadow-md space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-amber-200/80">
                  <div className="flex items-center gap-2.5 font-bold text-amber-900 text-base md:text-lg">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
                      📌
                    </div>
                    <span>Chốt kiến thức bài học (SGK)</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Đã chốt kiến thức
                    </span>
                  </div>
                  <button
                    type="button"
                    id={`btn-hide-takeaway-${currentAct.id}`}
                    onClick={() => toggleRevealTakeaway(currentAct.id)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="Bấm để ẩn lại phần chốt kiến thức"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ẩn chốt kiến thức</span>
                  </button>
                </div>
                <p className="text-amber-950 font-bold text-base md:text-lg leading-relaxed pl-2 md:pl-4">
                  {currentAct.keyTakeaway}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {activeTab > 0 && (
                <button
                  id="btn-explore-prev-tab"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab((prev) => prev - 1);
                  }}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Hoạt động trước
                </button>
              )}
              {activeTab < activities.length - 1 && (
                <button
                  id="btn-explore-next-tab"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab((prev) => prev + 1);
                  }}
                  className="px-4 py-2 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Hoạt động tiếp theo
                </button>
              )}
            </div>

            <button
              id="btn-explore-to-practice"
              onClick={() => {
                soundManager.playSuccess();
                if (onComplete) onComplete();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] cursor-pointer ml-auto"
            >
              <span>Chuyển sang Luyện Tập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Persistent Bottom Gallery of Real Media for the Period */}
      {displayMode === 'sgk' && mediaList.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <VisualMediaSection
            periodNumber={periodNumber}
            mediaList={mediaList}
            onRefreshMedia={refreshMedia}
            isTeacherMode={isTeacherMode}
          />
        </div>
      )}

      {/* Change Illustration / Insert Video Modal */}
      {currentAct && (
        <ChangeIllustrationModal
          isOpen={isChangeModalOpen}
          onClose={() => setIsChangeModalOpen(false)}
          periodNumber={periodNumber}
          activityId={currentAct.id}
          activityTitle={currentAct.title}
          lessonMediaList={mediaList}
          onSaved={(newMedia) => {
            setCustomVisual(newMedia);
            setShowOriginalSgk(false);
            resolvePlayableMediaUrl(newMedia.url, newMedia.fileId).then((resolved) => {
              setCustomVisualPlayableUrl(resolved);
            });
          }}
        />
      )}

      {/* Lightbox Modal for Full Image Zoom */}
      {selectedFullImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedFullImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedFullImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedFullImage}
              alt="Phóng to"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
