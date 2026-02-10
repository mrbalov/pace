#!/usr/bin/env bun

import { join, resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';

import { Output } from './types';

/**
 * Recursively finds the openspec binary by walking up the directory tree.
 *
 * @param {string} currentDir - Current directory being searched
 * @param {string} startDir - Original starting directory (for error messages)
 * @returns {string} The path to the openspec binary
 * @throws {Error} Throws error if openspec binary cannot be found in node_modules
 * @internal
 */
const findOpenSpecBinRecursive = (currentDir: string, startDir: string): string => {
  const candidateBin = join(currentDir, 'node_modules', '.bin', 'openspec');
  const parentDir = dirname(currentDir);
  const isRoot = currentDir === parentDir;

  if (existsSync(candidateBin)) {
    return candidateBin;
  }

  if (isRoot) {
    throw new Error(
      `Could not find openspec binary in node_modules. Searched from ${startDir} up to ${currentDir}`,
    );
  }

  return findOpenSpecBinRecursive(parentDir, startDir);
};

/**
 * Gets the path to the openspec binary.
 *
 * Finds node_modules by walking up from rootDir until it's found.
 * This allows rootDir to be openspec/specs while node_modules is at repo root.
 *
 * @param {string} rootDir - The root directory of the project
 * @returns {string} The path to the openspec binary
 * @throws {Error} Throws error if openspec binary cannot be found in node_modules
 *
 * @internal
 */
const getOpenSpecBin = (rootDir: string): string => {
  const startDir = resolve(rootDir);
  return findOpenSpecBinRecursive(startDir, startDir);
};

/**
 * Parsed validation data from OpenSpec JSON output.
 */
interface ParsedValidationData {
  items: Output['items'];
  summary: Output['summary'];
  version: string;
}

/**
 * Parses validation data from OpenSpec JSON output.
 *
 * @param {string} stdout - Standard output from openspec command
 * @returns {ParsedValidationData} Parsed validation data
 * @throws {Error} Throws error if JSON parsing fails
 * @internal
 */
const parseValidationData = (stdout: string): ParsedValidationData => {
  try {
    return JSON.parse(stdout.trim()) as ParsedValidationData;
  } catch (error) {
    throw new Error(
      `Failed to parse openspec JSON output: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Validates OpenSpec specifications using the OpenSpec CLI tool.
 *
 * Executes the OpenSpec CLI validation command and parses the JSON output.
 * Validates all specifications in the provided root directory using strict
 * validation rules. Returns structured validation results including items,
 * summary, and version information.
 *
 * Executes: `openspec validate --all --strict --no-interactive --json`
 * The command validates all specs in the rootDir directory tree.
 *
 * @param {string} rootDir - Root directory containing OpenSpec specifications to validate
 * @returns {Promise<Output>} Promise resolving to validation output with success status, items, summary, and version
 * @throws {Error} Throws error if openspec binary cannot be found or if JSON output cannot be parsed
 *
 * @see {@link https://github.com/fission-ai/openspec | OpenSpec CLI Documentation}
 *
 * @example
 * ```typescript
 * const result = await validateSpecsWithOpenspec('/path/to/openspec');
 * if (result.success) {
 *   console.log('All specs valid');
 * }
 * ```
 */
const validateSpecsWithOpenspec = async (rootDir: string): Promise<Output> => {
  const openspecBin = getOpenSpecBin(rootDir);

  const proc = Bun.spawn(
    ['bun', openspecBin, 'validate', '--all', '--strict', '--no-interactive', '--json'],
    {
      cwd: rootDir,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  );

  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);

  const exitCode = await proc.exited;
  const validationData = parseValidationData(stdout);

  return {
    success: exitCode === 0,
    exitCode,
    items: validationData.items,
    summary: validationData.summary,
    version: validationData.version,
    stderr: stderr.trim(),
  };
};

export default validateSpecsWithOpenspec;
