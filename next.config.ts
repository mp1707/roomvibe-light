import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance optimizations */


  // Moved from experimental as per Next.js warning
  serverExternalPackages: ["stripe", "replicate", "openai"],

  // Compiler optimizations
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },

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
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Bundle analysis (uncomment for debugging)
  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     config.resolve.alias = {
  //       ...config.resolve.alias,
  //       '@/components': path.resolve(__dirname, 'src/components'),
  //       '@/utils': path.resolve(__dirname, 'src/utils'),
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
