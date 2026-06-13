import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Serve metadata in <head> for all user agents (not streamed into <body>),
  // so SEO tools and all crawlers reliably see title/description/canonical.
  htmlLimitedBots: /.*/,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // allow photo uploads from the admin panel
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
