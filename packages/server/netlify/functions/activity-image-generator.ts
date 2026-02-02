import { activityImageGeneratorHandler } from '../../src/adapters/netlify';

export { activityImageGeneratorHandler as handler };

export const config = {
  path: '/activity-image-generator/*',
};
