import { CONFIG } from '../constants';
import { DialImageResponse } from './types';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Metadata stored with each image blob.
 * Matches ImageBlobMetadata from @pace/server/storage.
 */
type ImageBlobMetadata = {
  /** ISO 8601 timestamp when blob was created */
  createdAt: string;
  /** Original filename */
  filename: string;
  /** MIME type */
  contentType: string;
};

/**
 * Extracts file extension from image type or URL.
 *
 * @internal
 * @param {string | undefined} imageType - MIME type of the image
 * @param {string} imageUrl - Image URL from DIAL
 * @returns {string} File extension (default: '.png')
 */
const getFileExtension = (imageType: string | undefined, imageUrl: string): string => {
  if (imageType) {
    if (imageType === 'image/png') {
      return '.png';
    } else if (imageType === 'image/jpeg' || imageType === 'image/jpg') {
      return '.jpg';
    } else if (imageType === 'image/webp') {
      return '.webp';
    }
  }
  
  const urlExtension = imageUrl.split('.').pop()?.toLowerCase();
  if (urlExtension && ['png', 'jpg', 'jpeg', 'webp'].includes(urlExtension)) {
    return `.${urlExtension}`;
  }
  
  return '.png';
};

/**
 * Downloads image from DIAL and stores in Netlify Blobs (or local filesystem).
 *
 * @internal
 * @param {string} dialImageUrl - Full URL to image in DIAL storage
 * @param {string} apiKey - DIAL API key
 * @param {string} saveDirectory - Directory to save (used for local dev)
 * @param {string | undefined} imageType - MIME type of the image
 * @param {string} baseUrl - Base URL for constructing full image URL
 * @param {Function} storeImageFn - Function to store image (for dependency injection)
 * @returns {Promise<string>} Promise resolving to full URL of saved image
 * @throws {Error} Throws error if download or save fails
 */
const downloadAndSaveImage = async (
  dialImageUrl: string,
  apiKey: string,
  saveDirectory: string,
  imageType: string | undefined,
  baseUrl: string,
  storeImageFn?: (key: string, buffer: ArrayBuffer, metadata: ImageBlobMetadata) => Promise<void>
): Promise<string> => {
  const downloadResponse = await fetch(dialImageUrl, {
    headers: {
      'Api-Key': apiKey,
    },
  });

  if (!downloadResponse.ok) {
    throw new Error(`Failed to download image: ${downloadResponse.statusText}`);
  }

  const imageBuffer = await downloadResponse.arrayBuffer();
  const extension = getFileExtension(imageType, dialImageUrl);
  const filename = `${crypto.randomUUID()}${extension}`;
  const key = filename.replace(/\..+$/, ''); // Remove extension for key
  
  // Use Netlify Blobs if store function provided, otherwise use filesystem
  if (storeImageFn) {
    const metadata: ImageBlobMetadata = {
      createdAt: new Date().toISOString(),
      filename,
      contentType: imageType || 'image/png',
    };
    await storeImageFn(key, imageBuffer, metadata);
  } else {
    // Fallback to filesystem for local development
    await mkdir(saveDirectory, { recursive: true });
    const filePath = join(saveDirectory, filename);
    await Bun.write(filePath, imageBuffer);
  }
  
  const relativePath = `/images/${key}`;
  const fullUrl = new URL(relativePath, baseUrl).toString();
  
  return fullUrl;
};

