// IndexedDB helper for storing video and media Blobs safely without localStorage size limits.

const DB_NAME = 'OneFeedMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'mediaStore';

export interface StoredMedia {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  sizeMb: number;
  duration?: string;
  createdAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported in this browser environment.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaToIDB(
  file: File | Blob,
  duration?: string
): Promise<{ id: string; url: string; sizeMb: number }> {
  try {
    const db = await openDB();
    const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));

    const record: StoredMedia = {
      id,
      blob: file,
      name: (file as File).name || 'uploaded_media',
      type: file.type || 'video/mp4',
      sizeMb,
      duration,
      createdAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => {
        const objectUrl = URL.createObjectURL(file);
        resolve({ id, url: objectUrl, sizeMb });
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IDB save failed, falling back to Blob URL:', err);
    const objectUrl = URL.createObjectURL(file);
    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
    return { id: `fallback-${Date.now()}`, url: objectUrl, sizeMb };
  }
}

export async function getMediaUrlFromIDB(id: string): Promise<string | null> {
  if (!id || id.startsWith('fallback-')) return null;
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as StoredMedia | undefined;
        if (result && result.blob) {
          const url = URL.createObjectURL(result.blob);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteMediaFromIDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch {
    // Ignore error
  }
}
