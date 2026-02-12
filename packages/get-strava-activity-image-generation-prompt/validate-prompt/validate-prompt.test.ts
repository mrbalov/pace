import { describe, test, expect } from 'bun:test';

import validateActivityImagePrompt from './validate-prompt';
import { StravaActivityImagePrompt } from '../types';

type Case = [
  string,
  {
    prompt: StravaActivityImagePrompt;
    expectedValid: boolean;
    expectedErrors?: string[];
  },
];

describe('validate-prompt', () => {
  test.each<Case>([
    [
      'valid prompt within length limit',
      {
        prompt: {
          style: 'cartoon',
          mood: 'calm',
          subject: 'runner',
          scene: 'outdoor setting',
          text: 'cartoon style, runner, calm mood, outdoor setting',
        },
        expectedValid: true,
        expectedErrors: [],
      },
    ],
    [
      'prompt exceeding length limit',
      {
        prompt: {
          style: 'cartoon',
          mood: 'calm',
          subject: 'runner',
          scene: 'outdoor setting',
          text: 'a'.repeat(700),
        },
        expectedValid: false,
        expectedErrors: [`Prompt length (700) exceeds maximum (600)`],
      },
    ],
    [
      'prompt with invalid style',
      {
        prompt: {
          style: 'photorealistic' as 'cartoon',
          mood: 'calm',
          subject: 'runner',
          scene: 'outdoor setting',
          text: 'photorealistic style, runner, calm mood, outdoor setting',
        },
        expectedValid: false,
        expectedErrors: ['Style must be one of: cartoon, minimal, abstract, illustrated'],
      },
    ],
    [
      'prompt missing mood',
      {
        prompt: {
          style: 'cartoon',
          mood: '' as string,
          subject: 'runner',
          scene: 'outdoor setting',
          text: 'cartoon style, runner, calm mood, outdoor setting',
        },
        expectedValid: false,
        expectedErrors: ['Mood is required and must be a string'],
      },
    ],
    [
      'prompt with allowed style',
      {
        prompt: {
          style: 'minimal',
          mood: 'focused',
          subject: 'cyclist',
          scene: 'simple setting',
          text: 'minimal style, cyclist, focused mood, simple setting',
        },
        expectedValid: true,
        expectedErrors: [],
      },
    ],
  ])('%s', (_name, { prompt, expectedValid, expectedErrors }) => {
    const result = validateActivityImagePrompt(prompt);

    expect(result.valid).toBe(expectedValid);

    if (expectedErrors !== undefined) {
      expect(result.errors).toStrictEqual(expectedErrors);
    }
  });
});