/**
 * Sends an image generation request to the DIAL AI service, downloads the image,
 * saves it to the server, and returns the full URL.
 *
 * Makes a POST request to the DIAL (AI Proxy) service with an image generation
 * prompt. The service returns a JSON response containing an image URL in DIAL
 * storage. The image is then downloaded using the API key and saved to the server's
 * file system or Netlify Blobs. Returns a full URL that can be used to access the image.
 *
 * @param {string} prompt - Image generation prompt text
 * @param {string} saveDirectory - Directory path where images should be saved (for filesystem fallback)
 * @param {string} baseUrl - Base URL for constructing full image URL (e.g., 'http://localhost:3000')
 * @param {object} [options] - Optional configuration
 * @param {'standard' | 'hd'} [options.quality] - Image quality (default: 'standard')
 * @param {'1024x1024' | '1792x1024' | '1024x1792'} [options.size] - Image size (default: '1024x1024')
 * @param {'vivid' | 'natural'} [options.style] - Image style (default: 'natural')
 * @param {Function} [options.storeImage] - Function to store image in Blobs (if provided, uses Blobs instead of filesystem)
 * @returns {Promise<string>} Promise resolving to full image URL (e.g., 'http://localhost:3000/images/abc123')
 * @throws {Error} Throws error if:
 *   - DIAL_KEY environment variable is not set
 *   - API returns an error response
 *   - Response does not contain image URL
 *   - Image download fails
 *   - Image save fails
 *
 * @remarks
 * The function makes a chat completion request to DIAL's DALL-E-3 deployment.
 * Configuration parameters (quality, size, style) are passed via custom_fields.configuration.
 * The image URL is extracted from the response attachments, downloaded using the API key,
 * and saved to the specified directory or Netlify Blobs. Returns a full URL that can be used
 * to access the image via the server's image serving route.
 *
 * @see {@link https://ai-proxy.lab.epam.com/ | DIAL AI Proxy Service}
 * @see {@link https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_dalle_3_with_configuration | DALL-E-3 Configuration}
 *
 * @example
 * ```typescript
 * const imageUrl = await askDialForImage('A cartoon runner in a park', '/path/to/images', 'http://localhost:3000');
 * // Returns: 'http://localhost:3000/images/abc123-def456-...'
 * ```
 */
const askDialForImage = async (
  prompt: string,
  saveDirectory: string,
  baseUrl: string,
  options?: {
    quality?: 'standard' | 'hd';
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    style?: 'vivid' | 'natural';
    storeImage?: (key: string, buffer: ArrayBuffer, metadata: ImageBlobMetadata) => Promise<void>;
  }
): Promise<string> => {
  if (!process.env.DIAL_KEY) {
    throw new Error('DIAL_KEY is not set');
  }

  const quality = options?.quality ?? CONFIG.DEFAULT_QUALITY;
  const size = options?.size ?? CONFIG.DEFAULT_SIZE;
  const style = options?.style ?? CONFIG.DEFAULT_STYLE;

  const body = JSON.stringify({
    messages: [
      { role: 'user', content: prompt },
    ],
    extra_body: {
      custom_fields: {
        configuration: {
          quality,
          size,
          style,
        },
      },
    },
  });

  const apiKey = String(process.env.DIAL_KEY);
  const url = `${CONFIG.BASE_URL}/openai/deployments/${CONFIG.MODEL}/chat/completions?api-version=${CONFIG.API_VERSION}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'Content-Length': Buffer.byteLength(body).toString(),
    },
    body,
  });

  const json = await response.json() as DialImageResponse;

  if (json.error) {
    throw new Error(json.error.message || 'Unknown DIAL error.');
  }

  const attachments = json.choices?.[0]?.message?.custom_content?.attachments;
  const imageAttachment = attachments?.find((att) => att.type?.startsWith('image/'));

  if (!imageAttachment) {
    throw new Error('No image attachment in DIAL response.');
  }

  const imageUrl = imageAttachment.url;
  if (!imageUrl) {
    throw new Error('No image URL in DIAL response attachment.');
  }

  const fullDialUrl = (() => {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    } else {
      return `${CONFIG.BASE_URL}/v1/${imageUrl}`;
    }
  })();

  const fullImageUrl = await downloadAndSaveImage(
    fullDialUrl,
    apiKey,
    saveDirectory,
    imageAttachment.type,
    baseUrl,
    options?.storeImage // Pass store function if provided
  );

  return fullImageUrl;
};

export default askDialForImage;
