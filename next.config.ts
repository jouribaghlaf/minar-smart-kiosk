import type { NextConfig } from "next";

/**
 * Next.js configuration for the Minar Smart Kiosk platform.
 *
 * Notes for future integration work:
 * - `images.remotePatterns` is left empty on purpose. When real map tiles,
 *   government ID photos, or CDN-hosted assets are wired in, add the
 *   relevant hostnames here.
 * - `experimental.serverActions` is not needed since all data access goes
 *   through explicit API routes (see src/app/api) to keep a clean
 *   client -> API -> service -> Prisma boundary that mirrors a real
 *   production deployment (and makes it trivial to later split the API
 *   into its own service if needed).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
