/**
 * @file MediaSection.tsx
 * @description 음악/영상 섹션 컴포넌트
 *
 * YouTube 임베드를 사용하여 릴렉스 음악과 기분전환 영상을 표시합니다.
 */

'use client';

import { Youtube } from 'lucide-react';
import type { CounselingContent } from '@/lib/data/counseling-content';

interface MediaSectionProps {
  contents: CounselingContent[];
}

export default function MediaSection({ contents }: MediaSectionProps) {
  // YouTube URL을 embed 형식으로 변환
  const getEmbedUrl = (url: string): string => {
    // youtu.be 형식: https://youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    
    // watch 형식: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    
    // 이미 embed 형식인 경우
    if (url.includes('youtube.com/embed/')) {
      return url.split('?si=')[0]; // 쿼리 파라미터 제거
    }
    
    return url;
  };

  if (contents.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-muted-foreground">
        <p className="text-sm sm:text-base">콘텐츠가 준비 중입니다.</p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      role="list"
      aria-label="미디어 콘텐츠 목록"
    >
      {contents.map((content) => (
        <div
          key={content.id}
          className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          role="listitem"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {content.title}
            </h3>
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            {content.description}
          </p>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(content.youtubeUrl)}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              loading="lazy"
            />
          </div>

          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              {content.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}







