# Activity Module

## Purpose

Define requirements for the Activity module that manages Strava API integration and activity data retrieval. The module is responsible for authenticating with Strava, fetching activity data, transforming API responses to internal format, and ensuring data validation through Activity Guardrails.

## Requirements

## ADDED Requirements

### Requirement: Strava API Authentication

The module SHALL authenticate with the Strava API using OAuth2. The module SHALL use access tokens with appropriate scopes (`activity:read` for public activities, `activity:read_all` for private activities). The module SHALL handle token expiration and refresh flows securely.

#### Scenario: Successful authentication with valid token
- **GIVEN** a valid OAuth2 access token with `activity:read` scope
- **WHEN** authenticating with Strava API
- **THEN** the module SHALL successfully authenticate and proceed with API requests

#### Scenario: Authentication with activity:read_all scope
- **GIVEN** a valid OAuth2 access token with `activity:read_all` scope
- **WHEN** authenticating with Strava API
- **THEN** the module SHALL successfully authenticate and SHALL be able to access private activities

#### Scenario: Authentication failure with expired token
- **GIVEN** an expired OAuth2 access token
- **WHEN** attempting to authenticate
- **THEN** the module SHALL detect token expiration and SHALL attempt token refresh
- **AND** if refresh fails, the module SHALL return an authentication error

#### Scenario: Authentication failure with invalid token
- **GIVEN** an invalid or malformed OAuth2 access token
- **WHEN** attempting to authenticate
- **THEN** the module SHALL return an authentication error without retrying

### Requirement: System Trigger and Activity ID Reception

The module SHALL receive activity IDs from Strava webhook notifications. When a user uploads a new activity to Strava, Strava SHALL send a webhook notification to the system containing the activity ID. The module SHALL process activity IDs received from webhook events to initiate activity data fetching.

#### Scenario: Activity ID received from Strava webhook
- **GIVEN** a Strava webhook notification containing an activity ID for a new activity
- **WHEN** the webhook is received by the system
- **THEN** the Activity module SHALL be invoked with the activity ID from the webhook
- **AND** the module SHALL proceed to fetch complete activity data from Strava API

#### Scenario: Webhook-initiated activity processing flow
- **GIVEN** a user uploads a new activity to Strava
- **WHEN** Strava sends a webhook notification to the system
- **THEN** the webhook SHALL contain the activity ID
- **AND** the Activity module SHALL receive the activity ID and initiate the fetch process
- **AND** this SHALL be the entry point for the activity processing pipeline

### Requirement: Activity Data Fetching

The module SHALL fetch activity data from Strava API using the GET /activities/{activityId} endpoint. The module SHALL validate activity ID format before making API requests. The module SHALL request complete activity details including all available fields.

#### Scenario: Successful activity fetch with valid ID
- **GIVEN** a valid activity ID (received from webhook or other source) and authenticated Strava API access
- **WHEN** fetching activity data
- **THEN** the module SHALL call GET /activities/{activityId}
- **AND** the module SHALL receive complete activity details
- **AND** the module SHALL return the activity data

#### Scenario: Activity fetch with invalid activity ID format
- **GIVEN** an activity ID with invalid format (non-numeric, empty, or malformed)
- **WHEN** attempting to fetch activity data
- **THEN** the module SHALL validate the ID format before making API request
- **AND** the module SHALL return an error without calling the API

#### Scenario: Activity fetch for different activity types
- **GIVEN** valid activity IDs for different activity types (Run, Ride, Swim, Hike, etc.)
- **WHEN** fetching activity data
- **THEN** the module SHALL successfully fetch data for all supported Strava activity types
- **AND** the module SHALL handle activity-specific fields appropriately

#### Scenario: Activity fetch with minimal required fields
- **GIVEN** an activity with only required fields (type, sport_type) present in API response
- **WHEN** fetching activity data
- **THEN** the module SHALL successfully fetch and return the activity data
- **AND** optional fields SHALL be handled as absent or null

#### Scenario: Activity fetch with all optional fields present
- **GIVEN** an activity with all optional fields present (distance, elevation, heart rate, tags, gear, etc.)
- **WHEN** fetching activity data
- **THEN** the module SHALL successfully fetch and include all optional fields in the response

### Requirement: API Response Transformation

