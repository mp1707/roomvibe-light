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
    ],
  },
};

export default nextConfig;
