-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_post_view(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts
  SET view_count = view_count + 1
  WHERE id = post_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
