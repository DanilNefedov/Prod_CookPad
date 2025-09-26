import type { NextConfig } from "next";


const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});


const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: false, //turn on for vercel deploy
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  
};

export default nextConfig;
// export default withBundleAnalyzer(nextConfig);