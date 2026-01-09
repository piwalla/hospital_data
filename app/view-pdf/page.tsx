/**
 * @file app/view-pdf/page.tsx
 * @description PDF 뷰어 페이지
 * 
 * PDF 파일을 화면에 표시하고 다운로드할 수 있는 페이지입니다.
 * Query parameter로 파일 경로를 받아서 PDF를 표시합니다.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ViewPdfContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    const file = searchParams.get('file');
    if (file) {
      // 파일 경로가 /pdf/로 시작하는지 확인
      // 파일 경로 처리: http/https로 시작하거나 /로 시작하면 그대로 사용, 그 외에는 /pdf/ 경로 추가
      const url =
        file.startsWith('http://') || file.startsWith('https://') || file.startsWith('/')
          ? file
          : `/pdf/${file}`;
      setPdfUrl(url);
      // 파일명 추출
      const name = file.split('/').pop() || file;
      setFileName(name);
    }
  }, [searchParams]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!pdfUrl) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <p className="text-muted-foreground">PDF 파일을 찾을 수 없습니다.</p>
          <Button
            onClick={() => router.back()}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border-light)] shadow-leaf">
        <div className="container mx-auto px-4 py-3 sm:py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                aria-label="뒤로 가기"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">
                {fileName}
              </h1>
            </div>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
              aria-label="PDF 다운로드"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">다운로드</span>
            </Button>
          </div>
        </div>
      </div>

      {/* PDF 뷰어 */}
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
        <div className="bg-white rounded-lg shadow-canopy overflow-hidden">
          <iframe
            src={`${pdfUrl}#toolbar=1`}
            className="w-full h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]"
            title={fileName}
            aria-label={`${fileName} PDF 뷰어`}
          />
        </div>
      </div>
    </div>
  );
}

export default function ViewPdfPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <p className="text-muted-foreground">PDF를 불러오는 중...</p>
        </div>
      </div>
    }>
      <ViewPdfContent />
    </Suspense>
  );
}


