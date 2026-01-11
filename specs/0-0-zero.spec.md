---
id: zero
version: 1.0.0
level: 0
status: canonical
dependencies: none
---

# Zero Specification

## Purpose

This document defines the **zero‑level specification** of the system. It describes a multi-level specification architecture.

The Zero Specification establishes a **strict, deterministic, multi‑level architecture** for all other specifications.  
Its goal is to eliminate duplication, ambiguity, and semantic drift between specs by enforcing a clear hierarchy of responsibilities.

This specification defines **how specifications are written, structured, related, and evolved**.

This document describes **rules**, not implementation.

## Core Principles

The specification system **MUST** follow these principles:

1. Single source of truth  
2. Strict separation of concerns  
3. Deterministic behavior  
4. Explicit contracts between layers  
5. No implicit inheritance  
6. No duplication of rules  
7. Predictable evolution through versioning
8. Make use of RFC 2119 keywords: **MUST**, **MUST NOT**, **MAY**, **SHOULD**, etc.

Any specification that violates these principles is **invalid**.

## Specification Levels

All specifications **MUST** belong to exactly one level.

Cross‑level rule duplication is **forbidden**.

### _Level 0_ — Meta Specification

#### Purpose

Defines how specifications are structured and how they interact.

#### Responsibilities

- Define specification hierarchy
- Define allowed spec types
- Define rule ownership
- Define inheritance and dependency rules
- Define versioning and change policy

#### Examples

- `0-zero.spec.md`

#### Constraints

- **MUST NOT** define domain behavior  
- **MUST NOT** define runtime logic  
- **MUST NOT** reference implementation details  

### _Level 1_ — Global Guardrails

#### Purpose

Define global, cross‑cutting constraints that apply to the entire system.

#### Responsibilities

- Safety constraints
- Content constraints
- Determinism rules
- Style boundaries
- Retry and fallback rules

#### Examples

- `1-guardrails.spec.md`

#### Constraints

- _Level 1_ specifications **MAY** restrict lower‑level behavior.
- _Level 1_ specifications **MUST NOT** describe implementation details.
- _Level 2+_ specifications **MUST** explicitly declare dependency on at least one _Level 1_ specification in their front matter.

### _Level 2_ — Domain Specifications

#### Purpose

Define domain‑specific behavior within global constraints.

#### Responsibilities

- Domain inputs and outputs
- Classification rules
- Transformation logic
- Validation rules

#### Examples

- `2-prompt-generation.spec.md`
- `2-input-generation.spec.md`
- `2-signal-processing.spec.md`

#### Constraints

- **MUST** comply with _Level 1_ guardrails  
- **MUST NOT** redefine guardrails  
- **MUST NOT** define UI or infrastructure behavior  

### _Level 3_ — Integration Specifications

#### Purpose

Define how domains interact with each other.

#### Responsibilities

- Data flow between components
- Ordering and orchestration rules
- Failure propagation rules

#### Examples

- `3-pipeline.spec.md`
- `3-orchestration.spec.md`

#### Constraints

- **MUST NOT** redefine domain logic  
- **MUST** describe interaction contracts explicitly  

### _Level 4_ — Implementation Notes (Optional)

#### Purpose

Provide non‑binding guidance for implementers.

#### Responsibilities

- Clarifications
- Examples
- Rationale

#### Constraints

- MUST NOT introduce new rules  
- MUST NOT contradict higher‑level specs  
- MAY be omitted entirely  

## Rule Ownership

Every rule **MUST** have a single owning specification.

Rules:
- **MUST NOT** be duplicated across specs  
- **MUST** be referenced, not copied  
- **MUST** live at the lowest valid level  

Ownership rules:
- Global rule → _Level 1_  
- Domain rule → _Level 2_  
- Orchestration rule → _Level 3_  

## Dependency Rules

Specifications **MAY** depend only on lower‑numbered levels.

### Allowed
- _Level 2_ → _Level 1_  
- _Level 3_ → _Level 2_, _Level 1_  

### Forbidden

- _Level 1_ → _Level 2_  
- Circular dependencies  
- Implicit dependencies  

All dependencies **MUST** be explicit.

## Change and Versioning Policy

Any change **MUST** be classified as one of:

- Structural change  
- Behavioral change  
- Clarification only  

Rules:
- Structural or behavioral changes **REQUIRE** version bump  
- Clarifications **MAY** keep the same version  
- Breaking changes **MUST** be documented  

Version numbers **MUST** increase monotonically.

## Validation Rules

A specification is valid **only if**:

- Its level is explicitly stated  
- Its dependencies are explicit  
- It does not redefine higher‑level rules  
- It does not leak responsibilities across levels  
- It follows this Zero Specification  

Invalid specifications **MUST NOT** be used.

## Zero Spec Authority

The Zero Specification is the **highest authority**.

Conflict resolution order:
1. Zero Specification  
2. Guardrails  
3. Domain specifications  
4. Integration specifications  

No exceptions are allowed.

## Specification File Naming Conventions

`<level>-<name>.spec.md`

Examples:
- `0-zero.spec.md`

## Mandatory Front Matter

- `id: string`
- `version: string` (following semver)
- `level: number` (following this specification)
- `status: 'canonical' | 'regular' | 'draft' | 'deprecated'`
- `dependencies: 'none' | string[]` (references specifications on what the current specification depends on)

## Summary

The Zero Specification defines a **strict layered contract system** for specifications.

Its purpose is to:
- Prevent duplication  
- Enforce determinism  
- Enable safe evolution  
- Make behavior predictable  
- Keep specifications readable and enforceable  

All future specifications **MUST** comply with this document.
