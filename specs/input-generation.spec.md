---
id: prompt-generation
version: 0.0.1
---

# Prompt Generation Specification

## Purpose

This document defines how textual prompts for image generation
are constructed from activity data.

Prompt generation is a deterministic, rule-based process that:
- Transforms structured activity input into a visual description
- Enforces global guardrails
- Produces predictable and safe prompts for AI image models
- Considers activity title, description, and attached media

This specification defines behavior, not implementation.

## Scope

This specification applies to:
- All AI-generated images based on activity data
- All supported activity types (run, ride, trail, walk, hike, yoga, etc.)
- All visual styles allowed by the system

## Dependencies

Prompt generation MUST comply with:
- `guardrails.spec.md`
- Activity input specification
- Image generation specification

## Input

### Required Fields

Prompt generation requires the following activity fields:

- `type`

If required fields are missing:
- Prompt generation MUST NOT proceed
- A fallback strategy MUST be applied upstream

### Optional Fields

The following fields MAY be used if present:

- `avg_hr`
- `distance`
- `pace`
- `elevation_gain`
- `time_of_day`
- `weather`
- `duration`

Missing optional fields MUST NOT cause failure.

## Output

Prompt generation MUST return the following structure:

```yaml
prompt:
  text: string
  style: string
  mood: string
  scene: string
```

- `text` MUST be a single plain-text prompt
- `style` MUST match allowed styles
- `mood` and `scene` MUST be descriptive and generic

## Prompt Structure

Generated prompt text MUST follow this logical structure:

1. Main subject
2. Activity context
3. Environment / scene
4. Mood / emotion
5. Artistic style

Example (logical structure, not literal output):

```text
A lone runner during an intense uphill run,
mountain trail environment,
focused and determined mood,
cartoon illustration style
```

## Activity Classification Rules

### By Activity Type

| Activity Type | Subject Description |
|---------------|---------------------|
| Run           | runner              |
| Ride          | cyclist             |
| Trail Run     | trail runner        |
| Walk          | walker              |
| Hike          | hiker               |


### By Intensity

Intensity SHOULD be classified as:

- Low: easy, relaxed, calm, soft
- Medium: steady, focused
- High: intense, demanding, powerful, strong, exhausting

Intensity MAY be derived from:
- heart rate
- pace
- elevation gain
- duration

IF intensity cannot be determined:
- Default to `medium`

### By Elevation

- `elevation_gain > 300` → mountainous or hilly scene
- `elevation_gain ≤ 300` → flat or rolling terrain
- Missing data → neutral outdoor landscape

### By Time of Day

If `time_of_day` is available:
- morning → soft natural light
- day → neutral daylight
- evening → warm light
- night → dark, low light, maybe with moon and/or stars in the sky, calm or dramatic atmosphere

IF unknown:
- Use neutral daylight

## Style Selection

Style MUST be selected from allowed styles:

- `cartoon`
- `minimal`
- `abstract`
- `illustrated`

Rules:
- Default style: `cartoon`
- High intensity MAY bias toward `illustrated`
- Fallback style: `minimal`

Style selection MUST be deterministic.

## Mood Selection

Mood descriptors MUST be:
- abstract
- emotional
- non-narrative

Allowed examples:
- calm
- focused
- intense
- peaceful
- determined
- thoughtful

Mood MUST NOT include:
- named real persons
- violent or aggressive language

## Prompt Constraints

Generated prompts MUST comply with all of the following:

- No real or identifiable persons
- No text or typography instructions
- No political, military, or sexual content
- Maximum length: 400 characters

## Determinism

Given identical inputs:
- Prompt text SHOULD be identical
- Style, mood, and scene MUST be identical

Randomness:
- MUST NOT affect semantic meaning
- MUST stay within allowed variation boundaries

## Validation

Before returning, the prompt MUST be validated for:

- Length constraints
- Forbidden content
- Allowed style usage

If validation fails:
- Prompt MUST be sanitized
- Or regenerated with stricter constraints

## Failure Behavior

Prompt generation MUST NOT fail silently.

If generation cannot produce a valid prompt:
- Use a predefined safe fallback prompt
- Style MUST be set to `minimal`
- Mood MUST be set to `calm`

Fallback example:

```text
A simple abstract illustration inspired by outdoor endurance activity,
minimal style, calm atmosphere
```

## Versioning

Any change to:
- classification rules
- prompt structure
- style selection

MUST result in a version update of this specification.

Prompt generation behavior MUST always match the current spec version.
