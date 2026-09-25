import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove output: 'standalone' for Vercel deployment
  // Add optional webpack config for troubleshooting
  webpack: (config) => {
    // Keep source maps enabled for better debugging
    config.devtool = 'source-map';
    return config;
  },
  images: {
    // Demo avatars and client marks are local SVGs under /public/demo.
    // Only first-party files are served, so SVG optimization is safe here.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
