# @pace/ui

UI server package for PACE that provides web endpoints for Strava OAuth authorization and token management.

## Features

- **OAuth Flow**: Complete Strava OAuth2 authorization flow
- **Cookie Storage**: Secure HTTP-only cookie storage for tokens
- **Token Management**: Automatic token storage and retrieval
- **Bun Server**: Built on Bun.serve() for high performance

## Installation

This package is part of the PACE monorepo and is automatically available.

## Quick Start

### 1. Configure Strava Application

**IMPORTANT**: The redirect URI in your Strava app settings must exactly match what you configure here!

1. Go to [Strava Developers](https://www.strava.com/settings/api)
2. Edit your application settings
3. Set **Authorization Callback Domain** to: `localhost:3000`
   - Note: Strava uses the domain only, not the full URL
4. The full redirect URI will be: `http://localhost:3000/strava/auth/callback`

### 2. Set Environment Variables

Create a `.env` file in the project root:

```bash
STRAVA_CLIENT_ID=your-client-id
STRAVA_CLIENT_SECRET=your-client-secret
STRAVA_REDIRECT_URI=http://localhost:3000/strava/auth/callback
```

**Note**: The `STRAVA_REDIRECT_URI` must match what's configured in your Strava app. If Strava redirects to a different URL, check your app settings!

### 3. Start the Server

```bash
cd packages/ui
bun run dev
```f

Or from the project root:

```bash
bun run --filter @pace/ui dev
```

### 4. Authorize Strava

Visit `http://localhost:3000/strava/auth` in your browser. You'll be redirected to Strava to authorize the application. After authorization, tokens will be saved as cookies and you'll be redirected back.

## Endpoints

### GET `/strava/auth`

Initiates the Strava OAuth flow. Redirects the user to Strava's authorization page.

**Example:**
```
GET http://localhost:3000/strava/auth
```

**Response:** 302 Redirect to Strava authorization URL

### GET `/strava/auth/callback`

Handles the OAuth callback from Strava. Exchanges the authorization code for tokens and saves them as HTTP-only cookies.

**Query Parameters:**
- `code` (required): Authorization code from Strava
- `error` (optional): OAuth error code if authorization failed

**Response:** 302 Redirect with Set-Cookie headers

**Cookies Set:**
- `strava_access_token`: OAuth2 access token
- `strava_refresh_token`: OAuth2 refresh token
- `strava_token_expires_at`: Token expiration timestamp (Unix time)

## Usage in Other Pages

### Reading Tokens from Cookies

```typescript
import { getTokens } from '@pace/ui';

// In your route handler
const tokens = getTokens(request);

if (tokens) {
  const { accessToken, refreshToken, expiresAt } = tokens;
  // Use tokens to fetch activities
}
```

### Fetching Activities

```typescript
import { getTokens } from '@pace/ui';
import { fetchActivity } from '@pace/activity';
import getConfig from '@pace/ui/config';

// In your route handler
const tokens = getTokens(request);
const config = getConfig();

if (!tokens) {
  // Redirect to /strava/auth if no tokens
  return new Response(null, {
    status: 302,
    headers: { Location: '/strava/auth' },
  });
}

// Check if token is expired
const isExpired = tokens.expiresAt < Math.floor(Date.now() / 1000);
if (isExpired) {
  // Refresh token using @pace/strava-auth
  // Then update cookies
}

// Fetch activity
const activity = await fetchActivity('123456789', {
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken,
  clientId: config.strava.clientId,
  clientSecret: config.strava.clientSecret,
});
```

## Configuration

Configuration is loaded from environment variables:

### Required

- `STRAVA_CLIENT_ID`: Strava OAuth2 client ID
- `STRAVA_CLIENT_SECRET`: Strava OAuth2 client secret

### Optional

- `STRAVA_REDIRECT_URI`: OAuth redirect URI (default: `http://localhost:3000/strava/auth/callback`)
- `STRAVA_SCOPE`: OAuth scope (default: `activity:read`)
- `HOSTNAME`: Server hostname (default: extracted from Netlify's `URL` env var if available, otherwise `localhost`)
- `COOKIE_DOMAIN`: Cookie domain (default: undefined)
- `COOKIE_SECURE`: Secure cookies flag (default: `false` in dev, `true` in production)
- `COOKIE_SAME_SITE`: SameSite attribute (default: `lax`)
- `SUCCESS_REDIRECT`: Redirect URL after successful auth (default: `/`)
- `ERROR_REDIRECT`: Redirect URL after auth failure (default: `/`)

## Cookie Security

Cookies are set with the following security attributes:

- **HttpOnly**: Prevents JavaScript access (XSS protection)
- **Secure**: HTTPS only (enabled in production)
- **SameSite**: CSRF protection (default: `lax`)
- **Path**: `/` (available site-wide)
- **Max-Age**: Based on token expiration time

## API Reference

### `getTokens(request: Request)`

Extracts Strava OAuth tokens from request cookies.

**Parameters:**
- `request`: HTTP Request object

**Returns:** `{ accessToken: string; refreshToken: string; expiresAt: number } | null`

### `setTokens(response: Response, accessToken: string, refreshToken: string, expiresAt: number, cookieConfig: ServerConfig['cookies'])`

Sets Strava OAuth tokens as HTTP-only cookies in the response.

**Parameters:**
- `response`: HTTP Response object
- `accessToken`: OAuth2 access token
- `refreshToken`: OAuth2 refresh token
- `expiresAt`: Token expiration timestamp (Unix time)
- `cookieConfig`: Cookie configuration

**Returns:** Response with Set-Cookie headers

### `getConfig()`

Gets server configuration from environment variables.

**Returns:** `ServerConfig`

**Throws:** Error if required environment variables are missing

## Testing

Run unit tests:

```bash
bun test packages/ui
```

## Example: Complete Activity Fetch Flow

```typescript
import { getTokens } from '@pace/ui';
import { fetchActivity } from '@pace/activity';
import { refreshToken } from '@pace/strava-auth';
import { setTokens } from '@pace/ui/cookies';
import getConfig from '@pace/ui/config';

Bun.serve({
  routes: {
    '/activity/:id': {
      GET: async (request) => {
        const url = new URL(request.url);
        const activityId = url.pathname.split('/').pop()!;
        const config = getConfig();
        
        // Get tokens from cookies
        let tokens = getTokens(request);
        
        if (!tokens) {
          // No tokens, redirect to auth
          return new Response(null, {
            status: 302,
            headers: { Location: '/strava/auth' },
          });
        }
        
        // Check if token expired
        const isExpired = tokens.expiresAt < Math.floor(Date.now() / 1000);
        if (isExpired) {
          // Refresh token
          const newTokens = await refreshToken(tokens.refreshToken, {
            clientId: config.strava.clientId,
            clientSecret: config.strava.clientSecret,
            redirectUri: config.strava.redirectUri,
          });
          
          // Update cookies
          const response = new Response();
          setTokens(
            response,
            newTokens.access_token,
            newTokens.refresh_token || tokens.refreshToken,
            newTokens.expires_at,
            config.cookies
          );
          
          tokens = {
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token || tokens.refreshToken,
            expiresAt: newTokens.expires_at,
          };
        }
        
        // Fetch activity
        const activity = await fetchActivity(activityId, {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          clientId: config.strava.clientId,
          clientSecret: config.strava.clientSecret,
        });
        
        return new Response(JSON.stringify(activity), {
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
  },
});
```

## Deployment to Netlify

This package can be deployed to Netlify using Netlify Functions. The functions are located in `netlify/functions/` and use the same route handlers as the Bun server.

### Prerequisites

1. A Netlify account ([sign up here](https://app.netlify.com/signup))
2. Your Strava API credentials (Client ID and Client Secret)
3. A GitHub repository with your code (or GitLab/Bitbucket)

### Step 1: Set Up Environment Variables

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:

```
STRAVA_CLIENT_ID=your-client-id
STRAVA_CLIENT_SECRET=your-client-secret
STRAVA_REDIRECT_URI=https://your-site.netlify.app/strava/auth/callback
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
```

**Important**: Replace `your-site.netlify.app` with your actual Netlify domain.

### Step 2: Update Strava App Settings

1. Go to [Strava Developers](https://www.strava.com/settings/api)
2. Edit your application
3. Set **Authorization Callback Domain** to your domain (e.g., `pace.balov.dev` or `your-site.netlify.app`)
   - **Important**: This should be just the domain, without `https://` or any path
4. The redirect URI in your OAuth request (e.g., `https://pace.balov.dev/strava/auth/callback`) must match a path on the registered domain
5. Save changes

**Troubleshooting**: If you see a "redirect_uri invalid" error:
- Verify the `STRAVA_REDIRECT_URI` environment variable in Netlify matches exactly what you're using (including `https://`)
- Check that your Authorization Callback Domain in Strava matches the domain part of your redirect URI
- Ensure there are no trailing slashes or extra characters
- The redirect URI must use HTTPS for production (Strava requires HTTPS for non-localhost domains)

### Step 3: Configure Build Settings

In Netlify dashboard:

1. Go to **Site settings** → **Build & deploy**
2. Set **Base directory** to: `packages/ui`
3. Set **Build command** to: (default from `netlify.toml` is recommended)
   - Default: `curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun run build`
   - This installs Bun if needed, then builds browser code from `browser/` to `public/js/`
   - If Bun is already available in your build environment, you can use: `bun run build`
4. Set **Publish directory** to: `public` (relative to base directory)

**Important**: 
- The `publish` directory must be set in the Netlify dashboard, not in `netlify.toml`, because Netlify resolves paths in `netlify.toml` relative to the repo root, not the base directory.
- The build command is required to bundle browser components from TypeScript to JavaScript.
- Static files in `public/js/` (like `components.js` and `app.js`) are served automatically by Netlify before redirects are processed.

### Step 4: Deploy

#### Option A: Deploy via Netlify Dashboard

1. Go to your Netlify dashboard
2. Click **Add new site** → **Import an existing project**
3. Connect your Git repository
4. Configure:
   - **Base directory**: `packages/ui`
   - **Build command**: `bun run build` (or `npm run build` if Bun is not available)
   - **Publish directory**: `public`
5. Add environment variables (see Step 1)
6. Click **Deploy site**

#### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Navigate to the UI package:
   ```bash
   cd packages/ui
   ```

4. Initialize Netlify (if not already done):
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Set base directory: `packages/ui`
   - Set publish directory: `public`

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Step 5: Verify Deployment

1. Visit your Netlify site URL
2. Test the authorization flow:
   - Visit `https://your-site.netlify.app/strava/auth`
   - You should be redirected to Strava
   - After authorization, you should be redirected back

### Testing Locally

You can test Netlify Functions locally using Netlify CLI:

```bash
cd packages/ui
netlify dev
```

This will start a local development server that simulates Netlify's environment.

### Troubleshooting

#### Deploy Directory Does Not Exist

If you see the error: `Deploy directory 'public' does not exist`

**Solution:**
1. Go to **Site settings** → **Build & deploy**
2. Ensure **Base directory** is set to: `packages/ui`
3. Ensure **Publish directory** is set to: `public` (relative to base directory)
4. **Important**: Do NOT set `publish` in `netlify.toml` - paths in that file are resolved relative to the repo root, not the base directory
5. The `public` directory must exist at `packages/ui/public/`

#### Functions Not Working

- Check Netlify Function logs in the dashboard (Site settings → Functions)
- Verify environment variables are set correctly
- Ensure `netlify.toml` is in the `packages/ui/` directory
- Check that functions are being built (look for function files in deploy logs)

#### Redirect URI Mismatch

- Ensure `STRAVA_REDIRECT_URI` matches your Netlify domain exactly
- Verify Strava app settings match the redirect URI
- Check that the domain doesn't have trailing slashes
- Make sure you're using `https://` in production

#### Cookie Issues

- Ensure `COOKIE_SECURE=true` in production (required for HTTPS)
- Check `COOKIE_DOMAIN` if using a custom domain
- Verify `COOKIE_SAME_SITE` is set appropriately (`lax` or `none` for cross-site)
- Cookies should work across all functions on the same domain

#### Module Import Errors

- Ensure all dependencies are listed in `package.json`
- Check that TypeScript files are being transpiled correctly
- Verify that `node_bundler = "esbuild"` is set in `netlify.toml`
- Ensure the build command runs successfully (check build logs)

#### Build Command Fails

If `bun run build` fails in Netlify:

1. **Install Bun in build environment**: Add a build command that installs Bun first:
   ```
   curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun run build
   ```
   Or set it in Netlify dashboard: **Build & deploy** → **Build command**

2. **Alternative**: Commit the built files (`public/js/components.js` and `public/js/app.js`) to the repository so the build step isn't required (not recommended for production)

3. **Check build logs**: Look for errors in the Netlify build logs to see what's failing

### Netlify File Structure

```
packages/ui/
├── netlify.toml              # Netlify configuration (must be in base directory)
├── netlify/
│   └── functions/            # Netlify Functions
│       ├── strava-auth.ts
│       ├── strava-auth-callback.ts
│       └── root.ts
├── server/                   # Server-side code
│   ├── server.ts             # Bun server entry point
│   ├── routes/               # Route handlers
│   ├── templates/            # HTML template generators
│   ├── config/               # Server configuration
│   └── cookies/              # Cookie utilities
├── browser/                  # Browser-side code
│   ├── index.ts              # Components entry point
│   ├── app.ts                # Main client app script
│   └── components/           # Web components (TypeScript)
├── public/                   # Static files and build output
│   ├── index.html
│   └── js/                   # Built browser code (generated)
│       ├── components.js
│       └── app.js
└── types.ts                  # Shared types
```

### Important Notes

- **Netlify Functions run on Node.js runtime**, not Bun. The code uses standard Web APIs (Request, Response, fetch) which are available in Node.js 18+
- Functions have a **10-second timeout** on the free plan, **26 seconds** on paid plans
- Cookies work across all functions on the same domain
- The `netlify.toml` file uses redirects to route requests to functions
- Make sure your `package.json` includes all necessary dependencies
- TypeScript files will be automatically transpiled by Netlify's esbuild bundler

## See Also

- [@pace/strava-auth](../strava-auth/README.md) - OAuth authentication package
- [@pace/activity](../activity/README.md) - Activity fetching module
