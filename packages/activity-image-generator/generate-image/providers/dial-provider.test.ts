import { test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'os';
import dialProvider from './dial-provider';
import { DialImageResponse } from '../../ask-dial-for-image/types';

describe('dial-provider', () => {
  const testState = {
    originalEnv: process.env.DIAL_KEY,
    originalFetch: global.fetch,
    testDir: join(tmpdir(), `test-dial-${Date.now()}`),
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

  test('dialProvider throws error when DIAL_KEY is not set', async () => {
    delete process.env.DIAL_KEY;
    
    await expect(
      dialProvider.generateImage(
        'test prompt',
        testState.testDir,
        'http://localhost:3000'
      )
    ).rejects.toThrow('DIAL_KEY is not set');
  });

  test('dialProvider generates image successfully', async () => {
    process.env.DIAL_KEY = 'test-key';
    
    const mockImageBuffer = new TextEncoder().encode('fake-image-data').buffer;
    
    const dialResponse: DialImageResponse = {
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
    };
    
    let callCount = 0;
    const mockFetch = mock((url: RequestInfo | URL) => {
      const urlString = typeof url === 'string' ? url : url.toString();
      
      // First call: DIAL API request
      if (urlString.includes('chat/completions')) {
        callCount++;
        return Promise.resolve({
          json: async () => dialResponse,
        } as Response);
      }
      
      // Second call: Download image
      if (urlString.includes('ai-proxy.lab.epam.com')) {
        callCount++;
        return Promise.resolve({
          ok: true,
          arrayBuffer: async () => mockImageBuffer,
        } as Response);
      }
      
      return Promise.reject(new Error('Unexpected URL'));
    });
    
    global.fetch = mockFetch as any;
    
    const imageUrl = await dialProvider.generateImage(
      'test prompt',
      testState.testDir,
      'http://localhost:3000'
    );
    
    expect(imageUrl).toMatch(/^http:\/\/localhost:3000\/images\/[a-f0-9-]+$/);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test('dialProvider throws error on DIAL API error response', async () => {
    process.env.DIAL_KEY = 'test-key';
    
    const errorResponse: DialImageResponse = {
      error: {
        message: 'API error occurred',
      },
    };
    
    const mockFetch = mock(() => 
      Promise.resolve({
        json: async () => errorResponse,
      } as Response)
    );
    
    global.fetch = mockFetch as any;
    
    await expect(
      dialProvider.generateImage(
        'test prompt',
        testState.testDir,
        'http://localhost:3000'
      )
    ).rejects.toThrow('API error occurred');
  });
});
