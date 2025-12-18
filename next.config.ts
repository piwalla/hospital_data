import type { NextConfig } from "next";
import path from "path";

// Supabase URL에서 호스트명 추출
function getSupabaseHostname(): string | undefined {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return undefined;
  
  try {
    const url = new URL(supabaseUrl);
    return url.hostname;
  } catch {
    // URL 파싱 실패 시 수동 파싱
    return supabaseUrl
      .replace(/^https?:\/\//, '')
      .split('/')[0];
  }
}

const supabaseHostname = getSupabaseHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      // Supabase Storage 이미지 도메인 추가
      ...(supabaseHostname ? [{
        hostname: supabaseHostname,
        protocol: 'https' as const,
      }] : []),
    ],
  },
  // 다중 lockfile 경고 해결을 위한 workspace root 설정
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
