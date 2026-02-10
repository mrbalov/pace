/**
 * Extracts a command-line argument value by name.
 *
 * Searches process.argv for the specified argument name and returns its value.
 * Returns undefined if the argument is not found or has no value.
 *
 * @param {string} name - Command-line argument name (e.g., '--rootDir')
 * @returns {string | undefined} Argument value as string, or undefined if not found
 * @internal
 */
const getCliArg = (name: string): string | undefined => {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);

  if (index === -1 || args[index + 1] === undefined) {
    return undefined;
  } else {
    return String(args[index + 1]);
  }
};

/**
 * Parses command-line arguments for AI-based spec validation.
 *
 * Extracts CLI arguments and returns structured configuration object.
 * Supports multiple arguments including rootDir, specFilePaths (comma-separated),
 * systemPromptPath, and userPromptPath.
 *
 * @returns {{ rootDir?: string; specFilePaths?: string[]; systemPromptPath?: string; userPromptPath?: string }} Object containing parsed CLI arguments:
 *   - rootDir: Root directory path (undefined if not provided)
 *   - specFilePaths: Array of spec file paths (undefined if not provided, comma-separated input is split and trimmed)
 *   - systemPromptPath: Path to system prompt file (undefined if not provided)
 *   - userPromptPath: Path to user prompt file (undefined if not provided)
 *
 * @example
 * ```typescript
 * // Command: bun script.ts --rootDir /path/to/specs --specFilePaths /spec1.md,/spec2.md
 * const args = getCliArgs();
 * // Returns: { rootDir: '/path/to/specs', specFilePaths: ['/spec1.md', '/spec2.md'], ... }
 * ```
 */
const getCliArgs = () => {
  const rootDirArg = getCliArg('--rootDir');
  const specFilePathsArg = getCliArg('--specFilePaths');

  return {
    rootDir: rootDirArg ?? undefined,
    specFilePaths:
      specFilePathsArg !== undefined
        ? specFilePathsArg.split(',').map((path) => path.trim())
        : undefined,
    systemPromptPath: getCliArg('--systemPrompt'),
    userPromptPath: getCliArg('--userPrompt'),
  };
};

export default getCliArgs;
