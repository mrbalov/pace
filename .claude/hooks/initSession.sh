#!/bin/bash

# Initializes an AI TDD session.
# Resets line count and outputs a TDD reminder.

# Read hook input from stdin.
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
SOURCE=$(echo "$INPUT" | jq -r '.source // "startup"')

# Initialize line counter file.
COUNTER_FILE="/tmp/claude-session-$SESSION_ID-lines"

# Reset counter to 0 on new session or clear.
if [ "$SOURCE" = "clear" ] || [ ! -f "$COUNTER_FILE" ]; then
  echo "0" > "$COUNTER_FILE"
fi

# Output TDD workflow reminder.
echo "You are a senior software engineer.
Follow AGENTS.md and project.md.
Act in the TDD mode: Test file is required before the implementation.
Line budget: 1000 lines/session.
Current: $(cat "$COUNTER_FILE" 2>/dev/null || echo "0") lines used."

exit 0