The module SHALL transform Strava API responses to internal Activity format. The module SHALL map Strava API field names to internal field names. The module SHALL normalize data types and formats (dates, numbers, strings). The module SHALL preserve all data from the API response that is relevant to the system.

#### Scenario: Successful response transformation
- **GIVEN** a valid Strava API response
- **WHEN** transforming the response
- **THEN** the module SHALL convert the response to internal Activity format
- **AND** required fields (type, sport_type) SHALL be mapped correctly
- **AND** optional fields SHALL be mapped when present

#### Scenario: Date and time normalization
- **GIVEN** a Strava API response with date fields (start_date, start_date_local)
- **WHEN** transforming the response
- **THEN** the module SHALL normalize date formats to internal representation
- **AND** timezone information SHALL be preserved or normalized appropriately

#### Scenario: Numeric field normalization
- **GIVEN** a Strava API response with numeric fields (distance, elevation, speed, etc.)
- **WHEN** transforming the response
- **THEN** the module SHALL normalize numeric values to appropriate types (integers, floats)
- **AND** unit conversions SHALL be handled if needed (meters to appropriate units)

#### Scenario: Field mapping preservation
- **GIVEN** a Strava API response with all available fields
- **WHEN** transforming the response
- **THEN** the module SHALL preserve all relevant data from the API response
- **AND** field names SHALL be mapped according to internal format conventions

### Requirement: Activity ID Validation

The module SHALL validate activity ID format before making API requests. Activity IDs SHALL be numeric strings or numbers. Invalid activity IDs SHALL be rejected before API calls.

#### Scenario: Valid numeric activity ID
- **GIVEN** an activity ID that is a valid numeric string or number
- **WHEN** validating the activity ID
- **THEN** the validation SHALL pass
- **AND** the module SHALL proceed with API request

#### Scenario: Invalid activity ID format
- **GIVEN** an activity ID that is non-numeric, empty, or contains invalid characters
- **WHEN** validating the activity ID
- **THEN** the validation SHALL fail
- **AND** the module SHALL return an error without making API request

#### Scenario: Missing activity ID
- **GIVEN** a missing or undefined activity ID
- **WHEN** validating the activity ID
- **THEN** the validation SHALL fail
- **AND** the module SHALL return an error without making API request

### Requirement: Error Handling

The module SHALL handle various error conditions gracefully. API errors SHALL be classified and handled appropriately. Network errors SHALL be detected and handled. Invalid responses SHALL be detected and handled. User-facing errors SHALL be graceful and not expose internal details.

#### Scenario: Activity not found (404 error)
- **GIVEN** a valid activity ID that does not exist in Strava
- **WHEN** fetching activity data
- **THEN** the module SHALL detect the 404 error
- **AND** the module SHALL return an appropriate error indicating activity not found
- **AND** the error SHALL be user-friendly without exposing internal API details

#### Scenario: Unauthorized access (401 error)
- **GIVEN** an invalid or expired access token
- **WHEN** fetching activity data
- **THEN** the module SHALL detect the 401 error
- **AND** the module SHALL attempt token refresh if possible
- **AND** if refresh fails, the module SHALL return an authentication error

#### Scenario: Insufficient permissions (403 error)
- **GIVEN** an activity ID for a private activity and token with only `activity:read` scope
- **WHEN** fetching activity data
- **THEN** the module SHALL detect the 403 error
- **AND** the module SHALL return an appropriate error indicating insufficient permissions

#### Scenario: Rate limit exceeded (429 error)
- **GIVEN** Strava API rate limit has been exceeded
- **WHEN** fetching activity data
- **THEN** the module SHALL detect the 429 error
- **AND** the module SHALL implement retry logic with appropriate backoff
- **AND** the module SHALL respect rate limit headers from the API response

#### Scenario: Server error (500 error)
- **GIVEN** Strava API returns a 500 server error
- **WHEN** fetching activity data
- **THEN** the module SHALL detect the 500 error
- **AND** the module SHALL implement retry logic with exponential backoff
- **AND** after maximum retries, the module SHALL return an appropriate error

#### Scenario: Network failure
- **GIVEN** a network failure or timeout when calling Strava API
- **WHEN** fetching activity data
- **THEN** the module SHALL detect the network error
- **AND** the module SHALL implement retry logic with backoff
- **AND** after maximum retries, the module SHALL return an appropriate error

