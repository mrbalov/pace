---
id: 2-specification-validation-behavior
version: 1.0.1
level: 2
status: regular
dependencies:
  - 0-zero.spec.md
  - 0-specification-validation-meta.spec.md
  - 1-specification-validation-guardrails.spec.md
---

# Specification Validation (Behavior) Specification

This specification defines the **implementation-level pipeline** for validating specifications using AI.

This is a **Level 2 domain specification**.

It defines:
- Inputs
- Validation stages (without ordering)
- Concrete AI prompts
- Output contract

## 1. Purpose

The purpose of this specification is to define a **single, authoritative validation pipeline** used in CI and automated environments.

## 2. Pipeline Inputs

The pipeline **MUST** receive all specifications.

Missing input → **INVALID**

## 3. Validation Domains

The validation process covers the following domains:

- Structural validation
- Semantic validation
- Cross-spec validation

Each domain **MUST** apply the rules defined in the authoritative specifications:
- `0-zero.spec.md` (for specification system rules)
- `0-specification-validation-meta.spec.md` (for validation checklist)
- `1-specification-validation-guardrails.spec.md` (for AI behavior constraints)

The order of execution is NOT defined at this level.

## 4. Canonical AI Prompts

### 4.1 System Prompt

```text
You are a formal specification validation engine.

Your task is to validate a **COMPLETE SET** of specifications as a single system.

You **MUST** comply with the following authoritative specifications:
- The Zero Specification (0-zero.spec.md)
- The Specification Validation (Meta) Specification (0-specification-validation-meta.spec.md)
- The Specification Validation (Guardrails) Specification (1-specification-validation-guardrails.spec.md)

Apply all rules and constraints defined in those specifications.

You **MUST** validate:
- Each specification individually
- The combined behavior of all specifications together

You **MUST** apply the validation checklist from 0-specification-validation-meta.spec.md:
- All General Checks (Section 1)
- All Level-Specific Checks (Section 2)
- All Cross-Spec Compatibility Checks (Section 4)

You **MUST** produce deterministic output.
Identical inputs **MUST** result in identical output.

You **MUST** output **ONLY** valid JSON. No prose. No markdown. No explanations.
```

### 4.2 User Prompt

```text
Validate the following complete specification set.

This input represents the **ENTIRE** universe of specifications.
There is **NO** target specification.
All specifications **MUST** be validated together as a system.

Instructions:
- Apply the validation checklist from 0-specification-validation-meta.spec.md
- Apply the AI constraints from 1-specification-validation-guardrails.spec.md
- Validate cross-spec interactions and conflicts
- Determine a single global validation result

If **ANY** mandatory check fails → result **MUST** be **INVALID**.

Return a **SINGLE** validation result using this contract:

{
  "result": "VALID | CONDITIONALLY_VALID | INVALID",
  "violations": [
    {
      "spec_id": "<id or null if global>",
      "rule": "<meta rule reference>",
      "severity": "CONDITIONALLY_VALID | INVALID",
      "description": "<precise, mechanical description>"
    }
  ],
  "notes": []
}

Now validate the following specifications:

--- BEGIN SPECIFICATIONS ---

<INSERT RAW CONTENT OF ALL *.spec.md FILES HERE
IN STABLE, DETERMINISTIC ORDER
EACH FILE FULLY INCLUDED
NO SUMMARIZATION>

--- END SPECIFICATIONS ---
```

## 5. Validation Output Contract

```json
{
  "validated_scope": "FULL_SPECIFICATION_SET",
  "spec_count": 17,
  "result": "VALID | CONDITIONALLY_VALID | INVALID",
  "violations": [
    {
      "spec_id": "2-user-input-normalization",
      "rule": "level-violation",
      "severity": "INVALID",
      "description": "Level 2 spec defines orchestration logic"
    },
    {
      "spec_id": "1-global-guardrails",
      "rule": "shadowing",
      "severity": "INVALID",
      "description": "Rule duplicates constraint from Zero Specification"
    }
  ],
  "notes": []
}
```

## 6. Failure Handling

If validation cannot be completed:

```json
{
  "result": "INVALID",
  "violations": [
    {
      "rule": "pipeline-input",
      "severity": "INVALID",
      "description": "Validation inputs are incomplete or inconsistent"
    }
  ],
  "notes": []
}
```

## 7. Authority

This specification defines the implementation-level behavior for the validation pipeline, including AI prompts and output contracts.

The validation rules and checklist are owned by:
- `0-zero.spec.md` (for specification system rules)
- `0-specification-validation-meta.spec.md` (for validation checklist)

Note: Execution order and orchestration are owned by _Level 3_ (`3-specification-validation-orchestration.spec.md`).
