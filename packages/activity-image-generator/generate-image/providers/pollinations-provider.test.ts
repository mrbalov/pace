import { test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'os';
import pollinationsProvider from './pollinations-provider';

describe('pollinations-provider', () => {
  const testState = {
    originalFetch: global.fetch,
    testDir: join(tmpdir(), `test-pollinations-${Date.now()}`),
  };

  beforeEach(async () => {
    testState.originalFetch = global.fetch;
    await mkdir(testState.testDir, { recursive: true });
  });

  afterEach(async () => {
    global.fetch = testState.originalFetch;
    try {
      await rm(testState.testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  test('pollinationsProvider generates image with correct URL format', async () => {
    const mockImageBuffer = new TextEncoder().encode('fake-image-data').buffer;
    
    const mockFetch = mock(() => 
      Promise.resolve({
        ok: true,
        arrayBuffer: async () => mockImageBuffer,
        statusText: 'OK',
      } as Response)
    );
    global.fetch = mockFetch as any;
    
    const imageUrl = await pollinationsProvider.generateImage(
      'test prompt',
      testState.testDir,
      'http://localhost:3000',
      { size: '1024x1024' }
    );
    
    expect(imageUrl).toMatch(/^http:\/\/localhost:3000\/images\/[a-f0-9-]+$/);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('pollinations.ai');
    expect(fetchUrl).toContain('width=1024');
    expect(fetchUrl).toContain('height=1024');
    expect(fetchUrl).toContain('model=flux');
    expect(fetchUrl).toContain('nologo=true');
  });

  test('pollinationsProvider handles different sizes', async () => {
    const mockImageBuffer = new TextEncoder().encode('fake-image-data').buffer;
    
    const mockFetch = mock(() => 
      Promise.resolve({
        ok: true,
        arrayBuffer: async () => mockImageBuffer,
      } as Response)
    );
    global.fetch = mockFetch as any;
    
    await pollinationsProvider.generateImage(
      'test prompt',
      testState.testDir,
      'http://localhost:3000',
      { size: '1792x1024' }
    );
    
    const fetchUrl = mockFetch.mock.calls[0][0];
    expect(fetchUrl).toContain('width=1792');
    expect(fetchUrl).toContain('height=1024');
  });

  test('pollinationsProvider throws error on API failure', async () => {
    const mockFetch = mock(() => 
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)
    );
    global.fetch = mockFetch as any;
    
    await expect(
      pollinationsProvider.generateImage(
        'test prompt',
        testState.testDir,
        'http://localhost:3000'
      )
    ).rejects.toThrow('Pollinations API error: Internal Server Error');
  });

  test('pollinationsProvider uses storeImage function when provided', async () => {
    const mockImageBuffer = new TextEncoder().encode('fake-image-data').buffer;
    const mockStoreImage = mock(async () => {});
    
    const mockFetch = mock(() => 
      Promise.resolve({
        ok: true,
        arrayBuffer: async () => mockImageBuffer,
      } as Response)
    );
    global.fetch = mockFetch as any;
    
    await pollinationsProvider.generateImage(
      'test prompt',
      testState.testDir,
      'http://localhost:3000',
      { storeImage: mockStoreImage }
    );
    
    expect(mockStoreImage).toHaveBeenCalledTimes(1);
    const [key, buffer, metadata] = mockStoreImage.mock.calls[0];
    expect(key).toMatch(/^[a-f0-9-]+$/);
    expect(buffer).toBe(mockImageBuffer);
    expect(metadata.filename).toMatch(/^[a-f0-9-]+\.png$/);
    expect(metadata.contentType).toBe('image/png');
  });
});