#### Scenario: Malformed API response
- **GIVEN** a Strava API response that is malformed or does not match expected format
- **WHEN** processing the response
- **THEN** the module SHALL detect the invalid response
- **AND** the module SHALL return an appropriate error
- **AND** the error SHALL be logged for debugging purposes

#### Scenario: Graceful error handling
- **GIVEN** any error condition during activity fetch
- **WHEN** handling the error
- **THEN** the module SHALL return user-friendly error messages
- **AND** internal error details SHALL NOT be exposed to users
- **AND** errors SHALL be logged with appropriate context for debugging

### Requirement: Activity Guardrails Integration

The module SHALL integrate with the Activity Guardrails module to validate fetched activity data. The module SHALL validate activity data using Activity Guardrails before returning results. If validation fails, the module SHALL handle the failure appropriately.

#### Scenario: Successful validation with Activity Guardrails
- **GIVEN** fetched activity data from Strava API
- **WHEN** validating the activity data
- **THEN** the module SHALL call Activity Guardrails validateActivity method
- **AND** if validation passes, the module SHALL return the validated activity data

#### Scenario: Validation failure handling
- **GIVEN** fetched activity data that fails Activity Guardrails validation
- **WHEN** validating the activity data
- **THEN** the module SHALL detect validation failure
- **AND** the module SHALL return an appropriate error or handle via fallback mechanism
- **AND** the validation failure SHALL be logged

#### Scenario: Validation before return
- **GIVEN** any activity data fetched from Strava API
- **WHEN** returning the activity data
- **THEN** the module SHALL ensure validation has been performed
- **AND** unvalidated data SHALL NOT be returned to callers

### Requirement: Rate Limiting

The module SHALL respect Strava API rate limits. The module SHALL detect rate limit responses and handle them appropriately. The module SHALL implement retry logic with appropriate backoff when rate limited.

#### Scenario: Respecting rate limits
- **GIVEN** Strava API rate limit of 600 requests per 15 minutes per application
- **WHEN** making API requests
- **THEN** the module SHALL track request counts and respect the rate limit
- **AND** the module SHALL not exceed 600 requests per 15-minute window

#### Scenario: Rate limit detection
- **GIVEN** a Strava API response with 429 status code and rate limit headers
- **WHEN** detecting rate limit exceeded
- **THEN** the module SHALL parse rate limit headers (X-RateLimit-Limit, X-RateLimit-Usage, Retry-After)
- **AND** the module SHALL calculate appropriate wait time before retry

#### Scenario: Rate limit retry with backoff
- **GIVEN** a rate limit error (429) from Strava API
- **WHEN** retrying the request
- **THEN** the module SHALL wait for the duration specified in Retry-After header
- **AND** the module SHALL implement exponential backoff if Retry-After is not provided
- **AND** the module SHALL retry up to a maximum number of attempts

#### Scenario: Rate limit prevention
- **GIVEN** multiple concurrent requests to fetch activities
- **WHEN** managing API requests
- **THEN** the module SHALL implement request queuing or throttling to prevent rate limit violations
- **AND** the module SHALL prioritize requests appropriately

### Requirement: Retry Logic

The module SHALL implement retry logic for transient failures. Retries SHALL use exponential backoff. Maximum retry attempts SHALL be configurable and reasonable. Retries SHALL NOT be attempted for non-retryable errors.

#### Scenario: Retry for transient network errors
- **GIVEN** a transient network error (timeout, connection reset)
- **WHEN** handling the error
- **THEN** the module SHALL retry the request with exponential backoff
- **AND** retry attempts SHALL be limited to a maximum number (e.g., 3 attempts)

#### Scenario: Retry for server errors
- **GIVEN** a 500 or 502 server error from Strava API
- **WHEN** handling the error
- **THEN** the module SHALL retry the request with exponential backoff
- **AND** retry attempts SHALL be limited to a maximum number

#### Scenario: No retry for client errors
- **GIVEN** a client error (400, 401, 403, 404) from Strava API
- **WHEN** handling the error
- **THEN** the module SHALL NOT retry the request
- **AND** the module SHALL return the error immediately

#### Scenario: Exponential backoff implementation
- **GIVEN** a retryable error requiring retry
- **WHEN** implementing backoff
- **THEN** the module SHALL use exponential backoff (e.g., 1s, 2s, 4s delays)
- **AND** backoff delays SHALL have reasonable maximum limits

