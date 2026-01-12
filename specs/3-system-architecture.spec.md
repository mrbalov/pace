---
id: 3-system-architecture
version: 1.0.1
level: 3
status: draft
dependencies:
  - 0-zero.spec.md
  - 1-guardrails.spec.md
  - 2-prompt-generation.spec.md
---

# System Architecture Specification

## Purpose

This document defines the modular architecture of the Strava Activity Image Generator system, including service boundaries, dependencies, interfaces, and data flow between components.

## Core Design Principles

1. **Single Responsibility**: Each module has one clear purpose.
2. **Loose Coupling**: Modules communicate through well-defined interfaces.
3. **High Cohesion**: Related functionality is grouped together.
4. **Dependency Injection**: Dependencies are explicit and injected.
5. **Testability**: Each module can be tested in isolation.
6. **Resilience**: Failures in one module don't cascade.

## User Journey

```mermaid
graph TD
    User[User]
    Strava[Strava]
    System[System]
        
    %% Data Flow and Dependencies
    User -->|1. Upload activity| Strava
    Strava -->|2. Trigger the image-generating system| System
    System -->|3. Provide user with an AI-generated image| User
    User -->|4. Upload an AI-generated image| Strava
    
    %% Styling
    classDef user fill:#fffccc,stroke:#ccc000,stroke-width:2px,color:#000
    classDef external fill:#ffcccc,stroke:#cc0000,stroke-width:2px,color:#000
    classDef core fill:#ccddff,stroke:#0066cc,stroke-width:2px,color:#000
    
    class User user
    class Strava external
    class System core
```

The system is designed as a modular, service-oriented architecture with clear separation of concerns and well-defined interfaces between components.

## Services

1. **Guardrails:** Enforces all safety and content restrictions.
2. **Activity:** Manages Strava API integration and activity data retrieval.
3. **Activity Signals:** Extracts semantic signals from raw Strava activity data.
4. **Prompt Generation:** Generates text prompts for image generation based on extracted Strava activity signals.
5. **Image Generation:** Generates Strava activity image based on the prompt derived from the activity data.

### Service Dependency Graph

```mermaid
graph TD
    %% External Systems
    Strava[Strava]
    ImageGenAPI[External AI Image Generation API]
    
    %% Core Services
    GuardrailsService[Guardrails Service]
    ActivityService[Activity Service]
    ActivitySignalsService[Activity Signals Service]
    PromptGenerationService[Prompt Generation Service]
    ImageGenerationService[Image Generation Service]
    
    %% Data Flow and Dependencies
    Strava -->|1. Provide an activity ID via a web hook| ActivityService
    ActivityService -->|2. Fetch full activity data by ID| Strava
    ActivityService -->|3. Validate raw activity data| GuardrailsService
    ActivityService -->|4. Raw activity data| ActivitySignalsService
    ActivitySignalsService -->|5. Validate extracted activity signals| GuardrailsService
    ActivitySignalsService -->|6. Extracted activity signals| PromptGenerationService
    PromptGenerationService -->|7. Validate prepared image generation prompt| GuardrailsService
    PromptGenerationService -->|8. Image generation prompt| ImageGenerationService
    ImageGenerationService -->|9. API Request| ImageGenAPI
    
    %% Styling
    classDef external fill:#ffcccc,stroke:#cc0000,stroke-width:2px,color:#000
    classDef core fill:#ccddff,stroke:#0066cc,stroke-width:2px,color:#000
    classDef data fill:#ffffcc,stroke:#cccc00,stroke-width:1px,stroke-dasharray: 5 5
    
    class Strava,ImageGenAPI external
    class GuardrailsService,ActivityService,ActivitySignalsService,PromptGenerationService,ImageGenerationService core
```

### Service Dependency Matrix

| Service                       | Direct Dependencies                                   | Purpose of Dependency                    |
|-------------------------------|-------------------------------------------------------|------------------------------------------|
| **Guardrails Service**        | None                                                  | Independent validation service           |
| **Activity Service**          | 1. Guardrails Service                                 | 1. Content validation                    |
| **Activity Signals Service**  | 1. Guardrails Service                                 | 1. Signal validation                     |
| **Prompt Generation Service** | 1. Activity Signals Service<br/>2. Guardrails Service | 1. Signal input<br/>2. Prompt validation |
| **Image Generation Service**  | 1. Prompt Generation Service                          | 2. Prompt source                         |

### Guardrails Service

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
  validateActivitySignals(signals: ActivitySignals): ValidationResult
  validateActivityImagePrompt(prompt: ActivityImagePrompt): ValidationResult
}
```

### Activity Service

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

### Activity Signals Service

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

### Prompt Generation Service

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

### Image Generation Service

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
