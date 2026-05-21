import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  images: { unoptimized: true },
  // Required so JS/CSS assets load correctly when proxied via metriquill.com/free
  assetPrefix: "https://metriquill-free.vercel.app",
};

export default nextConfig;
