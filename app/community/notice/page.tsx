'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNotices } from '@/lib/api/notices';
import { type NoticePost } from '@/lib/mock-community-data';
import { Megaphone, Calendar, Eye, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NoticeListPage() {
  const [notices, setNotices] = useState<NoticePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getNotices();
        setNotices(data);
      } catch (error) {
        console.error('Failed to load notices', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-600" />
            공지사항
          </h1>
          <p className="text-slate-600 mt-2">
            리워크케어의 새로운 소식과 중요 안내를 확인하세요.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : notices.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-40 text-slate-400">
               <p>등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <li key={notice.id} className="hover:bg-slate-50 transition-colors">
                <Link href={`/community/notice/${notice.id}`} className="block p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {notice.isImportant && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                            중요
                          </span>
                        )}
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          notice.category === '점검' ? "bg-amber-50 text-amber-600" :
                          notice.category === '이벤트' ? "bg-purple-50 text-purple-600" :
                          "bg-blue-50 text-blue-600"
                        )}>
                          {notice.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2 line-clamp-1">
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {notice.viewCount.toLocaleString()}
                        </span>
                        <span>
                          작성자: {notice.author}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 mt-2" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          )}
        </div>
      </main>
    </div>
  );
}
