import { ActivityStravaApiResponse, Activity } from '../types';

/**
 * Transforms Strava API response to internal Activity format.
 *
 * Maps fields from the raw Strava API response structure to the internal
 * Activity type used by the system. Handles field name differences (e.g.,
 * `total_elevation_gain` → `elevation_gain`) and extracts nested data
 * (e.g., gear name from gear object). Only includes fields that are present
 * in the API response, preserving optional field semantics.
 *
 * @param {ActivityStravaApiResponse} apiResponse - Raw activity data from Strava API
 * @returns {Activity} Activity object in internal format with required fields (type, sport_type)
 *   and all available optional fields mapped from the API response
 *
 * @see {@link https://developers.strava.com/docs/reference/#api-Activities-getActivityById | Strava Activity Response Format}
 *
 * @example
 * ```typescript
 * const activity = transformResponse({
 *   id: 123456,
 *   type: 'Ride',
 *   sport_type: 'MountainBikeRide',
 *   distance: 50000,
 *   total_elevation_gain: 500
 * });
 * // Returns: { type: 'Ride', sport_type: 'MountainBikeRide', id: 123456, distance: 50000, elevation_gain: 500 }
 * ```
 */
const transformResponse = (apiResponse: ActivityStravaApiResponse): Activity => {
  const activity: Activity = {
    type: apiResponse.type,
    sport_type: apiResponse.sport_type,
  };

  if (apiResponse.id !== undefined) {
    activity.id = apiResponse.id;
  }

  if (apiResponse.distance !== undefined) {
    activity.distance = apiResponse.distance;
  }

  if (apiResponse.total_elevation_gain !== undefined) {
    activity.elevation_gain = apiResponse.total_elevation_gain;
  }

  if (apiResponse.start_date !== undefined) {
    activity.start_date = apiResponse.start_date;
  }

  if (apiResponse.start_date_local !== undefined) {
    activity.start_date_local = apiResponse.start_date_local;
  }

  if (apiResponse.timezone !== undefined) {
    activity.timezone = apiResponse.timezone;
  }

  if (apiResponse.moving_time !== undefined) {
    activity.moving_time = apiResponse.moving_time;
  }

  if (apiResponse.elapsed_time !== undefined) {
    activity.elapsed_time = apiResponse.elapsed_time;
  }

  if (apiResponse.average_speed !== undefined) {
    activity.average_speed = apiResponse.average_speed;
  }

  if (apiResponse.max_speed !== undefined) {
    activity.max_speed = apiResponse.max_speed;
  }

  if (apiResponse.average_cadence !== undefined) {
    activity.average_cadence = apiResponse.average_cadence;
  }

  if (apiResponse.average_temp !== undefined) {
    activity.average_temp = apiResponse.average_temp;
  }

  if (apiResponse.average_watts !== undefined) {
    activity.average_watts = apiResponse.average_watts;
  }

  if (apiResponse.weighted_average_watts !== undefined) {
    activity.weighted_average_watts = apiResponse.weighted_average_watts;
  }

  if (apiResponse.kilojoules !== undefined) {
    activity.kilojoules = apiResponse.kilojoules;
  }

  if (apiResponse.device_watts !== undefined) {
    activity.device_watts = apiResponse.device_watts;
  }

  if (apiResponse.has_heartrate !== undefined) {
    activity.has_heartrate = apiResponse.has_heartrate;
  }

  if (apiResponse.max_watts !== undefined) {
    activity.max_watts = apiResponse.max_watts;
  }

  if (apiResponse.elev_high !== undefined) {
    activity.elev_high = apiResponse.elev_high;
  }

  if (apiResponse.elev_low !== undefined) {
    activity.elev_low = apiResponse.elev_low;
  }

  if (apiResponse.calories !== undefined) {
    activity.calories = apiResponse.calories;
  }

  if (apiResponse.name !== undefined) {
    activity.name = apiResponse.name;
  }

  if (apiResponse.description !== undefined) {
    activity.description = apiResponse.description;
  }

  if (apiResponse.gear !== undefined) {
    if (typeof apiResponse.gear === 'string') {
      activity.gear = apiResponse.gear;
    } else if (apiResponse.gear.name !== undefined) {
      activity.gear = apiResponse.gear.name;
    }
  }

  if (apiResponse.gear_id !== undefined) {
    activity.gear = apiResponse.gear_id;
  }

  return activity;
};

export default transformResponse;
