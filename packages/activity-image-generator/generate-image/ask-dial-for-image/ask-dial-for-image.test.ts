import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'os';
import askDialForImage from './ask-dial-for-image';

type Case = [
  string,
  {
    prompt: string;
    saveDirectory: string;
    baseUrl: string;
    dialKey: string;
    responseBody: any;
    downloadResponseBody?: ArrayBuffer;
    shouldThrow: boolean;
    expectedError?: string;
    expectedResultPattern?: RegExp;
  }
];

describe('ask-dial-for-image', () => {
  const testState = { 
    originalEnv: process.env.DIAL_KEY, 
    originalFetch: global.fetch,
    testDir: join(tmpdir(), `test-images-${Date.now()}`),
  };

  beforeEach(async () => {
    testState.originalEnv = process.env.DIAL_KEY;
    testState.originalFetch = global.fetch;
    await mkdir(testState.testDir, { recursive: true });
  });

  afterEach(async () => {
    if (testState.originalEnv !== undefined) {
      process.env.DIAL_KEY = testState.originalEnv;
    } else {
      delete process.env.DIAL_KEY;
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
      'throws error when DIAL_KEY environment variable is not set',
      {
        prompt: 'A cartoon runner',
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: '',
        responseBody: {},
        shouldThrow: true,
        expectedError: 'DIAL_KEY is not set',
      },
    ],
    [
      'saves image and returns full URL from successful response with relative URL',
      {
        prompt: 'A cartoon runner',
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [
                    {
                      type: 'image/png',
                      title: 'Image',
                      url: 'files/test/image.png',
                    },
                  ],
                },
              },
            },
          ],
        },
        downloadResponseBody: new TextEncoder().encode('fake-image-data').buffer,
        shouldThrow: false,
        expectedResultPattern: /^http:\/\/localhost:3000\/images\/[a-f0-9-]+\.png$/,
      },
    ],
    [
      'saves image and returns full URL from successful response with absolute URL',
      {
        prompt: 'A cartoon runner',
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [
                    {
                      type: 'image/png',
                      title: 'Image',
                      url: 'https://example.com/image.png',
                    },
                  ],
                },
              },
            },
          ],
        },
        downloadResponseBody: new TextEncoder().encode('fake-image-data').buffer,
        shouldThrow: false,
        expectedResultPattern: /^http:\/\/localhost:3000\/images\/[a-f0-9-]+\.png$/,
      },
    ],
    [
      'throws error when API returns error response',
      {
        prompt: 'A cartoon runner',
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        responseBody: {
          error: {
            message: 'Invalid request',
          },
        },
        shouldThrow: true,
        expectedError: 'Invalid request',
      },
    ],
    [
      'throws error when no image attachment in response',
      {
        prompt: 'A cartoon runner',
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [],
                },
              },
            },
          ],
        },
        shouldThrow: true,
        expectedError: 'No image attachment in DIAL response.',
      },
    ],
    [
      'throws error when image attachment has no URL',
      {
        prompt: 'A cartoon runner',
        saveDirectory: testState.testDir,
        baseUrl: 'http://localhost:3000',
        dialKey: 'test-key',
        responseBody: {
          choices: [
            {
              message: {
                custom_content: {
                  attachments: [
                    {
                      type: 'image/png',
                      title: 'Image',
                    },
                  ],
                },
              },
            },
          ],
        },
        shouldThrow: true,
        expectedError: 'No image URL in DIAL response attachment.',
      },
    ],
  ])('%#. %s', async (_name, { prompt, saveDirectory, baseUrl, dialKey, responseBody, downloadResponseBody, shouldThrow, expectedError, expectedResultPattern }) => {
    if (dialKey) {
      process.env.DIAL_KEY = dialKey;
    } else {
      delete process.env.DIAL_KEY;
    }

    let callCount = 0;
    global.fetch = mock((url: RequestInfo | URL) => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          json: async () => responseBody,
        } as Response);
      } else {
        const urlString = typeof url === 'string' ? url : url.toString();
        if (urlString.includes('ai-proxy.lab.epam.com') || urlString.includes('example.com')) {
          return Promise.resolve({
            ok: true,
            arrayBuffer: async () => downloadResponseBody ?? new ArrayBuffer(0),
            statusText: 'OK',
          } as Response);
        }
        return Promise.resolve({
          json: async () => responseBody,
        } as Response);
      }
    });

    if (shouldThrow) {
      await expect(askDialForImage(prompt, saveDirectory, baseUrl)).rejects.toThrow(expectedError);
    } else {
      const result = await askDialForImage(prompt, saveDirectory, baseUrl);
      if (expectedResultPattern) {
        expect(result).toMatch(expectedResultPattern);
      }
    }
  });

  test('sends correct request to DIAL API and downloads image', async () => {
    const originalKey = process.env.DIAL_KEY;
    process.env.DIAL_KEY = 'test-key';

    let callCount = 0;
    const mockFetch = mock((url: RequestInfo | URL) => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          json: async () => ({
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
          }),
        } as Response);
      } else {
        return Promise.resolve({
          ok: true,
          arrayBuffer: async () => new TextEncoder().encode('fake-image').buffer,
          statusText: 'OK',
        } as Response);
      }
    });

    global.fetch = mockFetch;

    await askDialForImage('A cartoon runner', testState.testDir, 'http://localhost:3000');

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const firstCallArgs = mockFetch.mock.calls[0];
    expect(firstCallArgs[0]).toContain('dall-e-3');
    expect(firstCallArgs[0]).toContain('chat/completions');
    expect(firstCallArgs[1]?.method).toBe('POST');
    expect(firstCallArgs[1]?.headers?.['Api-Key']).toBe('test-key');
    
    const secondCallArgs = mockFetch.mock.calls[1];
    expect(secondCallArgs[0]).toContain('ai-proxy.lab.epam.com');
    expect(secondCallArgs[1]?.headers?.['Api-Key']).toBe('test-key');

    if (originalKey !== undefined) {
      process.env.DIAL_KEY = originalKey;
    } else {
      delete process.env.DIAL_KEY;
    }
  });
});
