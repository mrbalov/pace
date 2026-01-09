---
id: prompt-generation
version: 1.0.0
level: 2
status: regular
dependencies:
  - 0-0-zero.spec.md
  - 1-0-guardrails.spec.md
---

# Prompt Generation Specification

## Purpose

This document defines how textual prompts for image generation are constructed from Strava activity data. The prompt generation is based on the [Strava activity API response](https://developers.strava.com/docs/reference/#api-Activities-getActivityById).

Prompt generation is a **deterministic, rule-based process** that:
- Transforms structured activity input into visual descriptions
- Extracts semantic signals from user-provided text
- Enforces global guardrails
- Produces predictable and safe prompts for AI image models

This specification defines **behavior**, not implementation.

## Scope

This specification applies to:
- All AI-generated images based on activity data
- All supported Strava activity types (run, ride, trail, walk, hike, yoga, etc.)
- All visual styles allowed by the system

## Input Contract

### Required Fields

Prompt generation **MUST** receive:
- `type: string` - The activity type (run, ride, trail, walk, hike, yoga, etc.)

If required fields are missing:
- Prompt generation **MUST NOT** proceed
- A fallback strategy **MUST** be applied upstream

### Optional Fields

The following fields **MAY** be used if present:
- `name?: string` - Activity name
- `description?: string` - Activity description
- `sport_type?: string` - Descriptor of the sport type
- `tags?: string[]` - Activity tags
- `gear.name?: string` - Name of the gear
- `device_name?: string` - Name of the device used for recording the activity
- `average_heartrate?: number` - Average heart rate, bits per minute
- `distance?: number` - Distance in meters
- `moving_time?: number` - Moving time in minutes
- `average_speed?: number` - Average speed in hours per kilometer
- `max_speed?: number` - Max speed in hours per kilometer
- `total_elevation_gain?: number` - Elevation gain in meters
- `weather?: string` - Weather conditions
- `location_country?: string` - Country where the activity was recorded
- And others available from the Strava API. All the fields **MUST** be used safely and indirectly in the generated prompt.

Absence of optional fields **MUST NOT** cause failure.

## Output Contract

Prompt generation **MUST** return:

```typescript
type PromptOutput = {
  subject: string; // Main prompt text (≤ 400 chars).
  style: string;   // Visual style from allowed set.
  mood: string;    // Emotional descriptor.
  scene: string;   // Environment description.
};
```

All fields **MUST** be present and non-empty.

## User-Provided Text Processing

### Signal Extraction Rules

User-provided text from `name`, `description`, or `gear`:
- **MUST NOT** be copied verbatim into prompts
- **MUST** be processed through semantic signal extraction
- **MUST** comply with all _Level 1_ guardrails

Only normalized semantic signals **MAY** influence:
- mood selection
- intensity classification
- environment determination
- scene composition
- contextual details
- all other aspects of the generated activity image

### Brand Name Handling

Brand names **MAY** be included when:
- They originate from gear metadata or activity text
- They are contextually relevant
- They do not dominate the prompt

Brand names **MUST NOT**:
- Be inferred or hallucinated
- Violate content guardrails
- Receive excessive emphasis

## Activity Classification

### Activity Type Classification

```typescript
type StravaActivityType = string;
```

| Activity Type | Subject Description    | Default Environment |
|---------------|------------------------|---------------------|
| Run           | runner                 | outdoor trail       |
| Ride          | cyclist                | road or trail       |
| Trail Run     | trail runner           | forest trail        |
| Walk          | walker                 | park or urban       |
| Hike          | hiker                  | mountain trail      |
| Yoga          | person practicing yoga | indoor studio       |
| Swim          | swimmer                | pool or open water  |
| Workout       | athlete training       | gym                 |

Unknown types **MUST** be reviewed for safety and used if they don't look dangerous.

### Intensity Classification

```typescript
type StravaActivityIntensity = string;
```

Intensity **MUST** be classified as one of:
- `low` - easy, relaxed, recovery
- `medium` - steady, focused, moderate
- `high` - intense, demanding, exhausting

Classification sources (in priority order):
1. Explicit tags (`recovery`, `easy`, `race`)
2. Heart rate zones (if available)
3. Pace relative to activity type
4. Elevation gain per distance
5. Duration signals

Default: `medium`

### Elevation Classification

- `elevation_gain > 300m` → `mountainous` or `hilly`
- `elevation_gain ∈ [50, 300]` → `rolling` or `moderate`
- `elevation_gain < 50m` → `flat`
- Missing → neutral terrain

### Time Classification

- `morning` (5:00-11:00) → soft, fresh light
- `day` (11:00-17:00) → bright, neutral light
- `evening` (17:00-21:00) → warm, golden light
- `night` (21:00-5:00) → dark, dramatic atmosphere

Unknown → neutral daylight

## Tag Processing

### Recognized Tags

The system **MUST** recognize these Strava tags:

| Tag          | Mood Impact    | Intensity | Scene Modifier      |
|--------------|----------------|-----------|---------------------|
| long run     | determined     | medium    | endurance-focused   |
| recovery     | calm           | low       | gentle, relaxed     |
| race         | intense        | high      | competitive         |
| commute      | routine        | medium    | urban               |
| with kid     | playful        | low       | family-friendly     |
| easy         | relaxed        | low       | casual              |
| workout      | focused        | high      | training-oriented   |
| intervals    | dynamic        | high      | structured          |

Unrecognized tags **MUST** be processed safely in the appropriate manner.

## Style Selection

### Allowed Styles

Only these styles **MAY** be used:
- `cartoon` - colorful, friendly illustration
- `minimal` - simple, clean design
- `abstract` - artistic, non-literal
- `illustrated` - detailed, artistic rendering

### Selection Rules

Style selection **MUST** be deterministic:

1. If intensity = `high` AND activity ∈ {Run, Ride, Trail Run} → `illustrated`
2. If tags contain `recovery` OR `easy` → `minimal`
3. If elevation > 500m → `illustrated`
4. Default → `cartoon`

Fallback style: `minimal`

## Mood Selection

### Allowed Moods

Mood descriptors **MUST** be:
- Abstract and emotional
- Non-narrative
- Single words or short phrases

Valid moods include:
- `calm`, `peaceful`, `serene`
- `focused`, `determined`, `concentrated`
- `intense`, `powerful`, `explosive`
- `playful`, `joyful`, `lighthearted`
- `steady`, `rhythmic`, `flowing`

### Mood Mapping

Mood **MUST** align with:
- Intensity level
- Tag signals
- Time of day
- Weather conditions (if available)

## Scene Composition

### Environment Selection

Scene **MUST** include:
- Primary environment based on activity type
- Terrain features based on elevation
- Lighting based on time of day
- Weather elements (if specified)

### Composition Rules

Scenes **MUST**:
- Feature 1-3 primary visual subjects
- Avoid cluttered backgrounds
- Maintain focus on the activity
- Be appropriate for the selected style

Scenes **MUST NOT**:
- Include text or typography
- Show identifiable locations
- Contain forbidden content per _Level 1_ guardrails

## Prompt Assembly

### Structure Template

```text
A [style] illustration of a [subject] [activity_context].
Style: [style_descriptor].
Mood: [mood].
Scene: [environment] with [scene_details].
```

### Length Constraints

- Maximum total length: 400 characters
- If exceeded, **MUST** truncate scene details first
- Core subject and style **MUST** always be preserved

## Validation Rules

Before returning, the system **MUST** validate:

1. Prompt length ≤ 400 characters
2. Style ∈ allowed styles
3. No forbidden content present
4. All required fields populated
5. Brand usage complies with guardrails

If validation fails:
- **MUST** sanitize and retry once
- If still invalid, **MUST** use fallback

## Fallback Behavior

### Fallback Prompt

If a valid prompt cannot be generated, the fallback **MUST** always be valid and safe. E.g.,

```json
{
  "subject": "A simple abstract illustration of an outdoor activity",
  "style": "minimal",
  "mood": "calm",
  "scene": "neutral outdoor atmosphere with soft colors"
}
```

## Determinism Requirements

Given identical inputs, the system **MUST** produce:
- Identical prompt text
- Identical style selection
- Identical mood selection
- Identical scene composition

Random variation is **NOT** allowed in core prompt generation.

## Error Handling

The system **MUST NOT**:
- Throw exceptions for invalid input
- Return partial results
- Produce empty prompts
- Generate unsafe content

All errors **MUST** result in fallback behavior.

## Compliance

This specification **MUST** comply with:
- All _Level 1_ guardrails
- Content restrictions
- Safety boundaries
- Determinism requirements

Any violation makes the implementation invalid.
