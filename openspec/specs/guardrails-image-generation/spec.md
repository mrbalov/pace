# Image Generation Guardrails

## Purpose

Define guardrails for image style, output characteristics, retry/fallback strategies, failure handling, and determinism in image generation.

## Requirements

### Requirement: Allowed Image Styles

Only the following visual styles and their variations SHALL be allowed: `cartoon`, `minimal`, `abstract`, and `illustrated`.

#### Scenario: Cartoon style selection
- **GIVEN** an activity requiring image generation
- **WHEN** selecting an image style
- **THEN** `cartoon` style MAY be selected

#### Scenario: Minimal style selection
- **GIVEN** an activity requiring image generation
- **WHEN** selecting an image style
- **THEN** `minimal` style MAY be selected

#### Scenario: Abstract style selection
- **GIVEN** an activity requiring image generation
- **WHEN** selecting an image style
- **THEN** `abstract` style MAY be selected

#### Scenario: Illustrated style selection
- **GIVEN** an activity requiring image generation
- **WHEN** selecting an image style
- **THEN** `illustrated` style MAY be selected

### Requirement: Forbidden Image Styles

The system SHALL NOT generate photorealistic images, hyper-detailed or ultra-realistic art, or faces with high realism.

#### Scenario: No photorealistic images
- **GIVEN** an image generation request
- **WHEN** generating an image
- **THEN** the system SHALL NOT generate photorealistic images

#### Scenario: No hyper-detailed art
- **GIVEN** an image generation request
- **WHEN** generating an image
- **THEN** the system SHALL NOT generate hyper-detailed or ultra-realistic art

#### Scenario: No high realism faces
- **GIVEN** an image generation request
- **WHEN** generating an image
- **THEN** the system SHALL NOT generate faces with high realism

### Requirement: Style Consistency

For the same activity classification, style selection SHOULD be deterministic. Random variation SHALL stay within allowed style boundaries.

#### Scenario: Deterministic style selection
- **GIVEN** identical activity classifications
- **WHEN** selecting image styles
- **THEN** style selection SHOULD be identical

#### Scenario: Bounded random variation
- **GIVEN** an activity requiring image generation
- **WHEN** applying random variation to style selection
- **THEN** random variation SHALL stay within allowed style boundaries

### Requirement: Image Output Characteristics

Generated images SHALL satisfy the following characteristics: aspect ratio of `1:1` or `16:9`, no text elements, 1-3 primary visual subjects, neutral non-distracting background, and safe content only. If output validation fails, a retry MAY be attempted OR a fallback SHALL be used.

#### Scenario: Valid aspect ratio
- **GIVEN** a generated image
- **WHEN** validating the image
- **THEN** the image SHALL have aspect ratio `1:1` or `16:9`

#### Scenario: No text elements
- **GIVEN** a generated image
- **WHEN** validating the image
- **THEN** the image SHALL contain no text elements

#### Scenario: Appropriate subject count
- **GIVEN** a generated image
- **WHEN** validating the image
- **THEN** the image SHALL have 1-3 primary visual subjects

#### Scenario: Neutral background
- **GIVEN** a generated image
- **WHEN** validating the image
- **THEN** the image SHALL have a neutral, non-distracting background

#### Scenario: Safe content
- **GIVEN** a generated image
- **WHEN** validating the image
- **THEN** the image SHALL contain safe content only

#### Scenario: Output validation failure with retry
- **GIVEN** a generated image that fails output validation
- **WHEN** handling the failure
- **THEN** a retry MAY be attempted OR a fallback SHALL be used

### Requirement: Retry Limits

The maximum number of retries per image generation SHALL be 2. Each retry SHALL simplify the prompt.

#### Scenario: Retry within limit
- **GIVEN** an image generation that fails
- **WHEN** retrying generation
- **THEN** the system SHALL retry up to 2 times maximum

#### Scenario: Prompt simplification on retry
- **GIVEN** an image generation that fails
- **WHEN** retrying generation
- **THEN** each retry SHALL simplify the prompt

#### Scenario: No retry beyond limit
- **GIVEN** an image generation that has failed 2 times
- **WHEN** attempting another retry
- **THEN** the system SHALL NOT retry further and SHALL use fallback

### Requirement: Fallback Behavior

If all retries fail, the system SHALL switch to `minimal` or `abstract` style, use a predefined safe prompt, and always return a valid image. The system SHALL never return partial results, corrupted files, or empty responses.

#### Scenario: Fallback style selection
- **GIVEN** all retries have failed
- **WHEN** applying fallback
- **THEN** the system SHALL switch to `minimal` or `abstract` style

#### Scenario: Fallback safe prompt
- **GIVEN** all retries have failed
- **WHEN** applying fallback
- **THEN** the system SHALL use a predefined safe prompt

#### Scenario: Fallback always returns valid image
- **GIVEN** all retries have failed
- **WHEN** applying fallback
- **THEN** the system SHALL always return a valid image

#### Scenario: No partial results
- **GIVEN** any image generation scenario
- **WHEN** returning results
- **THEN** the system SHALL never return partial results

#### Scenario: No corrupted files
- **GIVEN** any image generation scenario
- **WHEN** returning results
- **THEN** the system SHALL never return corrupted files

#### Scenario: No empty responses
- **GIVEN** any image generation scenario
- **WHEN** returning results
- **THEN** the system SHALL never return empty responses

### Requirement: Failure Handling

Failures SHALL be logged with reason and context and classified (input, prompt, generation, validation). User-facing behavior SHALL be silent or graceful, avoid exposing internal errors, and always produce a valid outcome.

#### Scenario: Failure logging
- **GIVEN** a failure occurs during image generation
- **WHEN** handling the failure
- **THEN** the failure SHALL be logged with reason and context

#### Scenario: Failure classification
- **GIVEN** a failure occurs during image generation
- **WHEN** handling the failure
- **THEN** the failure SHALL be classified as input, prompt, generation, or validation

#### Scenario: Silent user-facing behavior
- **GIVEN** a failure occurs during image generation
- **WHEN** presenting results to the user
- **THEN** user-facing behavior SHALL be silent or graceful

#### Scenario: No internal error exposure
- **GIVEN** a failure occurs during image generation
- **WHEN** presenting results to the user
- **THEN** internal errors SHALL NOT be exposed to the user

#### Scenario: Always valid outcome
- **GIVEN** any failure scenario
- **WHEN** handling the failure
- **THEN** the system SHALL always produce a valid outcome

### Requirement: Determinism and Predictability

Given identical inputs, classification and style decisions SHOULD be identical. Randomness SHALL be bounded and controlled.

#### Scenario: Identical inputs produce identical decisions
- **GIVEN** identical activity inputs
- **WHEN** processing the activities
- **THEN** classification and style decisions SHOULD be identical

#### Scenario: Bounded randomness
- **GIVEN** an activity requiring image generation
- **WHEN** applying randomness
- **THEN** randomness SHALL be bounded and controlled