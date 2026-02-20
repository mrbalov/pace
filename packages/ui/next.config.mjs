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
  /**
   * Proxy /strava/* and /activity-image-generator/* to backend server.
   * @returns {Promise<import('next').Rewrite[]>} Array of rewrite rules.
   */
  async rewrites() {
    const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

    return [
      {
        source: '/strava/:path*',
        destination: `${apiUrl}/strava/:path*`,
      },
    ];
  },
};

export default nextConfig;
