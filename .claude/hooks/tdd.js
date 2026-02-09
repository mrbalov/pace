#!/usr/bin/env node

// Read hook input from stdin
const input = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const filePath = input.tool_input?.file_path;

// Only process implementation files (not test files, not config files)
function isImplementationFile(path) {
  if (!path) return false;
  
  // Skip test files
  if (path.includes('.test.')) return false;
  
  // Skip configuration files
  if (path.match(/\.(config|rc)\.(ts|js|json)$/)) return false;
  if (path.includes('eslint.config')) return false;
  if (path.includes('jest.config')) return false;
  if (path.includes('tsconfig')) return false;
  if (path.includes('package.json')) return false;
  if (path.includes('bunfig.toml')) return false;
  
  // Skip dotfiles and hidden files
  if (path.split('/').pop().startsWith('.')) return false;
  
  // Skip node_modules and other dependencies
  if (path.includes('node_modules')) return false;
  if (path.includes('dist/')) return false;
  if (path.includes('build/')) return false;
  
  // Only process TypeScript/JavaScript files
  return path.match(/\.(ts|tsx|js|jsx)$/);
}

function getTestFilePath(implementationPath) {
  const dir = require('path').dirname(implementationPath);
  const baseName = require('path').basename(implementationPath, require('path').extname(implementationPath));
  return require('path').join(dir, `${baseName}.test.ts`);
}

function fileExists(path) {
  try {
    require('fs').accessSync(path);
    return true;
  } catch {
    return false;
  }
}

function isNewFile(path) {
  // Check if file exists in the filesystem
  return !fileExists(path);
}

function main() {
  if (!isImplementationFile(filePath)) {
    // Allow non-implementation files
    process.stdout.write(JSON.stringify({
      continue: true,
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow"
      }
    }));
    process.exit(0);
  }

  const testFilePath = getTestFilePath(filePath);
  const testFileExists = fileExists(testFilePath);
  
  if (isNewFile(filePath) && !testFileExists) {
    // Strict enforcement: new implementation files require test files first
    process.stdout.write(JSON.stringify({
      continue: false,
      stopReason: "TDD: Create test file first",
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `TDD violation: Test file ${testFilePath} must be created before implementing ${filePath}`
      }
    }));
    process.exit(0);
  } else if (!testFileExists) {
    // Legacy file: warn but allow (gradual adoption)
    process.stdout.write(JSON.stringify({
      continue: true,
      systemMessage: `WARNING: No test file found for ${filePath}. Consider creating ${testFilePath}`,
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
        additionalContext: `WARNING: No test file found for ${filePath}. TDD best practice: create ${testFilePath}`
      }
    }));
    process.exit(0);
  } else {
    // Test file exists - allow
    process.stdout.write(JSON.stringify({
      continue: true,
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow"
      }
    }));
    process.exit(0);
  }
}

main();
