---
id: specification-validator-checklist
version: 0.0.1
level: 0
status: canonical
dependencies:
  - 0-0-zero.spec.md
---

# Specification Validator Checklist Specification

This document defines a **formal, deterministic checklist** for validating any system specification against the Zero Specification.

The checklist is **normative**.
A specification is considered **invalid** if any mandatory check fails.

This document defines **validation rules**, not implementation.

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

These checks apply to **every specification**, regardless of level.

### 1.1 Front Matter Validation

The specification **MUST** contain front matter with:

- `id`
- `version`
- `level`
- `status`
- `dependencies`

Validation rules:

- id **MUST** be unique across all specs
- version **MUST** follow semantic versioning
- level **MUST** be an integer
- status **MUST** be one of:
  - canonical
  - regular
  - draft
  - deprecated
- scope **MUST** be explicitly stated
- dependencies **MUST** be explicit or N/A

Failure of any rule → **INVALID**

### 1.2 File Naming Validation

File name **MUST** follow:

`<level>-<number>-<name>.spec.md`

Rules:

- level in filename **MUST** match front matter level
- filename **MUST** be stable across versions
- number **MUST** be numeric and sortable

Failure → **INVALID**

### 1.3 Dependency Validation

Dependencies **MUST** satisfy:

- Only lower-level dependencies allowed
- No circular dependencies
- All dependencies **MUST** exist
- Dependency filenames **MUST** be exact

Failure → **INVALID**

### 1.4 Rule Language Validation

The specification **MUST**:

- Use RFC 2119 keywords **MUST**, **MUST NOT**, **MAY**, **SHOULD**, etc. explicitly
- Avoid ambiguous language
- Avoid implementation terms

Failure → **CONDITIONALLY VALID**

### 1.5 Duplication Check

The specification **MUST NOT**:

- Duplicate rules owned by another level
- Rephrase higher-level rules as new ones

Failure → **INVALID**

## 2. _Level 0_ — Zero Specification Checklist

### 2.1 Allowed Content

A _Level 0_ spec **MAY** define:

- Specification hierarchy
- Rule ownership rules
- Dependency rules
- Versioning policy
- Validation criteria

### 2.2 Forbidden Content

A _Level 0_ spec **MUST NOT**:

- Define domain behavior
- Define runtime logic
- Define safety or content constraints
- Reference implementation details

Failure → **INVALID**

### 2.3 Authority Check

Zero Spec **MUST**:

- Explicitly define conflict resolution order
- Declare itself as the highest authority

Failure → **INVALID**

## 3. _Level 1_ — Global Guardrails Checklist

### 3.1 Allowed Content

A _Level 1_ spec **MAY** define:

- Global safety constraints
- Content and style boundaries
- Determinism rules
- Retry and fallback limits
- Input sanitization rules

### 3.2 Forbidden Content

A _Level 1_ spec **MUST NOT**:

- Define domain-specific logic
- Define transformation algorithms
- Define orchestration or sequencing
- Reference UI or infrastructure

Failure → **INVALID**

### 3.3 Downward Restriction Check

_Level 1_ rules MUST:

- Restrict lower levels
- Never depend on lower-level behavior

Failure → **INVALID**

## 4. _Level 2_ — Domain Specification Checklist

### 4.1 Allowed Content

A _Level 2_ spec **MAY** define:

- Domain inputs and outputs
- Classification rules
- Transformation rules
- Validation logic

### 4.2 Required References

A _Level 2_ spec **MUST**:

- Explicitly reference Guardrails
- Comply with all _Level 1_ constraints

Failure → **INVALID**

### 4.3 Forbidden Content

A _Level 2_ spec **MUST NOT**:

- Redefine guardrails
- Define orchestration logic
- Define infrastructure behavior

Failure → **INVALID**

## 5. _Level 3_ — Integration Specification Checklist

### 5.1 Allowed Content

A _Level 3_ spec MAY define:

- Data flow between domains
- Ordering rules
- Failure propagation rules
- Interface contracts

### 5.2 Forbidden Content

A _Level 3_ spec MUST NOT:

- Redefine domain logic
- Define safety or content rules
- Introduce new domain constraints

Failure → **INVALID**

## 6. _Level 4_ — Implementation Notes Checklist

### 6.1 Allowed Content

A _Level 4_ spec MAY include:

- Examples
- Clarifications
- Rationale

### 6.2 Forbidden Content

A _Level 4_ spec **MUST NOT**:

- Introduce new rules
- Contradict higher-level specs
- Be referenced as normative dependency

Failure → **INVALID**

## 7. Versioning Validation

For any spec change:

- Structural change → version bump REQUIRED
- Behavioral change → version bump REQUIRED
- Clarification only → version bump OPTIONAL

Breaking changes **MUST** be documented.

Failure → **CONDITIONALLY VALID**

## 8. Final Validation Result

A specification is:

- **VALID** — All mandatory checks pass
- **CONDITIONALLY VALID** — Only non-critical checks fail
- **INVALID** — Any mandatory check fails

Invalid specifications **MUST NOT** be used.

## Summary

This checklist provides a **formal, repeatable validation mechanism** for all specifications.

Its goals are to:

- Enforce Zero Specification authority
- Prevent rule duplication
- Preserve determinism
- Make a specification review mechanical and objective

All current and future specifications **MUST** pass this checklist.
