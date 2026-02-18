import { Status } from '../types';
import { Input } from './types';

/**
 * Determines the appropriate status based on loading and content states.
 * @param {Input} input - The input object containing loading and content states.
 * @param {boolean} input.isLoading - Whether the content is currently loading.
 * @param {boolean} input.isLoaded - Whether the content has finished loading.
 * @param {boolean} input.hasContent - Whether the loaded content has meaningful data.
 * @returns {Status} The corresponding status.
 */
const getStatus = ({
  isLoading,
  isLoaded,
  hasContent,
}: Input): Status => {
  if (isLoading) {
    return 'loading';
  } if (isLoaded && hasContent) {
    return 'loaded';
  } else if (isLoaded) {
    return 'error';
  } else {
    return 'pending';
  }
};

export default getStatus;
