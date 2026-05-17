import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow builds even with type/lint warnings (CI safety)
  typescript: { ignoreBuildErrors: false },
  eslint:     { ignoreDuringBuilds: false },
  // No image optimization needed (single-file tool)
  images: { unoptimized: true },
};

export default nextConfig;
