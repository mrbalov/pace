---
id: 2-specification-validation-pipeline-behavior
version: 1.0.0
level: 2
status: canonical
dependencies:
  - 0-zero.spec.md
  - 0-specification-validation-pipeline-meta.spec.md
  - 1-specification-validation-pipeline-guardrails.spec.md
---

# Specification Validation Pipeline (Behavior) Specification

This specification defines the **implementation-level pipeline**
for validating specifications using AI.

This is a **Level 2 domain specification**.

It defines:
- Inputs
- Execution stages
- Concrete AI prompts
- Output contract

## 1. Purpose

The purpose of this specification is to define a **single, authoritative validation pipeline** used in CI and automated environments.

## 2. Pipeline Inputs

The pipeline **MUST** receive:

1. Target specification
2. Full set of all specifications
3. Specification Validation Pipeline (Meta)
4. Zero Specification

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

### 4.1 System Instruction Prompt

```text
You are a formal specification validator.

You **MUST** comply with AI Validation Guardrails.

You **MUST** validate the provided specification strictly against:
- The Zero Specification
- The Specification Validation Pipeline (Meta)

You **MUST NOT** invent rules.
You **MUST NOT** infer intent.
You **MUST NOT** assume correctness.

Your output **MUST** be deterministic.
```

### 4.2 Validation Task Prompt

Validate the provided specification.

You **MUST**:
- Apply all checklist sections
- Perform cross-spec validation
- Detect conflicts and duplication

You **MUST NOT**:
- Suggest fixes
- Propose implementations
- Infer missing intent

## 5. Validation Output Contract

```json
{
  "spec_id": "<id>",
  "version": "<version>",
  "level": <number>,
  "result": "VALID | CONDITIONALLY_VALID | INVALID",
  "violations": [],
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
