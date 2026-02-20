/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce a self-contained server for Docker deployments
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  transpilePackages: [
    '@torq/strava-api',
    '@torq/get-strava-activity-signals',
    '@torq/get-strava-activity-image-generation-prompt',
  ],
};

export default nextConfig;
