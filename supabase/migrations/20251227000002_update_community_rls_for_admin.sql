-- 관리자가 커뮤니티 게시글을 수정/삭제할 수 있도록 RLS 정책 업데이트 (타입 캐스팅 수정)

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
DROP POLICY IF EXISTS "Users and admins can update posts" ON community_posts;
DROP POLICY IF EXISTS "Users and admins can delete posts" ON community_posts;

-- 새 정책: 작성자 본인 또는 관리자(admin)인 경우 수정 가능
CREATE POLICY "Users and admins can update posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (
    (auth.uid())::text = (user_id)::text OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.uid())::text = (user_id)::text OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 새 정책: 작성자 본인 또는 관리자(admin)인 경우 삭제(소프트 삭제) 가능
CREATE POLICY "Users and admins can delete posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (
    ((auth.uid())::text = (user_id)::text OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') 
    AND deleted_at IS NULL
  )
  WITH CHECK (
    ((auth.uid())::text = (user_id)::text OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );
