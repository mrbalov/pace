import { StravaActivityImagePrompt } from '../types';

export const DEFAULT_PROMPT: StravaActivityImagePrompt = {
  style: 'minimal',
  mood: 'neutral',
  subject: 'athlete',
  scene: 'simple outdoor setting',
  text: 'minimal style, athlete, neutral mood, simple outdoor setting',
} as const;
