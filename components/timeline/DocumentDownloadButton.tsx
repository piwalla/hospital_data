/**
 * @file DocumentDownloadButton.tsx
 * @description 타임라인 서류 다운로드 버튼 컴포넌트
 */

'use client';

import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { TimelineDocument } from '@/lib/types/timeline';

interface DocumentDownloadButtonProps {
  document: TimelineDocument;
}

export default function DocumentDownloadButton({ document }: DocumentDownloadButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!document.pdf_url) {
      return;
    }

    // 공식 링크 (http/https로 시작)
    if (document.pdf_url.startsWith('http://') || document.pdf_url.startsWith('https://')) {
      window.open(document.pdf_url, '_blank', 'noopener,noreferrer');
      return;
    }

    // 로컬 PDF 파일 (/pdf/로 시작)
    if (document.pdf_url.startsWith('/pdf/') || document.pdf_url.startsWith('/')) {
      router.push(`/view-pdf?file=${encodeURIComponent(document.pdf_url)}`);
      return;
    }

    // 상대 경로인 경우
    router.push(`/view-pdf?file=${encodeURIComponent(`/pdf/${document.pdf_url}`)}`);
  };

  if (!document.pdf_url) {
    return (
      <span className="text-sm sm:text-base text-[#6B7280]">
        PDF 없음
      </span>
    );
  }

  const isExternalLink = document.pdf_url.startsWith('http://') || document.pdf_url.startsWith('https://');

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="default"
      className="flex items-center gap-2 min-h-[44px] text-base sm:text-lg"
      aria-label={`${document.title} ${isExternalLink ? '열기' : '보기'}`}
    >
      {isExternalLink ? (
        <>
          <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>공식 링크</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>PDF 보기</span>
        </>
      )}
    </Button>
  );
}




