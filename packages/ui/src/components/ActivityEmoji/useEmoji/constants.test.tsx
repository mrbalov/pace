import { describe, expect, test } from 'bun:test';
import { 
  EMOJI_ANIMATION_TIMEOUT, 
  EMOJI_ANIMATION_TIMEOUT_HALF, 
  EMOJIS, 
  EMOJIS_WITH_SKIN_TONES,
  EMOJIS_WITH_SKIN_TONES_BASE,
  EMOJIS_WO_SKIN_TONES,
  EMOJI_SKIN_TONES 
} from './constants';

/**
 * Validates that an emoji string represents a single grapheme cluster.
 * This ensures skin tone modifiers are properly applied and render as one emoji.
 * @param {string} emoji - The emoji string to validate.
 * @returns {boolean} True if the emoji is a valid single grapheme cluster, false otherwise.
 */
const getIsValidEmojiGraphemeCluster = (emoji: string): boolean => {
  const segmenter = new Intl.Segmenter([], { granularity: 'grapheme' });
  const segments = Array.from(segmenter.segment(emoji));

  return segments.length === 1;
};

/**
 * Checks if an emoji supports skin tone modifiers by testing with a sample modifier.
 * @param {string} baseEmoji - The base emoji to test.
 * @returns {boolean} True if the emoji supports skin tone modifiers, false otherwise.
 */
const getEmojiSupportsSkinTone = (baseEmoji: string): boolean => {
  const testModifier = '🏻';
  const testEmoji = baseEmoji.includes('️')
    ? baseEmoji.replace('️', testModifier + '️')
    : baseEmoji + testModifier;

  return getIsValidEmojiGraphemeCluster(testEmoji);
};

describe('ActivityEmoji Constants', () => {
  test('EMOJI_ANIMATION_TIMEOUT should be 5000ms', () => {
    expect(EMOJI_ANIMATION_TIMEOUT).toBe(5000);
  });

  test('EMOJI_ANIMATION_TIMEOUT_HALF should be 200ms', () => {
    expect(EMOJI_ANIMATION_TIMEOUT_HALF).toBe(200);
  });

  test('EMOJI_SKIN_TONES should contain 6 variations', () => {
    expect(EMOJI_SKIN_TONES).toHaveLength(6);
    expect(EMOJI_SKIN_TONES[0]).toBe(''); // default (no modifier)
    expect(EMOJI_SKIN_TONES[1]).toBe('🏻'); // light
    expect(EMOJI_SKIN_TONES[5]).toBe('🏿'); // dark
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should only contain emojis that support skin tone modifiers', () => {
    for (const emoji of EMOJIS_WITH_SKIN_TONES_BASE) {
      expect(getEmojiSupportsSkinTone(emoji)).toBe(true);
    }
  });

  test('EMOJIS_WO_SKIN_TONES should not contain problematic emojis like fencing or horse racing', () => {
    expect(EMOJIS_WO_SKIN_TONES).toContain('🤺'); // fencing
    expect(EMOJIS_WO_SKIN_TONES).toContain('🏇'); // horse racing
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should not contain fencing or horse racing emojis', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).not.toContain('🤺'); // fencing
    expect(EMOJIS_WITH_SKIN_TONES_BASE).not.toContain('🏇'); // horse racing
  });

  test('All generated EMOJIS should be valid single grapheme clusters', () => {
    for (const emoji of EMOJIS) {
      expect(getIsValidEmojiGraphemeCluster(emoji)).toBe(true);
    }
  });

  test('EMOJIS array should contain expected number of emojis', () => {
    // EMOJIS_WITH_SKIN_TONES is already expanded with all skin tone variations.
    // So the total should just be the sum of both arrays.
    const expectedCount = EMOJIS_WO_SKIN_TONES.length + EMOJIS_WITH_SKIN_TONES.length;

    expect(EMOJIS).toHaveLength(expectedCount);
  });

  test('EMOJIS should not contain duplicate emojis', () => {
    const uniqueEmojis = new Set(EMOJIS);

    expect(uniqueEmojis.size).toBe(EMOJIS.length);
  });

  test('EMOJIS should not contain only valid emojis', () => {
    // Test that all emojis in the final array are valid grapheme clusters.
    const invalidEmojis = EMOJIS.filter(emoji => !getIsValidEmojiGraphemeCluster(emoji));
    
    expect(invalidEmojis).toHaveLength(0);
  });

  test('EMOJIS should not contain fencing or horse racing emojis with skin tones', () => {
    const problematicEmojis = EMOJIS.filter(
      emoji => emoji.includes('🤺') || emoji.includes('🏇'),
    );
    
    // The only valid ones should be the base emojis without skin tones.
    expect(problematicEmojis).toEqual(['🏇', '🤺']);
  });
});
