import { describe, test, expect } from 'bun:test';

import validateActivityImagePrompt from './validate-prompt';
import { PromptValidationResult } from './types';

type Case = [
  string,
  string,
  PromptValidationResult,
];

describe('validate-prompt', () => {
  test.each<Case>([
    [
      'valid prompt within length limit',
      'cartoon style, runner, calm mood, outdoor setting',
      {
        valid: true,
        errors: [],
      },
    ],
    [
      'prompt exceeding length limit',
      'a'.repeat(1001),
      {
        valid: false,
        errors: ['Prompt length (1001) exceeds maximum (1000)'],
      },
    ],
    [
      'empty prompt is rejected',
      '',
      {
        valid: false,
        errors: ['Text is required and must be a non-empty string'],
      },
    ],
    [
      'prompt with forbidden content is rejected',
      'cartoon style, forbidden political rally, outdoor setting',
      {
        valid: false,
        errors: ['Prompt contains forbidden content'],
      },
    ],
    [
      'valid prompt with allowed style keywords',
      'minimal style, cyclist, focused mood, simple setting',
      {
        valid: true,
        errors: [],
      },
    ],
  ])('%#. %s', (_name, prompt, expected) => {
    const result = validateActivityImagePrompt(
      prompt,
      (input) => input.includes('forbidden'),
    );

    expect(result).toStrictEqual(expected);
  });
});
