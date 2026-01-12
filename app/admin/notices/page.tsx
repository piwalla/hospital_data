'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNotices } from '@/lib/api/notices';
import { deleteNoticeAction } from '@/app/actions/admin-notices';
import { type NoticePost } from '@/lib/mock-community-data';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone, Loader2, Link as LinkIcon, Trash2, Edit } from 'lucide-react';

export default function AdminNoticePage() {
  const [notices, setNotices] = useState<NoticePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notices function for reuse
  const loadNotices = async () => {
    try {
      setIsLoading(true);
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    
    try {
      await deleteNoticeAction(id);
      alert('삭제되었습니다.');
      loadNotices(); // Reload list
    } catch (error) {
      console.error('Failed to delete notice', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-blue-600" />
            공지사항 관리
          </h1>
          <p className="text-slate-500 mt-1">
            공지사항을 등록하고 관리합니다.
          </p>
        </div>
        <Link href="/admin/notices/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            새 공지 등록
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">제목</th>
                <th className="px-6 py-3 font-medium w-32">카테고리</th>
                <th className="px-6 py-3 font-medium w-32">조회수</th>
                <th className="px-6 py-3 font-medium w-40">작성일</th>
                <th className="px-6 py-3 font-medium w-40">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center">
                     <div className="flex justify-center">
                       <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                     </div>
                   </td>
                 </tr>
              ) : notices.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                     등록된 공지사항이 없습니다.
                   </td>
                 </tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {notice.isImportant && (
                        <span className="inline-block px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded mr-2 align-middle">
                          중요
                        </span>
                      )}
                      {notice.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {notice.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {notice.viewCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </td>
                     <td className="px-6 py-4 flex gap-2">
                      <Link href={`/community/notice/${notice.id}`} target="_blank">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/notices/${notice.id}/edit`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-green-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => handleDelete(notice.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
