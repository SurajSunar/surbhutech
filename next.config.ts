import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //output: "standalone",
  output: "export",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
