

import { supabase as defaultSupabase } from '@/lib/supabase/client';
import { type NoticePost } from '@/lib/mock-community-data';
import { type SupabaseClient } from '@supabase/supabase-js';

export async function getNotices(): Promise<NoticePost[]> {
  
  const { data, error } = await defaultSupabase
    .from('posts')
    .select('*')
    .eq('type', 'notice')
    .eq('is_hidden', false)
    .order('is_important', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notices:', error);
    return [];
  }

  return data.map((post: any) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: '관리자', // Currently admin name is static or should be joined from author_id
    createdAt: post.created_at,
    viewCount: post.view_count,
    isImportant: post.is_important,
    category: post.category || '공지',
  }));
}

export async function getNoticeById(id: string): Promise<NoticePost | undefined> {
  
  const { data, error } = await defaultSupabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching notice:', error);
    return undefined;
  }

  // Increment view count (fire and forget)
  defaultSupabase.rpc('increment_view_count', { row_id: id });

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    author: '관리자',
    createdAt: data.created_at,
    viewCount: data.view_count,
    isImportant: data.is_important,
    category: data.category || '공지',
  };
}


export async function createNotice(
  notice: { title: string; content: string; category: string; isImportant: boolean },
  supabaseClient?: SupabaseClient,
  userId?: string
) {
  const supabase = supabaseClient || defaultSupabase;
  
  if (!userId) {
     // If userId not passed, try fetch (will fail on Clerk-Supabase client as seen)
     // Fallback or error
     console.error("createNotice: userId is required when using Clerk Auth");
     throw new Error('UserId is required');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      type: 'notice',
      title: notice.title,
      content: notice.content,
      category: notice.category,
      is_important: notice.isImportant,
      author_id: userId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNotice(
  id: string,
  notice: { title: string; content: string; category: string; isImportant: boolean },
  supabaseClient?: SupabaseClient
) {
  const supabase = supabaseClient || defaultSupabase;

  const { data, error } = await supabase
    .from('posts')
    .update({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      is_important: notice.isImportant,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotice(
  id: string,
  supabaseClient?: SupabaseClient
) {
  const supabase = supabaseClient || defaultSupabase;

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}


