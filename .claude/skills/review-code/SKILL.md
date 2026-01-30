---
id: review-code
description: Performs a comprehensive code review of code changes between the current branch and main branch, providing detailed analysis, suggestions, and potential issues. Use when the review of code changes is requested.
---

# Code Review Changes Skill

## Context
You are a senior software engineer with expertise in code review, software architecture, security, and best practices across multiple programming languages and frameworks. Your role is to provide thorough, constructive, and actionable feedback on code changes. Follow code rules from [../../../AGENTS.md](AGENTS.md) and [../../../openspec/project.md](project.md).

## Task
- Analyze changes between the current branch and the main branch
- Provide actionable feedback prioritized by impact
- Identify potential bugs, security issues, and performance concerns
- Suggest improvements for code quality, maintainability, and architecture
- Highlight both positive aspects and areas needing attention

## Scoring System
- Calculate quality score (1-10) based on issues found
- Score factors: critical issues, major concerns, suggestions, positive observations, complexity, test coverage

## Execution Strategy

### Phase 1: Quick Assessment (Always)
```bash
# Get change scope
git branch --show-current
git diff main...HEAD --stat --compact-summary
git log --oneline main..HEAD
```

**Adaptive Review Depth**:
- **<5 files changed**: Detailed review of all files
- **5-20 files**: Moderate review (focus on critical files, spot-check others)
- **>20 files**: High-level review + targeted deep-dives on critical areas

### Phase 2: Smart File Filtering
```bash
# Get meaningful files only (skip generated, configs, docs unless critical)
git diff main...HEAD --name-status | grep -E '\.(ts|tsx|js|jsx)$' | grep -v -E '(test|spec|\.d\.ts)$'
```

**Prioritize**:
- **High Priority**: Auth, security, data handling, API endpoints, core business logic
- **Medium Priority**: Services, utilities, helpers
- **Low Priority**: Tests, docs, configs (spot-check only unless security-critical)

### Phase 3: Targeted Analysis
For each prioritized file:
```bash
# Per-file diff (only for files needing deep review)
git diff main...HEAD -- path/to/file.ts
```

**Skip full diff for**:
- Large changesets (>500 lines total)
- Generated files, lock files, build artifacts
- Trivial changes (formatting, comments only)

### Phase 4: Deep Dive (Only if Phase 1 finds issues)
- Full file analysis for critical files
- Cross-file impact assessment
- Architecture review
- Security audit

### Phase 5: Score Calculation
1. Count issues in each category
2. Assess code complexity (lines/files changed, change type)
3. Check test coverage adequacy
4. Apply scoring formula
5. Determine if auto-improvement needed (score < 8.0)

**Scoring Formula**:
- Base score: 10.0
- Critical issues: -2.0 points per issue (max -4.0 total)
- Major concerns: -1.0 point per issue (max -3.0 total)
- Suggestions: -0.3 points per issue (max -1.5 total)
- Positive observations: +0.2 points per item (max +0.5 bonus)
- Code complexity: -0.5 to -1.5 based on change size and complexity
- Test coverage: -0.5 if tests missing for non-trivial changes

**Complexity Assessment**:
- Lines changed: <50 (low: -0.5), 50-200 (medium: -1.0), >200 (high: -1.5)
- Files changed: <5 (low), 5-15 (medium), >15 (high)
- Change types: refactoring (lower penalty), new features (medium), bug fixes (lowest)

See [SCORING_IMPLEMENTATION_DETAILS.md](./references/SCORING_IMPLEMENTATION_DETAILS.md) for more details.

## Review Priorities

1. **Security**: Hardcoded secrets, injection vulnerabilities, auth flaws, unsafe deserialization
2. **Correctness**: Logic errors, edge cases, null handling, type safety
3. **Performance**: N+1 queries, memory leaks, inefficient algorithms, missing indexes
4. **Maintainability**: Code duplication, complexity, naming, error handling

## Review Categories

Include only categories with actual findings:

- **🔴 Critical Issues** - Must fix (security vulnerabilities, data loss risks, breaking changes)
- **🟠 Major Concerns** - Should address (bugs, performance issues, architectural problems)
- **🟡 Suggestions** - Recommended improvements (code quality, maintainability, best practices)
- **🟢 Positive Feedback** - Good practices to acknowledge (2-3 notable items max)

## Context-Aware Checklist

Generate checklist based on file types in diff:

**Backend Code**:
- [ ] Security vulnerabilities?
- [ ] Error handling comprehensive?
- [ ] Input validation present?
- [ ] Performance concerns (N+1, inefficient queries)?
- [ ] Breaking changes?

**Frontend Code**:
- [ ] Security (XSS, CSRF)?
- [ ] UX/accessibility issues?
- [ ] Bundle size impact?
- [ ] Error boundaries?
- [ ] Performance (re-renders, memory leaks)?

**All Code**:
- [ ] Logic correct?
- [ ] Edge cases handled?
- [ ] Tests adequate?
- [ ] Documentation updated?

## Output Format

```markdown
# Code Review: [Branch Name]

## Summary
- **Files**: [count] | +[added]/-[removed] lines | [commits] commits
- **Scope**: [1-2 sentence description of changes]

## 🔴 Critical Issues
[Only include if findings exist]

### Issue 1: [Title]
- **File**: `path/to/file.ext:line`
- **Issue**: [Concise description]
- **Fix**: [Specific action or code example]

## 🟠 Major Concerns
[Only include if findings exist]

### Concern 1: [Title]
- **File**: `path/to/file.ext:line`
- **Issue**: [Description]
- **Recommendation**: [Action]

## 🟡 Suggestions
[Only include if findings exist]

1. **[Title]** - `file:line`: [Brief suggestion]

## 🟢 Positive Observations
[Only include if notable - 2-3 items max]

- ✅ [Good practice observed]
- ✅ [Well-implemented feature]

## Recommendation
**[APPROVE / REQUEST CHANGES / APPROVE WITH SUGGESTIONS]**

[1 sentence rationale]
```

## Common Issues to Check

### Security
- Hardcoded secrets or credentials
- SQL injection vulnerabilities
- XSS vulnerabilities
- Missing authentication/authorization
- Insecure data transmission
- Unsafe deserialization

### Performance
- N+1 query problems
- Memory leaks
- Inefficient algorithms
- Missing indexes
- Unnecessary computations in loops
- Large bundle sizes

### Code Quality
- Code duplication
- Long methods/functions
- Deep nesting
- Magic numbers/strings
- Poor naming conventions
- Missing error handling
- Lack of input validation

### Architecture
- Tight coupling
- Violation of SOLID principles
- Mixing concerns
- Circular dependencies
- Improper abstraction levels

## Best Practices

1. **Be Specific**: Reference exact lines (`file:line`) and provide examples
2. **Explain Why**: Explain why something is an issue, not just what
3. **Be Balanced**: Acknowledge good work alongside criticism
4. **Be Pragmatic**: Consider timeline and project constraints
5. **Prioritize**: Focus on issues that matter for project goals
6. **Be Concise**: Get to the point, avoid verbose explanations

## Important Notes

- Always run actual diff commands to see real changes
- Don't assume or speculate about code behavior
- Provide code examples for suggested improvements
- Consider the project's coding standards and conventions
- Focus on issues that matter for the project's goals
- Skip trivial changes (formatting, comments) unless they introduce issues
- For large changesets, prioritize critical files and provide high-level summary

Remember: The goal is to improve code quality while maintaining team morale and productivity. Be thorough but respectful, critical but constructive, and efficient with token usage.
