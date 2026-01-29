import type { Context } from '@netlify/functions';
import { listImageKeys, getImage, isExpired, deleteImage } from '../../src/storage';

/**
 * Scheduled function that runs daily to clean up expired images.
 * Deletes images older than 24 hours.
 */
export default async (request: Request, context: Context) => {
  console.log('Starting image cleanup...');
  
  try {
    const keys = await listImageKeys();
    console.log(`Found ${keys.length} images to check`);
    
    let deletedCount = 0;
    let errorCount = 0;
    
    for (const key of keys) {
      try {
        const result = await getImage(key);
        
        if (!result) {
          console.log(`Image ${key} not found, skipping`);
          continue;
        }
        
        if (isExpired(result.metadata)) {
          await deleteImage(key);
          deletedCount++;
          console.log(`Deleted expired image: ${key}`);
        }
      } catch (error) {
        console.error(`Error processing ${key}:`, error);
        errorCount++;
      }
    }
    
    const summary = {
      checked: keys.length,
      deleted: deletedCount,
      errors: errorCount,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Cleanup complete:', summary);
    
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
