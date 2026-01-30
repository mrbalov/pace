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
 * Parses command-line arguments for OpenSpec validation.
 *
 * Extracts CLI arguments and returns structured configuration object.
 * Defaults rootDir to current working directory if not provided.
 *
 * @returns {{ rootDir: string }} Object containing parsed CLI arguments:
 *   - rootDir: Root directory path (defaults to process.cwd())
 *
 * @example
 * ```typescript
 * // Command: bun script.ts --rootDir /path/to/specs
 * const args = getCliArgs();
 * // Returns: { rootDir: '/path/to/specs' }
 * ```
 */
const getCliArgs = () => {return {
  rootDir: getCliArg('--rootDir') ?? process.cwd(),
}};

export default getCliArgs;
