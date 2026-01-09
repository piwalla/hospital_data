"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createPost } from "@/lib/api/community-posts";
import { INJURY_TYPES, REGIONS } from "@/lib/data/community";
import type { CategoryType } from "@/lib/types/community";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";

export default function WritePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const client = useClerkSupabaseClient();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  
  const initialCategory = (searchParams.get('category') as CategoryType) || 'injury';
  const initialValue = searchParams.get('value') || '';

  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [categoryValue, setCategoryValue] = useState<string>(initialValue);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (category !== 'anonymous' && !categoryValue) {
      alert('게시판을 선택해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);

    const { error } = await createPost(client, user.id, {
      title: title.trim(),
      content: content.trim(),
      category,
      category_value: category === 'anonymous' ? null : categoryValue as any,
      is_anonymous: isAnonymous || category === 'anonymous',
    });

    setLoading(false);

    if (error) {
      alert('게시글 작성에 실패했습니다.');
      console.error(error);
      return;
    }

    // 작성 완료 후 해당 게시판으로 이동
    if (category === 'anonymous') {
      router.push('/community/anonymous');
    } else if (category === 'injury') {
      router.push(`/community/injury/${categoryValue}`);
    } else {
      router.push(`/community/region/${categoryValue}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Link href="/community">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <CardTitle className="text-2xl">글쓰기</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 게시판 선택 */}
              <div className="space-y-3">
                <Label>게시판 선택</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={category === 'injury' ? 'default' : 'outline'}
                    onClick={() => {
                      setCategory('injury');
                      setCategoryValue('');
                    }}
                    className="w-full"
                  >
                    부상 유형별
                  </Button>
                  <Button
                    type="button"
                    variant={category === 'region' ? 'default' : 'outline'}
                    onClick={() => {
                      setCategory('region');
                      setCategoryValue('');
                    }}
                    className="w-full"
                  >
                    지역별
                  </Button>
                  <Button
                    type="button"
                    variant={category === 'anonymous' ? 'default' : 'outline'}
                    onClick={() => {
                      setCategory('anonymous');
                      setCategoryValue('');
                    }}
                    className="w-full"
                  >
                    익명 게시판
                  </Button>
                </div>

                {/* 세부 카테고리 선택 */}
                {category === 'injury' && (
                  <Select value={categoryValue} onValueChange={setCategoryValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="부상 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INJURY_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {category === 'region' && (
                  <Select value={categoryValue} onValueChange={setCategoryValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(REGIONS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

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

              {/* 익명 옵션 (익명 게시판이 아닐 때만) */}
              {category !== 'anonymous' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <Label htmlFor="anonymous" className="cursor-pointer">
                    익명으로 작성하기
                  </Label>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-3">
                <Link href="/community" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    취소
                  </Button>
                </Link>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      작성 중...
                    </>
                  ) : (
                    '작성 완료'
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
