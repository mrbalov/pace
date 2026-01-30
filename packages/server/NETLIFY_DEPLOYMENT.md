# Netlify Deployment Guide

This guide explains how to deploy the PACE server package to Netlify Functions.

## Prerequisites

- A Netlify account
- Your repository connected to Netlify
- Strava OAuth app credentials

## Environment Variables

Configure these environment variables in the Netlify dashboard (Site settings → Environment variables):

### Required Variables

- **`STRAVA_CLIENT_ID`** - Your Strava OAuth client ID
- **`STRAVA_CLIENT_SECRET`** - Your Strava OAuth client secret
- **`UI_ORIGIN`** - Set to `https://pace.balov.dev` to restrict API access to your website only

### Optional Variables

- **`STRAVA_REDIRECT_URI`** - OAuth redirect URI (default: `http://localhost:3000/strava/auth/callback`)
  - **Important**: Set this to your Netlify function URL, e.g., `https://yoursite.netlify.app/strava/auth/callback`
  
- **`UI_ORIGIN`** - Frontend origin for CORS
  - **Required**: Set to `https://pace.balov.dev` to restrict access to your website only
  - Used to allow your frontend to make authenticated requests
  - Must match your UI deployment URL exactly (including protocol)
  - Only requests from this origin will be allowed by CORS

- **`NODE_ENV`** - Set to `production` for production deployments

- **`COOKIE_SECURE`** - Set to `true` for HTTPS-only cookies
  - **Required**: Must be `true` when `COOKIE_SAME_SITE=none` (browser requirement)
  - Recommended: `true` for production

- **`COOKIE_SAME_SITE`** - Cookie SameSite attribute
  - **Required for cross-origin**: Set to `none` if UI (`pace.balov.dev`) and API (`pace-api.netlify.app`) are on different domains
  - Use `lax` only if UI and API are on the same domain
  - Default: `lax` (will NOT work for cross-origin!)
  - **Important**: When set to `none`, `COOKIE_SECURE` must also be `true`

- **`COOKIE_DOMAIN`** - Cookie domain (optional, defaults to current domain)

- **`STRAVA_SCOPE`** - OAuth scope (default: `activity:read`)

- **`SUCCESS_REDIRECT`** - Redirect URL after successful authentication (default: `/`)
  - Should point to your UI, e.g., `https://yourapp.netlify.app/`

- **`ERROR_REDIRECT`** - Redirect URL after authentication failure (default: `/`)
  - Should point to your UI error page, e.g., `https://yourapp.netlify.app/error`

- **`IMAGE_PROVIDER`** - AI image generation provider (default: `pollinations`)
  - `pollinations`: Free, unlimited Pollinations.ai (no API key required, recommended for Netlify deployment)
  - Default: `pollinations` (works from Netlify without VPN)

- **`POLLINATIONS_MODEL`** - Pollinations.ai model selection (default: `flux`)
  - `flux`: Best for illustrations and cartoons, balanced quality (recommended default)
  - `seedream`: Advanced with excellent prompt understanding, creative output
  - `gpt-image-large`: High-fidelity with GPT Image 1.5 (better for photorealism)
  - `kontext`: Context-aware generation
  - Default: `flux` (produces better results for cartoon/illustration styles)

## Deployment Steps

### 1. Connect Repository to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider and select the repository

### 2. Configure Build Settings

In the Netlify site settings:

- **Base directory**: `packages/server`
- **Build command**: Leave empty or remove it (Netlify will use `netlify.toml`)
- **Publish directory**: Leave empty or set to `.` (functions-only deployment)
- **Functions directory**: `netlify/functions` (or leave empty, netlify.toml will set it)

**Important**: If you have a build command set in the Netlify UI, it will override `netlify.toml`. Either:
- Remove the build command from Netlify UI settings, OR
- Set it to match what's in `netlify.toml`: `curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && cd ../.. && bun install`

The `netlify.toml` file will automatically configure:
- Build command: Installs Bun and runs `bun install` from monorepo root
- Functions directory: `netlify/functions`
- Node.js version: 20

### 3. Add Environment Variables

1. Go to Site settings → Environment variables
2. Add all required and optional variables listed above
3. Make sure `STRAVA_REDIRECT_URI` matches your Netlify function URL

### 4. Update Strava App Settings

In your Strava app settings, update the **Authorization Callback Domain** to your Netlify domain:
- Example: `yoursite.netlify.app`

And ensure the redirect URI matches:
- Example: `https://yoursite.netlify.app/strava/auth/callback`

### 5. Deploy

1. Push your changes to the connected branch
2. Netlify will automatically trigger a build
3. Monitor the build logs in the Netlify dashboard

## Function URLs

After deployment, your functions will be available at:

- **Direct function URLs:**
  - `https://yoursite.netlify.app/.netlify/functions/strava-auth`
  - `https://yoursite.netlify.app/.netlify/functions/strava-auth-callback`
  - `https://yoursite.netlify.app/.netlify/functions/strava-logout`
  - `https://yoursite.netlify.app/.netlify/functions/strava-activities`
  - `https://yoursite.netlify.app/.netlify/functions/strava-activity`

- **Clean URLs (via redirects):**
  - `https://yoursite.netlify.app/strava/auth`
  - `https://yoursite.netlify.app/strava/auth/callback`
  - `https://yoursite.netlify.app/strava/logout`
  - `https://yoursite.netlify.app/strava/activities`
  - `https://yoursite.netlify.app/strava/activity/:id`

## Testing Locally

You can test Netlify Functions locally using the Netlify CLI:

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Navigate to server package
cd packages/server

# Start local development server
netlify dev
```

This will:
- Start a local server simulating Netlify Functions
- Use environment variables from `.env` file (if present)
- Hot-reload on code changes

## Troubleshooting

### Cookies Not Working

If cookies aren't being set properly:

1. Ensure `COOKIE_SECURE=true` and `COOKIE_SAME_SITE=none` for cross-origin setups
2. Verify `UI_ORIGIN` matches your frontend URL exactly
3. Check browser console for CORS errors
4. Ensure your frontend makes requests with `credentials: 'include'`

### CORS Errors

If you see CORS errors:

1. Verify `UI_ORIGIN` is set correctly (not `*`)
2. Check that your frontend URL matches `UI_ORIGIN` exactly (including protocol)
3. Ensure requests include `credentials: 'include'` in fetch options

### Function Not Found (404)

If functions return 404:

1. Verify `netlify.toml` has correct `functions` directory
2. Check that function files are in `netlify/functions/`
3. Ensure function files export `handler` correctly
4. Check build logs for compilation errors

### Build Failures

If builds fail:

1. Check build logs in Netlify dashboard
2. Verify Bun is available (Netlify should install it automatically)
3. Ensure all dependencies are listed in `package.json`
4. Check that TypeScript compiles without errors

## Architecture Notes

- Functions are serverless and scale automatically
- Each function is independent and can be invoked separately
- Functions share the same codebase but run in isolated environments
- Cookies work across functions via `multiValueHeaders` support
- Path parameters (like activity ID) are extracted from `event.path`

## Cost Considerations

Netlify Functions free tier includes:
- 125,000 requests/month
- 100 hours of compute time/month

For production workloads, consider upgrading to a paid plan.

## Security Best Practices

1. Never commit `STRAVA_CLIENT_SECRET` to version control
2. Use environment variables for all sensitive configuration
3. Set `COOKIE_SECURE=true` in production
4. Use `COOKIE_SAME_SITE=none` only when necessary (cross-origin)
5. Regularly rotate OAuth credentials
6. Monitor function logs for suspicious activity
