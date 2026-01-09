'use server';

import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';


const ADMIN_EMAIL = 'highstar0301@gmail.com';

async function checkAdmin() {
  const user = await currentUser();
  if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function updateNoticeAction(id: string, formData: {
  title: string;
  content: string;
  category: string;
  isImportant: boolean;
}) {
  await checkAdmin();

  const supabase = getServiceRoleClient();

  // We exclude updated_at because the column likely doesn't exist based on previous errors
  // We exclude author_id to avoid touching the column causing type errors
  const { error } = await supabase
    .from('posts')
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      is_important: formData.isImportant,
    })
    .eq('id', id);

  if (error) {
    console.error('Update Notice Error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/community/notice');
  revalidatePath('/admin/notices');
  revalidatePath(`/admin/notices/${id}/edit`);
}

export async function deleteNoticeAction(id: string) {
  await checkAdmin();

  const supabase = getServiceRoleClient();

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete Notice Error:', error);
    throw new Error(error.message);
  }

  revalidatePath('/community/notice');
  revalidatePath('/admin/notices');
}
