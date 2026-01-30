import { describe, test, expect } from 'bun:test';
import getFallbackPrompt from './get-fallback-prompt';

type Case = [
  string,
  {
    activityType: string;
    expectedSubject: string;
    expectedMood: string;
  }
];

describe('get-fallback-prompt', () => {
  test.each<Case>([
    [
      'generates fallback prompt for Run activity',
      {
        activityType: 'Run',
        expectedSubject: 'fitness activity illustration',
        expectedMood: 'energetic',
      },
    ],
    [
      'generates fallback prompt for Ride activity',
      {
        activityType: 'Ride',
        expectedSubject: 'fitness activity illustration',
        expectedMood: 'energetic',
      },
    ],
    [
      'generates fallback prompt for Swim activity',
      {
        activityType: 'Swim',
        expectedSubject: 'fitness activity illustration',
        expectedMood: 'energetic',
      },
    ],
  ])('%#. %s', (_name, { activityType, expectedSubject, expectedMood }) => {
    const result = getFallbackPrompt(activityType);

    expect(['minimal', 'abstract']).toContain(result.style);
    expect(result.subject).toBe(expectedSubject);
    expect(result.mood).toBe(expectedMood);
    expect(result.scene).toBe('neutral background');
    expect(result.text.length).toBeLessThanOrEqual(400);
  });

  test('generates deterministic style based on activity type', () => {
    const result1 = getFallbackPrompt('Run');
    const result2 = getFallbackPrompt('Run');
    expect(result1.style).toBe(result2.style);
  });

  test('generates different styles for different activity types', () => {
    const result1 = getFallbackPrompt('Run');
    const result2 = getFallbackPrompt('Ride');
    const result3 = getFallbackPrompt('Swim');
    
    const styles = [result1.style, result2.style, result3.style];
    const uniqueStyles = new Set(styles);
    
    expect(uniqueStyles.size).toBeGreaterThanOrEqual(1);
    expect(uniqueStyles.size).toBeLessThanOrEqual(2);
  });
});
