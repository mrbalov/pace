import { describe, test, expect } from 'bun:test';
import simplifyPrompt from './simplify-prompt';
import { StravaActivityImagePrompt } from '../../types';
import { CONFIG } from '../../constants';

type Case = [
  string,
  {
    prompt: StravaActivityImagePrompt;
    retryLevel: number;
    expectedText: string;
    expectedScene: string;
    expectedMood: string;
  },
];

describe('simplify-prompt', () => {
  test.each<Case>([
    [
      'simplifies prompt at level 1 by removing scene',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner in park',
          scene: 'sunny morning with trees',
          text: 'cartoon style, runner in park, energetic mood, sunny morning with trees',
        },
        retryLevel: 1,
        expectedText: 'cartoon style, energetic mood, runner in park',
        expectedScene: '',
        expectedMood: 'energetic',
      },
    ],
    [
      'simplifies prompt at level 2 by keeping only style and basic subject',
      {
        prompt: {
          style: 'minimal',
          mood: 'calm',
          subject: 'cyclist on road, mountain view',
          scene: 'evening sunset',
          text: 'minimal style, cyclist on road, mountain view, calm mood, evening sunset',
        },
        retryLevel: 2,
        expectedText: 'minimal style, cyclist on road',
        expectedScene: '',
        expectedMood: '',
      },
    ],
    [
      'truncates simplified text if exceeds 600 characters',
      {
        prompt: {
          style: 'abstract',
          mood: 'very energetic and dynamic',
          subject: 'a'.repeat(600),
          scene: 'complex scene',
          text: 'a'.repeat(500),
        },
        retryLevel: 1,
        expectedText:
          'abstract style, very energetic and dynamic mood, ' +
          'a'.repeat(600 - 'abstract style, very energetic and dynamic mood, '.length),
        expectedScene: '',
        expectedMood: 'very energetic and dynamic',
      },
    ],
  ])('%#. %s', (_name, { prompt, retryLevel, expectedText, expectedScene, expectedMood }) => {
    const result = simplifyPrompt(prompt, retryLevel);

    expect(result.style).toBe(prompt.style);
    expect(result.scene).toBe(expectedScene);
    expect(result.mood).toBe(expectedMood);

    if (typeof expectedText === 'string' && expectedText.length <= CONFIG.MAX_PROMPT_LENGTH) {
      expect(result.text).toBe(expectedText);
    } else {
      expect(result.text.length).toBeLessThanOrEqual(CONFIG.MAX_PROMPT_LENGTH);
    }
  });
});
