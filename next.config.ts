import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Mematikan error lint saat build di Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mematikan error type check saat build di Vercel (opsional)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
