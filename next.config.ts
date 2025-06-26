import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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
};

export default nextConfig;
