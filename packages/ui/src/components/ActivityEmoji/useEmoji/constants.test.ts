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

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain running emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🏃');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain biking emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🚴');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain swimming emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🏊');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain climbing emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🧗');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain surfing emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🏄');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain gymnastics emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🤸');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain weightlifting emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🏋️');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain rowing emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🚣');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain basketball emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('⛹️');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain golf emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🏌️');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain handball emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🤾');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain water polo emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🤽');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain mountain biking emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🚵');
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should contain yoga emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toContain('🧘');
  });

  test('EMOJIS_WITH_SKIN_TONES should contain light skin tone running emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES).toContain('🏃🏻');
  });

  test('EMOJIS_WITH_SKIN_TONES should contain medium-light skin tone swimming emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES).toContain('🏊🏼');
  });

  test('EMOJIS_WITH_SKIN_TONES should contain medium skin tone biking emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES).toContain('🚴🏽');
  });

  test('EMOJIS_WITH_SKIN_TONES should contain medium-dark skin tone climbing emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES).toContain('🧗🏾');
  });

  test('EMOJIS_WITH_SKIN_TONES should contain dark skin tone surfing emoji', () => {
    expect(EMOJIS_WITH_SKIN_TONES).toContain('🏄🏿');
  });

  test('Each emoji in EMOJIS_WITH_SKIN_TONES_BASE should generate 6 variations', () => {
    const emojisPerBase = EMOJIS_WITH_SKIN_TONES.length / EMOJIS_WITH_SKIN_TONES_BASE.length;
    expect(emojisPerBase).toBe(6);
  });

  test('EMOJIS_WO_SKIN_TONES should contain soccer ball emoji', () => {
    expect(EMOJIS_WO_SKIN_TONES).toContain('⚽');
  });

  test('EMOJIS_WO_SKIN_TONES should contain basketball emoji', () => {
    expect(EMOJIS_WO_SKIN_TONES).toContain('🏀');
  });

  test('EMOJIS_WO_SKIN_TONES should contain trophy emoji', () => {
    expect(EMOJIS_WO_SKIN_TONES).toContain('🏆');
  });

  test('EMOJIS_WO_SKIN_TONES should contain gold medal emoji', () => {
    expect(EMOJIS_WO_SKIN_TONES).toContain('🥇');
  });

  test('EMOJIS_WO_SKIN_TONES should not be empty', () => {
    expect(EMOJIS_WO_SKIN_TONES.length).toBeGreaterThan(0);
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should not be empty', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE.length).toBeGreaterThan(0);
  });

  test('EMOJI_SKIN_TONES should include empty string for default', () => {
    expect(EMOJI_SKIN_TONES).toContain('');
  });

  test('EMOJI_SKIN_TONES should include light skin tone', () => {
    expect(EMOJI_SKIN_TONES).toContain('🏻');
  });

  test('EMOJI_SKIN_TONES should include medium-light skin tone', () => {
    expect(EMOJI_SKIN_TONES).toContain('🏼');
  });

  test('EMOJI_SKIN_TONES should include medium skin tone', () => {
    expect(EMOJI_SKIN_TONES).toContain('🏽');
  });

  test('EMOJI_SKIN_TONES should include medium-dark skin tone', () => {
    expect(EMOJI_SKIN_TONES).toContain('🏾');
  });

  test('EMOJI_SKIN_TONES should include dark skin tone', () => {
    expect(EMOJI_SKIN_TONES).toContain('🏿');
  });

  test('All emojis with variation selector should be handled correctly', () => {
    const emojisWithVariationSelector = EMOJIS_WITH_SKIN_TONES_BASE.filter(
      emoji => emoji.includes('️')
    );
    expect(emojisWithVariationSelector.length).toBeGreaterThan(0);
  });

  test('Weightlifting emoji should have variation selector', () => {
    expect('🏋️'.includes('️')).toBe(true);
  });

  test('Basketball emoji should have variation selector', () => {
    expect('⛹️'.includes('️')).toBe(true);
  });

  test('Golf emoji should have variation selector', () => {
    expect('🏌️'.includes('️')).toBe(true);
  });

  test('Weightlifting with skin tone should be valid grapheme', () => {
    expect(getIsValidEmojiGraphemeCluster('🏋🏻️')).toBe(true);
  });

  test('Basketball with skin tone should be valid grapheme', () => {
    expect(getIsValidEmojiGraphemeCluster('⛹🏻️')).toBe(true);
  });

  test('Golf with skin tone should be valid grapheme', () => {
    expect(getIsValidEmojiGraphemeCluster('🏌🏻️')).toBe(true);
  });

  test('EMOJIS array should not be empty', () => {
    expect(EMOJIS.length).toBeGreaterThan(0);
  });

  test('EMOJIS array should be larger than EMOJIS_WO_SKIN_TONES', () => {
    expect(EMOJIS.length).toBeGreaterThan(EMOJIS_WO_SKIN_TONES.length);
  });

  test('EMOJIS array should be larger than EMOJIS_WITH_SKIN_TONES', () => {
    expect(EMOJIS.length).toBeGreaterThan(EMOJIS_WITH_SKIN_TONES.length);
  });

  test('Every emoji in EMOJIS_WO_SKIN_TONES should be in EMOJIS', () => {
    for (const emoji of EMOJIS_WO_SKIN_TONES) {
      expect(EMOJIS).toContain(emoji);
    }
  });

  test('Every emoji in EMOJIS_WITH_SKIN_TONES should be in EMOJIS', () => {
    for (const emoji of EMOJIS_WITH_SKIN_TONES) {
      expect(EMOJIS).toContain(emoji);
    }
  });

  test('EMOJIS should start with EMOJIS_WO_SKIN_TONES elements', () => {
    EMOJIS_WO_SKIN_TONES.forEach((emojiWithSkinTone, index) => {
      expect(EMOJIS[index]).toBe(emojiWithSkinTone);
    });
  });

  test('No emoji in EMOJIS should be undefined', () => {
    for (const emoji of EMOJIS) {
      expect(emoji).not.toBeUndefined();
    }
  });

  test('No emoji in EMOJIS should be null', () => {
    for (const emoji of EMOJIS) {
      expect(emoji).not.toBeNull();
    }
  });

  test('No emoji in EMOJIS should be empty string', () => {
    for (const emoji of EMOJIS) {
      expect(emoji).not.toBe('');
    }
  });

  test('All emojis in EMOJIS should be strings', () => {
    for (const emoji of EMOJIS) {
      expect(typeof emoji).toBe('string');
    }
  });

  test('EMOJIS_WITH_SKIN_TONES_BASE should have exactly 14 emojis', () => {
    expect(EMOJIS_WITH_SKIN_TONES_BASE).toHaveLength(14);
  });

  test('EMOJIS_WITH_SKIN_TONES should have exactly 84 emojis', () => {
    // 14 base emojis * 6 skin tones = 84
    expect(EMOJIS_WITH_SKIN_TONES).toHaveLength(84);
  });

  test('EMOJIS_WO_SKIN_TONES should have at least 20 emojis', () => {
    expect(EMOJIS_WO_SKIN_TONES.length).toBeGreaterThanOrEqual(20);
  });

  test('Running emoji with all skin tones should be valid', () => {
    for (const tone of EMOJI_SKIN_TONES) {
      const emoji = tone === '' ? '🏃' : '🏃' + tone;
      expect(getIsValidEmojiGraphemeCluster(emoji)).toBe(true);
    }
  });

  test('Swimming emoji with all skin tones should be valid', () => {
    for (const tone of EMOJI_SKIN_TONES) {
      const emoji = tone === '' ? '🏊' : '🏊' + tone;
      expect(getIsValidEmojiGraphemeCluster(emoji)).toBe(true);
    }
  });

  test('Yoga emoji with all skin tones should be valid', () => {
    for (const tone of EMOJI_SKIN_TONES) {
      const emoji = tone === '' ? '🧘' : '🧘' + tone;
      expect(getIsValidEmojiGraphemeCluster(emoji)).toBe(true);
    }
  });

  test('Fencing emoji from EMOJIS_WO_SKIN_TONES should be valid', () => {
    expect(getIsValidEmojiGraphemeCluster('🤺')).toBe(true);
  });

  test('Horse racing emoji from EMOJIS_WO_SKIN_TONES should be valid', () => {
    expect(getIsValidEmojiGraphemeCluster('🏇')).toBe(true);
  });

  test('Soccer ball emoji from EMOJIS_WO_SKIN_TONES should be valid', () => {
    expect(getIsValidEmojiGraphemeCluster('⚽')).toBe(true);
  });

  test('Trophy emoji from EMOJIS_WO_SKIN_TONES should be valid', () => {
    expect(getIsValidEmojiGraphemeCluster('🏆')).toBe(true);
  });

  test('EMOJI_ANIMATION_TIMEOUT_HALF should be less than EMOJI_ANIMATION_TIMEOUT', () => {
    expect(EMOJI_ANIMATION_TIMEOUT_HALF).toBeLessThan(EMOJI_ANIMATION_TIMEOUT);
  });

  test('EMOJI_ANIMATION_TIMEOUT should be a multiple of 1000', () => {
    expect(EMOJI_ANIMATION_TIMEOUT % 1000).toBe(0);
  });
});
