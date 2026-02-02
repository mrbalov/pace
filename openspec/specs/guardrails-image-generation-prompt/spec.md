# Image Generation Prompt Guardrails

## Purpose

Define guardrails for image generation prompt content, size limits, and safety validation to ensure appropriate and safe image generation.

## Requirements

### Requirement: Allowed Prompt Content

Prompts SHALL be restricted to the allowed content categories. Prompts MAY include generic human figures, nature/gym/home/urban/abstract environments, emotional tone (e.g., calm, intense, focused), artistic and stylistic descriptors, and contextual brand references (when allowed by input guardrails).

#### Scenario: Prompt with generic human figures
- **GIVEN** an activity requiring human representation
- **WHEN** generating a prompt
- **THEN** the prompt MAY include generic human figures

#### Scenario: Prompt with environment descriptors
- **GIVEN** an activity with environmental context
- **WHEN** generating a prompt
- **THEN** the prompt MAY include nature, gym, home, urban, or abstract environment descriptors

#### Scenario: Prompt with emotional tone
- **GIVEN** an activity with mood signals
- **WHEN** generating a prompt
- **THEN** the prompt MAY include emotional tone descriptors (e.g., calm, intense, focused)

#### Scenario: Prompt with artistic descriptors
- **GIVEN** an activity requiring image generation
- **WHEN** generating a prompt
- **THEN** the prompt MAY include artistic and stylistic descriptors

#### Scenario: Prompt with contextual brand reference
- **GIVEN** an activity with valid brand information from input guardrails
- **WHEN** generating a prompt
- **THEN** the prompt MAY include contextual brand references

### Requirement: Forbidden Prompt Content

Prompts SHALL NOT include real persons or identifiable individuals, political or ideological symbols, explicit violence or sexual content, military or combat scenes, or text/captions/typography instructions. If forbidden content is detected, it SHALL be removed or replaced, and generation SHALL NOT proceed without sanitization.

#### Scenario: Prompt without real persons
- **GIVEN** a prompt being validated
- **WHEN** the prompt contains references to real persons or identifiable individuals
- **THEN** the prompt SHALL NOT be used and SHALL be sanitized

#### Scenario: Prompt without political symbols
- **GIVEN** a prompt being validated
- **WHEN** the prompt contains political or ideological symbols
- **THEN** the prompt SHALL NOT be used and SHALL be sanitized

#### Scenario: Prompt without explicit content
- **GIVEN** a prompt being validated
- **WHEN** the prompt contains explicit violence or sexual content
- **THEN** the prompt SHALL NOT be used and SHALL be sanitized

#### Scenario: Prompt without military scenes
- **GIVEN** a prompt being validated
- **WHEN** the prompt contains military or combat scenes
- **THEN** the prompt SHALL NOT be used and SHALL be sanitized

#### Scenario: Prompt without text instructions
- **GIVEN** a prompt being validated
- **WHEN** the prompt contains text, captions, or typography instructions
- **THEN** the prompt SHALL NOT be used and SHALL be sanitized

#### Scenario: Forbidden content detection and sanitization
- **GIVEN** a prompt containing forbidden content
- **WHEN** forbidden content is detected
- **THEN** the content SHALL be removed or replaced, and generation SHALL NOT proceed without sanitization

### Requirement: Prompt Size Limits

The maximum prompt length SHALL be 600 characters. Prompts exceeding this limit SHALL be truncated or simplified.

#### Scenario: Prompt within size limit
- **GIVEN** a prompt with length less than or equal to 600 characters
- **WHEN** validating the prompt
- **THEN** the prompt passes size validation

#### Scenario: Prompt exceeding size limit
- **GIVEN** a prompt with length greater than 600 characters
- **WHEN** validating the prompt
- **THEN** the prompt SHALL be truncated or simplified to meet the limit
