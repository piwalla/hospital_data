/**
 * 커뮤니티 댓글 및 좋아요 관련 API 함수
 */

import { supabase } from '@/lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import type {
  CommunityComment,
  CreateCommentData,
} from '@/lib/types/community';



// ============================================
// 댓글 API
// ============================================

/**
 * 게시글의 댓글 목록 조회
 */
export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('community_comments')
    .select('*')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return { comments: [], error };
  }

  return { comments: data as CommunityComment[], error: null };
}

/**
 * 댓글 작성
 */
export async function createComment(client: SupabaseClient, userId: string, data: CreateCommentData) {
  // 사용자 닉네임 가져오기
  const { data: profile } = await client
    .from('users')
    .select('name')
    .eq('clerk_id', userId)
    .single();

  const author_name = data.is_anonymous 
    ? `익명${Math.floor(Math.random() * 1000)}`
    : profile?.name || '사용자';

  const { data: comment, error } = await client
    .from('community_comments')
    .insert({
      post_id: data.post_id,
      user_id: userId,
      author_name,
      is_anonymous: data.is_anonymous || false,
      content: data.content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return { comment: null, error };
  }

  return { comment: comment as CommunityComment, error: null };
}

/**
 * 댓글 수정
 */
export async function updateComment(client: SupabaseClient, id: string, content: string) {
  const { data: comment, error } = await client
    .from('community_comments')
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    return { comment: null, error };
  }

  return { comment: comment as CommunityComment, error: null };
}

/**
 * 댓글 삭제 (소프트 삭제)
 */
export async function deleteComment(client: SupabaseClient, id: string) {
  const { error } = await client
    .from('community_comments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    return { error };
  }

  return { error: null };
}

// ============================================
// 좋아요 API
// ============================================

/**
 * 게시글 좋아요 추가/취소
 */
export async function togglePostLike(client: SupabaseClient, userId: string, postId: string) {
  // 이미 좋아요했는지 확인
  const { data: existingLike } = await client
    .from('community_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (existingLike) {
    // 좋아요 취소
    const { error } = await client
      .from('community_likes')
      .delete()
      .eq('id', existingLike.id);

    if (error) {
      console.error('Error removing like:', error);
      return { liked: false, error };
    }

    return { liked: false, error: null };
  } else {
    // 좋아요 추가
    const { error } = await client
      .from('community_likes')
      .insert({
        user_id: userId,
        post_id: postId,
      });

    if (error) {
      console.error('Error adding like:', error);
      return { liked: false, error };
    }

    return { liked: true, error: null };
  }
}

/**
 * 댓글 좋아요 추가/취소
 */
export async function toggleCommentLike(client: SupabaseClient, userId: string, commentId: string) {
  // 이미 좋아요했는지 확인
  const { data: existingLike } = await client
    .from('community_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .single();

  if (existingLike) {
    // 좋아요 취소
    const { error } = await client
      .from('community_likes')
      .delete()
      .eq('id', existingLike.id);

    if (error) {
      console.error('Error removing like:', error);
      return { liked: false, error };
    }

    return { liked: false, error: null };
  } else {
    // 좋아요 추가
    const { error } = await client
      .from('community_likes')
      .insert({
        user_id: userId,
        comment_id: commentId,
      });

    if (error) {
      console.error('Error adding like:', error);
      return { liked: false, error };
    }

    return { liked: true, error: null };
  }
}

/**
 * 사용자가 게시글에 좋아요했는지 확인
 */
export async function checkPostLiked(client: SupabaseClient, userId: string | null, postId: string) {
  if (!userId) {
    return { liked: false };
  }

  const { data } = await client
    .from('community_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  return { liked: !!data };
}

/**
 * 사용자가 댓글에 좋아요했는지 확인
 */
export async function checkCommentLiked(client: SupabaseClient, userId: string | null, commentId: string) {
  if (!userId) {
    return { liked: false };
  }

  const { data } = await client
    .from('community_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .single();

  return { liked: !!data };
}
