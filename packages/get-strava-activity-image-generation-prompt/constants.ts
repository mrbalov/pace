export const STYLES = [
  'cartoon',
  'minimal',
  'abstract',
  'illustrated',
] as const;

export const MOODS = [
  'calm',
  'intense',
  'routine',
  'playful',
  'calm',
  'intense',
  'focused',
  'focused',
] as const;

export const TERRAINS = [
  'mountainous terrain',
  'rolling hills',
  'flat terrain',
] as const;

export const ENVIRONMENTS = [
  'indoor training space',
  'outdoor training space',
] as const;

export const ATMOSPHERES = [
  'soft morning light',
  'bright daylight',
  'warm evening glow',
  'dark night atmosphere',
  'soft neutral light',
] as const;

export const DEFAULT_PROMPT = {
  style: 'minimal',
  mood: 'neutral',
  subject: 'athlete',
  scene: 'simple outdoor setting',
  text: 'minimal style, athlete, neutral mood, simple outdoor setting',
} as const;
