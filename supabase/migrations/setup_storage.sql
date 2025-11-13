-- 리워크케어(ReWorkCare) Storage 설정
-- Public 버킷으로 설정, 이미지 파일 전용, RLS 미사용

-- 1. UPLOADS 버킷 생성 (이미지 파일 저장용)

-- uploads 버킷 생성 (이미 존재하면 업데이트)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,  -- public bucket (누구나 접근 가능)
  52428800,  -- 50MB 제한 (50 * 1024 * 1024)
  ARRAY['image/*']  -- 이미지 파일 타입만 허용
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/*'];

-- 2. RLS 정책 생성 (모든 사용자 접근 허용)

-- 이 프로젝트는 RLS를 사용하지 않으므로 모든 사용자에게 모든 작업 허용
CREATE POLICY "all_user_crud"
ON storage.objects FOR ALL
TO anon, authenticated, service_role
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');

-- 3. 기존 정책 정리 (필요시)

-- 기존 정책들이 있다면 삭제 (중복 방지)
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
