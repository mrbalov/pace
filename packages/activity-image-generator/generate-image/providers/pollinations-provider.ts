import { ImageProvider, ImageGenerationOptions, ImageBlobMetadata } from './types';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Pollinations.ai image generation provider.
 * 
 * Completely free, no authentication required.
 * Uses FLUX and other open-source models.
 * 
 * @internal
 * @see {@link https://pollinations.ai | Pollinations.ai}
 */
const pollinationsProvider: ImageProvider = {
  generateImage: async (
    prompt: string,
    saveDirectory: string,
    baseUrl: string,
    options?: ImageGenerationOptions
  ): Promise<string> => {
    // Map size to width/height
    const sizeMap = {
      '1024x1024': { width: 1024, height: 1024 },
      '1792x1024': { width: 1792, height: 1024 },
      '1024x1792': { width: 1024, height: 1792 },
    };
    const dimensions = sizeMap[options?.size ?? '1024x1024'];
    
    // Build Pollinations API URL
    const pollinationsUrl = new URL('https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt));
    pollinationsUrl.searchParams.set('width', String(dimensions.width));
    pollinationsUrl.searchParams.set('height', String(dimensions.height));
    pollinationsUrl.searchParams.set('model', 'flux');
    pollinationsUrl.searchParams.set('nologo', 'true');
    
    // Fetch image from Pollinations
    const response = await fetch(pollinationsUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.statusText}`);
    }
    
    // Download image
    const imageBuffer = await response.arrayBuffer();
    const filename = `${crypto.randomUUID()}.png`;
    const key = filename.replace(/\..+$/, '');
    
    // Save to Netlify Blobs or filesystem
    if (options?.storeImage) {
      const metadata: ImageBlobMetadata = {
        createdAt: new Date().toISOString(),
        filename,
        contentType: 'image/png',
      };
      await options.storeImage(key, imageBuffer, metadata);
    } else {
      // Fallback to filesystem for local dev
      await mkdir(saveDirectory, { recursive: true });
      const filePath = join(saveDirectory, filename);
      await Bun.write(filePath, imageBuffer);
    }
    
    // Return full URL
    const relativePath = `/images/${key}`;
    return new URL(relativePath, baseUrl).toString();
  }
};

export default pollinationsProvider;
