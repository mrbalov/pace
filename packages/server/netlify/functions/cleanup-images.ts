import type { Context } from '@netlify/functions';
import { listImageKeys, getImage, isExpired, deleteImage } from '../../src/storage';

/**
 * Scheduled function that runs daily to clean up expired images.
 * Deletes images older than 24 hours.
 * @param {Request} _request - The incoming HTTP request (unused)
 * @param {Context} _context - Netlify function context (unused)
 * @returns {Promise<Response>} HTTP response with cleanup summary
 */
export default async (_request: Request, _context: Context) => {
  // Explicitly mark parameters as intentionally unused
  void _request;
  void _context;

  console.info('Starting image cleanup...');

  try {
    const keys = await listImageKeys();
    console.info(`Found ${keys.length} images to check`);

    const counters = { deletedCount: 0, errorCount: 0 };

    for (const key of keys) {
      try {
        const result = await getImage(key) as { data: unknown; metadata: unknown } | null;

        if (!result) {
          console.info(`Image ${key} not found, skipping`);
          continue;
        }

        if (isExpired(result.metadata)) {
          await deleteImage(key);
          counters.deletedCount++;
          console.info(`Deleted expired image: ${key}`);
        }
      } catch (error) {
        console.error(`Error processing ${key}:`, error);
        counters.errorCount++;
      }
    }
    
    const summary = {
      checked: keys.length,
      deleted: counters.deletedCount,
      errors: counters.errorCount,
      timestamp: new Date().toISOString(),
    };

    console.info('Cleanup complete:', summary);
    
    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Cleanup failed:', error);
    return new Response(JSON.stringify({ error: 'Cleanup failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  schedule: '@daily', // Runs at midnight UTC every day
};
