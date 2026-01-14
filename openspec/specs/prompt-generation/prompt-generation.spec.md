---
id: 2-prompt-generation
version: 1.3.1
level: 2
status: regular
dependencies:
  - 0-zero.spec.md
  - 1-guardrails.spec.md
---

# Prompt Generation Specification

## Purpose

This document defines how textual prompts for image generation are constructed from Strava activity data. The prompt generation is based on the [Strava activity API response](https://developers.strava.com/docs/reference/#api-Activities-getActivityById).

Prompt generation is a **deterministic, rule-based process** that:
- Transforms structured activity input into visual descriptions
- Extracts semantic signals from user-provided text
- Enforces global guardrails defined in `1-guardrails.spec.md`
- Produces predictable and safe prompts for AI image models

This specification defines **behavior**, not implementation.

## Scope

This specification applies to:
- All AI-generated images based on activity data
- All supported Strava activity types (run, ride, trail, walk, hike, yoga, etc.)
- All visual styles allowed by `1-guardrails.spec.md`

## Input Contract

### Required Fields

Prompt generation **MUST** receive:
- `type: string` - The activity type (run, ride, trail, walk, hike, yoga, etc.)
- `sport_type: string` - Descriptor of the sport type

If required fields are missing:
- Prompt generation **MUST NOT** proceed
- A fallback strategy **MUST** be applied upstream

### Optional Fields

The following fields **MAY** be used if present:
- `name?: string` - Activity name
- `description?: string` - Activity description
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

| Field   | Type   | Field Description              |
|---------|--------|--------------------------------|
| Subject | string | Main prompt text.              |
| Style   | string | Visual style from allowed set. |
| Mood    | string | Emotion description.           |
| Scene   | string | Environment description.       |

All fields **MUST** be present and non-empty.

## User-Provided Text Processing

User-provided text processing **MUST** comply with section 2 of `1-guardrails.spec.md`.

### Signal Extraction Rules

User-provided text from `name`, `description`, or `gear`:
- **MUST** be processed according to section 2 of `1-guardrails.spec.md`
- **MUST** extract only normalized semantic signals

Extracted signals **MAY** influence:
- mood selection
- intensity classification
- environment determination
- scene composition
- contextual details
- all other aspects of the generated activity image

### Brand Name Handling

Brand names **MUST** be handled according to section 2.3 of `1-guardrails.spec.md`.

## Activity Classification

### Activity Type Classification

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

### Unknown Activity Type Handling

For activity types not in the above table:

1. **Safety Review**: The activity type **MUST** be evaluated against `1-guardrails.spec.md`

2. **If Safe**: Unknown types that pass safety review:
  - **MUST** use generic subject: "athlete" or "person exercising"
  - **MUST** use neutral environment: "outdoor setting" or "training area"
  - **MAY** incorporate safe contextual signals from other fields

3. **If Unsafe or Ambiguous**:
  - **MUST** fall back to generic activity prompt
  - **MUST** log the unknown type for review
  - **MUST** use the fallback prompt structure defined in Fallback Behavior

### Intensity Classification

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

## Weather Influence

### Weather Condition Mapping

Weather conditions **MUST** influence scene composition through:

#### 1. Lighting Adjustments

| Weather     | Lighting Modifier                    |
|-------------|--------------------------------------|
| sunny       | bright, clear, high contrast        |
| cloudy      | soft, diffused, even lighting       |
| overcast    | muted, gray, low contrast           |
| rainy       | wet surfaces, reflections, dim      |
| stormy      | dramatic, dark, high contrast       |
| foggy       | limited visibility, mysterious       |
| snowy       | bright, white, soft shadows         |

#### 2. Environmental Elements

| Weather     | Scene Elements to Add                |
|-------------|--------------------------------------|
| sunny       | clear skies, defined shadows        |
| cloudy      | cloud coverage, neutral atmosphere  |
| rainy       | rain effects, puddles, wet surfaces |
| stormy      | dark clouds, wind effects           |
| foggy       | mist, reduced visibility layers     |
| snowy       | snow coverage, winter atmosphere    |
| windy       | motion blur, flowing elements       |

#### 3. Mood Modifiers

| Weather     | Mood Influence                      |
|-------------|--------------------------------------|
| sunny       | energetic, positive, vibrant        |
| cloudy      | neutral, steady, focused            |
| rainy       | contemplative, persistent, moody    |
| stormy      | intense, challenging, dramatic      |
| foggy       | mysterious, calm, introspective     |
| snowy       | peaceful, quiet, serene             |

### Weather Application Rules

1. Weather **MUST** be applied as a scene modifier, not as the primary subject
2. Weather effects **MUST NOT** obscure the main activity
3. If weather conflicts with other signals (e.g., indoor activity), weather **MUST** be ignored
4. Unknown weather conditions **MUST** default to neutral atmosphere
5. Weather **MAY** override default lighting only when explicitly specified

## Tag Processing

Tags **MUST** be processed according to section 3 of `1-guardrails.spec.md`.

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

### Unrecognized Tag Handling

Unrecognized tags **MUST** be processed as follows:

1. **Safety Check**: Verify the tag complies with section 3 of `1-guardrails.spec.md`
2. **Signal Extraction**: Extract safe semantic signals if possible:
  - Emotional indicators → mood influence
  - Location hints → scene modifiers
  - Intensity signals → intensity classification
3. **If No Safe Signal**: Ignore the tag completely
4. **Logging**: Unknown tags **SHOULD** be logged for future recognition

## Style Selection

### Style Selection Rules

Style selection **MUST** use only styles allowed by section 5 of `1-guardrails.spec.md`.

Style selection **MUST** be deterministic:

1. If intensity = `high` AND activity ∈ {Run, Ride, Trail Run} → `illustrated`
2. If tags contain `recovery` OR `easy` → `minimal`
3. If elevation > 500m → `illustrated`
4. If weather ∈ {stormy, dramatic} → `illustrated`
5. If weather = `foggy` → `abstract`
6. Default → `cartoon`

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

Mood **MUST** align with (in priority order):
1. Explicit tag signals
2. Intensity level
3. Weather conditions (if available)
4. Time of day
5. Activity duration

Conflicts **MUST** be resolved by priority order.

## Scene Composition

### Environment Selection

Scene **MUST** include:
- Primary environment based on activity type
- Terrain features based on elevation
- Lighting based on time of day
- Weather elements (if specified and applicable)

### Composition Rules

Scenes **MUST**:
- Feature visual subjects per section 6 of `1-guardrails.spec.md`
- Avoid cluttered backgrounds
- Maintain focus on the activity
- Be appropriate for the selected style
- Incorporate weather effects when specified

Scenes **MUST NOT** include any content forbidden by section 4 of `1-guardrails.spec.md`.

### Scene Building Priority

Scene elements **MUST** be added in this order:
1. Base environment (from activity type)
2. Terrain modifiers (from elevation)
3. Weather effects (if specified)
4. Time-based lighting
5. Mood-based atmosphere

If conflicts arise, earlier elements take precedence.

## Prompt Assembly

### Structure Template

```text
A [style] illustration of a [subject] [activity_context].
Style: [style_descriptor].
Mood: [mood].
Scene: [environment] with [scene_details].
```

### Length Constraints

Prompts **MUST** comply with the length limit defined in section 4.3 of `1-guardrails.spec.md`.

If the limit is exceeded:
- **MUST** truncate scene details first
- Core subject and style **MUST** always be preserved

## Validation Rules

Before returning, the system **MUST** validate:

1. Prompt complies with section 4 of `1-guardrails.spec.md`
2. Style is allowed per section 5 of `1-guardrails.spec.md`
3. All required output fields are populated
4. Brand usage complies with section 2.3 of `1-guardrails.spec.md`

If validation fails:
- **MUST** sanitize and retry once
- If still invalid, **MUST** use fallback

## Fallback Behavior

### Fallback Prompt

If a valid prompt cannot be generated, the fallback **MUST** always be valid and safe:
- Subject: A simple abstract illustration of an outdoor activity.
- Style: Minimal.
- Mood: Calm.
- Scene: Neutral outdoor atmosphere with soft colors.

This fallback **MUST**:
- Be used for any unrecoverable error
- Be used for unsafe or ambiguous activity types
- Comply with all sections of `1-guardrails.spec.md`
- Always produce a valid image

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

All errors **MUST** result in fallback behavior per section 7 of `1-guardrails.spec.md`.

## Compliance

This specification **MUST** comply with all sections of `1-guardrails.spec.md`. Any violation makes the implementation invalid.
