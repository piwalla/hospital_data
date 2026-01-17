'use server';

import { createSupabaseAdminClient } from '@/lib/supabase/service-role';
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 게시글 삭제 (Soft Delete)
export async function deletePostAction(postId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const supabase = createSupabaseAdminClient();

  // 1. 본인 확인 (또는 관리자)
  // Admin Client를 쓰더라도, 지우려는 대상이 "내 글"인지 확인해야 함.
  // RLS를 우회하므로 코드 레벨에서 권한 검사를 철저히 해야 함.
  const { data: post } = await supabase
    .from('community_posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  // 관리자 권한 확인 로직이 필요하다면 추가 (여기서는 본인 확인만)
  // const isAdmin = ... (check user metadata)
  // 지금은 간단히 사용자 본인인지만 체크
  if (post.user_id !== userId) {
     // 관리자 여부 체크 (선택 사항, 필요시 구현)
     // const { data: adminUser } = await supabase.rpc('is_admin', { user_id: userId });
     // if (!adminUser) throw new Error('권한이 없습니다.');
      throw new Error('삭제 권한이 없습니다.');
  }

  // 2. 삭제 처리 (Soft Delete)
  const { error } = await supabase
    .from('community_posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', postId);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('게시글 삭제 중 오류가 발생했습니다.');
  }

  revalidatePath('/community');
  return { success: true };
}

// 게시글 수정 (제목, 내용)
export async function updatePostAction(postId: string, title: string, content: string) {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }
  
    const supabase = createSupabaseAdminClient();
  
    // 권한 검사
    const { data: post } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', postId)
      .single();
  
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
  
    if (post.user_id !== userId) {
        throw new Error('수정 권한이 없습니다.');
    }
  
    const { error } = await supabase
      .from('community_posts')
      .update({ 
          title, 
          content,
          updated_at: new Date().toISOString()
      })
      .eq('id', postId);
  
    if (error) {
      console.error('Error updating post:', error);
      throw new Error('게시글 수정 중 오류가 발생했습니다.');
    }
  
    revalidatePath(`/community/post/${postId}`);
    revalidatePath('/community');
    return { success: true };
  }
