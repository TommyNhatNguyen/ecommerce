import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/orders",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
