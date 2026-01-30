import type { Context } from '@netlify/functions';
import { getImage, isExpired, deleteImage } from '../../src/storage';

/**
 * Netlify Function handler for serving images from Blobs.
 *
 * GET /images/:key - Retrieves and serves image by key
 * Auto-deletes if expired (>24 hours old)
 * @param {Request} request - The incoming HTTP request
 * @param {Context} _context - Netlify function context (unused)
 * @returns {Promise<Response>} HTTP response with image data or error
 */
export default async (request: Request, _context: Context) => {
  // Explicitly mark parameter as intentionally unused
  void _context;

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(part => part);
  
  // Extract key from path: /images/:key or /.netlify/functions/images/:key
  const keyIndex = pathParts.indexOf('images');
  if (keyIndex === -1 || keyIndex >= pathParts.length - 1) {
    return new Response('Not Found', { status: 404 });
  }
  
  const key = pathParts[keyIndex + 1];
  
  try {
    const result = await getImage(key);
    
    if (!result) {
      return new Response('Not Found', { status: 404 });
    }
    
    const { data, metadata } = result;

    // Check if expired
    if (isExpired(metadata)) {
      // Delete expired image
      await deleteImage(key);
      return new Response('Not Found - Image expired', { status: 404 });
    }

    // Type assertion for metadata properties
    const metadataObj = metadata as { contentType?: string; createdAt?: string };

    // Serve image
    return new Response(data as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': metadataObj.contentType ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Created-At': metadataObj.createdAt ?? new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const config = {
  path: '/images/*',
};
