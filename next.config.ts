import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The photos are already small, pre-compressed WebP files. Serving them as-is keeps the
  // site off Vercel's image-optimization quota entirely (relevant on the free Hobby plan).
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/", destination: "/invitation", permanent: false },
      // links shared before the card moved to /invitation keep working
      { source: "/cards/ref/:slug", destination: "/invitation", permanent: true },
    ];
  },
};

export default nextConfig;
