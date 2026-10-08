import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MVPでは Cache Components を使わず、クライアント中心で進める
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
