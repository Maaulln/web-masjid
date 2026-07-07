import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Mematikan error type check saat build di Vercel (opsional)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
