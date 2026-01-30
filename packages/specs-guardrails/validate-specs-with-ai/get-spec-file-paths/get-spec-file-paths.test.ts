import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import getSpecFilePaths from './get-spec-file-paths';

type Case = [
  string,
  {
    files: { path: string; content: string }[];
    directories: string[];
    expectedCount: number;
    expectedPaths: string[];
  }
];

describe('get-spec-file-paths', () => {
  const testState = { tempDir: '' };

  beforeEach(async () => {
    testState.tempDir = join(tmpdir(), `test-get-spec-file-paths-${Date.now()}`);
    await mkdir(testState.tempDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testState.tempDir, { recursive: true, force: true });
  });

  test.each<Case>([
    [
      'finds single spec file in root directory',
      {
        files: [
          {
            path: 'test.spec.md',
            content: 'content',
          },
        ],
        directories: [],
        expectedCount: 1,
        expectedPaths: ['test.spec.md'],
      },
    ],
    [
      'finds multiple spec files in root directory',
      {
        files: [
          {
            path: 'first.spec.md',
            content: 'first',
          },
          {
            path: 'second.spec.md',
            content: 'second',
          },
          {
            path: 'third.spec.md',
            content: 'third',
          },
        ],
        directories: [],
        expectedCount: 3,
        expectedPaths: ['first.spec.md', 'second.spec.md', 'third.spec.md'],
      },
    ],
    [
      'finds spec files in nested directories',
      {
        files: [
          {
            path: 'nested/deep/file.spec.md',
            content: 'nested',
          },
        ],
        directories: ['nested', 'nested/deep'],
        expectedCount: 1,
        expectedPaths: ['nested/deep/file.spec.md'],
      },
    ],
    [
      'finds spec files in multiple nested directories',
      {
        files: [
          {
            path: 'dir1/file1.spec.md',
            content: 'file1',
          },
          {
            path: 'dir2/file2.spec.md',
            content: 'file2',
          },
          {
            path: 'dir1/nested/file3.spec.md',
            content: 'file3',
          },
        ],
        directories: ['dir1', 'dir2', 'dir1/nested'],
        expectedCount: 3,
        expectedPaths: ['dir1/file1.spec.md', 'dir1/nested/file3.spec.md', 'dir2/file2.spec.md'],
      },
    ],
    [
      'ignores files that do not end with spec.md',
      {
        files: [
          {
            path: 'test.md',
            content: 'not spec',
          },
          {
            path: 'test.spec.txt',
            content: 'wrong extension',
          },
          {
            path: 'valid.spec.md',
            content: 'valid',
          },
        ],
        directories: [],
        expectedCount: 1,
        expectedPaths: ['valid.spec.md'],
      },
    ],
    [
      'returns empty array when no spec files exist',
      {
        files: [
          {
            path: 'regular.md',
            content: 'not spec',
          },
          {
            path: 'text.txt',
            content: 'text',
          },
        ],
        directories: [],
        expectedCount: 0,
        expectedPaths: [],
      },
    ],
    [
      'returns sorted paths alphabetically',
      {
        files: [
          {
            path: 'zebra.spec.md',
            content: 'z',
          },
          {
            path: 'apple.spec.md',
            content: 'a',
          },
          {
            path: 'banana.spec.md',
            content: 'b',
          },
        ],
        directories: [],
        expectedCount: 3,
        expectedPaths: ['apple.spec.md', 'banana.spec.md', 'zebra.spec.md'],
      },
    ],
    [
      'handles deeply nested directory structures',
      {
        files: [
          {
            path: 'level1/level2/level3/level4/file.spec.md',
            content: 'deep',
          },
        ],
        directories: ['level1', 'level1/level2', 'level1/level2/level3', 'level1/level2/level3/level4'],
        expectedCount: 1,
        expectedPaths: ['level1/level2/level3/level4/file.spec.md'],
      },
    ],
    [
      'finds spec files in root and nested directories together',
      {
        files: [
          {
            path: 'root.spec.md',
            content: 'root',
          },
          {
            path: 'nested/file.spec.md',
            content: 'nested',
          },
        ],
        directories: ['nested'],
        expectedCount: 2,
        expectedPaths: ['nested/file.spec.md', 'root.spec.md'],
      },
    ],
    [
      'handles empty directory',
      {
        files: [],
        directories: [],
        expectedCount: 0,
        expectedPaths: [],
      },
    ],
    [
      'handles directory with only subdirectories and no files',
      {
        files: [],
        directories: ['subdir1', 'subdir2'],
        expectedCount: 0,
        expectedPaths: [],
      },
    ],
    [
      'handles files with same name in different directories',
      {
        files: [
          {
            path: 'dir1/same.spec.md',
            content: 'dir1',
          },
          {
            path: 'dir2/same.spec.md',
            content: 'dir2',
          },
        ],
        directories: ['dir1', 'dir2'],
        expectedCount: 2,
        expectedPaths: ['dir1/same.spec.md', 'dir2/same.spec.md'],
      },
    ],
  ])('%#. %s', async (_name, { files, directories, expectedCount, expectedPaths }) => {
    for (const dir of directories) {
      await mkdir(join(testState.tempDir, dir), { recursive: true });
    }

    for (const file of files) {
      await writeFile(join(testState.tempDir, file.path), file.content);
    }

    const result = await getSpecFilePaths(testState.tempDir);

    expect(result.length).toStrictEqual(expectedCount);

    if (expectedPaths.length > 0) {
      const relativePaths = result.map((path) => path.replace(testState.tempDir + '/', ''));
      for (const expectedPath of expectedPaths) {
        expect(relativePaths).toContain(expectedPath);
      }
    }
  });

  test('returns absolute paths', async () => {
    const specFile = join(testState.tempDir, 'test.spec.md');
    await writeFile(specFile, 'content');

    const result = await getSpecFilePaths(testState.tempDir);

    expect(result[0]).toContain(testState.tempDir);
    expect(result[0]).toContain('test.spec.md');
  });

  test('sorts paths correctly with different directory depths', async () => {
    await mkdir(join(testState.tempDir, 'a'), { recursive: true });
    await mkdir(join(testState.tempDir, 'z'), { recursive: true });
    await writeFile(join(testState.tempDir, 'z', 'file.spec.md'), 'z');
    await writeFile(join(testState.tempDir, 'a', 'file.spec.md'), 'a');

    const result = await getSpecFilePaths(testState.tempDir);

    expect(result.length).toStrictEqual(2);
    expect(result[0]).toContain('a/file.spec.md');
    expect(result[1]).toContain('z/file.spec.md');
  });
});
