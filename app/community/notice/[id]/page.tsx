'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getNoticeById } from '@/lib/api/notices';
import { type NoticePost } from '@/lib/mock-community-data';
import { ArrowLeft, Calendar, User, Eye, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<NoticePost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNotice() {
      if (params.id) {
        try {
           const data = await getNoticeById(params.id as string);
           setNotice(data);
        } catch (error) {
           console.error("Failed to load notice", error);
        } finally {
           setIsLoading(false);
        }
      }
    }
    loadNotice();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-slate-500 mb-4">존재하지 않는 게시글입니다.</p>
          <Button onClick={() => router.back()}>뒤로 가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/community/notice">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </Link>

        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100">
             <div className="flex gap-2 mb-4">
               {notice.isImportant && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    중요
                  </span>
                )}
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  {notice.category}
                </span>
             </div>
             <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
               {notice.title}
             </h1>
             
             <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1.5">
                 <User className="w-4 h-4" />
                 {notice.author}
               </span>
               <span className="w-px h-3 bg-gray-300" />
               <span className="flex items-center gap-1.5">
                 <Calendar className="w-4 h-4" />
                 {new Date(notice.createdAt).toLocaleDateString()}
               </span>
               <span className="w-px h-3 bg-gray-300" />
               <span className="flex items-center gap-1.5">
                 <Eye className="w-4 h-4" />
                 {notice.viewCount.toLocaleString()}
               </span>
             </div>
          </div>

          <div className="p-6 md:p-8 min-h-[300px]">
            <div className="prose prose-slate max-w-none whitespace-pre-line">
              {notice.content}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex justify-end">
             <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('주소가 복사되었습니다.');
                }}
             >
               <Share2 className="w-4 h-4" />
               공유하기
             </Button>
          </div>
        </article>
      </main>
    </div>
  );
}
