# Docker Setup for PACE

This project includes a complete Docker configuration for easy deployment and development.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Node.js 24 (for local development without Docker)

## Quick Start

### Using the Helper Script

The easiest way to run the application is using the provided helper script:

```bash
# Build Docker images
./docker-run.sh build

# Start production containers
./docker-run.sh start

# Start development with hot reloading
./docker-run.sh dev
```

### Manual Docker Commands

#### Production Mode

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

#### Development Mode (with hot reloading)

```bash
# Start development containers
docker-compose -f docker-compose.dev.yml up

# Stop development containers
docker-compose -f docker-compose.dev.yml down
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with your configuration:

```env
# Strava API Configuration
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REDIRECT_URI=http://localhost:3000/strava/auth/callback
POLLINATIONS_API_KEY=pollinations_api_key

# Optional: Custom ports
PORT=3000
UI_ORIGIN=http://localhost:3001
```

### Ports

- **UI (Frontend)**: http://localhost:3001
- **Server (Backend)**: http://localhost:3000

## Docker Architecture

### Multi-Stage Build

The Dockerfile uses a multi-stage build process for optimization:

1. **Base Stage**: Sets up Node.js 24 and Bun
2. **Dependencies Stage**: Installs all npm packages
3. **Server Builder**: Builds the server application
4. **UI Builder**: Builds the React frontend
5. **Server Runtime**: Production server image (minimal)
6. **UI Runtime**: Nginx serving static files

### Services

#### Production (`docker-compose.yml`)

- **server**: Node.js backend API (port 3000)
- **ui**: Nginx serving React app (port 3001/80)

#### Development (`docker-compose.dev.yml`)

- **server-dev**: Bun dev server with hot reloading (port 3000)
- **ui-dev**: Vite dev server with hot reloading (port 3001)

## Docker Commands Reference

### Building

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build server
docker-compose build ui

# Build with no cache
docker-compose build --no-cache
```

### Running

```bash
# Start all services (foreground)
docker-compose up

# Start in background
docker-compose up -d

# Start specific service
docker-compose up server

# View logs
docker-compose logs -f
docker-compose logs -f server
docker-compose logs -f ui
```

### Debugging

```bash
# List running containers
docker ps

# Execute command in container
docker exec -it pace-server sh
docker exec -it pace-ui sh

# View container logs
docker logs pace-server
docker logs pace-ui

# Inspect container
docker inspect pace-server
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove with volumes
docker-compose down -v

# Remove with images
docker-compose down --rmi all

# Complete cleanup
./docker-run.sh clean
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 3001 are already in use:

1. Stop the conflicting service, or
2. Change ports in `docker-compose.yml`:

```yaml
services:
  server:
    ports:
      - "3010:3000"  # Map to different host port
  ui:
    ports:
      - "3011:80"
```

### Permission Issues

If you encounter permission issues with volumes in development mode:

```bash
# Fix ownership
sudo chown -R $(whoami):$(whoami) .
```

### Build Failures

If builds fail due to network issues or package installation:

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Container Won't Start

Check logs for specific errors:

```bash
docker-compose logs server
docker-compose logs ui
```

## Performance Optimization

### Image Size

The production images are optimized for size:
- Server image: ~300MB (Node.js Alpine + app)
- UI image: ~40MB (Nginx Alpine + static files)

### Caching

Docker layers are optimized for build caching:
- Package files copied first (for dependency caching)
- Source code copied last (frequent changes)

### Resource Limits

To limit container resources, add to `docker-compose.yml`:

```yaml
services:
  server:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## Security Notes

- Never commit `.env` files with real credentials
- Use secrets management in production
- Regularly update base images for security patches
- Consider using non-root users in containers

## Support

For issues or questions about the Docker setup, please check:
- Project documentation
- Docker logs: `docker-compose logs`
- GitHub issues: https://github.com/mrbalov/pace/issues
