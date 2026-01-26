# Strava API Guide

This guide explains how the Strava API works, how to obtain API credentials, and how to test the Activity module with real API access.

## Table of Contents

1. [How the Strava API Works](#how-the-strava-api-works)
2. [Getting API Credentials](#getting-api-credentials)
3. [Obtaining an Access Token](#obtaining-an-access-token)
4. [Testing the Activity Module](#testing-the-activity-module)
5. [Token Refresh Flow](#token-refresh-flow)

## How the Strava API Works

### Authentication

The Strava API uses **OAuth 2.0** for authentication. Your application needs:

- **Client ID**: Public identifier for your application
- **Client Secret**: Secret key (keep this secure!)
- **Access Token**: Short-lived token (6 hours) used to make API requests
- **Refresh Token**: Long-lived token used to get new access tokens

### API Endpoints

The Activity module uses the following Strava API endpoint:

- **GET `/activities/{id}`**: Fetches activity details by ID
  - Base URL: `https://www.strava.com/api/v3`
  - Full endpoint: `https://www.strava.com/api/v3/activities/{id}`
  - Requires authentication via `Authorization: Bearer {access_token}` header

### OAuth Scopes

Different scopes grant different permissions:

- **`activity:read`**: Read public activities only
- **`activity:read_all`**: Read all activities (including private ones)

For testing, `activity:read` is usually sufficient unless you need to access private activities.

### Rate Limits

Strava enforces rate limits:
- **600 requests per 15 minutes** per application
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Usage`: Current usage count
  - `Retry-After`: Seconds to wait before retrying (on 429 errors)

The Activity module automatically handles rate limiting with retry logic.

## Getting API Credentials

### Step 1: Create a Strava Account

If you don't have one, create an account at [strava.com](https://www.strava.com).

### Step 2: Create an Application

1. Go to [Strava Developers](https://www.strava.com/settings/api)
2. Click **"Create App"** or **"My API Application"**
3. Fill in the application details:
   - **Application Name**: Your app name (e.g., "PACE Testing")
   - **Category**: Select appropriate category
   - **Website**: Your website URL (can be `http://localhost` for testing)
   - **Authorization Callback Domain**: This is important!
     - For local testing: `localhost`
     - For production: Your actual domain
     - **Note**: Strava requires a valid domain format (no `http://` prefix)

4. Click **"Create"**

### Step 3: Get Your Credentials

After creating the app, you'll see:

- **Client ID**: A numeric ID (e.g., `12345`)
- **Client Secret**: A long string (e.g., `abc123def456...`)

**⚠️ Important**: Keep your Client Secret secure! Never commit it to version control.

## Obtaining an Access Token

There are two ways to get an access token:

### Method 1: Manual Authorization (Quick Testing)

1. **Build the authorization URL**:
   ```
   https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&scope=activity:read&approval_prompt=force
   ```

   Replace:
   - `YOUR_CLIENT_ID` with your actual Client ID
   - `redirect_uri` should match what you set in your app settings
   - `scope` can be `activity:read` or `activity:read_all`

2. **Open the URL in your browser** and authorize the application

3. **After authorization**, Strava will redirect to your redirect URI with a `code` parameter:
   ```
   http://localhost/?code=AUTHORIZATION_CODE&scope=activity:read
   ```

4. **Exchange the code for tokens** using a POST request:

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=AUTHORIZATION_CODE \
  -d grant_type=authorization_code
```

The response will contain:
```json
{
  "token_type": "Bearer",
  "expires_at": 1234567890,
  "expires_in": 21600,
  "refresh_token": "refresh_token_here",
  "access_token": "access_token_here",
  "athlete": { ... }
}
```

### Method 2: Using a Helper Script

Create a simple script to automate the token exchange:

```typescript
// scripts/get-strava-token.ts
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost';

// Step 1: Print authorization URL
console.log(`\n1. Open this URL in your browser:`);
console.log(`https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=activity:read&approval_prompt=force\n`);

// Step 2: After authorization, paste the code from the redirect URL
// The code will be in the URL: http://localhost/?code=CODE_HERE
const code = process.argv[2]; // Pass code as command line argument

if (!code) {
  console.log('2. After authorization, run:');
  console.log(`   bun run scripts/get-strava-token.ts YOUR_CODE\n`);
  process.exit(0);
}

// Step 3: Exchange code for tokens
const response = await fetch('https://www.strava.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
  }),
});

const data = await response.json();

if (data.access_token) {
  console.log('\n✅ Success! Your tokens:\n');
  console.log(`Access Token: ${data.access_token}`);
  console.log(`Refresh Token: ${data.refresh_token}`);
  console.log(`Expires At: ${new Date(data.expires_at * 1000).toISOString()}\n`);
  console.log('⚠️  Store these securely! Access tokens expire in 6 hours.\n');
} else {
  console.error('❌ Error:', data);
}
```

## Testing the Activity Module

### Step 1: Set Up Environment Variables

Create a `.env` file in the project root (make sure it's in `.gitignore`):

```bash
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_ACCESS_TOKEN=your_access_token
STRAVA_REFRESH_TOKEN=your_refresh_token
```

### Step 2: Create a Test Script

Create a test script to fetch a real activity:

```typescript
// scripts/test-activity.ts
import fetchActivity from '../packages/strava-activity';
import { ActivityConfig } from '../packages/strava-activity/types';

// Load credentials from environment variables
const config: ActivityConfig = {
  accessToken: process.env.STRAVA_ACCESS_TOKEN!,
  refreshToken: process.env.STRAVA_REFRESH_TOKEN,
  clientId: process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
};

// Validate required environment variables
if (!config.accessToken) {
  console.error('❌ Error: STRAVA_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

// Get activity ID from command line argument
const activityId = process.argv[2];

if (!activityId) {
  console.error('❌ Error: Activity ID is required');
  console.log('Usage: bun run scripts/test-activity.ts <activity_id>');
  console.log('\nTo find an activity ID:');
  console.log('1. Go to any activity on strava.com');
  console.log('2. Look at the URL: https://www.strava.com/activities/123456789');
  console.log('3. The number is the activity ID\n');
  process.exit(1);
}

try {
  console.log(`\n🔍 Fetching activity ${activityId}...\n`);
  
  const activity = await fetchActivity(activityId, config);
  
  console.log('✅ Success! Activity data:\n');
  console.log(JSON.stringify(activity, null, 2));
  console.log('\n');
} catch (error) {
  const errorMessage = (error as Error).message;
  
  try {
    const parsedError = JSON.parse(errorMessage);
    console.error('❌ Error:', parsedError.message);
    console.error('   Code:', parsedError.code);
  } catch {
    console.error('❌ Error:', errorMessage);
  }
  
  process.exit(1);
}
```

### Step 3: Find an Activity ID

To test with a real activity:

1. Go to [strava.com](https://www.strava.com) and log in
2. Navigate to any activity (yours or a public one)
3. Look at the URL: `https://www.strava.com/activities/123456789`
4. The number (`123456789`) is the activity ID

### Step 4: Run the Test

```bash
# Make sure your .env file is set up
bun run scripts/test-activity.ts 123456789
```

### Example Output

```
🔍 Fetching activity 123456789...

✅ Success! Activity data:

{
  "type": "Ride",
  "sport_type": "Ride",
  "id": 123456789,
  "name": "Morning Ride",
  "distance": 50000,
  "elevation_gain": 500,
  "start_date": "2024-01-01T08:00:00Z",
  "average_speed": 25.5,
  "calories": 800
}
```

## Token Refresh Flow

Access tokens expire after **6 hours**. The Activity module can automatically refresh tokens if you provide:

- `refreshToken`
- `clientId`
- `clientSecret`

When a 401 (Unauthorized) error occurs, the module will:
1. Detect the expired token
2. Automatically call the refresh endpoint
3. Retry the original request with the new token

You don't need to manually refresh tokens - the module handles it automatically!

### Manual Token Refresh

If you need to manually refresh a token:

```typescript
import refreshToken from './packages/strava-activity/refresh-token';

const newAccessToken = await refreshToken({
  accessToken: 'expired-token',
  refreshToken: 'your-refresh-token',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
});

console.log('New access token:', newAccessToken);
```

## Troubleshooting

### Error: "Activity not found" (404)

- Make sure the activity ID is correct
- Verify the activity exists and is accessible
- Check if you need `activity:read_all` scope for private activities

### Error: "Authentication failed" (401)

- Your access token may have expired (tokens last 6 hours)
- Make sure you're using a valid access token
- If you have refresh token configured, the module should auto-refresh

### Error: "Insufficient permissions" (403)

- You may need `activity:read_all` scope instead of `activity:read`
- The activity might be private and require additional permissions

### Error: "Rate limit exceeded" (429)

- You've made too many requests (600 per 15 minutes)
- The module will automatically retry after waiting
- Wait a few minutes before trying again

## Additional Resources

- [Strava API Documentation](https://developers.strava.com/docs/)
- [Strava OAuth Guide](https://developers.strava.com/docs/authentication/)
- [Strava API Reference](https://developers.strava.com/docs/reference/)
- [Activity Module Specification](../openspec/specs/activity/spec.md)
