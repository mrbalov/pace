import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'os';
import generateImage from './generate-image';
import { StravaActivityImagePrompt } from '../types';

type Case = [
  string,
  {
    prompt: StravaActivityImagePrompt;
    saveDirectory: string;
    baseUrl: string;
    dialKey: string;
    fetchResponses: any[];
    shouldThrow: boolean;
    expectedError?: string;
    expectedUsedFallback: boolean;
    expectedRetriesPerformed: number;
  }
];

describe('generate-image', () => {
  const testState = { 
    originalEnv: process.env.DIAL_KEY,
    originalImageProvider: process.env.IMAGE_PROVIDER,
    originalFetch: global.fetch,
    testDir: join(tmpdir(), `test-images-${Date.now()}`),
  };

  beforeEach(async () => {
    testState.originalEnv = process.env.DIAL_KEY;
    testState.originalImageProvider = process.env.IMAGE_PROVIDER;
    testState.originalFetch = global.fetch;
    await mkdir(testState.testDir, { recursive: true });
  });

  afterEach(async () => {
    if (testState.originalEnv !== undefined) {
      process.env.DIAL_KEY = testState.originalEnv;
    } else {
      delete process.env.DIAL_KEY;
    }
    if (testState.originalImageProvider !== undefined) {
      process.env.IMAGE_PROVIDER = testState.originalImageProvider;
    } else {
      delete process.env.IMAGE_PROVIDER;
    }
    global.fetch = testState.originalFetch;
    try {
      await rm(testState.testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  test.each<Case>([
    [
      'throws error when DIAL_KEY is not set for dial provider',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: '',
        fetchResponses: [],
        shouldThrow: true,
        expectedError: 'DIAL_KEY is not set',
        expectedUsedFallback: false,
        expectedRetriesPerformed: 0,
      },
    ],
    [
      'successfully generates image on first attempt',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        fetchResponses: [
          {
            choices: [
              {
                message: {
                  custom_content: {
                    attachments: [
                      {
                        type: 'image/png',
                        url: 'files/test/image.png',
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            ok: true,
            arrayBuffer: async () => new TextEncoder().encode('fake-image').buffer,
            statusText: 'OK',
          },
        ],
        shouldThrow: false,
        expectedUsedFallback: false,
        expectedRetriesPerformed: 0,
      },
    ],
    [
      'retries with simplified prompt on failure',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        fetchResponses: [
          {
            error: { message: 'First attempt failed' },
          },
          {
            choices: [
              {
                message: {
                  custom_content: {
                    attachments: [
                      {
                        type: 'image/png',
                        url: 'files/test/image2.png',
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            ok: true,
            arrayBuffer: async () => new TextEncoder().encode('fake-image').buffer,
            statusText: 'OK',
          },
        ],
        shouldThrow: false,
        expectedUsedFallback: false,
        expectedRetriesPerformed: 0,
      },
    ],
    [
      'uses fallback after max retries',
      {
        prompt: {
          style: 'cartoon',
          mood: 'energetic',
          subject: 'runner',
          scene: 'park',
          text: 'cartoon style, runner, energetic mood, park',
        },
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        fetchResponses: [
          {
            error: { message: 'First attempt failed' },
          },
          {
            error: { message: 'Second attempt failed' },
          },
          {
            error: { message: 'Third attempt failed' },
          },
          {
            choices: [
              {
                message: {
                  custom_content: {
                    attachments: [
                      {
                        type: 'image/png',
                        url: 'files/test/fallback.png',
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            ok: true,
            arrayBuffer: async () => new TextEncoder().encode('fake-fallback-image').buffer,
            statusText: 'OK',
          },
        ],
        shouldThrow: false,
        expectedUsedFallback: true,
        expectedRetriesPerformed: 2,
      },
    ],
  ])(
    '%#. %s',
    async (
      _name,
      {
        prompt,
        saveDirectory,
        baseUrl,
        dialKey,
        fetchResponses,
        shouldThrow,
        expectedError,
        expectedUsedFallback,
        expectedRetriesPerformed,
      }
    ) => {
      // Set provider based on test case
      if (dialKey) {
        process.env.IMAGE_PROVIDER = 'dial';
        process.env.DIAL_KEY = dialKey;
      } else {
        // Default to pollinations if no dialKey
        delete process.env.IMAGE_PROVIDER;
        delete process.env.DIAL_KEY;
      }

      let callCount = 0;
      global.fetch = mock((url: RequestInfo | URL) => {
        const response = fetchResponses[callCount] ?? fetchResponses[fetchResponses.length - 1];
        callCount++;
        const urlString = typeof url === 'string' ? url : url.toString();
        
        // Handle DIAL provider responses
        if (urlString.includes('ai-proxy.lab.epam.com') && !urlString.includes('chat/completions')) {
          return Promise.resolve({
            ok: true,
            arrayBuffer: async () => new TextEncoder().encode('fake-image').buffer,
            statusText: 'OK',
          } as Response);
        }
        
        // Handle Pollinations provider responses (default)
        if (urlString.includes('pollinations.ai')) {
          return Promise.resolve({
            ok: true,
            arrayBuffer: async () => new TextEncoder().encode('fake-image').buffer,
            statusText: 'OK',
          } as Response);
        }
        
        // Handle DIAL API JSON responses
        return Promise.resolve({
          json: async () => response,
        } as Response);
      });

      if (shouldThrow) {
        await expect(generateImage({ prompt }, saveDirectory, baseUrl)).rejects.toThrow(expectedError);
      } else {
        const result = await generateImage({ prompt }, saveDirectory, baseUrl);
        expect(result.usedFallback).toBe(expectedUsedFallback);
        expect(result.retriesPerformed).toBe(expectedRetriesPerformed);
        expect(result.imageUrl).toBeTruthy();
        expect(typeof result.imageUrl).toBe('string');
        expect(result.imageUrl).toMatch(new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/images/[a-f0-9-]+`));
      }
    }
  );

  test('throws error when prompt text exceeds 400 characters', async () => {
    delete process.env.IMAGE_PROVIDER; // Use default (pollinations)

    const longPrompt: StravaActivityImagePrompt = {
      style: 'cartoon',
      mood: 'energetic',
      subject: 'runner',
      scene: 'park',
      text: 'a'.repeat(401),
    };

    await expect(generateImage({ prompt: longPrompt }, testState.testDir, 'http://localhost:3000')).rejects.toThrow('exceeds 400 character limit');
  });

  test('uses Pollinations provider by default', async () => {
    delete process.env.IMAGE_PROVIDER;
    delete process.env.DIAL_KEY;

    const mockImageBuffer = new TextEncoder().encode('fake-image-data').buffer;
    const mockFetch = mock(() => 
      Promise.resolve({
        ok: true,
        arrayBuffer: async () => mockImageBuffer,
      } as Response)
    );
    global.fetch = mockFetch as any;

    const prompt: StravaActivityImagePrompt = {
      style: 'cartoon',
      mood: 'energetic',
      subject: 'runner',
      scene: 'park',
      text: 'cartoon style, runner, energetic mood, park',
    };

    const result = await generateImage({ prompt }, testState.testDir, 'http://localhost:3000');
    
    expect(result.imageUrl).toMatch(/^http:\/\/localhost:3000\/images\/[a-f0-9-]+$/);
    expect(mockFetch).toHaveBeenCalled();
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('pollinations.ai');
  });
});
