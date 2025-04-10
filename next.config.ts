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
    domains: ['logos-world.net', 'rbgerynpltfzvbkgenva.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logos-world.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rbgerynpltfzvbkgenva.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
