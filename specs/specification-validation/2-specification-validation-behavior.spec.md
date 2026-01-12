---
id: 2-specification-validation-behavior
version: 1.0.0
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
- Execution stages
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

Each domain applies the rules defined in:
- Zero Specification
- Specification Validation Pipeline (Meta)

The order of execution is NOT defined at this level.

## 4. Canonical AI Prompts

### 4.1 System Prompt

```text
You are a formal specification validation engine.

Your task is to validate a **COMPLETE SET** of specifications as a single system.

You **MUST** comply with:
- The Zero Specification
- The Specification Validation Pipeline (Meta)
- The Specification Validation Pipeline (Guardrails)

You **MUST** treat all specifications as authoritative, static text.
You **MUST NOT** assume intent.
You **MUST NOT** invent rules.
You **MUST NOT** infer missing behavior.
You **MUST NOT** suggest fixes or improvements.

You **MUST** validate:
- Each specification individually
- The combined behavior of all specifications together

You **MUST** apply:
- All General Checks
- All Level-Specific Checks
- All Cross-Spec Compatibility Checks

You **MUST** detect:
- Rule violations
- Cross-level conflicts
- Rule shadowing
- Duplication
- Constraint violations
- Non-determinism introduced by combination

You **MUST** produce deterministic output.
Identical inputs **MUST** result in identical output.

You **MUST** output **ONLY** valid JSON. No prose. No markdown. No explanations.

Validation context:
- Specification Validation Pipeline (Meta): 0-specification-validation-pipeline-meta
- Specification Validation Pipeline (Guardrails): 1-specification-validation-pipeline-guardrails
```

### 4.2 User Prompt

Validate the provided specifications.

You **MUST**:
- Apply all checklist sections
- Perform cross-spec validation
- Detect conflicts and duplication

You **MUST NOT**:
- Suggest fixes
- Propose implementations
- Infer missing intent

```text
Validate the following complete specification set.

This input represents the **ENTIRE** universe of specifications.
There is **NO** target specification.
All specifications **MUST** be validated together as a system.

Instructions:
- Validate every specification against the meta checklist
- Validate every specification against level rules
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
      "severity": "INVALID | CONDITIONAL",
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

## Failure Handling

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

This specification is the sole owner of:
- Validation pipeline behavior
- AI prompts
- Execution order

No other specification may redefine this pipeline.
