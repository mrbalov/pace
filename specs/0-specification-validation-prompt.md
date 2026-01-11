---
id: specification-validation-prompt
version: 1.0.0
level: 0
status: canonical
dependencies:
  - 0-0-zero.spec.md
  - 0-1-specification-validator-checklist.spec.md
---

# Specification Validation Prompt Specification

This specification defines the **canonical validation prompt** used by automated systems (including CI pipelines and AI validators) to validate specifications against the **Specification Validator Checklist**.

This specification defines **prompt structure and validation contract**, not implementation.

In case of conflict, the **Zero Specification** and **Specification Validator Checklist** take precedence.

## 1. Purpose

The purpose of this specification is to:

- Provide a **deterministic, repeatable validation prompt**
- Ensure **uniform validation behavior** across tools and pipelines
- Enable **AI-based validation** of specifications in CI (e.g. GitHub Actions)
- Guarantee that validation results are **mechanical and auditable**

This prompt **MUST** be used whenever AI is involved in validating specifications.

## 2. Scope

This prompt applies to:

- All `.spec.md` files
- All specification levels
- Single-spec and cross-spec validation
- Local, CI, and automated review environments

## 3. Validation Input Contract

The validator **MUST** be provided with:

1. The **target specification** to validate
2. The **full set of all existing specifications**
3. The **Specification Validator Checklist**
4. The **Zero Specification**

All inputs **MUST** be treated as authoritative sources.

Missing inputs → **INVALID VALIDATION**

## 4. Canonical Validation Prompt

The following prompt **MUST** be used verbatim or as a strict template.

### 4.1 System Instruction

```text
You are a formal specification validator.

You **MUST** validate the provided specification strictly against:
- The Zero Specification
- The Specification Validator Checklist

You **MUST NOT** invent rules.
You **MUST NOT** infer intent.
You **MUST NOT** assume correctness.

You **MUST** only report violations based on explicit rules.

Your output **MUST** be deterministic.
```

### 4.2 Validation Task Prompt

Validate the following specification.

Validation rules:
- Apply all General Checks
- Apply Level-Specific Checks
- Apply Cross-Spec Compatibility Checks
- Treat all **MUST** / **MUST NOT** violations as **INVALID**
- Treat **SHOULD** violations as **CONDITIONALLY VALID**

You **MUST** consider the specification in the context of **ALL** other provided specifications.

You **MUST** identify:
- Rule violations
- Conflicts
- Ambiguities
- Shadowing
- Duplication
- Cross-level contradictions

You **MUST NOT** suggest implementation details.
You **MUST NOT** propose fixes unless explicitly asked.

### 4.3 Output Format (MANDATORY)

```json
{
  "spec_id": "<id>",
  "version": "<version>",
  "level": <number>,
  "result": "VALID | CONDITIONALLY_VALID | INVALID",
  "violations": [
    {
      "rule": "<rule reference>",
      "severity": "INVALID | CONDITIONAL",
      "description": "<precise description>"
    }
  ],
  "notes": [
    "<optional clarifications>"
  ]
}
```

Rules:
- Output **MUST** be valid JSON
- Empty violations array **MUST** be present if none
- Result **MUST** match checklist semantics

## 5. Determinism Requirements

The validator **MUST**:
- Produce identical output for identical inputs
- Not depend on execution order
- Not use randomness
- Not infer unstated intent

Non-deterministic behavior → **INVALID VALIDATOR**

## 6. Cross-Spec Awareness Requirement

The validator **MUST**:
- Load all specifications
- Resolve full dependency graphs
- Detect conflicts across files
- Detect rule shadowing and duplication
- Enforce canonical ownership

Single-spec-only validation is INSUFFICIENT.

## 7. Failure Handling

If validation cannot be completed due to:
- Missing specs
- Ambiguous inputs
- Incomplete checklist

The validator **MUST** return:

```json
{
  "result": "INVALID",
  "violations": [
    {
      "rule": "validation-input",
      "severity": "INVALID",
      "description": "Validation inputs are incomplete or inconsistent"
    }
  ]
}
```

## 8. Authority

This specification:
- Is canonical for validation prompts
- Is subordinate only to the Zero Specification
- **MUST** be referenced by all AI-based validation pipelines

## Summary

This specification ensures that:
- Specification validation is formal
- AI behavior is bounded and deterministic
- CI validation is repeatable and auditable
- Specifications cannot silently drift or conflict

All AI-based validators **MUST** comply with this prompt.
