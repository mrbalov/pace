#!/bin/bash

# Read entire stdin once.
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
CHANGED_FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Session line tracking.
COUNTER_FILE="/tmp/claude-session-$SESSION_ID-lines"
CURRENT_LINES=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")

# Count lines added/modified and update session counter.
if [ -f "$CHANGED_FILE_PATH" ]; then
  # Get lines changed in this file.
  LINES_CHANGED=$(git diff --stat HEAD "$CHANGED_FILE_PATH" 2>/dev/null | tail -1 | grep -o '[0-9]* insertion' | grep -o '[0-9]*' || echo "0")
  NEW_TOTAL=$((CURRENT_LINES + LINES_CHANGED))
  
  # Check session line budget (1000 lines).
  if [ "$NEW_TOTAL" -gt 1000 ]; then
    echo "{\"decision\": \"block\", \"reason\": \"Session limit: 1000 lines exceeded ($NEW_TOTAL/1000)\"}"
    exit 2
  fi
  
  # Update counter.
  echo "$NEW_TOTAL" > "$COUNTER_FILE"
fi

# Success.
exit 0
