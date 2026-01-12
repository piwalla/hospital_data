import { notFound } from 'next/navigation';
import { findDocumentById } from '@/lib/data/documents';
import { findRequestedDocumentById } from '@/lib/data/requested-documents';
import DocumentTabs from '@/components/documents/DocumentTabs';
import type { Document } from '@/lib/types/document';

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;
  
  // 1. 직접 작성 서류에서 검색
  let document = findDocumentById(id);
  
  // 2. 요청 서류에서 검색 (없으면)
  if (!document) {
    const requestedDoc = findRequestedDocumentById(id);
    if (requestedDoc) {
      // RequestedDocument를 Document 타입으로 변환 (UI 호환성)
      document = {
        id: requestedDoc.id,
        name: requestedDoc.name,
        description: requestedDoc.description,
        category: 'application', // 기본값
        predefinedSummary: {
          summary: requestedDoc.description,
          sections: [
            {
              title: '발급/요청 가이드',
              content: requestedDoc.guide,
              order: 1
            },
            {
              title: '필요한 단계',
              content: `이 서류는 **${requestedDoc.requiredStages.join(', ')}** 단계에서 필요합니다.`,
              order: 2
            }
          ],
          importantNotes: [
            '이 서류는 환자가 직접 작성하는 것이 아니라, 병원이나 기관에 요청해서 받는 서류입니다.',
            `발급처: ${requestedDoc.source === 'hospital' ? '병원 원무과' : requestedDoc.source === 'company' ? '회사' : '해당 기관'}`
          ]
        }
      } as Document;
    }
  }

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
        <DocumentTabs document={document} />
      </div>

    </div>
  );
}
