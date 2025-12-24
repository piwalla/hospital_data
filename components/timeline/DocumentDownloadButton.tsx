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
      <div className="flex flex-col gap-2 flex-shrink-0">
        {/* 별도 양식 없음 표시 */}
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
          <span className="text-sm font-medium">별도 양식 없음</span>
        </div>
        
        {/* 서류 상세 안내 페이지로 연결 */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sm"
        >
          <a 
            href={document.guide_url || `/documents?search=${encodeURIComponent(document.title)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>획득 방법 보기</span>
          </a>
        </Button>
      </div>
    );
  }

  const isExternalLink = document.pdf_url.startsWith('http://') || document.pdf_url.startsWith('https://');

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* PDF 다운로드/보기 버튼 */}
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

      {/* 가이드 보기 버튼 (PDF가 있어도 가이드가 있으면 표시) */}
      {(document.guide_url || !document.pdf_url) && (
         <Button
           asChild
           variant="ghost"
           size="sm"
           className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
         >
           <a 
             href={document.guide_url || `/documents?search=${encodeURIComponent(document.title)}`}
             target={document.guide_url?.startsWith('/') ? "_self" : "_blank"}
             rel="noopener noreferrer"
           >
             <ExternalLink className="w-4 h-4" />
             <span>획득 방법 보기</span>
           </a>
         </Button>
      )}
    </div>
  );
}




