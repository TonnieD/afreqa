import type { NextConfig } from "next";

function getOrigin(rawUrl: string | undefined): string {
  if (!rawUrl) return "";
  try {
    return new URL(rawUrl).origin;
  } catch {
    return "";
  }
}

const umamiOrigin = getOrigin(process.env.NEXT_PUBLIC_UMAMI_URL);
const blobPublicOrigin = getOrigin(process.env.BLOB_PUBLIC_BASE_URL);
const scriptSrcExtra = umamiOrigin ? ` ${umamiOrigin}` : "";
const blobOriginExtra = blobPublicOrigin ? ` ${blobPublicOrigin}` : "";
const connectSrcExtra = `${umamiOrigin ? ` ${umamiOrigin}` : ""}${blobOriginExtra}`;

const cspReportOnlyDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://player.vimeo.com${scriptSrcExtra}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com${blobOriginExtra} https://*.vercel-storage.com https://i.ytimg.com https://i.vimeocdn.com`,
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://open.spotify.com https://www.google.com https://maps.google.com",
  `connect-src 'self' https://*.public.blob.vercel-storage.com https://blob.vercel-storage.com https://*.vercel-storage.com${connectSrcExtra}`,
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  reactStrictMode: true,
  serverExternalPackages: ["@afreqa/core", "@node-rs/argon2", "sharp", "pg-boss"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Basic images only; videos use embeds
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async headers() {
    const securityHeaders = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Content-Security-Policy-Report-Only",
        value: cspReportOnlyDirectives,
      },
    ];

    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=15552000",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
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
