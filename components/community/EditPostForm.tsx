"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updatePost } from "@/lib/api/community-posts";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";
import type { CommunityPost } from "@/lib/types/community";

interface EditPostFormProps {
  post: CommunityPost;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const client = useClerkSupabaseClient();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  // 권한 체크: 작성자 본인 또는 관리자만 수정 가능
  useEffect(() => {
    if (user && user.id !== post.user_id && user.publicMetadata?.role !== 'admin') {
      alert('수정 권한이 없습니다.');
      router.push('/community');
    }
  }, [user, post, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);

    const { error } = await updatePost(client, post.id, {
      title: title.trim(),
      content: content.trim(),
    });

    setLoading(false);

    if (error) {
      alert('게시글 수정에 실패했습니다.');
      console.error(error);
      return;
    }

    alert('수정되었습니다.');
    router.push(`/community/post/${post.id}`);
  }

  if (!user) {
    return null; // or loading
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-2xl">글 수정하기</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  maxLength={200}
                />
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={15}
                  className="resize-none"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  취소
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      수정 중...
                    </>
                  ) : (
                    '수정 완료'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
