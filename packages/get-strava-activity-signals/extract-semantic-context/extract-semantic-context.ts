import extractTextSignals from '../extract-text-signals';
import { Input } from './types';

/**
 * Extracts semantic context from Strava activity user text.
 * @param {Input} input - Strava activity data.
 * @returns {string[] | undefined} Extracted semantic context or undefined if none found.
 */
const extractSemanticContext = ({ name, description }: Input): string[] | undefined => {
  const semanticContext: string[] = [];

  if (name) {
    const nameSignals = extractTextSignals(name);

    if (nameSignals) {
      semanticContext.push(...nameSignals);
    }
  }

  if (description) {
    const descriptionSignals = extractTextSignals(description);

    if (descriptionSignals) {
      semanticContext.push(...descriptionSignals);
    }
  }

  return semanticContext.length > 0 ? semanticContext : undefined;
};

export default extractSemanticContext;
