import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Output } from './types';

type Case = [
  string,
  {
    rootDir?: string;
    specFilePaths?: string[];
    systemPrompt: string;
    userPrompt: string;
    shouldThrow: boolean;
    expectedError?: string;
  },
];

describe('validate-specs-with-ai', () => {
  const testState = { tempDir: '' };

  beforeEach(async () => {
    testState.tempDir = join(tmpdir(), `test-validate-specs-with-ai-${Date.now()}`);
    await mkdir(testState.tempDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testState.tempDir, { recursive: true, force: true });
  });

  test.each<Case>([
    [
      'throws error when neither rootDir nor specFilePaths provided',
      {
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: true,
        expectedError: 'Either rootDir or specFilePaths must be provided',
      },
    ],
    [
      'throws error when both rootDir and specFilePaths provided',
      {
        rootDir: '/some/path',
        specFilePaths: ['/spec1.md'],
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: true,
        expectedError: 'Only one of rootDir or specFilePaths can be provided, not both',
      },
    ],
    [
      'accepts rootDir when provided alone',
      {
        rootDir: '/some/path',
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: false,
      },
    ],
    [
      'accepts specFilePaths when provided alone',
      {
        specFilePaths: ['/spec1.md', '/spec2.md'],
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: false,
      },
    ],
    [
      'handles empty specFilePaths array',
      {
        specFilePaths: [],
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: false,
      },
    ],
    [
      'handles single spec file path',
      {
        specFilePaths: ['/single.spec.md'],
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: false,
      },
    ],
    [
      'handles multiple spec file paths',
      {
        specFilePaths: ['/spec1.md', '/spec2.md', '/spec3.md'],
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: false,
      },
    ],
    [
      'handles empty system prompt',
      {
        specFilePaths: ['/spec.md'],
        systemPrompt: '',
        userPrompt: 'User prompt',
        shouldThrow: false,
      },
    ],
    [
      'handles empty user prompt',
      {
        specFilePaths: ['/spec.md'],
        systemPrompt: 'System prompt',
        userPrompt: '',
        shouldThrow: false,
      },
    ],
    [
      'handles very long prompts',
      {
        specFilePaths: ['/spec.md'],
        systemPrompt: 'A'.repeat(10000),
        userPrompt: 'B'.repeat(10000),
        shouldThrow: false,
      },
    ],
    [
      'handles prompts with special characters',
      {
        specFilePaths: ['/spec.md'],
        systemPrompt: 'System @#$%^&*() prompt',
        userPrompt: 'User 测试 🚀 prompt',
        shouldThrow: false,
      },
    ],
    [
      'handles rootDir with trailing slash',
      {
        rootDir: '/path/to/',
        systemPrompt: 'System prompt',
        userPrompt: 'User prompt',
        shouldThrow: false,
      },
    ],
  ])(
    '%#. %s',
    async (
      _name,
      { rootDir, specFilePaths, systemPrompt, userPrompt, shouldThrow, expectedError },
    ) => {
      const mockGetSpecFilePaths = mock(() =>
        Promise.resolve(['/mock1.spec.md', '/mock2.spec.md']),
      );
      const mockBuildUserPrompt = mock(() => Promise.resolve('Built prompt'));
      const mockAskDial = mock(() =>
        Promise.resolve({
          validated_scope: 'FULL_SPECIFICATION_SET',
          result: 'VALID',
          spec_count: 2,
        } as Output),
      );

      // Use mock.module to mock ES modules
      void mock.module('./get-spec-file-paths', () => ({
        default: mockGetSpecFilePaths,
      }));

      void mock.module('./build-user-prompt', () => ({
        default: mockBuildUserPrompt,
      }));

      void mock.module('./ask-dial', () => ({
        default: mockAskDial,
      }));

      // Re-import the function to get the mocked version
      const { default: validateSpecsWithAI } = await import('./validate-specs-with-ai');

      if (shouldThrow) {
        expect(
          validateSpecsWithAI(systemPrompt, userPrompt, rootDir, specFilePaths),
        ).rejects.toThrow(expectedError);
      } else {
        const result = await validateSpecsWithAI(systemPrompt, userPrompt, rootDir, specFilePaths);

        expect(result).toBeDefined();
        if (rootDir) {
          expect(mockGetSpecFilePaths).toHaveBeenCalledWith(rootDir);
        }
        if (specFilePaths) {
          expect(mockBuildUserPrompt).toHaveBeenCalledWith(specFilePaths, userPrompt);
        }
      }
    },
  );

  test('calls getSpecFilePaths when rootDir is provided', async () => {
    const mockGetSpecFilePaths = mock(() => Promise.resolve(['/mock.spec.md']));
    const mockBuildUserPrompt = mock(() => Promise.resolve('Built prompt'));
    const mockAskDial = mock(() => Promise.resolve({} as Output));

    void mock.module('./get-spec-file-paths', () => ({
      default: mockGetSpecFilePaths,
    }));

    void mock.module('./build-user-prompt', () => ({
      default: mockBuildUserPrompt,
    }));

    void mock.module('./ask-dial', () => ({
      default: mockAskDial,
    }));

    const { default: validateSpecsWithAI } = await import('./validate-specs-with-ai');

    await validateSpecsWithAI('System', 'User', '/test/path');

    expect(mockGetSpecFilePaths).toHaveBeenCalledWith('/test/path');
    expect(mockBuildUserPrompt).toHaveBeenCalled();
    expect(mockAskDial).toHaveBeenCalled();
  });

  test('uses provided specFilePaths directly when rootDir is not provided', async () => {
    const mockBuildUserPrompt = mock(() => Promise.resolve('Built prompt'));
    const mockAskDial = mock(() => Promise.resolve({} as Output));

    void mock.module('./build-user-prompt', () => ({
      default: mockBuildUserPrompt,
    }));

    void mock.module('./ask-dial', () => ({
      default: mockAskDial,
    }));

    const { default: validateSpecsWithAI } = await import('./validate-specs-with-ai');

    const specPaths = ['/spec1.md', '/spec2.md'];
    await validateSpecsWithAI('System', 'User', undefined, specPaths);

    expect(mockBuildUserPrompt).toHaveBeenCalledWith(specPaths, 'User');
    expect(mockAskDial).toHaveBeenCalled();
  });
});
