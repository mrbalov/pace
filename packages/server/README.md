# @pace/server

Server/backend package for the PACE application. Handles Strava OAuth authentication, token management, and provides server-side functionality.

## Features

- **Strava OAuth Authentication**: Handles OAuth2 authorization flow and token exchange
- **Cookie Management**: Secure token storage using HTTP-only cookies
- **Multiple Deployment Options**: Supports standalone HTTP server and serverless adapters (Netlify, Vercel)
- **TypeScript**: Fully typed with comprehensive type definitions
- **Node.js Compatible**: Compiled to standard Node.js JavaScript for deployment on any Node.js host

## Installation

This package is part of the PACE monorepo and is automatically available to other packages.

## Usage

### Standalone HTTP Server

The package can be run as a standalone HTTP server:

```bash
# Development mode (with watch)
bun run dev

# Build for production
bun run build

# Run compiled server
bun run start
# or
node dist/index.js
```

The server will:
- Listen on port specified by `PORT` environment variable (default: 3000)
- Handle routes:
  - `GET /strava/auth` - Initiates Strava OAuth flow
  - `GET /strava/auth/callback` - Handles OAuth callback

### Serverless Adapters

#### Netlify Functions

```typescript
import { stravaAuthHandler, stravaAuthCallbackHandler } from '@pace/server/adapters/netlify';

// In your Netlify function file
export const handler = stravaAuthHandler; // or stravaAuthCallbackHandler
```

#### Vercel Serverless Functions

```typescript
import { stravaAuthHandler, stravaAuthCallbackHandler } from '@pace/server/adapters/vercel';

// In your Vercel API route
export default stravaAuthHandler; // or stravaAuthCallbackHandler
```

**Note**: For Vercel, you'll need to install `@vercel/node` as a dependency:

```bash
bun add @vercel/node
```

### Direct Route Handlers

You can also use the route handlers directly:

```typescript
import { handleStravaAuth, handleStravaAuthCallback } from '@pace/server/routes';
import { getConfig } from '@pace/server/config';

const config = getConfig();
const request = new Request('http://localhost:3000/strava/auth');
const response = handleStravaAuth(request, config);
```

## Configuration

The server uses environment variables for configuration:

### Required Variables

- `STRAVA_CLIENT_ID` - Your Strava OAuth client ID
- `STRAVA_CLIENT_SECRET` - Your Strava OAuth client secret

### Optional Variables

- `STRAVA_REDIRECT_URI` - OAuth redirect URI (default: `http://localhost:3000/strava/auth/callback`)
- `STRAVA_SCOPE` - OAuth scope (default: `activity:read`)
- `PORT` - Server port (default: `3000`)
- `HOSTNAME` - Server hostname (default: `localhost` or extracted from `URL` env var)
- `NODE_ENV` - Environment (`production` enables secure cookies)
- `COOKIE_DOMAIN` - Cookie domain (default: current domain)
- `COOKIE_SECURE` - Enable secure cookies (default: `true` in production)
- `COOKIE_SAME_SITE` - SameSite cookie attribute (default: `lax`)
- `SUCCESS_REDIRECT` - Redirect URL after successful auth (default: `/`)
- `ERROR_REDIRECT` - Redirect URL after auth failure (default: `/`)

## Development

```bash
# Install dependencies (from repo root)
bun install

# Run tests
bun test

# Build
bun run build

# Development mode with watch
bun run dev
```

## Building for Production

The package compiles TypeScript to Node.js-compatible JavaScript:

```bash
bun run build
```

This will:
- Compile TypeScript to JavaScript
- Target Node.js runtime (not Bun runtime)
- Output ESM format for modern Node.js
- Bundle dependencies appropriately
- Output to `dist/` directory

The compiled output in `dist/` can be deployed to any Node.js 18+ hosting platform.

## Deployment

### Generic Node.js Hosting

1. Build the package:
   ```bash
   bun run build
   ```

2. Set environment variables on your hosting platform

3. Start the server:
   ```bash
   node dist/index.js
   ```

   Or use the start script:
   ```bash
   bun run start
   ```

### Railway

1. Connect your repository to Railway
2. Set the root directory to `packages/server`
3. Set build command: `bun run build`
4. Set start command: `node dist/index.js`
5. Configure environment variables

### Render

1. Create a new Web Service
2. Set root directory to `packages/server`
3. Set build command: `bun run build`
4. Set start command: `node dist/index.js`
5. Configure environment variables

### Fly.io

1. Create a `fly.toml` in `packages/server`:
   ```toml
   app = "your-app-name"
   primary_region = "iad"

   [build]
     builder = "paketobuildpacks/builder:base"

   [env]
     PORT = "8080"

   [[services]]
     internal_port = 8080
     protocol = "tcp"
   ```

2. Deploy:
   ```bash
   flyctl deploy
   ```

### Netlify Functions

Use the Netlify adapter as shown in the "Serverless Adapters" section above.

### Vercel

Use the Vercel adapter as shown in the "Serverless Adapters" section above.

## Project Structure

```
packages/server/
├── src/
│   ├── index.ts              # Standalone HTTP server entry point
│   ├── types.ts               # TypeScript types and constants
│   ├── config/                # Configuration management
│   │   ├── get-config.ts
│   │   └── index.ts
│   ├── cookies/               # Cookie utilities
│   │   ├── get-tokens.ts
│   │   ├── set-tokens.ts
│   │   └── index.ts
│   ├── routes/               # Route handlers
│   │   ├── strava-auth/
│   │   ├── strava-auth-callback/
│   │   └── index.ts
│   └── adapters/             # Serverless adapters
│       ├── netlify.ts
│       ├── vercel.ts
│       └── index.ts
├── dist/                     # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Testing

Tests use Bun's test runner:

```bash
bun test
```

Tests are located alongside the source files with `.test.ts` extension.

## Dependencies

- `@pace/strava-auth` - Strava OAuth2 authentication utilities

## License

MIT
