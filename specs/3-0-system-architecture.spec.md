---
id: system-architecture
version: 1.0.0
level: 3
status: draft
dependencies:
  - 0-0-zero.spec.md
  - 1-0-guardrails.spec.md
  - 2-0-prompt-generation.spec.md
---

# System Architecture Specification

## Purpose

This document defines the modular architecture of the Strava Activity Image Generator system, including service boundaries, dependencies, interfaces, and data flow between components.

## System Overview

The system is designed as a modular, service-oriented architecture with clear separation of concerns and well-defined interfaces between components.

### Core Design Principles

1. **Single Responsibility**: Each module has one clear purpose.
2. **Loose Coupling**: Modules communicate through well-defined interfaces.
3. **High Cohesion**: Related functionality is grouped together.
4. **Dependency Injection**: Dependencies are explicit and injected.
5. **Testability**: Each module can be tested in isolation.
6. **Resilience**: Failures in one module don't cascade.

## Services

1. **Guardrails:** Enforces all safety and content restrictions.
2. **Activity:** Manages Strava API integration and activity data retrieval.
3. **Activity Signals:** Extracts semantic signals from raw Strava activity data.
4. **Prompt Generation:** Generates text prompts for image generation based on extracted Strava activity signals.
5. **Image Generation:** Generates Strava activity image based on the prompt derived from the activity data.

Service dependencies graph:

```mermaid
graph TD
    %% External Systems
    StravaAPI[Strava API]
    ImageGenAPI[Image Generation API]
    
    %% Core Services
    ConfigService[Configuration Service]
    GuardrailsService[Guardrails Service]
    ActivityService[Activity Service]
    DataValidationService[Data Validation Service]
    ActivitySignalsService[Activity Signals Service]
    TextProcessingService[Text Processing Service]
    PromptGenerationService[Prompt Generation Service]
    ImageGenerationService[Image Generation Service]
    
    %% Dependencies
    GuardrailsService --> ConfigService
    
    ActivityService --> ConfigService
    ActivityService --> DataValidationService
    ActivityService --> StravaAPI
    
    ActivitySignalsService --> GuardrailsService
    ActivitySignalsService --> TextProcessingService
    
    PromptGenerationService --> ActivitySignalsService
    PromptGenerationService --> GuardrailsService
    
    ImageGenerationService --> PromptGenerationService
    ImageGenerationService --> ImageGenAPI
    
    %% Styling
    classDef external fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef core fill:#bbf,stroke:#333,stroke-width:2px,color:black
    classDef support fill:#bfb,stroke:#333,stroke-width:2px,color:black
    
    class StravaAPI,ImageGenAPI external
    class GuardrailsService,ActivityService,ActivitySignalsService,PromptGenerationService,ImageGenerationService core
    class ConfigService,DataValidationService,TextProcessingService support
```

### 1. Guardrails Service

**Purpose**: Enforces all safety and content restrictions.

**Responsibilities**:
- Validate content against forbidden lists.
- Check for prohibited patterns.
- Sanitize user input and system output.
- Enforce compliance rules.

**Dependencies**:
- None

**Interface**:
```typescript
interface GuardrailsService {
  validateActivity(activity: Activity): ValidationResult
  validateActivitySignals(signals: ActivitySignals): ValidationResults
  validateActivityImagePrompt(prompt: ActivityImagePrompt): ValidationResult
}
```

### 2. Activity Service

**Purpose**: Manages Strava API integration and activity data retrieval.

**Responsibilities**:
- Authenticate with Strava API.
- Fetch activity data.
- Transform API responses to internal format.

**Dependencies**:
- Guardrails Service

**Interface**:
```typescript
interface ActivityService {
  fetchActivity(activityId: string): Promise<Activity>;
}
```

### 3. Activity Signals Service

**Purpose**: Extracts semantic signals from raw Strava activity data.

**Responsibilities**:
- Parse user-provided text safely.
- Extract activity signals from the Strava API response: subject, style, mood, scene, and others.

**Dependencies**:
- Guardrails Service

**Interface**:
```typescript
interface ActivitySignalsService {
  getSignals(activity: Activity): Promise<ActivitySignals>;
}
```

### 4. Prompt Generation Service

**Purpose**: Generates text prompts for image generation based on extracted Strava activity signals.

**Responsibilities**:
- Apply prompt generation rules.
- Select appropriate style.
- Compose scene descriptions.
- Validate prompt safety.

**Dependencies**:
- Activity Signals Service
- Guardrails Service

**Interface**:
```typescript
interface PromptGenerationService {
  generatePrompt(signals: ActivitySignals): ActivityImagePrompt
  getFallbackPrompt(): ActivityImagePrompt
}
```

### 5. Image Generation Service

**Purpose**: Generates Strava activity image based on the prompt derived from the activity data.

**Responsibilities**:
- Submit prompts to image generation API.
- Handle generation retries.
- Manage rate limiting.

**Dependencies**:
- Prompt Generation Service

**Interface**:
```typescript
interface ImageGenerationService {
  generateImage(prompt: ActivityImagePrompt): Promise<ActivityImage>
  regenerateWithFallback(prompt: ActivityImagePrompt): Promise<ActivityImage>
}
```

## Data Flow

### Primary Flow: New Activity to AI Image Generation

1. **Input**: Activity ID from the Strava web hook.
2. **Activity Service**: Fetches activity from the Strava API.
3. **Guardrails Service**: Validates raw activity data for safety.
4. **Activity Signals Service**: Extracts semantic signals from the raw Strava activity data.
5. **Prompt Generation Service**: Creates image prompt based on extracted activity signals.
6. **Guardrails Service**: Validates image prompt for safety.
7. **Image Generation Service**: Generates image using the prompt.
8. **Output**: Generated image URL is shared with the requestor.

### Error Flow

1. Any service failure triggers error logging.
2. Fallback mechanisms activate for persistent failures.
3. System returns a safe default output.

## Testing Strategy

### Unit Testing

- Each service **MUST** be tested in isolation.
- Mock dependencies are injected.
- 100% coverage for critical paths.
- Edge cases and error conditions.

### Integration Testing

- Test service interactions.
- Verify data flow.
- Test error propagation.
- Validate contracts.

### End-to-End Testing

- Complete flow validation.
- Failure scenario testing.

## Deployment Considerations

### Service Packaging

- Each module as separate package.
- Clear version management.
- Dependency declaration.
- Build automation.

### Configuration Management

- Environment-specific configs.
- Secret management.

### Scalability

- Stateless service design.
- Horizontal scaling capability.
- Rate limiting.

## Compliance

This architecture **MUST** comply with:
- Zero Specification requirements.
- _Level 1_ Guardrails.
- All domain specifications.
- Security best practices.

## Future Extensions

The architecture supports future additions:
- New activity types.
- Additional image styles.
- Multiple AI model providers.
- User preferences.
- Batch processing.
- Webhook integrations.
