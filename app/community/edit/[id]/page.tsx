import { supabase } from "@/lib/supabase/client";
import EditPostForm from "@/components/community/EditPostForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 수정 | 커뮤니티",
  description: "작성한 글을 수정합니다",
};

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const { data: post, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  return <EditPostForm post={post} />;
}
