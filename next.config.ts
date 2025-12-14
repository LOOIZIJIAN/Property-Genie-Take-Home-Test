import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'd1u14yaqwsw479.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
