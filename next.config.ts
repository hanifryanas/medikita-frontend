import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy /api/* → NestJS backend (avoids CORS in client components)
        source: '/api/:path*',
        destination: `${process.env.NEST_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
