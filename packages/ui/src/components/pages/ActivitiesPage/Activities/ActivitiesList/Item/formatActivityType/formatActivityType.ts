'use client';

import { ACTIVITIES } from './constants';

/**
 * Formats activity type to a friendly display name.
 * @param {string} type - Activity type from Strava API.
 * @returns {string} Formatted activity type name.
 */
const formatActivityType = (type: string): string => {
  const typeLowercased = type.toLowerCase();
  const activity = ACTIVITIES[typeLowercased];

  if (activity) {
    return activity;
  } else {
    return type
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
};

export default formatActivityType;
