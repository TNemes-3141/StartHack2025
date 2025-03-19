import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@zilliz/milvus2-sdk-node'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.proto$/,
      use: "raw-loader", // Ensures the protobuf files are properly loaded
    });

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
