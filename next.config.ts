import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  devIndicators: {
    position: 'bottom-right',
  },
  experimental: {
    viewTransition: true,
    instantNavigationDevToolsToggle: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
