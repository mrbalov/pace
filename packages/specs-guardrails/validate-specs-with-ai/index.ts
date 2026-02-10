#!/usr/bin/env bun

import { readFile } from 'node:fs/promises';
import validateSpecsWithAI from './validate-specs-with-ai';

/**
 * CLI entry point.
 */
if (import.meta.main) {
  const { default: getCliArgs } = await import('./get-cli-args');
  const { rootDir, specFilePaths, systemPromptPath, userPromptPath } = getCliArgs();

  if (!systemPromptPath) {
    throw new Error('--systemPrompt is required');
  }
  if (!userPromptPath) {
    throw new Error('--userPrompt is required');
  }

  // Validate that exactly one of rootDir or specFilePaths is provided
  const hasRootDir = rootDir !== undefined;
  const hasSpecFilePaths = specFilePaths !== undefined;

  if (!hasRootDir && !hasSpecFilePaths) {
    throw new Error('Either --rootDir or --specFilePaths must be provided');
  }

  if (hasRootDir && hasSpecFilePaths) {
    throw new Error('Only one of --rootDir or --specFilePaths can be provided, not both');
  }

  const systemPrompt = await readFile(systemPromptPath, 'utf8');
  const userPrompt = await readFile(userPromptPath, 'utf8');
  const result = await validateSpecsWithAI(
    systemPrompt.trim(),
    userPrompt.trim(),
    rootDir,
    specFilePaths,
  );

  console.info(JSON.stringify(result, null, 2));
}

export default validateSpecsWithAI;
