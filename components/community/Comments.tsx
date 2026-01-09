"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/lib/api/community-interactions";
import type { CommunityComment } from "@/lib/types/community";
import { MessageSquare, ThumbsUp, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";

interface CommentsProps {
  postId: string;
  initialComments: CommunityComment[];
  isAnonymousBoard?: boolean;
}

export default function Comments({ postId, initialComments, isAnonymousBoard = false }: CommentsProps) {
  const client = useClerkSupabaseClient();
  const { user } = useUser();
  const [comments, setComments] = useState<CommunityComment[]>(initialComments);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(isAnonymousBoard);

  // 게시판 타입이 변경될 때 익명 설정 업데이트
  /* Effect not strictly needed if we assume component mounts with stable prop, 
     but keeping it simple. We can initialize state from prop. 
     If prop forces true, we respect it. */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);

    const { comment, error } = await createComment(client, user.id, {
      post_id: postId,
      content: content.trim(),
      is_anonymous: isAnonymous || isAnonymousBoard,
    });

    setLoading(false);

    if (error) {
      alert('댓글 작성에 실패했습니다.');
      return;
    }

    if (comment) {
      setComments([...comments, comment]);
      setContent('');
    }
  }

  return (
    <div className="space-y-4">
      {/* 댓글 목록 */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          댓글 {comments.length}개
        </h3>

        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-500">
              첫 댓글을 작성해보세요
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>

      {/* 댓글 작성 */}
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isAnonymousBoard ? "익명으로 댓글을 남겨보세요" : "댓글을 입력하세요"}
              rows={3}
              className="resize-none"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* 익명 게시판이면 항상 익명, 아니면 선택 가능 */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous-comment"
                    checked={isAnonymous || isAnonymousBoard}
                    disabled={isAnonymousBoard}
                    onChange={(e) => !isAnonymousBoard && setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="anonymous-comment" className="text-sm text-slate-600 cursor-pointer select-none">
                    익명으로 작성
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={loading || !content.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    작성 중...
                  </>
                ) : (
                  '댓글 작성'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// 댓글 아이템 컴포넌트
function CommentItem({ comment }: { comment: CommunityComment }) {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-900">
              {comment.author_name}
            </span>
            <span className="text-slate-500">{timeAgo}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-600">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {comment.like_count}
          </Button>
        </div>
        <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
      </CardContent>
    </Card>
  );
}
