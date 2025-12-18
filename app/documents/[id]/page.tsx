/**
 * @file app/documents/[id]/page.tsx
 * @description 서류 상세 정보 페이지
 * 
 * 각 서류의 상세 정보를 표시하는 페이지입니다.
 * 서류 ID를 받아서 해당 서류의 정보를 보여줍니다.
 */

import { notFound } from 'next/navigation';
import { findDocumentById } from '@/lib/data/documents';
import DocumentSummary from '@/components/documents/DocumentSummary';
import DocumentAssistant from '@/components/documents/DocumentAssistant';

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;
  const document = findDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border-light)] shadow-leaf">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              {document.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {document.description}
            </p>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-4xl space-y-6 sm:space-y-8">
        <DocumentSummary document={document} />
        <DocumentAssistant />
      </div>
    </div>
  );
}

