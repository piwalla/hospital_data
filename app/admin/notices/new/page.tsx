'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createNotice } from '@/lib/api/notices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

export default function NewNoticePage() {
  const router = useRouter();
  const { user } = useUser();
  const supabase = useClerkSupabaseClient(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '공지',
    content: '',
    isImportant: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setIsSubmitting(true);
    try {
      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }
      await createNotice(formData, supabase, user.id);
      router.push('/admin/notices');
      router.refresh(); // Refresh server components/cache if needed
    } catch (error) {
      console.error('Failed to create notice', error);
      alert('공지사항 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/notices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-slate-900">새 공지사항 등록</h1>
           <p className="text-slate-500">새로운 소식을 사용자들에게 알립니다.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">제목</label>
              <Input 
                placeholder="제목을 입력하세요" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">카테고리</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="공지">공지</option>
                <option value="점검">점검</option>
                <option value="이벤트">이벤트</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">내용</label>
            <Textarea 
              className="min-h-[300px]" 
              placeholder="내용을 입력하세요 (줄바꿈이 반영됩니다)"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isImportant"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.isImportant}
              onChange={(e) => setFormData({...formData, isImportant: e.target.checked})}
            />
            <label htmlFor="isImportant" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
              중요 공지 (상단 고정)
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link href="/admin/notices">
              <Button type="button" variant="outline">취소</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
