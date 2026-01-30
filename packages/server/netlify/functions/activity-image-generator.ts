import { connectLambda } from '@netlify/blobs';
import { activityImageGenerator } from '../../src/routes';
import { getConfig } from '../../src/config';

/**
 * Netlify Function handler for activity image generation.
 * @param {Request} request - The incoming HTTP request
 * @param {any} context - Netlify function context
 * @returns {Promise<Response>} HTTP response with generated image or error
 */
export default async (request: Request, context: unknown) => {
  // Connect to Netlify Blobs context
  connectLambda(context as Parameters<typeof connectLambda>[0]);
  
  const config = getConfig();
  const response = await activityImageGenerator(request, config);
  
  return response;
};

export const config = {
  path: '/activity-image-generator/*',
};
