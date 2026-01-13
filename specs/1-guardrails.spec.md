---
id: 1-guardrails
version: 1.0.4
level: 1
status: canonical
dependencies:
  - 0-zero.spec.md
---

# Guardrails Specification

## Purpose

This document defines the global guardrails for the system. Guardrails are explicit constraints that ensure predictable, safe, and consistent behavior of AI-driven components.

Guardrails are part of the system specification. Any behavior not allowed by this document is considered undefined and must be prevented or safely handled by the implementation.

## Scope

These guardrails apply to:
- Activity ingestion
- Prompt generation
- Image generation
- Output validation
- Failure and fallback behavior

## 1. Input Guardrails

### 1.1 Required Fields

An activity input **MUST** contain:
- `type`

Optional fields **MAY** include:
- `distance`
- `avg_hr`
- `pace`
- `elevation_gain`
- `time_of_day`
- `weather`
- `name`
- `description`
- `tags`
- `gear`

If required fields are missing:
- The activity **MUST** be rejected
- OR handled via a predefined fallback

### 1.2 Value Constraints

Input values **MUST** satisfy the following constraints when present:

- `distance > 0`
- `avg_hr ∈ [40, 220]`
- `pace > 0`
- `elevation_gain ≥ 0`

Values outside allowed ranges **MUST** be:
- clamped
- normalized
- or replaced with `unknown`

Absence of optional fields **MUST** NOT be treated as an error.

### 1.3 Semantic Validation

Inputs **MUST** be semantically consistent.

Examples of invalid combinations:
- Running pace faster than realistic human limits
- Cycling cadence outside realistic bounds
- Elevation gain is inconsistent with athe ctivity type

If semantic validation fails:
- Prefer graceful degradation
- Avoid hard failure when possible

## 2. User-Provided Text Guardrails

### 2.1 Supported Text Sources

The system MAY ingest user-provided text from:
- `activity.name`
- `activity.description`
- `activity.tags`
- `activity.gear`

These fields MUST be treated as untrusted input.

### 2.2 Text Usage Rules

User-provided text:
- **MUST NOT** be copied verbatim into prompts
- **MUST** be processed through signal extraction
- **MUST** comply with all prompt and content guardrails

Only normalized semantic signals **MAY** influence prompt generation.

### 2.3 Brand Names

Brand names **MAY** be used in prompts under the following constraints:

- Brands **MUST** originate from:
  - gear metadata
  - activity name or description
- Brands **MUST NOT** be inferred or hallucinated
- Brand usage **MUST** be contextual (e.g., equipment reference)
- Excessive brand emphasis **MUST** be avoided

Brand names **MUST** still comply with all other content guardrails.

## 3. Tag Guardrails

### 3.1 Supported Tag Types

The system MAY process built-in Strava tags, including but not limited to:
- `long run`
- `recovery`
- `race`
- `commute`
- `with kid`
- `easy`
- `workout`

Tags MAY be represented as:
- structured fields
- normalized enums
- keywords extracted from metadata

### 3.2 Tag Handling Rules

- Tags **MUST** be normalized before use
- Tags **MUST** influence mood, intensity, or scene
- Tags **MUST NOT** be rendered as literal text in images
- Conflicting tags **SHOULD** be resolved deterministically

Examples:
- `recovery` → calm mood, low intensity
- `with kid` → playful or warm atmosphere
- `long run` → endurance-oriented scene

## 4. Prompt Guardrails

### 4.1 Allowed Content

Prompts **MAY** include:
- Generic human figures
- Nature, gym, home, urban, and abstract environments
- Emotional tone (e.g., calm, intense, focused)
- Artistic and stylistic descriptors
- Contextual brand references (when allowed)

### 4.2 Forbidden Content

Prompts **MUST NOT** include:
- Real persons or identifiable individuals
- Political or ideological symbols
- Explicit violence or sexual content
- Military or combat scenes
- Text, captions, or typography instructions

If forbidden content is detected:
- It **MUST** be removed or replaced
- Generation **MUST NOT** proceed without sanitization

### 4.3 Prompt Size Limits

- Maximum prompt length: 400 characters
- Prompts exceeding this limit **MUST** be truncated or simplified

## 5. Style Guardrails

### 5.1 Allowed Styles

Only the following visual styles and their variations are allowed:
- `cartoon`
- `minimal`
- `abstract`
- `illustrated`

### 5.2 Forbidden Styles

The system **MUST NOT** generate:
- Photorealistic images
- Hyper-detailed or ultra-realistic art
- Faces with high realism

### 5.3 Consistency

For the same activity classification:
- Style selection **SHOULD** be deterministic
- Random variation **MUST** stay within allowed style boundaries

## 6. Image Output Guardrails

Generated images **MUST** satisfy:
- Aspect ratio: `1:1` or `16:9`
- No text elements
- 1–3 primary visual subjects
- Neutral, non-distracting background
- Safe content only

If output validation fails:
- A retry **MAY** be attempted
- OR a fallback **MUST** be used

## 7. Retry and Fallback Strategy

### 7.1 Retry Limits

- Maximum retries per image generation: 2
- Each retry **MUST** simplify the prompt

### 7.2 Fallback Behavior

If all retries fail:
- Switch to `minimal` or `abstract` style
- Use a predefined safe prompt
- Always return a valid image

The system **MUST** never return:
- Partial results
- Corrupted files
- Empty responses

## 8. Failure Handling

Failures **MUST** be:
- Logged with reason and context
- Classified (input, prompt, generation, validation)

User-facing behavior **MUST**:
- Be silent or graceful
- Avoid exposing internal errors
- Always produce a valid outcome

## 9. Determinism and Predictability

Given identical inputs:
- Classification and style decisions **SHOULD** be identical
- Randomness **MUST** be bounded and controlled

## 10. Guardrails as Contract

- Guardrails are part of the public system contract
- Any change to this file is a behavioral change
- Guardrails **MUST** be versioned and reviewed

Code that violates these guardrails is considered incorrect, even if it appears to work.