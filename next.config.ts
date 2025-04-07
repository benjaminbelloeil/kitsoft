import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure output includes static resources
  output: 'standalone',
  // Add optional webpack config for troubleshooting
  webpack: (config) => {
    // Keep source maps enabled for better debugging
    config.devtool = 'source-map';
    return config;
  },
  images: {
    domains: ['logos-world.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logos-world.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
