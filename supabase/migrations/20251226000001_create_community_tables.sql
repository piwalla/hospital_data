-- Community Feature Tables
-- 커뮤니티 기능을 위한 테이블 생성

-- 1. 게시글 테이블
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 작성자 정보
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name VARCHAR(50) NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  
  -- 게시글 내용
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  
  -- 카테고리
  -- category: 'injury', 'region', 'anonymous'
  -- category_value: 'fracture', 'nerve', 'burn', 'amputation', 'other', 'metropolitan', 'non_metropolitan', null
  category VARCHAR(20) NOT NULL,
  category_value VARCHAR(30),
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- 제약조건
  CONSTRAINT valid_category CHECK (category IN ('injury', 'region', 'anonymous')),
  CONSTRAINT valid_injury_type CHECK (
    category != 'injury' OR category_value IN ('fracture', 'nerve', 'burn', 'amputation', 'other')
  ),
  CONSTRAINT valid_region CHECK (
    category != 'region' OR category_value IN ('metropolitan', 'non_metropolitan')
  ),
  CONSTRAINT anonymous_no_value CHECK (
    category != 'anonymous' OR category_value IS NULL
  )
);

-- 2. 댓글 테이블
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 작성자 정보
  author_name VARCHAR(50) NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  
  -- 내용
  content TEXT NOT NULL,
  
  -- 통계
  like_count INTEGER DEFAULT 0,
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. 좋아요 테이블
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 제약조건: 게시글 또는 댓글 중 하나만
  CONSTRAINT like_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  -- 중복 좋아요 방지
  CONSTRAINT unique_post_like UNIQUE (user_id, post_id),
  CONSTRAINT unique_comment_like UNIQUE (user_id, comment_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category, category_value, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_popular ON community_posts(like_count DESC, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id, created_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_likes_post ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_comment ON community_likes(comment_id);

-- RLS (Row Level Security) 정책

-- 게시글 정책
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 삭제되지 않은 게시글 조회 가능
CREATE POLICY "Anyone can view non-deleted posts"
  ON community_posts FOR SELECT
  USING (deleted_at IS NULL);

-- 인증된 사용자만 게시글 작성 가능
CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 작성자만 자신의 게시글 수정 가능
CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 작성자만 자신의 게시글 삭제 가능 (소프트 삭제)
CREATE POLICY "Users can delete own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- 댓글 정책
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 삭제되지 않은 댓글 조회 가능
CREATE POLICY "Anyone can view non-deleted comments"
  ON community_comments FOR SELECT
  USING (deleted_at IS NULL);

-- 인증된 사용자만 댓글 작성 가능
CREATE POLICY "Authenticated users can create comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 작성자만 자신의 댓글 수정 가능
CREATE POLICY "Users can update own comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 작성자만 자신의 댓글 삭제 가능
CREATE POLICY "Users can delete own comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- 좋아요 정책
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 좋아요 조회 가능
CREATE POLICY "Anyone can view likes"
  ON community_likes FOR SELECT
  USING (true);

-- 인증된 사용자만 좋아요 추가 가능
CREATE POLICY "Authenticated users can add likes"
  ON community_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 좋아요만 삭제 가능
CREATE POLICY "Users can delete own likes"
  ON community_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 트리거: 게시글 좋아요 수 업데이트
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.post_id IS NOT NULL THEN
    UPDATE community_posts
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND OLD.post_id IS NOT NULL THEN
    UPDATE community_posts
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_like_count
AFTER INSERT OR DELETE ON community_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_like_count();

-- 트리거: 댓글 좋아요 수 업데이트
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.comment_id IS NOT NULL THEN
    UPDATE community_comments
    SET like_count = like_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.comment_id IS NOT NULL THEN
    UPDATE community_comments
    SET like_count = like_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_comment_like_count
AFTER INSERT OR DELETE ON community_likes
FOR EACH ROW
EXECUTE FUNCTION update_comment_like_count();

-- 트리거: 게시글 댓글 수 업데이트
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.deleted_at IS NULL THEN
    UPDATE community_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE community_posts
      SET comment_count = comment_count - 1
      WHERE id = NEW.post_id;
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE community_posts
      SET comment_count = comment_count + 1
      WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_comment_count
AFTER INSERT OR UPDATE ON community_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comment_count();

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON community_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_comments_updated_at
BEFORE UPDATE ON community_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
