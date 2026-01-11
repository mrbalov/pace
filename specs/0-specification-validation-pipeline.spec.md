---
id: specification-validation-pipeline
version: 1.0.0
level: 0
status: canonical
dependencies:
  - 0-0-zero.spec.md
---

# Specification Validation Pipeline Specification

This document defines a **formal, deterministic checklist** for validating any system specification against the Zero Specification.

This specification is authoritative for the validation of all specifications. It is subordinate to the Zero Specification. In case of conflict, Zero Specification always prevails.

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
- dependencies **MUST** be explicit or N/A

Failure of any rule → **INVALID**

### 1.2 File Naming Validation

File name **MUST** follow:

`<level>-<name>.spec.md`

Rules:

- level in filename **MUST** match front matter level
- filename **MUST** be stable across versions

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

A _Level 0_ specification **MUST NOT**:

- Define domain behavior
- Define runtime logic
- Define safety or content constraints themselves
- Reference implementation details

A _Level 0_ specification **MAY**:

- Define **meta-rules** for validating safety or content constraints defined in lower-level specifications

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

## 8. Cross-Spec Compatibility Checks

These checks validate a specification **in the context of all other existing specifications**.

Cross-spec checks are **mandatory**.
Failure of any check in this section → **INVALID**.

### 8.1 Dependency Closure Check

A specification **MUST** satisfy full dependency closure:

- All declared dependencies **MUST** exist
- All transitive dependencies **MUST** be resolvable
- No dependency chain **MUST** exceed defined level ordering

Failure → **INVALID**

### 8.2 Cross-Level Rule Conflict Check

A specification **MUST NOT**:

- Contradict any rule from a higher-level specification
- Weaken a higher-level **MUST** into **SHOULD** or **MAY**
- Introduce exceptions not explicitly allowed upstream

Conflict resolution rules:

1. Higher level always wins
2. Canonical beats non-canonical
3. Newer version beats older version (same level only)

Unresolvable conflict → **INVALID**

### 8.3 Rule Shadowing Check

A specification **MUST NOT**:

- Redefine an existing rule under a different name
- Introduce semantically equivalent rules already owned elsewhere

Semantic duplication is treated as duplication.

Failure → **INVALID**

### 8.4 Behavioral Overlap Check

If multiple specs affect the same behavior:

- Ownership **MUST** be explicit
- One spec **MUST** be authoritative
- Others **MUST** reference, not redefine

Implicit overlap → **INVALID**

### 8.5 Constraint Tightening Rules

Lower-level specifications **MAY**:

- Add stricter constraints
- Narrow allowed values
- Reduce degrees of freedom

Lower-level specifications **MUST NOT**:

- Relax higher-level constraints
- Introduce alternative behaviors

Violation → **INVALID**

### 8.6 Global Determinism Check

Combined application of all specs **MUST** result in:

- Deterministic outcomes for identical inputs
- No conflicting randomness sources
- No order-dependent interpretation

Non-determinism introduced by combination → **INVALID**

### 8.7 Version Compatibility Check

A specification update **MUST**:

- Declare compatibility expectations in the project’s `/CHANGELOG.md` if it makes sense
- Identify affected dependent specs and state them in the project’s `/CHANGELOG.md`
- Explicitly state breaking changes in the project’s `/CHANGELOG.md`

Undeclared breaking change → **INVALID**

### 8.8 Orphan Rule Check

Rules **MUST NOT** exist that:

- Are not referenced by any valid execution path
- Cannot be applied due to higher-level constraints

Orphan rules → **CONDITIONALLY VALID**

### 8.9 Canonical Alignment Check

If multiple specs define overlapping domains:

- Exactly one **canonical** spec **MUST** exist
- All others **MUST** defer to it

Multiple canonicals → **INVALID**

### 8.10 Cross-Spec Validation Result

If **all** checks in this section pass → **VALID**

If **any** mandatory check fails → **INVALID**

Incompatible specifications **MUST NOT** be merged, deployed, or referenced.

## 9. Final Validation Result

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
