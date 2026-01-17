/**
 * @file VideoGuideButton.tsx
 * @description 비디오 가이드 버튼 컴포넌트 (지역화 지원)
 * 
 * 산재 보상 완벽 가이드 비디오를 YouTube 임베드로 제공합니다.
 * 지연 로딩으로 최적화되어 있습니다.
 */

'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';
import { Locale, TimelineTranslation } from '@/lib/i18n/config';

// YouTube 동영상 ID (URL에서 추출: https://youtu.be/r433_ZwERkc)
const YOUTUBE_VIDEO_ID = 'r433_ZwERkc';
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`;

interface VideoGuideButtonProps {
  size?: VariantProps<typeof buttonVariants>['size'];
  variant?: VariantProps<typeof buttonVariants>['variant'];
  children?: React.ReactNode;
  locale: Locale;
  t: TimelineTranslation;
}

export default function VideoGuideButton({ 
  size = 'lg',
  variant = 'default',
  children,
  locale,
  t,
}: VideoGuideButtonProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const handleVideoOpen = () => {
    setIsVideoOpen(true);
    // 모달이 열릴 때만 YouTube iframe 로드 (지연 로딩)
    setShouldLoadVideo(true);
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleVideoOpen}
          variant={variant}
          size={size}
          className="flex items-center gap-2"
        >
          <Play className={iconSize} />
          {children ?? t.videoBtn}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {t.videoTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          {shouldLoadVideo && (
            <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={YOUTUBE_EMBED_URL}
                title={t.videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                loading="lazy"
              />
            </div>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            {t.videoTip}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

