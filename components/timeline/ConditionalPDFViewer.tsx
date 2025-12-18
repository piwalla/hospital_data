/**
 * @file components/timeline/ConditionalPDFViewer.tsx
 * @description 조건부 PDF 뷰어 컴포넌트
 * 
 * 모바일: WebP 이미지 표시 (여러 페이지 세로 나열)
 * 데스크톱: 기존 PDF iframe 표시
 */

'use client';

import { useIsMobile } from '@/hooks/use-is-mobile';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ConditionalPDFViewerProps {
  stepNumber: number;
  pdfUrl: string;
}

export default function ConditionalPDFViewer({ stepNumber, pdfUrl }: ConditionalPDFViewerProps) {
  const isMobile = useIsMobile();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!isMobile) {
      setLoading(false);
      return;
    }

    // 각 step별 페이지 수 정의
    const stepPageCounts: Record<number, number> = {
      1: 15,
      2: 15,
      3: 12,  // step3는 12개 페이지
      4: 15,
    };

    const pageCount = stepPageCounts[stepNumber];

    if (pageCount) {
      const urls: string[] = [];
      for (let i = 1; i <= pageCount; i++) {
        urls.push(`${supabaseUrl}/storage/v1/object/public/uploads/step${stepNumber}-${i}.webp`);
      }
      setImageUrls(urls);
      setLoading(false);
    } else {
      // 변환되지 않은 step의 경우
      setError('아직 변환되지 않은 단계입니다.');
      setLoading(false);
    }
  }, [isMobile, stepNumber, supabaseUrl]);

  // 모바일: WebP 이미지 표시
  if (isMobile) {
    if (loading) {
      return (
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-muted-foreground">이미지 로딩 중...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full p-4 rounded-lg border border-[var(--border-medium)] bg-[var(--background-alt)]">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (imageUrls.length === 0) {
      return (
        <div className="w-full p-4 rounded-lg border border-[var(--border-medium)] bg-[var(--background-alt)]">
          <p className="text-sm text-muted-foreground">이미지를 찾을 수 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="w-full space-y-2">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="w-full relative rounded-lg overflow-hidden border border-[var(--border-medium)] bg-white shadow-sm"
          >
            <Image
              src={url}
              alt={`${stepNumber}단계 가이드 ${index + 1}페이지`}
              width={800}
              height={1200}
              className="w-full h-auto"
              loading={index === 0 ? 'eager' : 'lazy'}
              quality={85}
              unoptimized={false}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        ))}
      </div>
    );
  }

  // 데스크톱: 기존 PDF iframe 표시
  return (
    <div className="w-full rounded-lg overflow-hidden border border-[var(--border-medium)] bg-white shadow-sm">
      <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px]">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title={`${stepNumber}단계 가이드 PDF`}
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}

