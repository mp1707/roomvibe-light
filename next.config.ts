import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* Performance optimizations */

  // Moved from experimental as per Next.js warning
  serverExternalPackages: ["stripe", "replicate", "openai"],

  // Simplified config for React 19 stability
  experimental: {
    // Disable problematic features
    webpackBuildWorker: false,
  },

  // Minimal webpack config for HMR stability
  webpack: (config, { dev }) => {
    if (dev) {
      // Force polling for file changes (more reliable on some systems)
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
      
      // Ensure proper module resolution
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // Only apply compiler optimizations in production
  ...(process.env.NODE_ENV === "production" && {
    compiler: {
      removeConsole: true,
    },
  }),

  // Performance optimizations
  poweredByHeader: false,

  images: {
    // Optimize image loading
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,

    remotePatterns: [
      new URL("https://kxrfeixhctmklevy.public.blob.vercel-storage.com/**"),
      new URL("https://img.daisyui.com/**"),
      // Add Supabase storage domain - replace with your actual Supabase project URL
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      new URL("https://replicate.delivery/**"),
      // Add iStock domain for mock images
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/**",
      },
      // Add localhost for development
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      // Add Google's image domains for profile pictures
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
