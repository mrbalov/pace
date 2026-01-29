/**
 * Metadata stored with each image blob.
 * Matches ImageBlobMetadata from @pace/server/storage.
 */
export type ImageBlobMetadata = {
  /** ISO 8601 timestamp when blob was created. */
  createdAt: string;
  /** Original filename. */
  filename: string;
  /** MIME type. */
  contentType: string;
};

/**
 * Options for image generation across all providers.
 */
export type ImageGenerationOptions = {
  /** Image quality setting (standard or HD). */
  quality?: 'standard' | 'hd';
  /** Image dimensions. */
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  /** Image style (vivid or natural). */
  style?: 'vivid' | 'natural';
  /** Optional function to store image in Netlify Blobs. */
  storeImage?: (key: string, buffer: ArrayBuffer, metadata: ImageBlobMetadata) => Promise<void>;
};

/**
 * Common interface for all image generation providers.
 */
export type ImageProvider = {
  /**
   * Generates an image from a text prompt.
   * 
   * @param {string} prompt - Text prompt for image generation
   * @param {string} saveDirectory - Directory to save images (for filesystem fallback)
   * @param {string} baseUrl - Base URL for constructing full image URL
   * @param {ImageGenerationOptions} [options] - Optional configuration
   * @returns {Promise<string>} Promise resolving to full image URL
   * @throws {Error} Throws error if generation fails
   */
  generateImage: (
    prompt: string,
    saveDirectory: string,
    baseUrl: string,
    options?: ImageGenerationOptions
  ) => Promise<string>;
};

/**
 * Supported image generation providers.
 */
export type ProviderName = 'pollinations' | 'dial';
