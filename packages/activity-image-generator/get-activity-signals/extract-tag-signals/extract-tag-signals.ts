import { StravaActivity } from '@pace/strava-api';

/**
 * Normalized Strava tag names.
 */
const KNOWN_TAGS = [
  'recovery',
  'race',
  'commute',
  'with kid',
  'long run',
  'easy',
  'workout',
] as const;

/**
 * Extracts and normalizes tag signals from activity data.
 *
 * Processes Strava tags and normalizes them to known tag values.
 * Tags influence mood, intensity, and scene composition.
 *
 * Tags are normalized to lowercase and matched against known tag list.
 * Unknown tags are filtered out to ensure only safe, recognized tags are used.
 *
 * @param {StravaActivity} activity - Activity data to extract tags from
 * @returns {string[]} Array of normalized tag strings
 */
const extractTagSignals = (activity: StravaActivity): string[] => {
  const tags: string[] = [];

  // Strava API doesn't directly expose tags in the base activity response
  // Tags might be available in extended metadata or user-provided descriptions
  // For now, we'll check common tag indicators in the activity data

  // Check commute flag
  if (activity.commute === true) {
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

  // Normalize tags to lowercase and filter to known tags
  const normalizedTags = tags
    .map((tag) => tag.toLowerCase().trim())
    .filter((tag) => KNOWN_TAGS.includes(tag as (typeof KNOWN_TAGS)[number]));

  return normalizedTags;
};

export default extractTagSignals;
