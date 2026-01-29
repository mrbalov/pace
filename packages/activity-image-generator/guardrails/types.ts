import { StravaActivity } from '@pace/strava-api';
import { StravaActivitySignals, StravaActivityImagePrompt, ValidationResult } from '../types';

/**
 * Validation result for activity data.
 */
export type StravaActivityValidationResult = ValidationResult<StravaActivity>;

/**
 * Validation result for activity signals.
 */
export type StravaActivitySignalsValidationResult = ValidationResult<StravaActivitySignals>;

/**
 * Validation result for activity image prompt.
 */
export type StravaActivityImagePromptValidationResult = ValidationResult<StravaActivityImagePrompt>;
