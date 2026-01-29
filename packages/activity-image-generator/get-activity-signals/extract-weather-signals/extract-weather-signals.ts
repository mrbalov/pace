import { StravaActivity } from '@pace/strava-api';

/**
 * Extracts weather signal from activity data.
 *
 * Parses weather information from activity data if available.
 * Weather data is optional in Strava API responses.
 *
 * @param {StravaActivity} activity - Activity data to extract weather from
 * @returns {'sunny' | 'rainy' | 'cloudy' | 'foggy' | undefined} Weather classification or undefined if not available
 *
 * @remarks
 * Weather extraction is based on available activity metadata.
 * If weather data is not present, returns undefined.
 */
const extractWeatherSignals = (activity: StravaActivity): 'sunny' | 'rainy' | 'cloudy' | 'foggy' | undefined => {
  // Strava API doesn't directly expose weather in the base activity response
  // Weather might be available in extended metadata or user-provided descriptions
  // For now, we'll return undefined as weather is optional
  
  // Future enhancement: parse weather from description or extended metadata
  // if (activity.description) {
  //   const desc = activity.description.toLowerCase();
  //   if (desc.includes('rain') || desc.includes('wet')) return 'rainy';
  //   if (desc.includes('sun') || desc.includes('sunny')) return 'sunny';
  //   if (desc.includes('cloud') || desc.includes('overcast')) return 'cloudy';
  //   if (desc.includes('fog') || desc.includes('mist')) return 'foggy';
  // }
  
  return undefined;
};

export default extractWeatherSignals;
