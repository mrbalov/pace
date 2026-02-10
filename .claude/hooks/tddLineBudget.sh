#!/bin/bash

# Tracks lines added/modified in a session and blocks if over 1000 lines.
# Reads the changed file path and session ID from stdin,
# counts lines changed using git diff, updates a session counter,
# and blocks if the total exceeds 1000 lines.

# Read entire stdin once.
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
CHANGED_FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Validate SESSION_ID is not null or empty.
if [ "$SESSION_ID" = "null" ] || [ -z "$SESSION_ID" ]; then
  exit 0
fi

# Ensure tmp directory exists
mkdir -p "$CLAUDE_PROJECT_DIR/tmp"

# Session line tracking.
COUNTER_FILE="$CLAUDE_PROJECT_DIR/tmp/claude-session-$SESSION_ID-lines"
PROCESSED_FILES="$CLAUDE_PROJECT_DIR/tmp/claude-session-$SESSION_ID-files"
CURRENT_LINES=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")

# Count lines added/modified and update session counter.
if [ -f "$CHANGED_FILE_PATH" ]; then
  # Check if we've already counted this file in this session to avoid double-counting.
  if ! grep -Fxq "$CHANGED_FILE_PATH" "$PROCESSED_FILES" 2>/dev/null; then
    # Count total lines in the file directly (works for new/untracked files).
    LINES_IN_FILE=$(wc -l < "$CHANGED_FILE_PATH" 2>/dev/null | tr -d ' ' || echo "0")
    NEW_TOTAL=$((CURRENT_LINES + LINES_IN_FILE))
    
    # Mark file as processed.
    echo "$CHANGED_FILE_PATH" >> "$PROCESSED_FILES"
  else
    # File already counted, no additional lines.
    NEW_TOTAL=$CURRENT_LINES
  fi
  
  # Check session line budget (1000 lines).
  if [ "$NEW_TOTAL" -gt 1000 ]; then
    echo "{\"hookSpecificOutput\": {\"hookEventName\": \"PostToolUse\", \"permissionDecision\": \"deny\", \"permissionDecisionReason\": \"Session limit: 1000 lines exceeded ($NEW_TOTAL/1000)\"}}"
    exit 2
  fi
  
  # Update counter only if we added new lines.
  if [ "$NEW_TOTAL" -gt "$CURRENT_LINES" ]; then
    echo "$NEW_TOTAL" > "$COUNTER_FILE"
  fi
fi

# Success.
exit 0
