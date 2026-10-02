import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "easylink-api-v2.onrender.com",
      },
    ],
  },
};

export default nextConfig;
