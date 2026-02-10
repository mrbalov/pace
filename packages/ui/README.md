# @pace/ui

Single Page Application (SPA) UI package for PACE built with React, Vite, and Geist UI. This package provides a pure client-side application that communicates with the `/packages/server` backend API.

## Features

- **Pure SPA**: No server capabilities - just static HTML, CSS, and JavaScript
- **React**: Modern React 18 with TypeScript
- **Geist UI**: Beautiful, accessible UI components from Vercel's design system
- **Vite**: Lightning-fast development server with Hot Module Replacement (HMR)
- **Wouter**: Minimal, fast routing library
- **Dark Mode**: Automatic dark mode support via Geist UI
- **Cookie-Based Auth**: Uses HTTP-only cookies from backend for secure authentication

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│  Vite Dev    │────────▶│   Server    │
│   (SPA)     │         │  Server      │         │   (API)     │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │  React App   │
                        │  + Geist UI  │
                        └──────────────┘
```

The UI package is a pure static site that:

- Uses Vite for development and production builds
- Makes API calls to `/packages/server` backend
- Uses cookies automatically for authentication (via `credentials: 'include'`)
- Leverages Vite proxy during development to avoid CORS issues

## Installation

This package is part of the PACE monorepo and is automatically available.

## Development

### Prerequisites

1. Backend server (`/packages/server`) must be running on `http://localhost:3000`
2. Install dependencies: `bun install` (or `npm install`)

### Start Development Server

```bash
cd packages/ui
bun run dev
```

Vite will start on `http://localhost:3001` with:

- Hot Module Replacement (instant updates)
- React Fast Refresh (preserves component state)
- Proxy to backend API (no CORS issues in development)

### Build for Production

```bash
bun run build
```

Output: `packages/ui/dist/` (ready for static hosting)

### Preview Production Build

```bash
bun run preview
```

Starts a local server to preview the production build.

## Project Structure

```
packages/ui/
├── src/                    # Source code
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Root app component with routing
│   ├── api/               # API client
│   │   ├── client.ts      # Base fetch wrapper
│   │   ├── strava.ts      # Strava API methods
│   │   └── hooks.ts       # React hooks for API calls
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx   # Home page
│   │   └── ActivitiesPage.tsx  # Activities list page
│   └── vite-env.d.ts      # Environment type definitions
├── index.html             # HTML entry point (Vite requires root)
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript config for Vite config
├── package.json
└── README.md
```

## Configuration

### Environment Variables

Create a `.env` file in `packages/ui/`:

```bash
# Backend API URL (optional with Vite proxy)
# If not set, Vite proxy will forward /strava requests to localhost:3000
VITE_API_URL=http://localhost:3000
```

For production, set `VITE_API_URL` to your deployed backend URL.

**Note**: During development, Vite's proxy configuration automatically forwards `/strava` requests to `http://localhost:3000`, so you may not need to set `VITE_API_URL` locally.

### Backend CORS Configuration

The backend (`/packages/server`) must be configured to allow requests from the UI origin. Set the `UI_ORIGIN` environment variable in the server:

```bash
# In /packages/server/.env
UI_ORIGIN=http://localhost:3001
```

For production, set it to your deployed UI URL.

## Usage

### Pages

- `/` - Home page with Strava authorization button
- `/activities` - List of user's Strava activities (requires authentication)

### Authentication Flow

1. User clicks "Authorize with Strava" on home page
2. Browser redirects to backend `/strava/auth` endpoint
3. Backend redirects to Strava OAuth page
4. User authorizes on Strava
5. Strava redirects to backend `/strava/auth/callback`
6. Backend sets HTTP-only cookies and redirects back to UI
7. UI makes API calls with cookies automatically included

### API Client

The API client provides both plain functions and React hooks:

```typescript
// Plain functions (for non-React code)
import { authorizeStrava, fetchActivities } from './api/strava';

authorizeStrava(); // Redirects to OAuth
const activities = await fetchActivities();

// React hooks (for components)
import { useActivities } from './api/hooks';

function MyComponent() {
  const { activities, loading, error, refetch } = useActivities();
  // ...
}
```

All API calls automatically include cookies via `credentials: 'include'`.

## Building for Production

```bash
bun run build
```

This creates an optimized production build in `dist/` directory. The entire `dist/` directory can be deployed as a static site.

## Deployment

The UI package is a pure static site and can be deployed to any static hosting service:

### Netlify

The `netlify.toml` file is already configured for deployment:

1. Connect your repository to Netlify
2. Set **Base directory** to: `packages/ui` (if deploying from monorepo root)
3. Netlify will automatically detect the build settings from `netlify.toml`:
   - Build command: `bun install && bun run build`
   - Publish directory: `dist`
   - SPA redirects configured automatically
4. Add environment variable in Netlify dashboard: `VITE_API_URL=https://your-backend-url.com`

The `netlify.toml` file includes:

- SPA routing redirects (all routes → `index.html`)
- Security headers
- Static asset caching
- HTML cache control

