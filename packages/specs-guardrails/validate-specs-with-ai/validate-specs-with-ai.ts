#!/usr/bin/env bun

import getSpecFilePaths from './get-spec-file-paths';
import { Output } from './types';
import buildUserPrompt from './build-user-prompt';
import askDial from './ask-dial';

/**
 * Validates OpenSpec specifications using AI-based validation.
 *
 * Validates OpenSpec specification files by sending them to an AI service
 * (DIAL) for analysis. The AI checks specifications against validation rules
 * and returns structured validation results. Can validate all specs in a
 * directory or a specific set of spec files.
 *
 * Exactly one of rootDir or specFilePaths must be provided:
 * - rootDir: Validates all spec.md files found recursively in the directory
 * - specFilePaths: Validates only the specified spec files
 *
 * @param {string} systemPrompt - System prompt instructing the AI on validation rules and format
 * @param {string} userPrompt - User prompt describing what to validate
 * @param {string} [rootDir] - Root directory containing OpenSpec specifications (mutually exclusive with specFilePaths)
 * @param {string[]} [specFilePaths] - Array of specific spec file paths to validate (mutually exclusive with rootDir)
 * @returns {Promise<Output>} Promise resolving to validation output with results, violations, and summary
 * @throws {Error} Throws error if neither rootDir nor specFilePaths is provided, or if both are provided
 *
 * @example
 * ```typescript
 * const result = await validateSpecsWithAI(
 *   systemPrompt,
 *   userPrompt,
 *   '/path/to/openspec/specs'
 * );
 * ```
 */
const validateSpecsWithAI = async (
  systemPrompt: string,
  userPrompt: string,
  rootDir?: string,
  specFilePaths?: string[]
): Promise<Output> => {
  // Validate that exactly one of rootDir or specFilePaths is provided
  const hasRootDir = rootDir !== undefined;
  const hasSpecFilePaths = specFilePaths !== undefined;

  if (!hasRootDir && !hasSpecFilePaths) {
    throw new Error('Either rootDir or specFilePaths must be provided');
  }

  if (hasRootDir && hasSpecFilePaths) {
    throw new Error('Only one of rootDir or specFilePaths can be provided, not both');
  }

  // Get spec file paths either from rootDir or use provided specFilePaths
  const finalSpecFilePaths = hasRootDir
    ? await getSpecFilePaths(rootDir)
    : specFilePaths!;

  const userPromptWithSpecs = await buildUserPrompt(finalSpecFilePaths, userPrompt);

  return askDial<Output>(systemPrompt, userPromptWithSpecs);
};

export default validateSpecsWithAI;
