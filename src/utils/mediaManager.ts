import { VisualMediaItem } from '../types';
import { defaultMediaList } from '../data/defaultMedia';
import { saveMediaBlob, deleteMediaBlob } from './indexedDbStorage';

const STORAGE_KEY_CUSTOM_MEDIA = 'congnghe4_custom_media';
const STORAGE_KEY_DELETED_MEDIA = 'congnghe4_deleted_media_ids';

/**
 * Loads list of media item IDs that the teacher chose to delete/hide
 */
export function loadDeletedMediaIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_MEDIA);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load deleted media IDs from localStorage', err);
    return [];
  }
}

/**
 * Saves list of deleted media item IDs to localStorage
 */
export function saveDeletedMediaIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DELETED_MEDIA, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save deleted media IDs to localStorage', err);
  }
}

/**
 * Extracts YouTube video ID and returns standard embed URL
 */
export function getEmbedVideoUrl(rawUrl: string): { isYouTube: boolean; embedUrl: string } {
  if (!rawUrl) return { isYouTube: false, embedUrl: '' };

  const trimmed = rawUrl.trim();

  // YouTube formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    return {
      isYouTube: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  return { isYouTube: false, embedUrl: trimmed };
}

/**
 * Loads custom media items stored in browser localStorage
 */
export function loadCustomMedia(): VisualMediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_MEDIA);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load custom media from localStorage', err);
    return [];
  }
}

/**
 * Saves custom media items list to localStorage
 */
export function saveCustomMedia(items: VisualMediaItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_MEDIA, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save custom media to localStorage', err);
  }
}

/**
 * Retrieves all active media items (custom + curated defaults) for a specific period,
 * filtering out any items that the teacher marked as deleted/unsuitable.
 */
export function getMediaForPeriod(periodNumber: number): VisualMediaItem[] {
  const deletedIds = new Set(loadDeletedMediaIds());
  const customItems = loadCustomMedia()
    .filter((item) => item.periodNumber === periodNumber && !deletedIds.has(item.id));
  const curated = defaultMediaList
    .filter((item) => item.periodNumber === periodNumber && !deletedIds.has(item.id));

  // Return custom first (so teacher's uploaded photos/videos appear first), then curated defaults
  return [...customItems, ...curated];
}

/**
 * Returns total count of media items for a specific period
 */
export function getMediaCountForPeriod(periodNumber: number): number {
  return getMediaForPeriod(periodNumber).length;
}

/**
 * Adds a new custom media item created by the teacher
 */
export function addCustomMedia(item: Omit<VisualMediaItem, 'id' | 'isCustom' | 'addedAt'>): VisualMediaItem {
  const customList = loadCustomMedia();
  const newItem: VisualMediaItem = {
    ...item,
    id: `custom-media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    isCustom: true,
    addedAt: Date.now(),
    author: item.author || 'Giáo viên lớp học',
  };

  const updated = [newItem, ...customList];
  saveCustomMedia(updated);
  return newItem;
}

/**
 * Adds a video file uploaded directly from the teacher's computer/device,
 * saving the video blob to IndexedDB and storing item metadata in the custom media list.
 */
export async function addCustomVideoFromFile(params: {
  file: File;
  periodNumber: number;
  title: string;
  caption?: string;
  author?: string;
  thumbnailUrl?: string;
  duration?: number;
}): Promise<VisualMediaItem> {
  const fileId = `video-blob-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  
  await saveMediaBlob(fileId, params.file, {
    name: params.file.name,
    mimeType: params.file.type,
    size: params.file.size,
  });

  return addCustomMedia({
    periodNumber: params.periodNumber,
    type: 'video',
    url: `idb://${fileId}`,
    fileId: fileId,
    title: params.title,
    caption: params.caption,
    author: params.author || 'Video quay thực tế từ máy',
    thumbnailUrl: params.thumbnailUrl,
    fileSize: params.file.size,
    duration: params.duration,
  });
}

/**
 * Deletes any media item by ID (both teacher-added media and default media).
 * If the item had an uploaded binary blob in IndexedDB, cleans it up.
 * If the item was in the custom list, removes it.
 * Also records the ID in deletedMediaIds so default items are hidden from the lesson.
 */
export function deleteMediaItem(id: string): void {
  // 1. Check custom items and clean up IndexedDB
  const customList = loadCustomMedia();
  const target = customList.find((item) => item.id === id);
  if (target) {
    if (target.fileId) {
      deleteMediaBlob(target.fileId).catch(() => {});
    } else if (target.url?.startsWith('idb://')) {
      deleteMediaBlob(target.url.replace('idb://', '')).catch(() => {});
    }
    const updated = customList.filter((item) => item.id !== id);
    saveCustomMedia(updated);
  }

  // 2. Track in deletedMediaIds
  const deletedIds = loadDeletedMediaIds();
  if (!deletedIds.includes(id)) {
    saveDeletedMediaIds([...deletedIds, id]);
  }
}

/**
 * Backward compatibility alias
 */
export const deleteCustomMedia = deleteMediaItem;

/**
 * Restores all original curated media items for a specific period if they were deleted
 */
export function restoreDefaultMediaForPeriod(periodNumber: number): void {
  const periodDefaultIds = new Set(
    defaultMediaList.filter((m) => m.periodNumber === periodNumber).map((m) => m.id)
  );
  const currentDeleted = loadDeletedMediaIds();
  const updatedDeleted = currentDeleted.filter((id) => !periodDefaultIds.has(id));
  saveDeletedMediaIds(updatedDeleted);
}

/**
 * Checks if any default media was deleted in a specific period
 */
export function hasDeletedDefaultMedia(periodNumber: number): boolean {
  const deletedIds = new Set(loadDeletedMediaIds());
  return defaultMediaList.some(
    (item) => item.periodNumber === periodNumber && deletedIds.has(item.id)
  );
}

/**
 * Resizes and compresses image files from computer before storing in localStorage
 * Keeps max resolution at 1280px and JPEG quality at 0.82 to prevent storage overflow.
 */
export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 960;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
