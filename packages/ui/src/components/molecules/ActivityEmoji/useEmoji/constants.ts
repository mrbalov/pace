/**
 * Timeout duration for the emoji animation in milliseconds.
 */
export const EMOJI_ANIMATION_TIMEOUT = 5000;

/**
 * Half of animation duration.
 * Used to time the emoji change in the animation cycle.
 */
export const EMOJI_ANIMATION_TIMEOUT_HALF = 200;

/**
 * Skin tone modifiers for emojis.
 */
export const EMOJI_SKIN_TONES = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];

/**
 * Sport emojis that support Unicode skin tone modifiers.
 * These represent people performing activities where the person is clearly visible.
 */
export const EMOJIS_WITH_SKIN_TONES_BASE = [
  '🏃', // running
  '🚴', // biking
  '🏊', // swimming
  '🧗', // climbing
  '🏄', // surfing
  '🤸', // gymnastics
  '🏋️', // weightlifting
  '🚣', // rowing
  '⛹️', // basketball
  '🏌️', // golf
  '🤾', // handball
  '🤽', // water polo
  '🚵', // mountain biking
  '🧘', // yoga/meditation
];

/**
 * Emojis with skin tone variations.
 * Generated from base emojis supporting skin tones.
 */
export const EMOJIS_WITH_SKIN_TONES = EMOJIS_WITH_SKIN_TONES_BASE.flatMap((emoji: string) =>
  EMOJI_SKIN_TONES.map((tone) => {
    if (tone === '') {
      return emoji;
    } else if (emoji.includes('️')) {
      // Handle emojis with variation selector (️)
      // Insert skin tone before the variation selector.
      return emoji.replace('️', tone + '️');
    } else {
      // Regular emoji + skin tone.
      return emoji + tone;
    }
  }),
);

/**
 * Sport emojis that do NOT support Unicode skin tone modifiers.
 * Includes equipment/objects and activities where people are not clearly visible.
 */
export const EMOJIS_WO_SKIN_TONES = [
  '⚽', // soccer
  '🏀', // basketball
  '🏈', // american football
  '⚾', // baseball
  '🥎', // softball
  '🎾', // tennis
  '🏐', // volleyball
  '🏓', // ping pong
  '🏸', // badminton
  '🥍', // lacrosse
  '🏑', // field hockey
  '🥅', // goal net
  '⛳', // golf hole
  '🎯', // target/darts
  '🛝', // playground slide
  '🛼', // roller skate
  '🛹', // skateboard
  '🎿', // skis
  '⛸️', // ice skate
  '🥌', // curling stone
  '⛷️', // skiing
  '🏂', // snowboarding
  '🏆', // trophy/winning
  '🥇', // gold medal
  '🏇', // horse racing (person not clearly visible)
  '🤺', // fencing (person fully covered in gear)
];

/**
 * Complete list of sport emojis including skin tone variations.
 */
export const EMOJIS = [...EMOJIS_WO_SKIN_TONES, ...EMOJIS_WITH_SKIN_TONES];
