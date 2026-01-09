"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  ThumbsUp,
  Lock,
  Users,
  MapPin,
  Bone,
  Brain,
  Flame,
  HelpingHand,
  Activity,
  Building2,
  TentTree,
  Map
} from "lucide-react";
import { 
  INJURY_TYPES, 
  REGIONS, 
  getUserInjuryType,
  getUserRegionType,
} from "@/lib/data/community";
import type { InjuryType, RegionType } from "@/lib/types/community";
import CommunityHero from "./CommunityHero";
import { cn } from "@/lib/utils";

interface CommunityMainProps {
  userInjury?: string; // 사용자의 부상 부위
  userRegion?: string; // 사용자의 지역
}

export default function CommunityMain({ userInjury, userRegion }: CommunityMainProps) {
  // 사용자 맞춤 카테고리
  const myInjuryType = userInjury ? getUserInjuryType(userInjury) : null;
  const myRegionType = userRegion ? getUserRegionType(userRegion) : null;

  // Icon Mappings
  const getInjuryIconComponent = (key: string | null) => {
    switch (key) {
      case 'fracture': return <Bone className="w-8 h-8 text-indigo-500" />;
      case 'nerve': return <Brain className="w-8 h-8 text-pink-500" />;
      case 'burn': return <Flame className="w-8 h-8 text-orange-500" />;
      case 'amputation': return <HelpingHand className="w-8 h-8 text-red-500" />;
      case 'other': return <Activity className="w-8 h-8 text-emerald-500" />;
      default: return <Activity className="w-8 h-8 text-slate-400" />;
    }
  };

  const getRegionIconComponent = (key: string | null) => {
    switch (key) {
      case 'metropolitan': return <Building2 className="w-8 h-8 text-blue-500" />;
      case 'non_metropolitan': return <TentTree className="w-8 h-8 text-green-500" />;
      default: return <Map className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#eff2f5]">
      {/* Premium Hero Section */}
      <CommunityHero />

      <div className="container max-w-6xl mx-auto px-4 pb-20 space-y-12">
        
        {/* 내 커뮤니티 */}
        {(myInjuryType || myRegionType) && (
          <section className="space-y-4">
             <div className="flex items-center gap-2 px-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-700" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">내 커뮤니티 바로가기</h2>
             </div>
             
             <div className="grid md:grid-cols-2 gap-4">
              {myInjuryType && (
                <Link href={`/community/injury/${myInjuryType}`}>
                  <Card className="hover:shadow-premium-hover transition-all cursor-pointer border-white/60 bg-white/80 backdrop-blur-md shadow-premium rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                           {getInjuryIconComponent(myInjuryType)}
                        </div>
                        <div>
                          <p className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {INJURY_TYPES[myInjuryType]}
                          </p>
                          <p className="text-sm font-medium text-slate-500 mt-1">내 부상 유형 동료들과 소통하기</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
              {myRegionType && (
                <Link href={`/community/region/${myRegionType}`}>
                  <Card className="hover:shadow-premium-hover transition-all cursor-pointer border-white/60 bg-white/80 backdrop-blur-md shadow-premium rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                           {getRegionIconComponent(myRegionType)}
                        </div>
                        <div>
                          <p className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {REGIONS[myRegionType]}
                          </p>
                          <p className="text-sm font-medium text-slate-500 mt-1">내 지역 정보 공유하기</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* 부상 유형별 게시판 */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity className="w-5 h-5 text-indigo-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">부상 유형별 게시판</h2>
           </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.entries(INJURY_TYPES) as [InjuryType, string][]).map(([type, label]) => (
              <Link key={type} href={`/community/injury/${type}`}>
                <Card className="h-full hover:shadow-premium-hover transition-all cursor-pointer border-white/60 bg-white/80 backdrop-blur-md shadow-premium rounded-[2rem] overflow-hidden group">
                  <CardContent className="p-6 text-center space-y-4 flex flex-col items-center justify-center h-full">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 지역별 게시판 */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">지역별 게시판</h2>
           </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {(Object.entries(REGIONS) as [RegionType, string][]).map(([type, label]) => (
              <Link key={type} href={`/community/region/${type}`}>
                <Card className="hover:shadow-premium-hover transition-all cursor-pointer border-white/60 bg-white/80 backdrop-blur-md shadow-premium rounded-[2rem] overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors duration-300 group-hover:scale-110">
                         {getRegionIconComponent(type)}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{label}</p>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">
                          {type === 'metropolitan' ? '서울, 경기, 인천 종합 정보' : '전국 지역별 정보 공유'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 익명 게시판 */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lock className="w-5 h-5 text-purple-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">익명 게시판</h2>
           </div>

          <Link href="/community/anonymous">
            <Card className="hover:shadow-premium-hover transition-all cursor-pointer border-white/60 bg-gradient-to-br from-purple-50/80 to-white/90 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="min-w-0">
                      <p className="text-2xl font-black text-purple-900 mb-1 truncate">대나무숲 (익명)</p>
                      <p className="text-base font-medium text-purple-700/80 truncate">
                         말 못 할 고민, 여기서 털어놓으세요. 철저히 익명으로 보호됩니다.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="hidden sm:flex border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl px-6 h-12 font-bold shrink-0">
                    입장하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* 인기 게시글 */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">지금 뜨는 인기글</h2>
           </div>

          <Card className="border-white/60 bg-white/80 backdrop-blur-md shadow-premium rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-2 sm:p-4">
              <div className="space-y-2">
                {/* 임시 데이터 - 실제로는 API에서 가져옴 */}
                <PopularPostItem
                  title="장해등급 12급 판정 후기 공유합니다 (생각보다 잘 나왔네요)"
                  likes={45}
                  comments={23}
                  views={312}
                  rank={1}
                />
                <PopularPostItem
                  title="휴업급여 신청할 때 공단 담당자랑 싸우지 마세요... 팁 드립니다"
                  likes={38}
                  comments={19}
                  views={287}
                  rank={2}
                />
                <PopularPostItem
                  title="수도권에서 재활 잘하는 병원 추천 부탁드립니다 (허리 디스크)"
                  likes={32}
                  comments={41}
                  views={256}
                  rank={3}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 글쓰기 버튼 */}
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/community/write">
            <Button size="lg" className="rounded-full shadow-premium-hover bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg font-bold transition-transform hover:scale-105">
              <MessageSquare className="w-5 h-5 mr-2" />
              글쓰기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 인기 게시글 아이템 컴포넌트
function PopularPostItem({ 
  title, 
  likes, 
  comments, 
  views,
  rank
}: { 
  title: string; 
  likes: number; 
  comments: number; 
  views: number; 
  rank: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-indigo-50/50 rounded-[1.5rem] transition-colors cursor-pointer group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={cn(
            "w-8 h-8 flex items-center justify-center rounded-xl font-black text-white text-sm shrink-0",
             rank === 1 ? "bg-orange-500 shadow-sm" : 
             rank === 2 ? "bg-slate-400" : "bg-slate-300"
          )}>
            {rank}
          </div>
          <p className="font-bold text-slate-800 truncate group-hover:text-indigo-700 transition-colors pr-4">{title}</p>
      </div>
      
      <div className="flex items-center gap-4 text-xs font-medium text-slate-400 shrink-0">
        <span className="flex items-center gap-1 hidden sm:flex">
          <ThumbsUp className="w-3.5 h-3.5" />
          {likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {comments}
        </span>
        <span className="flex items-center gap-1 hidden sm:flex">
          <Eye className="w-3.5 h-3.5" />
          {views}
        </span>
      </div>
    </div>
  );
}

