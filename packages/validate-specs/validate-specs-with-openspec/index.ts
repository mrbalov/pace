#!/usr/bin/env bun

import validateSpecsWithOpenspec from './validate-specs-with-openspec';

/**
 * CLI entry point.
 */
if (import.meta.main) {
  const { default: getCliArgs } = await import('./get-cli-args');
  const { rootDir } = getCliArgs();
  const result = await validateSpecsWithOpenspec(rootDir);

  console.info(JSON.stringify(result, null, 2));
}

export default validateSpecsWithOpenspec;
