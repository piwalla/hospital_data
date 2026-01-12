/**
 * @file app/requested-documents/[id]/page.tsx
 * @description 병원/회사에 요청해야 하는 서류 상세 페이지
 *
 * 각 요청 서류의 설명과 요청 방법을 별도 페이지에서 보여줍니다.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findRequestedDocumentById } from '@/lib/data/requested-documents';

interface RequestedDocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestedDocumentDetailPage({ params }: RequestedDocumentDetailPageProps) {
  const { id } = await params;
  const document = findRequestedDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border-light)] shadow-leaf">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              aria-label="서류 목록으로 돌아가기"
            >
              <Link href="/documents">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {document.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                병원이나 회사에 요청해서 발급받는 서류입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-4xl space-y-6 sm:space-y-8">
        {/* 이 서류는 무엇인가요? */}
        <section
          className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4"
          aria-labelledby="what-is-this-doc"
        >
          <h2 id="what-is-this-doc" className="text-base sm:text-lg font-semibold text-foreground">
            이 서류는 무엇인가요?
          </h2>
          <div
            className="text-sm sm:text-base text-foreground leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: document.description
                .replace(/\n/g, '<br />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        </section>

        {/* 어떻게 요청하나요? */}
        <section
          className="bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4"
          aria-labelledby="how-to-request"
        >
          <h2 id="how-to-request" className="text-base sm:text-lg font-semibold text-foreground">
            어떻게 요청하나요?
          </h2>
          <div
            className="text-sm sm:text-base text-foreground leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: document.guide
                .replace(/\n/g, '<br />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        </section>

        {/* 안내 문구 */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4" aria-label="추가 안내">
          <p className="text-xs sm:text-sm text-blue-900">
            이 서류는 <strong>환자가 직접 작성하는 서류가 아니라</strong>, 병원이나 회사에 &quot;
            <strong>이 서류 발급해 주세요</strong>&quot;라고 요청해야 하는 서류입니다.
            어려우시면 병원 원무과나 회사 인사 담당자에게 이 화면을 보여주고 도움을 요청하셔도 좋습니다.
          </p>
        </section>
      </div>
    </div>
  );
}









