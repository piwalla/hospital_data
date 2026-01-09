/**
 * 커뮤니티 게시글 관련 API 함수
 */

import { supabase } from '@/lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import type {
  CommunityPost,
  CreatePostData,
  PostFilter,
} from '@/lib/types/community';



/**
 * 게시글 목록 조회
 */
export async function getPosts(filter: PostFilter = {}) {
  const {
    category,
    category_value,
    sort = 'latest',
    limit = 20,
    offset = 0,
  } = filter;

  let query = supabase
    .from('community_posts')
    .select('*')
    .is('deleted_at', null);

  // 카테고리 필터
  if (category) {
    query = query.eq('category', category);
    if (category_value) {
      query = query.eq('category_value', category_value);
    }
  }

  // 정렬
  switch (sort) {
    case 'popular':
      query = query.order('like_count', { ascending: false });
      break;
    case 'comments':
      query = query.order('comment_count', { ascending: false });
      break;
    case 'latest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // 페이지네이션
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], error };
  }

  return { posts: data as CommunityPost[], error: null };
}

/**
 * 게시글 상세 조회 (조회수 증가)
 */
export async function getPost(id: string) {
  // 조회수 증가
  await supabase.rpc('increment_post_view', { post_id: id });

  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return { post: null, error };
  }

  return { post: data as CommunityPost, error: null };
}

/**
 * 게시글 작성
 */
export async function createPost(client: SupabaseClient, userId: string, data: CreatePostData) {
  // 사용자 닉네임 가져오기 (없으면 기본값)
  const { data: profile } = await client
    .from('users')
    .select('name')
    .eq('clerk_id', userId)
    .single();

  const author_name = data.is_anonymous 
    ? `익명${Math.floor(Math.random() * 1000)}`
    : profile?.name || '사용자';

  const { data: post, error } = await client
    .from('community_posts')
    .insert({
      user_id: userId,
      author_name,
      is_anonymous: data.is_anonymous || false,
      title: data.title,
      content: data.content,
      category: data.category,
      category_value: data.category_value,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return { post: null, error };
  }

  return { post: post as CommunityPost, error: null };
}

/**
 * 게시글 수정
 */
export async function updatePost(client: SupabaseClient, id: string, data: Partial<CreatePostData>) {
  const { data: post, error } = await client
    .from('community_posts')
    .update({
      title: data.title,
      content: data.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    return { post: null, error };
  }

  return { post: post as CommunityPost, error: null };
}

/**
 * 게시글 삭제 (소프트 삭제)
 */
export async function deletePost(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('community_posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    return { error };
  }

  return { error: null };
}

/**
 * 인기 게시글 조회
 */
export async function getPopularPosts(limit: number = 5) {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .is('deleted_at', null)
    .order('like_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular posts:', error);
    return { posts: [], error };
  }

  return { posts: data as CommunityPost[], error: null };
}

/**
 * 내 게시글 조회
 */
export async function getMyPosts(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('community_posts')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my posts:', error);
    return { posts: [], error };
  }

  return { posts: data as CommunityPost[], error: null };
}
