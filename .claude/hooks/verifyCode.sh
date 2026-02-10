#!/bin/bash

# Read entire stdin once
INPUT=$(cat)
CHANGED_FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')
IS_CODE_FILE=$(echo "$CHANGED_FILE_PATH" | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -z "$IS_CODE_FILE" ]; then
  exit 0
elif [ ! -f "$CHANGED_FILE_PATH" ]; then
  exit 0
else
  # Use bunx to ensure the project-local eslint is used.
  bunx eslint "$CHANGED_FILE_PATH" --fix 2>/dev/null || true
  bunx eslint "$CHANGED_FILE_PATH" || true

  # Use bunx to ensure the project-local prettier is used.
  bunx prettier --write "$CHANGED_FILE_PATH" 2>/dev/null || true
  bunx prettier --check "$CHANGED_FILE_PATH" || true
  
  # Find and run corresponding test file if it exists.
  # For `file.ts`, look for `file.test.ts` or `file.test.tsx`.
  CHANGED_DIR=$(dirname "$CHANGED_FILE_PATH")
  CHANGED_NAME=$(basename "$CHANGED_FILE_PATH" | sed 's/\.[^.]*$//')
  
  # Check for `*.test.ts` or `*.test.tsx` in the same directory.
  TEST_FILE_TS="$CHANGED_DIR/$CHANGED_NAME.test.ts"
  TEST_FILE_TSX="$CHANGED_DIR/$CHANGED_NAME.test.tsx"
  
  if [ -f "$TEST_FILE_TS" ]; then
    bun test "$TEST_FILE_TS" || true
  elif [ -f "$TEST_FILE_TSX" ]; then
    bun test "$TEST_FILE_TSX" || true
  fi
fi

# Always exit 0.
# Errors are reported via stdout, not exit codes.
exit 0
