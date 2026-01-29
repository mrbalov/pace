import { connectLambda } from '@netlify/blobs';
import { activityImageGenerator } from '../../src/routes';
import { getConfig } from '../../src/config';

/**
 * Netlify Function handler for activity image generation.
 */
export default async (request: Request, context: any) => {
  // Connect to Netlify Blobs context
  connectLambda(context);
  
  const config = getConfig();
  const response = await activityImageGenerator(request, config);
  
  return response;
};

export const config = {
  path: '/activity-image-generator/*',
};