### Vercel

1. Set **Root Directory** to: `packages/ui`
2. Set **Build Command** to: `bun run build` (or `npm run build`)
3. Set **Output Directory** to: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Cloudflare Pages

1. Set **Build command** to: `bun run build` (or `npm run build`)
2. Set **Build output directory** to: `dist`
3. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### S3 + CloudFront

1. Build: `bun run build`
2. Upload contents of `dist/` to S3 bucket
3. Configure CloudFront to serve from S3
4. Set environment variable in your deployment process

### SPA Routing

For client-side routing to work, configure your hosting service to serve `index.html` for all routes:

- **Netlify**: Add `_redirects` file in `public/`:

  ```
  /*    /index.html   200
  ```

  Or configure in `netlify.toml`:

  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

- **Vercel**: Add `vercel.json`:

  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

- **Cloudflare Pages**: Routing works automatically

- **S3 + CloudFront**: Configure error pages to return `index.html` for 404s

## Technologies

### React 18

- Modern React with hooks
- TypeScript for type safety
- React Fast Refresh for instant updates

### Vite

- Lightning-fast development server
- Hot Module Replacement (HMR)
- Optimized production builds
- Built-in TypeScript support
- Proxy configuration for API calls

### Geist UI

- Vercel's design system components
- Beautiful, accessible components
- Dark mode support
- Full TypeScript support
- [Component Reference](https://geist-ui.dev/)

### Wouter

- Minimal routing library (~2KB)
- React Router compatible API
- No configuration needed
- [Documentation](https://github.com/molefrog/wouter)

## Vite Proxy Benefits

The Vite proxy configuration eliminates CORS complexity during development:

```typescript
server: {
  proxy: {
    '/strava': {
      target: 'http://localhost:3000',
      credentials: 'include', // Forward cookies
    },
  },
}
```

Requests to `/strava/auth` are automatically forwarded to `http://localhost:3000/strava/auth` with cookies preserved. In production, the app uses the configured `VITE_API_URL` environment variable.

## Type Safety

TypeScript provides full type safety:

- React component props
- API response types
- Environment variables (`VITE_API_URL`)
- Router params

## Bundle Size

Approximate production bundle sizes (gzipped):

- React + React DOM: ~45 KB
- Geist UI: ~30 KB
- Wouter: ~1 KB
- Application code: ~10 KB
- **Total**: ~86 KB gzipped

Much smaller than many alternatives while maintaining great developer experience.

## Browser Support

- Modern browsers with ES2020 support
- React 18 compatible browsers
- Fetch API with credentials support

## Troubleshooting

### CORS Errors

If you see CORS errors:

1. **Development**: Vite proxy should handle this automatically. Check `vite.config.ts` proxy settings.
2. **Production**: Verify `UI_ORIGIN` is set correctly in backend
3. Check that backend CORS headers include your UI origin
4. Ensure `credentials: 'include'` is used in fetch calls

### Cookies Not Working

1. Verify backend is setting cookies correctly
2. Check cookie domain matches your setup
3. Ensure `credentials: 'include'` is used in fetch calls
4. For production, ensure both UI and backend are on HTTPS

### Build Errors

1. Run `bun install` (or `npm install`) to ensure dependencies are installed
2. Check that all required packages are in `package.json`
3. Verify TypeScript configuration
4. Check for TypeScript errors: `bun run build` will show them

### Vite Dev Server Issues

1. Check that port 3001 is available
2. Verify `vite.config.ts` is correct
3. Check browser console for errors
4. Try clearing browser cache

### API Errors

1. Verify backend server is running on `http://localhost:3000`
2. Check `VITE_API_URL` environment variable (if set)
3. Verify backend endpoints are accessible
4. Check browser console for detailed error messages
5. In development, verify Vite proxy is working (check Network tab)

### React Fast Refresh Not Working

1. Ensure components are exported as default or named exports
2. Check that components are React components (not regular functions)
3. Verify file extensions are `.tsx` for React components

## Development Tips

### Hot Module Replacement

Vite's HMR updates your app instantly when you save files. React Fast Refresh preserves component state during updates.

### TypeScript

All files use TypeScript for type safety. The build will fail if there are type errors, ensuring type safety in production.

### Geist UI Theming

Geist UI supports theming. You can customize the theme in `src/main.tsx`:

```tsx
import { GeistProvider, CssBaseline } from '@geist-ui/core';

<GeistProvider themeType="dark">
  {' '}
  {/* or "light" */}
  <CssBaseline />
  <App />
</GeistProvider>;
```

### Adding New Routes

Add routes in `src/App.tsx`:

```tsx
<Route path="/new-route" component={NewPage} />
```

## See Also

- [@pace/server](../server/README.md) - Backend API server
- [Geist UI Documentation](https://geist-ui.dev/) - UI component library
- [Vite Documentation](https://vitejs.dev/) - Build tool and dev server
- [React Documentation](https://react.dev/) - React framework
- [Wouter Documentation](https://github.com/molefrog/wouter) - Routing library
