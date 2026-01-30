import { StravaActivity } from '@pace/strava-api';
import { CONFIG } from '../../constants';

/**
 * Extracts time of day signal from activity timestamps.
 *
 * Determines time of day (morning, day, evening, night) based on
 * activity start time. Uses local time if available, otherwise UTC.
 *
 * Time classifications:
 * - Morning: 5:00 - 10:00
 * - Day: 10:00 - 17:00
 * - Evening: 17:00 - 20:00
 * - Night: 20:00 - 5:00
 *
 * @param {StravaActivity} activity - Activity data to extract time from
 * @returns {'morning' | 'day' | 'evening' | 'night'} Time of day classification
 */
const extractTimeSignals = (activity: StravaActivity): 'morning' | 'day' | 'evening' | 'night' => {
  // Prefer local time, fall back to UTC
  const timeString = activity.start_date_local ?? activity.start_date;
  
  const result = (() => {
    if (!timeString) {
      return 'day'; // Default to day if no time available
    } else {
      const date = new Date(timeString);
      const hour = date.getHours();
      
      if (hour >= CONFIG.TIME_OF_DAY.MORNING_START && hour < CONFIG.TIME_OF_DAY.MORNING_END) {
        return 'morning';
      } else if (hour >= CONFIG.TIME_OF_DAY.MORNING_END && hour < CONFIG.TIME_OF_DAY.EVENING_START) {
        return 'day';
      } else if (hour >= CONFIG.TIME_OF_DAY.EVENING_START && hour < CONFIG.TIME_OF_DAY.NIGHT_START) {
        return 'evening';
      } else {
        return 'night';
      }
    }
  })();
  
  return result;
};

export default extractTimeSignals;
