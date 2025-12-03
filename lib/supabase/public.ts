/**
 * @file public.ts
 * @description 공개 데이터용 Supabase 클라이언트 (서버 컴포넌트용)
 * 
 * 로그인 없이도 접근 가능한 공개 데이터를 조회할 때 사용합니다.
 * 인증이 필요 없는 데이터(타임라인, 병원 정보 등)에 사용합니다.
 */

import { createClient } from "@supabase/supabase-js";

/**
 * 공개 데이터용 Supabase 클라이언트 생성
 * 인증 없이 anon key만 사용합니다.
 * 
 * @example
 * ```tsx
 * // Server Component
 * import { createPublicSupabaseClient } from '@/lib/supabase/public';
 * 
 * export default async function MyPage() {
 *   const supabase = createPublicSupabaseClient();
 *   const { data } = await supabase.from('stages').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}


