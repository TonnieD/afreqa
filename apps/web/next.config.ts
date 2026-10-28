import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  reactStrictMode: true,
  serverExternalPackages: ["@afreqa/core", "@node-rs/argon2", "sharp", "pg-boss"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Basic images only; videos must use Tus protocol
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("@node-rs/argon2");
    }
    return config;
  },
};

export default nextConfig;
