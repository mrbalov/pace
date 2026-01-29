import { test, expect, beforeEach, afterEach } from 'bun:test';
import getProvider from './get-provider';
import pollinationsProvider from './pollinations-provider';
import dialProvider from './dial-provider';

describe('get-provider', () => {
  const testState = {
    originalEnv: process.env.IMAGE_PROVIDER,
  };

  beforeEach(() => {
    testState.originalEnv = process.env.IMAGE_PROVIDER;
  });

  afterEach(() => {
    if (testState.originalEnv !== undefined) {
      process.env.IMAGE_PROVIDER = testState.originalEnv;
    } else {
      delete process.env.IMAGE_PROVIDER;
    }
  });

  test('getProvider returns pollinations by default', () => {
    delete process.env.IMAGE_PROVIDER;
    const provider = getProvider();
    expect(provider).toBe(pollinationsProvider);
  });

  test('getProvider returns pollinations when IMAGE_PROVIDER=pollinations', () => {
    process.env.IMAGE_PROVIDER = 'pollinations';
    const provider = getProvider();
    expect(provider).toBe(pollinationsProvider);
  });

  test('getProvider returns dial when IMAGE_PROVIDER=dial', () => {
    process.env.IMAGE_PROVIDER = 'dial';
    const provider = getProvider();
    expect(provider).toBe(dialProvider);
  });

  test('getProvider throws on invalid provider', () => {
    process.env.IMAGE_PROVIDER = 'invalid';
    expect(() => getProvider()).toThrow('Unknown IMAGE_PROVIDER: invalid');
  });
});
