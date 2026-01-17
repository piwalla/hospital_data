"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, Eye, Clock } from "lucide-react";
import Link from "next/link";
import Comments from "@/components/community/Comments";
import { togglePostLike } from "@/lib/api/community-interactions";
import type { CommunityPost, CommunityComment } from "@/lib/types/community";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { deletePostAction } from "@/app/actions/community";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";

interface PostDetailProps {
  post: CommunityPost;
  comments: CommunityComment[];
  initialLiked: boolean;
}

export default function PostDetail({ post, comments, initialLiked }: PostDetailProps) {
  const client = useClerkSupabaseClient();
  const { user } = useUser();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [liking, setLiking] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  async function handleLike() {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    setLiking(true);
    const { liked: newLiked } = await togglePostLike(client, user.id, post.id);
    setLiking(false);

    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 뒤로가기 */}
        <Link href="/community">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>
        </Link>

        {/* 게시글 */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* 제목 */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-slate-900 flex-1">{post.title}</h1>
              
              {/* 수정/삭제 버튼 (작성자 또는 관리자만) */}
              {user && (user.id === post.user_id || user.publicMetadata?.role === 'admin') && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/community/edit/${post.id}`}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (confirm('정말 삭제하시겠습니까?')) {
                        try {
                          await deletePostAction(post.id);
                          alert('삭제되었습니다.');
                          window.location.href = '/community';
                        } catch (error: any) {
                          alert(error.message || '삭제 실패');
                        }
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-sm text-slate-600 pb-4 border-b">
              <span className="font-medium text-slate-900">{post.author_name}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeAgo}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.view_count}
              </span>
            </div>

            {/* 내용 */}
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h1: ({...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-slate-900" {...props} />,
                  h2: ({...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-slate-800" {...props} />,
                  h3: ({...props}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-700" {...props} />,
                  p: ({...props}) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
                  ul: ({...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700" {...props} />,
                  ol: ({...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700" {...props} />,
                  li: ({...props}) => <li className="ml-4" {...props} />,
                  strong: ({...props}) => <strong className="font-bold text-slate-900" {...props} />,
                  em: ({...props}) => <em className="italic text-slate-600" {...props} />,
                  blockquote: ({...props}) => <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 text-slate-600 italic" {...props} />,
                  code: ({inline, ...props}: any) => 
                    inline ? 
                      <code className="bg-slate-100 text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props} /> :
                      <code className="block bg-slate-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4" {...props} />,
                  table: ({...props}) => <table className="w-full border-collapse my-4" {...props} />,
                  th: ({...props}) => <th className="border border-slate-300 bg-slate-100 px-4 py-2 text-left font-semibold" {...props} />,
                  td: ({...props}) => <td className="border border-slate-300 px-4 py-2" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* 좋아요 버튼 */}
            <div className="pt-4 border-t">
              <Button
                variant={liked ? "default" : "outline"}
                onClick={handleLike}
                disabled={liking}
                className="gap-2"
              >
                <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                좋아요 {likeCount}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 댓글 */}
        <Comments 
        postId={post.id} 
        initialComments={comments} 
        isAnonymousBoard={post.category === 'anonymous'}
      />
      </div>
    </div>
  );
}
