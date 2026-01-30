import { StravaActivitySignals } from '../../types';

/**
 * Activity type to subject mapping.
 */
const ACTIVITY_SUBJECTS: Record<string, string> = {
  Run: 'runner',
  Ride: 'cyclist',
  TrailRun: 'trail runner',
  Walk: 'walker',
  Hike: 'hiker',
  Swim: 'swimmer',
  VirtualRide: 'cyclist',
  VirtualRun: 'runner',
};

/**
 * Composes scene description from activity signals.
 *
 * Builds environment description based on activity type, elevation,
 * time of day, and weather. Scene composition follows priority order:
 * base environment → terrain → weather → lighting → atmosphere.
 *
 * Scene composition priority:
 * 1. Base environment (from activity type)
 * 2. Terrain features (from elevation)
 * 3. Weather elements (if applicable)
 * 4. Lighting (from time of day)
 * 5. Atmosphere (from mood)
 * 
 * @param {StravaActivitySignals} signals - Activity signals to compose scene from
 * @returns {{ subject: string; scene: string }} Subject and scene description
 */
const composeScene = (signals: StravaActivitySignals): { subject: string; scene: string } => {
  // Determine subject from activity type
  const subject = ACTIVITY_SUBJECTS[signals.activityType] ?? 'athlete';
  
  // Build scene components
  const sceneParts: string[] = [];
  
  // Base environment
  const baseEnvironment = signals.activityType.includes('Virtual')
    ? 'indoor training space'
    : 'outdoor setting';
  sceneParts.push(baseEnvironment);
  
  // Terrain features
  if (signals.elevation === 'mountainous') {
    sceneParts.push('mountainous terrain');
  } else if (signals.elevation === 'rolling') {
    sceneParts.push('rolling hills');
  } else {
    sceneParts.push('flat terrain');
  }
  
  // Weather elements
  if (signals.weather === 'sunny') {
    sceneParts.push('bright clear sky');
  } else if (signals.weather === 'rainy') {
    sceneParts.push('rainy atmosphere');
  } else if (signals.weather === 'cloudy') {
    sceneParts.push('cloudy sky');
  } else if (signals.weather === 'foggy') {
    sceneParts.push('misty fog');
  }
  
  // Lighting from time of day
  if (signals.timeOfDay === 'morning') {
    sceneParts.push('soft morning light');
  } else if (signals.timeOfDay === 'day') {
    sceneParts.push('bright daylight');
  } else if (signals.timeOfDay === 'evening') {
    sceneParts.push('warm evening glow');
  } else if (signals.timeOfDay === 'night') {
    sceneParts.push('dark night atmosphere');
  }
  
  // Compose scene string
  const scene = sceneParts.join(', ');
  
  return { subject, scene };
};

export default composeScene;
