/**
 * 커뮤니티 기능 관련 타입 정의
 */

// 부상 유형
export type InjuryType = 'fracture' | 'nerve' | 'burn' | 'amputation' | 'other';

// 지역 유형
export type RegionType = 'metropolitan' | 'non_metropolitan';

// 카테고리 유형
export type CategoryType = 'injury' | 'region' | 'anonymous';

// 카테고리 값
export type CategoryValue = InjuryType | RegionType | null;

// 게시글
export interface CommunityPost {
  id: string;
  user_id: string;
  author_name: string;
  is_anonymous: boolean;
  title: string;
  content: string;
  category: CategoryType;
  category_value: CategoryValue;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// 댓글
export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  is_anonymous: boolean;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// 좋아요
export interface CommunityLike {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
}

// 게시글 작성 데이터
export interface CreatePostData {
  title: string;
  content: string;
  category: CategoryType;
  category_value: CategoryValue;
  is_anonymous?: boolean;
}

// 댓글 작성 데이터
export interface CreateCommentData {
  post_id: string;
  content: string;
  is_anonymous?: boolean;
}

// 게시글 목록 필터
export interface PostFilter {
  category?: CategoryType;
  category_value?: CategoryValue;
  sort?: 'latest' | 'popular' | 'comments';
  limit?: number;
  offset?: number;
}
