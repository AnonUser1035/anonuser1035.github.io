import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },

  // Allow dev server access from the local network (phone testing).
  allowedDevOrigins: ['http://192.168.*.*:3000'],
};

export default nextConfig;