### Requirement: Token Management

The module SHALL securely manage OAuth2 access tokens. Tokens SHALL be stored securely. Token expiration SHALL be detected and handled. Token refresh SHALL be implemented when possible.

#### Scenario: Secure token storage
- **GIVEN** an OAuth2 access token
- **WHEN** storing the token
- **THEN** the token SHALL be stored securely (encrypted, not in plain text)
- **AND** the token SHALL NOT be logged or exposed in error messages

#### Scenario: Token expiration detection
- **GIVEN** an OAuth2 access token with expiration time
- **WHEN** using the token for API requests
- **THEN** the module SHALL check token expiration before making requests
- **AND** if expired, the module SHALL attempt token refresh

#### Scenario: Token refresh flow
- **GIVEN** an expired OAuth2 access token with refresh token available
- **WHEN** detecting token expiration
- **THEN** the module SHALL attempt to refresh the token using refresh token
- **AND** if refresh succeeds, the module SHALL use the new access token
- **AND** if refresh fails, the module SHALL return an authentication error

#### Scenario: Token usage in requests
- **GIVEN** a valid OAuth2 access token
- **WHEN** making Strava API requests
- **THEN** the module SHALL include the token in Authorization header
- **AND** the token SHALL be formatted as "Bearer {token}"

### Requirement: Credential Storage

The module SHALL securely store API credentials. Credentials SHALL NOT be hardcoded. Credentials SHALL be accessed from secure configuration or environment variables.

#### Scenario: Secure credential access
- **GIVEN** API credentials (client ID, client secret, tokens)
- **WHEN** accessing credentials
- **THEN** credentials SHALL be retrieved from secure storage (environment variables, secret management)
- **AND** credentials SHALL NOT be hardcoded in source code

#### Scenario: Credential validation
- **GIVEN** API credentials from configuration
- **WHEN** initializing the module
- **THEN** the module SHALL validate that required credentials are present
- **AND** if credentials are missing, the module SHALL return an initialization error

### Requirement: Module Interface

The module SHALL expose a well-defined TypeScript interface. The interface SHALL include the fetchActivity method. The interface SHALL be consistent with system architecture specifications.

#### Scenario: Interface definition
- **GIVEN** the Activity module
- **WHEN** accessing the module interface
- **THEN** the module SHALL expose `fetchActivity(activityId: string): Promise<Activity>` method
- **AND** the interface SHALL match the system architecture specification

#### Scenario: Method signature compliance
- **GIVEN** the fetchActivity method
- **WHEN** calling the method
- **THEN** the method SHALL accept activityId as a string parameter
- **AND** the method SHALL return a Promise that resolves to Activity type
- **AND** the method SHALL handle errors appropriately

### Requirement: Activity Data Structure

The module SHALL return activity data in a structure that matches the internal Activity format. Required fields SHALL always be present. Optional fields SHALL be present when available from API response.

#### Scenario: Required fields presence
- **GIVEN** activity data returned from fetchActivity
- **WHEN** inspecting the activity data
- **THEN** required fields (type, sport_type) SHALL always be present
- **AND** required fields SHALL have valid values

#### Scenario: Optional fields handling
- **GIVEN** activity data returned from fetchActivity
- **WHEN** inspecting optional fields
- **THEN** optional fields SHALL be present when available in API response
- **AND** optional fields SHALL be absent or null when not available in API response
- **AND** optional fields SHALL match Activity Data Guardrails specification

### Requirement: Private Activity Support

The module SHALL support fetching private activities when appropriate OAuth2 scope is available. Private activities SHALL require `activity:read_all` scope. The module SHALL handle permission errors appropriately.

#### Scenario: Private activity fetch with correct scope
- **GIVEN** a private activity ID and OAuth2 token with `activity:read_all` scope
- **WHEN** fetching the activity
- **THEN** the module SHALL successfully fetch the private activity data

#### Scenario: Private activity fetch without correct scope
- **GIVEN** a private activity ID and OAuth2 token with only `activity:read` scope
- **WHEN** fetching the activity
- **THEN** the module SHALL receive 403 error from API
- **AND** the module SHALL return an appropriate error indicating insufficient permissions
