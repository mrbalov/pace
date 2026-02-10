import { describe, test, expect } from 'bun:test';
import generatePrompt from './create-image-generation-prompt';
import { StravaActivitySignals } from '../types';
import { validateActivityImagePrompt } from '../guardrails';

describe('generate-prompt', () => {
  test('generates valid prompt from signals', () => {
    const signals: StravaActivitySignals = {
      activityType: 'Run',
      intensity: 'medium',
      elevation: 'flat',
      timeOfDay: 'day',
      tags: [],
    };

    const prompt = generatePrompt(signals);

    expect(prompt.style).toBeDefined();
    expect(prompt.mood).toBeDefined();
    expect(prompt.subject).toBeDefined();
    expect(prompt.scene).toBeDefined();
    expect(prompt.text.length).toBeLessThanOrEqual(600);

    // Validate the prompt
    const validation = validateActivityImagePrompt(prompt);
    expect(validation.valid).toBe(true);
  });

  test('generates prompt with recovery tag', () => {
    const signals: StravaActivitySignals = {
      activityType: 'Run',
      intensity: 'low',
      elevation: 'flat',
      timeOfDay: 'day',
      tags: ['recovery'],
    };

    const prompt = generatePrompt(signals);

    expect(prompt.style).toBe('minimal');
    expect(prompt.mood).toBe('calm');
  });

  test('generates prompt with high intensity', () => {
    const signals: StravaActivitySignals = {
      activityType: 'Run',
      intensity: 'high',
      elevation: 'flat',
      timeOfDay: 'day',
      tags: [],
    };

    const prompt = generatePrompt(signals);

    expect(prompt.style).toBe('illustrated');
    expect(prompt.mood).toBe('intense');
  });
});
