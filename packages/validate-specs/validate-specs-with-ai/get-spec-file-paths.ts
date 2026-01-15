#!/usr/bin/env bun

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const getSpecFilePaths = async (rootDir: string): Promise<string[]> => {
  const result: string[] = [];
  const walk = async (dir: string) => {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('spec.md')) {
        result.push(fullPath);
      }
    }
  };

  await walk(rootDir);

  return result.sort();
};

export default getSpecFilePaths;
