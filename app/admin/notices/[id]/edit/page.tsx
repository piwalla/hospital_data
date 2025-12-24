'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { updateNoticeAction } from '@/app/actions/admin-notices';
import { getNoticeById } from '@/lib/api/notices';

export default function EditNoticePage() {
  const router = useRouter();
  const params = useParams();
  // const supabase = useClerkSupabaseClient(); // Not needed for update anymore, and read is via public client
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '공지',
    content: '',
    isImportant: false
  });

  useEffect(() => {
    async function loadNotice() {
      if (!params?.id) return;
      try {
        const data = await getNoticeById(params.id as string);
        if (data) {
          setFormData({
            title: data.title,
            category: data.category,
            content: data.content,
            isImportant: data.isImportant
          });
        } else {
             alert('공지사항을 찾을 수 없습니다.');
             router.push('/admin/notices');
        }
      } catch (error) {
        console.error('Failed to load notice', error);
        alert('공지사항을 불러오는데 실패했습니다.');
        router.push('/admin/notices');
      } finally {
        setIsLoading(false);
      }
    }
    loadNotice();
  }, [params?.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setIsSubmitting(true);
    try {
      if (!params?.id) return;
      await updateNoticeAction(params.id as string, formData);
      alert('공지사항이 수정되었습니다.');
      router.push('/admin/notices');
    } catch (error) {
      console.error('Failed to update notice', error);
      alert('공지사항 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">공지사항 수정</h1>
            <p className="text-slate-500">기존 공지사항을 수정합니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <select 
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="공지">공지</option>
                <option value="이벤트">이벤트</option>
                <option value="점검">점검</option>
              </select>
            </div>
            
            <div className="space-y-2 flex items-end pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="important" 
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({...formData, isImportant: e.target.checked})}
                />
                <Label htmlFor="important" className="font-medium">중요 공지로 설정 (상단 고정)</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input 
              id="title" 
              placeholder="공지사항 제목을 입력하세요" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea 
              id="content" 
              placeholder="공지 내용을 입력하세요" 
              className="min-h-[300px]"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              수정 완료
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
