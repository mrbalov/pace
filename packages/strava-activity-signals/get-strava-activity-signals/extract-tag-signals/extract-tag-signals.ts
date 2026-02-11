import { KNOWN_TAGS } from './constants';
import { Input } from './types';

/**
 * Extracts and normalizes tag signals from activity data.
 *
 * Processes Strava tags and normalizes them to known tag values.
 * Tags influence mood, intensity, and scene composition.
 *
 * Tags are normalized to lowercase and matched against known tag list.
 * Unknown tags are filtered out to ensure only safe, recognized tags are used.
 *
 * Strava API doesn't directly expose tags in the base activity response.
 * Tags might be available in extended metadata or user-provided descriptions.
 * For now, the function checks common tag indicators in the activity data.
 *
 * @param {Input} input - Strava activity data to extract tags from.
 * @returns {string[]} Array of normalized tag strings or undefined if no valid tags found.
 */
const extractTagSignals = ({ commute }: Input): string[] | undefined => {
  const tags: string[] = [];

  if (commute) {
    tags.push('commute');
  }

  // Check workout type (Strava uses numeric codes)
  // Workout type 10 = Race, but this is activity-specific
  // We'll rely on other indicators for now

  // Future enhancement: parse tags from description or extended metadata
  // if (activity.description) {
  //   const desc = activity.description.toLowerCase();
  //   KNOWN_TAGS.forEach((tag) => {
  //     if (desc.includes(tag)) {
  //       tags.push(tag);
  //     }
  //   });
  // }

  const normalizedTags = tags
    .map((tag) => tag.toLowerCase().trim())
    .filter((tag) => KNOWN_TAGS.includes(tag as (typeof KNOWN_TAGS)[number]));

  return normalizedTags.length > 0 ? normalizedTags : undefined;
};

export default extractTagSignals;
