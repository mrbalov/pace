import { getStore } from '@netlify/blobs';

/**
 * Metadata stored with each image blob.
 */
export type ImageBlobMetadata = {
  /** ISO 8601 timestamp when blob was created */
  createdAt: string;
  /** Original filename */
  filename: string;
  /** MIME type */
  contentType: string;
};

/**
 * Gets the images blob store with strong consistency.
 */
export const getImagesStore = () => {
  return getStore({
    name: 'images',
    consistency: 'strong', // Ensure immediate availability
  });
};

/**
 * Stores an image in Netlify Blobs with metadata.
 *
 * @param key - Unique key for the image (UUID)
 * @param imageBuffer - Image data as ArrayBuffer
 * @param metadata - Image metadata
 * @returns Promise resolving when stored
 */
export const storeImage = async (
  key: string,
  imageBuffer: ArrayBuffer,
  metadata: ImageBlobMetadata
): Promise<void> => {
  const store = getImagesStore();
  
  // Store image data
  await store.set(key, imageBuffer);
  
  // Store metadata separately with "-meta" suffix
  await store.setJSON(`${key}-meta`, metadata);
};

/**
 * Retrieves an image from Netlify Blobs.
 *
 * @param key - Image key
 * @returns Image data and metadata, or null if not found
 */
export const getImage = async (
  key: string
): Promise<{ data: ArrayBuffer; metadata: ImageBlobMetadata } | null> => {
  const store = getImagesStore();
  
  const [data, metadata] = await Promise.all([
    store.get(key, { type: 'arrayBuffer' }),
    store.getJSON<ImageBlobMetadata>(`${key}-meta`),
  ]);
  
  if (!data || !metadata) {
    return null;
  }
  
  return { data, metadata };
};

/**
 * Checks if an image blob is expired (older than 24 hours).
 *
 * @param metadata - Image metadata
 * @returns True if expired
 */
export const isExpired = (metadata: ImageBlobMetadata): boolean => {
  const createdAt = new Date(metadata.createdAt);
  const now = new Date();
  const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  return ageInHours > 24;
};

/**
 * Deletes an image and its metadata from Netlify Blobs.
 *
 * @param key - Image key
 * @returns Promise resolving when deleted
 */
export const deleteImage = async (key: string): Promise<void> => {
  const store = getImagesStore();
  await Promise.all([
    store.delete(key),
    store.delete(`${key}-meta`),
  ]);
};

/**
 * Lists all image keys in the store.
 *
 * @returns Array of image keys (excluding metadata keys)
 */
export const listImageKeys = async (): Promise<string[]> => {
  const store = getImagesStore();
  const allKeys = [];
  
  for await (const { key } of store.list()) {
    // Only include image keys, not metadata keys
    if (!key.endsWith('-meta')) {
      allKeys.push(key);
    }
  }
  
  return allKeys;
};
