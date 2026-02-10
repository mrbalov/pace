#!/usr/bin/env node

/**
 * TDD enforcement hook for the agentic development.
 * Enforces that for any new implementation file, a corresponding test file must exist.
 * For legacy files without test files, it allows but issues a warning to encourage TDD adoption.
 *
 * Setup in `.claude/settings.json`:
 * ```json
 * {
 *   "hooks": {
 *     "PreToolUse": [{
 *       "matcher": "Bash",
 *       "hooks": [{ "type": "command", "command": "node /path/to/tdd.js" }]
 *     }]
 *   }
 * }
 * ```
 */

/**
 * Reads hook input from stdin and extracts the file path.
 * Expects JSON input with a `tool_input.file_path` field indicating the file being processed.
 * If the input is malformed or missing, it defaults to allowing the action.
 * @returns {string} The file path being processed, or null if not found.
 */
function getFilePath() {
  try {
    const stdinData = require('fs').readFileSync(0, 'utf8');
    const input = JSON.parse(stdinData);
    const filePath = input.tool_input?.file_path;

    // Validate we have a file path.
    if (!filePath) {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'allow'
          }
        })
      );
      process.exit(0);
    }
  } catch (error) {
    // If we can't parse input, allow by default.
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'allow'
        }
      })
    );
    process.exit(0);
  }

  return filePath;
}

/**
 * Only process implementation files (not test files, not config files)
 * @param {string} path - The file path to check.
 * @returns {boolean} - True if the file is an implementation file, false otherwise.
 */
function isImplementationFile(path) {
  if (!path) return false;
  
  // Skip test files.
  if (path.includes('.test.')) return false;
  
  // Skip configuration files.
  if (path.match(/\.(config|rc)\.(ts|js|json)$/)) return false;
  if (path.includes('eslint.config')) return false;
  if (path.includes('jest.config')) return false;
  if (path.includes('tsconfig')) return false;
  if (path.includes('package.json')) return false;
  if (path.includes('bunfig.toml')) return false;
  
  // Skip dotfiles and hidden files.
  if (path.split('/').pop().startsWith('.')) return false;
  
  // Skip node_modules and other dependencies.
  if (path.includes('node_modules')) return false;
  if (path.includes('dist/')) return false;
  if (path.includes('build/')) return false;
  
  // Only process TypeScript/JavaScript files.
  return Boolean(path.match(/\.(ts|tsx|js|jsx)$/));
}

/**
 * Given an implementation file path, returns the expected test file path.
 * E.g. `src/utils/math.ts` -> `src/utils/math.test.ts`.
 * @param {string} implementationPath - The path of the implementation file.
 * @returns {string} - The expected test file path for a given implementation file.
 */
function getTestFilePath(implementationPath) {
  const dir = require('path').dirname(implementationPath);
  const baseName = require('path').basename(implementationPath, require('path').extname(implementationPath));

  return require('path').join(dir, `${baseName}.test.ts`);
}

/**
 * Checks if a file exists at the given path.
 * @param {string} path - The file path to check for existence.
 * @returns {boolean} - True if the file exists, false otherwise.
 */
function fileExists(path) {
  try {
    require('fs').accessSync(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if file exists in the filesystem.
 * @param {string} path - The file path to check.
 * @returns {boolean} - True if the file is new (does not exist), false if it already exists.
 */
function isNewFile(path) {
  return !fileExists(path);
}

/**
 * Main function to enforce TDD rules:
 * - If it's not an implementation file, allow.
 * - If it's a new implementation file without a corresponding test file, block and require test file creation first.
 * - If it's an existing implementation file without a test file, allow but issue a warning.
 * - If the corresponding test file exists, allow.
 * Outputs a JSON response to stdout with permission decisions and reasons.
 * Exits with code 0 for allowed actions, non-zero for blocked actions.
 * 
 * Writes results to stdout in the format expected by the Claude hooks system.
 * The response object contains permission decisions and reasons.
 * 
 * @returns {void}
 * 
 * @example
 * ```javascript
 * {
 *   stopReason: 'TDD: Create test file first',
 *   hookSpecificOutput: {
 *     hookEventName: 'PreToolUse',
 *     permissionDecision: 'deny',
 *     permissionDecisionReason: 'TDD violation: Test file src/utils/math.test.ts must be created before implementing src/utils/math.ts'
 *   }
 * }
 * ```
 */
function main() {
  try {
    const filePath = getFilePath();

    if (!isImplementationFile(filePath)) {
      // Allow non-implementation files.
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'allow'
          }
        })
      );
      process.exit(0);
    }

    const testFilePath = getTestFilePath(filePath);
    const testFileExists = fileExists(testFilePath);
        
    if (isNewFile(filePath) && !testFileExists) {
      // Strict enforcement: new implementation files require test files first.
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'deny',
            permissionDecisionReason: `TDD violation: Test file ${testFilePath} must be created before implementing ${filePath}`
          }
        })
      );
      process.exit(0);
    } else if (!testFileExists) {
      // Legacy file: warn but allow (gradual adoption).
      process.stdout.write(
        JSON.stringify({
          systemMessage: `WARNING: No test file found for ${filePath}. Consider creating ${testFilePath}`,
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'allow',
            additionalContext: `WARNING: No test file found for ${filePath}. TDD best practice: create ${testFilePath}`
          }
        })
      );
      process.exit(0);
    } else {
      // Test file exists - allow.
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'allow'
          }
        })
      );
      process.exit(0);
    }
  } catch (error) {
    // On any error, allow by default
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'allow'
        }
      })
    );
    process.exit(0);
  }
}

main();
