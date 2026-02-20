# Multi-stage Dockerfile for TORQ application
# Builds both UI and server in optimized layers

# Stage 1: Base dependencies
FROM node:24-alpine AS base

# Install bun globally
RUN npm install -g bun@latest

WORKDIR /app

# Copy package files for dependency installation
COPY package.json bun.lockb ./
COPY packages/*/package.json ./packages/

# Create package directory structure
RUN for file in packages/*/package.json; do \
      dir=$(dirname "$file"); \
      mkdir -p "$dir"; \
      mv "$file" "$dir/"; \
    done

# Stage 2: Install dependencies
FROM base AS deps

# Install all dependencies (including dev dependencies for building)
RUN bun install --frozen-lockfile

# Stage 3: Build server
FROM deps AS server-builder

# Copy server source code
COPY packages/server ./packages/server
COPY packages/strava-api ./packages/strava-api
COPY packages/generate-strava-activity-image ./packages/generate-strava-activity-image
COPY packages/get-strava-activity-signals ./packages/get-strava-activity-signals
COPY packages/get-strava-activity-image-generation-prompt ./packages/get-strava-activity-image-generation-prompt
COPY packages/check-forbidden-content ./packages/check-forbidden-content

# Build server
WORKDIR /app/packages/server
RUN bun run build

# Stage 4: Build UI
FROM deps AS ui-builder

# Copy UI source code
COPY packages/ui ./packages/ui

# Build UI for production (standalone output for Docker)
WORKDIR /app/packages/ui
ENV NEXT_OUTPUT=standalone
RUN bun run build

# Stage 5: Production server runtime
FROM node:24-alpine AS server-runtime

WORKDIR /app

# Copy only production dependencies and built server
COPY --from=server-builder /app/package.json ./
COPY --from=server-builder /app/bun.lockb ./
COPY --from=server-builder /app/packages/server/dist ./packages/server/dist
COPY --from=server-builder /app/packages/server/package.json ./packages/server/

# Copy workspace packages that server depends on
COPY --from=server-builder /app/packages/strava-api ./packages/strava-api
COPY --from=server-builder /app/packages/generate-strava-activity-image ./packages/generate-strava-activity-image
COPY --from=server-builder /app/packages/get-strava-activity-signals ./packages/get-strava-activity-signals
COPY --from=server-builder /app/packages/get-strava-activity-image-generation-prompt ./packages/get-strava-activity-image-generation-prompt
COPY --from=server-builder /app/packages/check-forbidden-content ./packages/check-forbidden-content

# Install bun for runtime
RUN npm install -g bun@latest

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Expose server port
EXPOSE 3000

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Run server
CMD ["node", "packages/server/dist/server.js"]

# Stage 6: UI Next.js server
FROM node:24-alpine AS ui-runtime

WORKDIR /app

# Copy built Next.js output and required files
COPY --from=ui-builder /app/packages/ui/.next/standalone ./
COPY --from=ui-builder /app/packages/ui/.next/static ./packages/ui/.next/static
COPY --from=ui-builder /app/packages/ui/public ./packages/ui/public

# Expose Next.js port
EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Run Next.js standalone server
CMD ["node", "packages/ui/server.js"]
