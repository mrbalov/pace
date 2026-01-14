---
id: 0-specification-validation-meta
version: 1.0.7
level: 0
status: regular
dependencies:
  - 0-zero.spec.md
---

# Specification Validation (Meta) Specification

This document defines a **formal, deterministic checklist** for validating any system specification against the Zero Specification.

This specification is authoritative for the validation of all specifications. It is subordinate to the Zero Specification. In case of conflict, Zero Specification always prevails.

The checklist is **normative**.
A specification is considered **invalid** if any mandatory check fails.

This document defines **validation procedures**, not the specification system itself (which is defined in `0-zero.spec.md`).

## How to Use This Checklist

For every specification file:

1. Identify its declared level
2. Run **all General Checks**
3. Run **Level-Specific Checks**
4. Record validation result:
   - **VALID**
   - **CONDITIONALLY VALID**
   - **INVALID**

## 1. General Checks (All Levels)

These checks validate compliance with rules defined in `0-zero.spec.md`.

### 1.1 Front Matter Validation

Verify the specification contains all required front matter fields as defined in `0-zero.spec.md`:

- Check for presence of `id`, `version`, `level`, `status`, `dependencies`
- Validate `id` uniqueness and pattern compliance
- Validate `version` follows semantic versioning
- Validate `level` is an integer
- Validate `status` is an allowed value
- Validate dependencies are explicit or 'none'

Failure of any rule → **INVALID**

### 1.2 File Naming Validation

Verify file name follows the convention defined in `0-zero.spec.md`:

- Check level in filename matches front matter level
- Check filename stability across versions

Failure → **INVALID**

### 1.3 Dependency Validation

Verify dependencies satisfy rules from `0-zero.spec.md`:

- Check only lower-level or same-level dependencies
- Check no circular dependencies
- Check all dependencies exist
- Check dependency filenames are exact

Failure → **INVALID**

### 1.4 Rule Language Validation

Verify the specification:

- Uses RFC 2119 keywords correctly
- Avoids ambiguous language
- Avoids implementation terms where inappropriate

Failure → **CONDITIONALLY VALID**

### 1.5 Duplication Check

Verify the specification does not:

- Duplicate rules owned by another level
- Rephrase higher-level rules as new ones

Failure → **INVALID**

## 2. Level-Specific Content Validation

### 2.1 _Level 0_ Content Validation

Verify _Level 0_ specifications comply with constraints from `0-zero.spec.md`:

- Check content is limited to meta-specification concerns
- Check no domain behavior is defined
- Check no runtime logic is defined
- Check no implementation details are referenced

Failure → **INVALID**

### 2.2 _Level 1_ Content Validation

Verify _Level 1_ specifications comply with constraints from `0-zero.spec.md`:

- Check content is limited to global guardrails
- Check no domain-specific logic is defined
- Check no orchestration is defined
- Check no UI/infrastructure references

Failure → **INVALID**

### 2.3 _Level 2_ Content Validation

Verify _Level 2_ specifications:

- Reference appropriate _Level 1_ guardrails
- Comply with all _Level 1_ constraints
- Do not redefine guardrails
- Do not define orchestration logic

Failure → **INVALID**

### 2.4 _Level 3_ Content Validation

Verify _Level 3_ specifications:

- Define only integration concerns
- Do not redefine domain logic
- Do not introduce new domain constraints

Failure → **INVALID**

### 2.5 _Level 4_ Content Validation

Verify _Level 4_ specifications:

- Contain only non-normative content
- Do not introduce new rules
- Do not contradict higher-level specs

Failure → **INVALID**

## 3. Versioning Validation

Verify version changes follow rules from `0-zero.spec.md`:

- Structural changes have version bump
- Behavioral changes have version bump
- Breaking changes are documented

Failure → **CONDITIONALLY VALID**

## 4. Cross-Spec Compatibility Checks

These checks validate a specification in context of all other specifications.

### 4.1 Dependency Closure Check

Verify:

- All declared dependencies exist
- All transitive dependencies are resolvable
- No dependency chain violates level ordering

Failure → **INVALID**

### 4.2 Cross-Level Rule Conflict Check

Verify the specification does not:

- Contradict higher-level rules
- Weaken higher-level requirements
- Introduce unauthorized exceptions

Failure → **INVALID**

### 4.3 Rule Shadowing Check

Verify the specification does not:

- Redefine existing rules under different names
- Introduce semantically equivalent rules

Failure → **INVALID**

### 4.4 Behavioral Overlap Check

For specs affecting the same behavior, verify:

- Ownership is explicit
- One spec is authoritative
- Others reference, not redefine

Failure → **INVALID**

### 4.5 Constraint Tightening Rules

Verify lower-level specifications:

- Only add stricter constraints
- Do not relax higher-level constraints
- Do not introduce alternative behaviors

Failure → **INVALID**

### 4.6 Global Determinism Check

Verify combined application results in:

- Deterministic outcomes
- No conflicting randomness sources
- No order-dependent interpretation

Failure → **INVALID**

### 4.7 Version Compatibility Check

Verify specification updates:

- Declare compatibility expectations where appropriate
- Identify affected dependent specs
- Explicitly state breaking changes

Failure → **INVALID**

### 4.8 Orphan Rule Check

Verify no rules exist that:

- Are not referenced by any execution path
- Cannot be applied due to constraints

Failure → **CONDITIONALLY VALID**

### 4.9 Canonical Alignment Check

For overlapping domains, verify:

- Exactly one canonical spec exists
- All others defer to it

Failure → **INVALID**

### 4.10 Cross-Spec Validation Result

If all checks pass → **VALID**
If any mandatory check fails → **INVALID**

## 5. Final Validation Result

A specification is:

- **VALID** — All mandatory checks pass
- **CONDITIONALLY VALID** — Only non-critical checks fail
- **INVALID** — Any mandatory check fails

Invalid specifications **MUST NOT** be used.

## Summary

This checklist provides a **formal validation mechanism** for all specifications against the rules defined in `0-zero.spec.md`.

Its goals are to:

- Verify compliance with Zero Specification
- Detect rule duplication
- Preserve determinism
- Make specification review mechanical and objective

All specifications **MUST** pass this checklist to be considered valid.
