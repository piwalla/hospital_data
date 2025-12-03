import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  // 다중 lockfile 경고 해결을 위한 workspace root 설정
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
