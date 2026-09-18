import { getEmbedVideoUrl, compressImageFile } from './mediaManager';
import {
  saveMediaBlob,
  deleteMediaBlob,
  resolvePlayableMediaUrl,
  generateVideoThumbnail,
} from './indexedDbStorage';

export interface CustomIllustrationMedia {
  activityId: string;
  periodNumber: number;
  type: 'image' | 'video';
  url: string; // Data URL, remote URL, YouTube embed URL, or idb:// URL
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  isYouTube?: boolean;
  fileId?: string; // If stored in IndexedDB
  updatedAt: number;
}

const STORAGE_KEY_CUSTOM_ILLUSTRATIONS = 'congnghe4_custom_activity_illustrations';

/**
 * Loads all custom illustrations map from localStorage
 */
function getAllCustomIllustrations(): { [key: string]: CustomIllustrationMedia } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_ILLUSTRATIONS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load custom illustrations from localStorage', err);
    return {};
  }
}

/**
 * Saves all custom illustrations map to localStorage
 */
function saveAllCustomIllustrations(map: { [key: string]: CustomIllustrationMedia }): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_ILLUSTRATIONS, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save custom illustrations to localStorage', err);
  }
}

/**
 * Generates a storage key for a specific activity in a period
 */
function getStorageKey(periodNumber: number, activityId: string): string {
  return `${periodNumber}_${activityId}`;
}

/**
 * Loads the custom illustration for a specific activity, if any
 */
export function loadCustomIllustration(
  periodNumber: number,
  activityId: string
): CustomIllustrationMedia | null {
  const map = getAllCustomIllustrations();
  const key = getStorageKey(periodNumber, activityId);
  return map[key] || null;
}

/**
 * Sets/saves a custom illustration for a specific activity
 */
export function saveCustomIllustration(
  periodNumber: number,
  activityId: string,
  data: Omit<CustomIllustrationMedia, 'updatedAt' | 'periodNumber' | 'activityId'>
): CustomIllustrationMedia {
  const map = getAllCustomIllustrations();
  const key = getStorageKey(periodNumber, activityId);

  // If there was an old file in IndexedDB, delete it if different
  const oldItem = map[key];
  if (oldItem?.fileId && oldItem.fileId !== data.fileId) {
    deleteMediaBlob(oldItem.fileId).catch(() => {});
  }

  const newItem: CustomIllustrationMedia = {
    ...data,
    periodNumber,
    activityId,
    updatedAt: Date.now(),
  };

  map[key] = newItem;
  saveAllCustomIllustrations(map);
  return newItem;
}

/**
 * Removes custom illustration for an activity and reverts to default SGK drawing
 */
export async function removeCustomIllustration(
  periodNumber: number,
  activityId: string
): Promise<void> {
  const map = getAllCustomIllustrations();
  const key = getStorageKey(periodNumber, activityId);
  const existing = map[key];

  if (existing?.fileId) {
    try {
      await deleteMediaBlob(existing.fileId);
    } catch (_) {}
  }

  delete map[key];
  saveAllCustomIllustrations(map);
}

/**
 * Saves a video file uploaded from the teacher's computer as custom illustration
 */
export async function saveCustomIllustrationVideoFile(
  periodNumber: number,
  activityId: string,
  file: File,
  title?: string,
  caption?: string
): Promise<CustomIllustrationMedia> {
  const fileId = `act_illust_vid_${periodNumber}_${activityId}_${Date.now()}`;

  // Store video blob into IndexedDB
  await saveMediaBlob(fileId, file, {
    name: file.name,
    mimeType: file.type || 'video/mp4',
    size: file.size,
  });

  // Generate thumbnail
  let thumbnailUrl: string | undefined;
  try {
    const thumbResult = await generateVideoThumbnail(file);
    thumbnailUrl = thumbResult.thumbnailUrl || undefined;
  } catch (err) {
    console.warn('Could not generate video thumbnail', err);
  }

  return saveCustomIllustration(periodNumber, activityId, {
    type: 'video',
    url: `idb://${fileId}`,
    fileId,
    thumbnailUrl,
    title: title?.trim() || file.name.replace(/\.[^/.]+$/, ''),
    caption: caption?.trim() || 'Video minh họa tải lên từ máy tính',
    isYouTube: false,
  });
}

/**
 * Saves an image file uploaded from the teacher's computer as custom illustration
 */
export async function saveCustomIllustrationImageFile(
  periodNumber: number,
  activityId: string,
  file: File,
  title?: string,
  caption?: string
): Promise<CustomIllustrationMedia> {
  // Compress image
  const dataUrl = await compressImageFile(file);

  return saveCustomIllustration(periodNumber, activityId, {
    type: 'image',
    url: dataUrl,
    thumbnailUrl: dataUrl,
    title: title?.trim() || file.name.replace(/\.[^/.]+$/, ''),
    caption: caption?.trim() || 'Hình ảnh tải lên từ máy tính',
    isYouTube: false,
  });
}

/**
 * Saves a YouTube video as custom illustration
 */
export function saveCustomIllustrationYouTube(
  periodNumber: number,
  activityId: string,
  youtubeUrl: string,
  title?: string,
  caption?: string
): CustomIllustrationMedia {
  const { embedUrl } = getEmbedVideoUrl(youtubeUrl);

  return saveCustomIllustration(periodNumber, activityId, {
    type: 'video',
    url: embedUrl,
    title: title?.trim() || 'Video minh họa YouTube',
    caption: caption?.trim() || 'Video trực quan hỗ trợ bài học',
    isYouTube: true,
  });
}

/**
 * Saves an image URL as custom illustration
 */
export function saveCustomIllustrationImageUrl(
  periodNumber: number,
  activityId: string,
  imageUrl: string,
  title?: string,
  caption?: string
): CustomIllustrationMedia {
  return saveCustomIllustration(periodNumber, activityId, {
    type: 'image',
    url: imageUrl.trim(),
    thumbnailUrl: imageUrl.trim(),
    title: title?.trim() || 'Hình ảnh minh họa trực quan',
    caption: caption?.trim() || 'Hình ảnh trực quan sinh động',
    isYouTube: false,
  });
}
