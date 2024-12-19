import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://test.lilaclabs.ai/lilac-agent/:path*", // Target API
      },
    ];
  },
};

export default nextConfig;
