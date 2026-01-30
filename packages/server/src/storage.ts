/**
 * Storage module for managing image data.
 * This module provides functions to interact with image storage.
 */

/**
 * Lists all image keys in storage.
 * @returns {Promise<string[]>} Array of image keys
 */
export function listImageKeys(): Promise<string[]> {
  // Implementation would go here
  return Promise.reject(new Error('Not implemented'));
}

/**
 * Gets an image from storage by key.
 * @param {string} _key - The image key (unused)
 * @returns {Promise<{ data: unknown; metadata: unknown } | null>} Image data with metadata or null if not found
 */
export function getImage(_key: string): Promise<{ data: unknown; metadata: unknown } | null> {
  // Implementation would go here - key parameter will be used when implemented
  return Promise.reject(new Error(`Not implemented: getImage for key ${_key}`));
}

/**
 * Checks if an image is expired based on its metadata.
 * @param {unknown} _metadata - The image metadata
 * @returns {boolean} True if expired, false otherwise
 */
export function isExpired(_metadata: unknown): boolean {
  // Implementation would go here - metadata parameter will be used when implemented
  void _metadata; // Explicitly mark as intentionally unused for now
  throw new Error('Not implemented: isExpired');
}

/**
 * Deletes an image from storage.
 * @param {string} _key - The image key to delete (unused)
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export function deleteImage(_key: string): Promise<void> {
  // Implementation would go here - key parameter will be used when implemented
  return Promise.reject(new Error(`Not implemented: deleteImage for key ${_key}`));
}