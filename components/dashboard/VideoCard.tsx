"use client";

import { useState } from "react";
import { PlayCircle, Target, Flame, Star, Lightbulb } from "lucide-react";
import Image from "next/image";
import { VideoData, getYoutubeThumbnail } from "@/lib/data/videos";

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
}

interface VideoCardProps {
  video: VideoData;
  showPersonalizationBadge?: boolean;
  checklist?: ChecklistItem[];
}

export default function VideoCard({ video, showPersonalizationBadge = false, checklist = [] }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = getYoutubeThumbnail(video.youtubeId, 'medium');

  // Local Badge Logic for Premium Icons
  const getBadgeContent = (badge?: 'critical' | 'recommended' | 'optional') => {
    switch (badge) {
      case 'critical':
        return {
          icon: <Flame className="w-3 h-3 text-red-600" fill="currentColor" />,
          text: '도움 되는 영상',
          className: 'bg-red-50 text-red-700 border-red-100',
        };
      case 'recommended':
        return {
          icon: <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />,
          text: '강력 추천',
          className: 'bg-yellow-50 text-yellow-700 border-yellow-100',
        };
      case 'optional':
        return {
          icon: <Lightbulb className="w-3 h-3 text-slate-500" />,
          text: '참고',
          className: 'bg-slate-50 text-slate-600 border-slate-100',
        };
      default:
        return null;
    }
  };

  const badgeStyle = getBadgeContent(video.badge);

  return (
    <div className="group block bg-white/80 backdrop-blur-md border border-white/40 shadow-premium rounded-[2.5rem] overflow-hidden hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full relative">
      {/* 썸네일/플레이어 영역 */}
      <div className="relative aspect-video bg-slate-100 flex-shrink-0 overflow-hidden m-1 rounded-[2rem]">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="absolute inset-0 w-full h-full rounded-[2rem]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button 
            onClick={() => setIsPlaying(true)}
            className="w-full h-full relative cursor-pointer group-hover:scale-[1.02] transition-transform duration-500 block text-left"
            aria-label="Play video"
          >
            {thumbnailUrl ? (
              <Image 
                src={thumbnailUrl} 
                alt={video.title} 
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <PlayCircle className="w-12 h-12 text-slate-300 transition-colors" />
              </div>
            )}
            
            {/* 재생 아이콘 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors backdrop-blur-[1px]">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-10 h-10 text-white drop-shadow-md" fill="currentColor" />
              </div>
            </div>

            {/* 영상 길이 */}
            {video.duration && (
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                {video.duration}
              </div>
            )}

            {/* 개인화 배지 */}
            {showPersonalizationBadge && (
              <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10 border border-white/20">
                <Target className="w-3 h-3 text-indigo-200" /> <span>맞춤 추천</span>
              </div>
            )}
          </button>
        )}
      </div>

      {/* 정보 영역 - Flex-grow to fill space */}
      <div className="p-5 flex flex-col flex-1">
        {/* 배지 */}
        <div className="flex items-center gap-2 mb-3">
          {badgeStyle && (
            <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border bg-opacity-50 backdrop-blur-sm ${badgeStyle.className}`}>
              {badgeStyle.icon} {badgeStyle.text}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h4 className="font-extrabold text-slate-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors tracking-tight">
          {video.title}
        </h4>

        {/* 설명 */}
        {video.description && (
          <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}

        {/* Desktop Only Checklist - Fills the empty space */}
        {checklist && checklist.length > 0 && (
          <div className="hidden md:block mt-auto pt-4 border-t border-indigo-50/50">
            <h5 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               이 단계 핵심 체크포인트
            </h5>
            <ul className="space-y-2">
              {checklist.slice(0, 3).map((item) => (
                <li key={item.id} className="text-xs bg-indigo-50/50 border border-indigo-100/50 p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-indigo-600">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block text-xs tracking-tight">{item.title}</span>
                      {item.description && (
                         <span className="text-[10px] text-slate-400 font-medium leading-tight block mt-0.5">{item.description}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
