import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/PostDetail";
import { getPost } from "@/lib/api/community-posts";
import { getComments, checkPostLiked } from "@/lib/api/community-interactions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { post } = await getPost(id);
  
  if (!post) {
    return { title: "게시글을 찾을 수 없습니다" };
  }

  return {
    title: `${post.title} | 커뮤니티`,
    description: post.content.substring(0, 100),
  };
}

import { createSupabaseAdminClient } from "@/lib/supabase/service-role";
import { auth } from "@clerk/nextjs/server";

export default async function PostDetailPage({ params }: PageProps) {
  const client = createSupabaseAdminClient();
  const { userId } = await auth();
  const { id } = await params;
  const { post, error } = await getPost(id);

  if (error || !post) {
    notFound();
  }

  const { comments } = await getComments(id);
  const { liked } = await checkPostLiked(client, userId, id);

  return (
    <PostDetail 
      post={post} 
      comments={comments} 
      initialLiked={liked}
    />
  );
}
