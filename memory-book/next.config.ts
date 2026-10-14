import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Synced folders can create duplicate cache files that Turbopack cannot parse.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
