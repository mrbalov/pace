import { StravaActivitySignalsTimeOfDay } from '../types';
import { CLASSIFICATIONS } from '../constants';
import { Input } from './types';

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
 * @param {Input} input - Activity data to extract time from.
 * @returns {StravaActivitySignalsTimeOfDay} Time of day classification.
 */
const extractTimeSignals = ({
  start_date_local,
  start_date,
}: Input): StravaActivitySignalsTimeOfDay => {
  const startDate = start_date_local || start_date;

  if (startDate) {
    const date = new Date(startDate);
    const hour = date.getHours();
    const isMorning =
      hour >= CLASSIFICATIONS.TIME_OF_DAY.MORNING_START &&
      hour < CLASSIFICATIONS.TIME_OF_DAY.MORNING_END;
    const isDay =
      hour >= CLASSIFICATIONS.TIME_OF_DAY.MORNING_END &&
      hour < CLASSIFICATIONS.TIME_OF_DAY.EVENING_START;
    const isEvening =
      hour >= CLASSIFICATIONS.TIME_OF_DAY.EVENING_START &&
      hour < CLASSIFICATIONS.TIME_OF_DAY.NIGHT_START;

    if (isMorning) {
      return 'morning';
    } else if (isDay) {
      return 'day';
    } else if (isEvening) {
      return 'evening';
    } else {
      return 'night';
    }
  } else {
    return 'day';
  }
};

export default extractTimeSignals;
