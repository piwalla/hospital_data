"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PostCard from "@/components/community/PostCard";
import { getPosts } from "@/lib/api/community-posts";
import type { CommunityPost, CategoryType, CategoryValue } from "@/lib/types/community";
import { 
  Loader2, 
  MessageSquare,
  Bone,
  Brain,
  Flame,
  HelpingHand,
  Activity,
  Building2,
  TentTree,
  Map,
  Lock
} from "lucide-react";
import Link from "next/link";
import { 
  INJURY_TYPES, 
  REGIONS 
} from "@/lib/data/community";
import BoardNotice from "./BoardNotice";

interface BoardListProps {
  category: CategoryType;
  categoryValue: CategoryValue;
  title: string;
  description?: string;
}

export default function BoardList({ category, categoryValue, title, description }: BoardListProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'latest' | 'popular' | 'comments'>('latest');

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const { posts: data } = await getPosts({
        category,
        category_value: categoryValue,
        sort,
        limit: 20,
      });
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, [category, categoryValue, sort]);

  // 아이콘 가져오기
  const getIcon = () => {
    if (category === 'injury' && categoryValue) {
      switch (categoryValue) {
        case 'fracture': return <Bone className="w-10 h-10 text-indigo-500" />;
        case 'nerve': return <Brain className="w-10 h-10 text-pink-500" />;
        case 'burn': return <Flame className="w-10 h-10 text-orange-500" />;
        case 'amputation': return <HelpingHand className="w-10 h-10 text-red-500" />;
        case 'other': return <Activity className="w-10 h-10 text-emerald-500" />;
        default: return <Activity className="w-10 h-10 text-slate-400" />;
      }
    }
    if (category === 'region' && categoryValue) {
       switch (categoryValue) {
        case 'metropolitan': return <Building2 className="w-10 h-10 text-blue-500" />;
        case 'non_metropolitan': return <TentTree className="w-10 h-10 text-green-500" />;
        default: return <Map className="w-10 h-10 text-slate-400" />;
      }
    }
    return <Lock className="w-10 h-10 text-purple-500" />;
  };

  // 설명 가져오기
  const getDescription = () => {
    if (description) return description;
    if (category === 'injury' && categoryValue) {
      return `${INJURY_TYPES[categoryValue as keyof typeof INJURY_TYPES]} 관련 정보를 공유하는 공간입니다.`;
    }
    if (category === 'region' && categoryValue) {
      return `${REGIONS[categoryValue as keyof typeof REGIONS]} 지역 동료들과 소통해보세요.`;
    }
    return '자유롭게 이야기를 나눠보세요';
  };

  return (
    <div className="min-h-screen bg-[#eff2f5]">
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
               {getIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
              <p className="text-slate-500 font-medium mt-1">{getDescription()}</p>
            </div>
        </div>
        
        {/* 공지사항/가이드 */}
         <BoardNotice category={category} />

        {/* Controls */}
        <div className="sticky top-20 z-10 flex items-center justify-between bg-[#eff2f5]/90 backdrop-blur-md py-4 px-2">
          <Select value={sort} onValueChange={(value: any) => setSort(value)}>
            <SelectTrigger className="w-32 bg-white border-slate-200 rounded-xl shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="comments">댓글순</SelectItem>
            </SelectContent>
          </Select>

          <Link href={`/community/write?category=${category}&value=${categoryValue || ''}`}>
            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md hover:shadow-lg transition-all">
              <MessageSquare className="w-4 h-4 mr-2" />
              글쓰기
            </Button>
          </Link>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex items-center justify-center py-20 min-h-[400px]">
             <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-400 font-medium">게시글을 불러오고 있습니다...</p>
             </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100/50 shadow-sm min-h-[400px]">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-700 mb-2">아직 작성된 글이 없습니다</h3>
             <p className="text-slate-500 mb-6">가장 먼저 이야기를 시작해보세요!</p>
             <Link href={`/community/write?category=${category}&value=${categoryValue || ''}`}>
              <Button size="lg" className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700">첫 게시글 작성하기</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] py-6">
            <div className="divide-y divide-slate-100">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* 더보기 버튼 (나중에 무한 스크롤로 변경) */}
        {!loading && posts.length >= 20 && (
          <div className="text-center pt-8">
            <Button variant="outline" className="rounded-full px-8 border-slate-300 text-slate-600 hover:bg-slate-50">더보기</Button>
          </div>
        )}
      </div>
    </div>
  );
}
