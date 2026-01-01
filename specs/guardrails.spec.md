---
id: guardrails
version: 0.0.1
---

# Guardrails Specification

## Purpose

This document defines the global guardrails for the system.
Guardrails are explicit constraints that ensure predictable, safe,
and consistent behavior of AI-driven components.

Guardrails are part of the system specification.
Any behavior not allowed by this document is considered undefined
and must be prevented or safely handled by the implementation.

## Scope

These guardrails apply to:
- Activity ingestion
- Prompt generation
- Image generation
- Output validation
- Failure and fallback behavior

## 1. Input Guardrails

### 1.1 Required Fields

An activity input MUST contain:
- `type`

Optional fields MAY include:
- `distance`
- `avg_hr`
- `pace`
- `elevation_gain`
- `time_of_day`
- `weather`

If required fields are missing:
- The activity MUST be rejected
- OR handled via a predefined fallback

### 1.2 Value Constraints

Input values MUST satisfy the following constraints:

- `distance > 0`
- `avg_hr ∈ [40, 220]`
- `pace > 0`
- `elevation_gain ≥ 0`

Values outside allowed ranges MUST be:
- clamped
- normalized
- or replaced with `unknown`

### 1.3 Semantic Validation

Inputs MUST be semantically consistent.

Examples of invalid combinations:
- Running pace faster than human limits
- Cycling cadence outside realistic bounds
- Elevation gain inconsistent with activity type

If semantic validation fails:
- Prefer graceful degradation
- Avoid hard failure when possible

## 2. Prompt Guardrails

### 2.1 Allowed Content

Prompts MAY include:
- Generic human figures
- Nature, gym, home, and other abstract environments
- Emotional tone (e.g. calm, intense, focused)
- Artistic and stylistic descriptors

### 2.2 Forbidden Content

Prompts MUST NOT include:
- Real persons or identifiable individuals
- Political or ideological symbols
- Explicit violence or sexual content
- Military or combat scenes
- Text, captions, or typography instructions

If forbidden content is detected:
- It MUST be removed or replaced
- Generation MUST NOT proceed without sanitization

### 2.3 Prompt Size Limits

- Maximum prompt length: 400 characters
- Prompts exceeding this limit MUST be truncated or simplified

## 3. Style Guardrails

### 3.1 Allowed Styles

Only the following visual styles and their variations are allowed:
- `cartoon`
- `minimal`
- `abstract`
- `illustrated`

### 3.2 Forbidden Styles

The system MUST NOT generate:
- Photorealistic images
- Hyper-detailed or ultra-realistic art
- Faces with high realism

### 3.3 Consistency

For the same activity classification:
- Style selection SHOULD be deterministic
- Random variation MUST stay within allowed style boundaries

## 4. Image Output Guardrails

Generated images MUST satisfy:
- Aspect ratio: 1:1 or 16:9
- No text elements
- 1–3 primary visual subjects
- Neutral, non-distracting background
- Safe content only

If output validation fails:
- A retry MAY be attempted
- OR a fallback MUST be used

## 5. Retry and Fallback Strategy

### 5.1 Retry Limits

- Maximum retries per image generation: 2
- Each retry MUST simplify the prompt

### 5.2 Fallback Behavior

If all retries fail:
- Switch to `minimal` or `abstract` style
- Use a predefined safe prompt
- Always return a valid image

The system MUST never return:
- Partial results
- Corrupted files
- Empty responses

## 6. Failure Handling

Failures MUST be:
- Logged with reason and context
- Classified (input, prompt, generation, validation)

User-facing behavior MUST:
- Be silent or graceful
- Avoid exposing internal errors
- Always produce a valid outcome

## 7. Determinism and Predictability

Given identical inputs:
- Classification and style decisions SHOULD be identical
- Randomness MUST be bounded and controlled

## 8. Guardrails as Contract

- Guardrails are part of the public system contract
- Any change to this file is a behavioral change
- Guardrails MUST be versioned and reviewed

Code that violates these guardrails is considered incorrect,
even if it appears to work.
