import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy /api/* → NestJS backend (avoids CORS in client components)
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:3000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
