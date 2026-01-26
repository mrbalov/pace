# @pace/strava-auth

Strava OAuth2 authentication package for the PACE project. Handles authorization URL generation, token exchange, and token refresh for Strava API integration.

## Features

- **Authorization URL Generation**: Create OAuth2 authorization URLs for user consent
- **Token Exchange**: Exchange authorization codes for access and refresh tokens
- **Token Refresh**: Refresh expired access tokens using refresh tokens
- **Type Safety**: Full TypeScript support with comprehensive types
- **Error Handling**: Structured error handling with clear error codes
- **API Tests**: Real API integration tests (requires credentials)

## Installation

This package is part of the PACE monorepo and is automatically available to other packages.

## Usage

### Generate Authorization URL

```typescript
import { getAuthorizationUrl } from '@pace/strava-auth';

const url = getAuthorizationUrl({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost',
  scope: 'activity:read', // optional, defaults to 'activity:read'
});

console.log('Visit this URL to authorize:', url);
```

### Exchange Authorization Code for Tokens

```typescript
import { exchangeToken } from '@pace/strava-auth';

// After user authorizes, Strava redirects with a code
const code = 'authorization-code-from-redirect';

const tokens = await exchangeToken(code, {
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost',
});

console.log('Access Token:', tokens.access_token);
console.log('Refresh Token:', tokens.refresh_token);
console.log('Expires At:', new Date(tokens.expires_at * 1000));
```

### Refresh Access Token

```typescript
import { refreshToken } from '@pace/strava-auth';

const newTokens = await refreshToken('refresh-token-here', {
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost',
});

console.log('New Access Token:', newTokens.access_token);
```

### Complete Example: Fetch Activity with Token Refresh

```typescript
import { refreshToken } from '@pace/strava-auth';
import { fetchActivity } from '@pace/strava-activity';

const config = {
  clientId: process.env.STRAVA_CLIENT_ID!,
  clientSecret: process.env.STRAVA_CLIENT_SECRET!,
  redirectUri: 'http://localhost',
};

// Refresh token to get a fresh access token
const tokenResponse = await refreshToken(process.env.STRAVA_REFRESH_TOKEN!, config);

// Fetch activity using the refreshed token
const activity = await fetchActivity('123456789', {
  accessToken: tokenResponse.access_token,
  refreshToken: tokenResponse.refresh_token || process.env.STRAVA_REFRESH_TOKEN!,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
});

console.log('Activity:', activity);
```

## API Reference

### `getAuthorizationUrl(config: StravaAuthConfig): string`

Generates the Strava OAuth2 authorization URL.

**Parameters:**
- `config.clientId` (required): OAuth2 client ID
- `config.clientSecret` (required): OAuth2 client secret
- `config.redirectUri` (required): OAuth2 redirect URI
- `config.scope` (optional): OAuth2 scope (default: `'activity:read'`)

**Returns:** Authorization URL string

**Throws:** `StravaAuthError` with code `'INVALID_CONFIG'` if configuration is invalid

### `exchangeToken(code: string, config: StravaAuthConfig): Promise<StravaTokenResponse>`

Exchanges an authorization code for access and refresh tokens.

**Parameters:**
- `code` (required): Authorization code from Strava redirect
- `config`: OAuth2 configuration (same as `getAuthorizationUrl`)

**Returns:** Promise resolving to token response

**Throws:** `StravaAuthError` with codes:
- `'INVALID_CONFIG'`: Missing required configuration
- `'INVALID_CODE'`: Authorization code is missing
- `'NETWORK_ERROR'`: Network connection failure
- `'UNAUTHORIZED'`: Invalid credentials or authorization code
- `'MALFORMED_RESPONSE'`: Invalid JSON response

### `refreshToken(refreshToken: string, config: StravaAuthConfig): Promise<StravaTokenRefreshResponse>`

Refreshes an expired access token using a refresh token.

**Parameters:**
- `refreshToken` (required): OAuth2 refresh token
- `config`: OAuth2 configuration (same as `getAuthorizationUrl`)

**Returns:** Promise resolving to token refresh response

**Throws:** `StravaAuthError` with codes:
- `'INVALID_CONFIG'`: Missing required configuration
- `'INVALID_CODE'`: Refresh token is missing
- `'NETWORK_ERROR'`: Network connection failure
- `'UNAUTHORIZED'`: Invalid credentials or refresh token
- `'MALFORMED_RESPONSE'`: Invalid JSON response

## Types

### `StravaAuthConfig`

```typescript
type StravaAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string;
};
```

### `StravaTokenResponse`

```typescript
type StravaTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  athlete?: { ... };
};
```

### `StravaTokenRefreshResponse`

```typescript
type StravaTokenRefreshResponse = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
};
```

### `StravaAuthError`

```typescript
type StravaAuthError = {
  code: StravaAuthErrorCode;
  message: string;
};
```

## Testing

### Unit Tests

Run unit tests with mocked API calls:

```bash
bun test packages/strava-auth
```

## Error Handling

All functions throw errors with a `StravaAuthError` structure. To parse errors:

```typescript
try {
  const tokens = await exchangeToken(code, config);
} catch (error) {
  const authError = JSON.parse((error as Error).message) as StravaAuthError;
  console.error('Error code:', authError.code);
  console.error('Error message:', authError.message);
}
```

## See Also

- [Strava API Documentation](https://developers.strava.com/docs/)
- [Strava OAuth Guide](https://developers.strava.com/docs/authentication/)
- [@pace/strava-activity](../strava-activity/README.md) - Activity fetching module
