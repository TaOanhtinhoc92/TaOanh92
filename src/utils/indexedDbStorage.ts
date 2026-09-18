/**
 * IndexedDB storage utility for storing large media files (videos & high-res photos)
 * directly on the teacher's computer/device without hitting localStorage 5MB quota.
 */

const DB_NAME = 'CongNghe4_LocalMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

// In-memory cache for generated object URLs to avoid recreating them on every render
const objectUrlCache = new Map<string, string>();

/**
 * Opens or initializes the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('Trình duyệt không hỗ trợ lưu trữ tệp lớn (IndexedDB).'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Không thể mở cơ sở dữ liệu tệp cục bộ.'));
    };
  });
}

export interface StoredMediaRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  name: string;
  size: number;
  createdAt: number;
}

/**
 * Saves a video or media Blob to IndexedDB
 */
export async function saveMediaBlob(
  id: string,
  blob: Blob,
  metadata?: { name?: string; mimeType?: string; size?: number }
): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: StoredMediaRecord = {
      id,
      blob,
      mimeType: metadata?.mimeType || blob.type || 'video/mp4',
      name: metadata?.name || 'media_file',
      size: metadata?.size || blob.size || 0,
      createdAt: Date.now(),
    };

    const putRequest = store.put(record);

    putRequest.onsuccess = () => {
      // Pre-cache object URL for immediate access
      if (objectUrlCache.has(id)) {
        try {
          URL.revokeObjectURL(objectUrlCache.get(id)!);
        } catch (_) {}
      }
      const newUrl = URL.createObjectURL(blob);
      objectUrlCache.set(id, newUrl);
      resolve();
    };

    putRequest.onerror = () => {
      reject(putRequest.error || new Error('Không thể lưu tệp video vào bộ nhớ máy.'));
    };
  });
}

/**
 * Retrieves a media Blob from IndexedDB by its unique ID
 */
export async function getMediaBlob(id: string): Promise<Blob | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const record = getRequest.result as StoredMediaRecord | undefined;
      resolve(record ? record.blob : null);
    };

    getRequest.onerror = () => {
      reject(getRequest.error || new Error('Không thể đọc tệp từ bộ nhớ.'));
    };
  });
}

/**
 * Resolves a playable URL for a media item.
 * If the item is backed by IndexedDB (url starts with `idb://` or has fileId),
 * returns an active Object URL (`blob:http...`).
 */
export async function resolvePlayableMediaUrl(url: string, fileId?: string): Promise<string> {
  const targetId = fileId || (url.startsWith('idb://') ? url.replace('idb://', '') : null);

  if (!targetId) {
    return url;
  }

  // Check cache first
  if (objectUrlCache.has(targetId)) {
    return objectUrlCache.get(targetId)!;
  }

  try {
    const blob = await getMediaBlob(targetId);
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      objectUrlCache.set(targetId, objectUrl);
      return objectUrl;
    }
  } catch (err) {
    console.error('Failed to resolve media blob URL for:', targetId, err);
  }

  return url;
}

/**
 * Deletes a media blob from IndexedDB and cleans up cache
 */
export async function deleteMediaBlob(id: string): Promise<void> {
  if (objectUrlCache.has(id)) {
    try {
      URL.revokeObjectURL(objectUrlCache.get(id)!);
    } catch (_) {}
    objectUrlCache.delete(id);
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delRequest = store.delete(id);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => reject(delRequest.error);
    });
  } catch (err) {
    console.warn('Could not delete media blob from IndexedDB:', err);
  }
}

/**
 * Automatically captures a preview snapshot thumbnail from an uploaded video file
 */
export function generateVideoThumbnail(
  file: File | Blob
): Promise<{ thumbnailUrl: string; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const tempUrl = URL.createObjectURL(file);
    video.src = tempUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    let hasResolved = false;

    const cleanup = () => {
      URL.revokeObjectURL(tempUrl);
      video.remove();
    };

    const finish = (thumbnailUrl: string, duration: number) => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        resolve({ thumbnailUrl, duration });
      }
    };

    // Timeout safety in case format cannot be decoded by canvas
    const timer = setTimeout(() => {
      finish('', video.duration || 0);
    }, 4000);

    video.onloadedmetadata = () => {
      // Seek to 1s or 15% of the video to catch an active teaching scene
      const seekTime = Math.min(1.0, video.duration > 1 ? video.duration * 0.15 : 0.2);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 640;
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;
        const ratio = width / height;

        canvas.width = Math.min(width, MAX_WIDTH);
        canvas.height = Math.round(canvas.width / (ratio || 16 / 9));

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          finish(dataUrl, video.duration || 0);
          return;
        }
      } catch (err) {
        console.warn('Failed to capture video thumbnail frame:', err);
      }
      finish('', video.duration || 0);
    };

    video.onerror = () => {
      clearTimeout(timer);
      finish('', 0);
    };
  });
}

/**
 * Formats file size nicely (e.g. 15.4 MB, 820 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Formats seconds into mm:ss (e.g. 01:24)
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
