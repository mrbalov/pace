---
name: tdd
description: Enforces Test-Driven Development with automated hooks for test-first coding, line budget tracking, and quality validation. Use when the TDD is requested.
---

# TDD Skill

## Overview

This project enforces strict Test-Driven Development (TDD) practices with automated hooks that ensure tests are written before implementation and maintain quality standards.

Follow principles stated in `AGENTS.md` and `project.md`. Carefully review requirements before writing the code.

## References

- [project.md](../../../openspec/project.md)
- [CODE_STYLE.md](../../../openspec/CODE_STYLE.md)
- [LINTING.md](../../../openspec/LINTING.md)
- [TESTING.md](../../../openspec/TESTING.md)

## TDD Requirements

### 1. Test-First Approach (Mandatory)

- **New implementation files**: Test file MUST exist before creating implementation
- **Legacy files**: Warnings shown but allowed (gradual adoption)
- **Test file pattern**: `filename.test.ts` co-located with `filename.ts`
- **Manual approval**: Test file MUST be approved manually before code generation

### 2. Session Line Budget

- **Limit**: 1000 lines of code per session
- **Counter**: Tracks accumulated lines across all edits
- **Reset**: New session or session clear (`source: "clear"`)

### 3. Test Validation

- All tests must pass before edits are considered complete
- Failed tests block further changes until fixed
- Use `bun test` (not Jest) as per project conventions

## Red-Green-Refactor Cycle

- Step 1: Red (Failing Test).
- Step 2: Green (Minimal Implementation).
- Step 3: Refactor (Improve Code). Add validation, error handling, and additional test cases while keeping tests green.

## Hook Behavior

### PreToolUse (Edit|Write)

- **New files**: Blocks if no corresponding `.test.ts` exists
- **Existing files**: Warns but allows (legacy support)
- **Config files**: Always allowed (eslint.config.js, tsconfig.json, etc.)

### PostToolUse (Edit|Write)

- Runs ESLint with `--fix`
- Runs Prettier formatting
- Executes corresponding test file
- **Blocks on test failures** (exit code 2)
- **Blocks on line budget exceeded** (>1000 lines/session)

### SessionStart

- Initializes/resets line counter
- Displays TDD reminder and current usage

## File Patterns

### Implementation Files (Enforced)

- `*.ts`, `*.tsx`, `*.js`, `*.jsx`
- Not in `node_modules`, `dist`, `build`
- Not test files (`*.test.*`)
- Not config files (`*.config.*`, `tsconfig.*`, `package.json`)

### Test Files (Required)

- `filename.test.ts` for `filename.ts`
- Co-located in same directory
- Must contain actual test cases (not empty)

## Best Practices

1. **Start with failing test**: Write test first, see it fail (red)
2. **Minimal implementation**: Make test pass with simplest code (green)
3. **Iterative improvement**: Refactor while keeping tests green
4. **Small changes**: Stay within 1000-line session budget
5. **Clear test names**: Describe behavior, not implementation details
6. **Type safety**: Use TypeScript types in test cases for better validation
