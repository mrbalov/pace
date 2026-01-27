# Netlify Build Settings

## Correct Build Settings for Netlify UI

When configuring your site in the Netlify dashboard, use these settings:

### Build Settings

- **Base directory**: `packages/server`
- **Build command**: **Leave empty** (or remove if already set)
  - The `netlify.toml` file will handle the build command automatically
  - If you must set it manually, use: `curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && cd ../.. && bun install`
- **Publish directory**: `.` (or leave empty)
  - Not used for functions-only deployment, but Netlify requires a value
- **Functions directory**: `netlify/functions` (or leave empty)
  - The `netlify.toml` file will set this automatically

### Important Notes

1. **Build Command Override**: If you set a build command in the Netlify UI, it will **override** the command in `netlify.toml`. Either:
   - Leave the build command **empty** in Netlify UI (recommended), OR
   - Set it to match the command in `netlify.toml`

2. **Bun Installation**: Netlify doesn't have Bun pre-installed, so the build command installs it first. This is handled automatically by `netlify.toml`.

3. **Monorepo Structure**: The build command navigates to the repo root (`cd ../..`) to install all workspace dependencies.

## Troubleshooting Build Failures

### Build fails with "bun: command not found"

**Solution**: Make sure the build command in Netlify UI is either:
- Empty (so it uses `netlify.toml`), OR
- Includes Bun installation: `curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && cd ../.. && bun install`

### Build fails with "Cannot find module"

**Solution**: The build command must run from the monorepo root to install workspace dependencies. Make sure it includes `cd ../..` before `bun install`.

### Functions not found

**Solution**: Verify the Functions directory is set to `netlify/functions` (relative to base directory `packages/server`).

## Example: Correct Netlify UI Settings

```
Base directory:     packages/server
Build command:      (empty - uses netlify.toml)
Publish directory:  .
Functions directory: netlify/functions
```
