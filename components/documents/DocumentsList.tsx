/**
 * @file DocumentsList.tsx
 * @description 서류 목록 컴포넌트
 *
 * 그리드 레이아웃으로 서류 목록을 카드 형태로 표시합니다.
 * 각 서류 카드를 클릭하면 Sheet로 상세 정보가 표시됩니다.
 */

'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FileWarning,
  Heart,
  Calendar,
  FileCheck,
  Receipt,
  DollarSign,
  Users,
  Flower,
  FileText,
  Briefcase,
  RefreshCw,
  FileEdit,
  FileQuestion,
} from 'lucide-react';
import type { Document } from '@/lib/types/document';
import { DOCUMENTS } from '@/lib/data/documents';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RequestedDocumentsList from './RequestedDocumentsList';
import { getRequestedDocumentsByStage } from '@/lib/data/requested-documents';

// 각 서류에 맞는 아이콘 매핑
const documentIcons: Record<string, typeof FileWarning> = {
  'workplace-accident-application': FileWarning,
  'accident-report': FileText,
  'medical-benefit-application': Receipt,
  'sick-leave-benefit-application': Calendar,
  'disability-rating-application': FileCheck,
  'employment-support-application': Briefcase,
  're-treatment-application': RefreshCw,
};

// 각 서류에 맞는 아이콘 색상 (초록색 계열로 통일, 2025년 개선 버전)
const documentIconColors: Record<string, string> = {
  'workplace-accident-application': 'text-primary',
  'accident-report': 'text-primary',
  'medical-benefit-application': 'text-primary',
  'sick-leave-benefit-application': 'text-primary',
  'disability-rating-application': 'text-primary',
  'employment-support-application': 'text-primary',
  're-treatment-application': 'text-primary',
};

// 단계별 서류 매핑 (1단계 = initial, 2단계 = treatment, 3단계 = disability, 4단계 = return)
const stageDocumentMap: Record<number, { write: string[]; request: string[] }> = {
  1: {
    write: ['workplace-accident-application', 'accident-report'],
    request: ['initial'],
  },
  2: {
    write: ['sick-leave-benefit-application', 'medical-benefit-application'],
    request: ['treatment'],
  },
  3: {
    write: ['disability-rating-application'],
    request: ['disability'],
  },
  4: {
    write: ['employment-support-application', 're-treatment-application'],
    request: ['return'],
  },
};

interface DocumentsListProps {
  initialStage?: number;
}

export default function DocumentsList({ initialStage }: DocumentsListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stageFromUrl = searchParams.get('stage') ? parseInt(searchParams.get('stage')!, 10) : initialStage;
  const [showAll, setShowAll] = useState(!stageFromUrl); // 단계가 없으면 전체 보기

  // 단계별 필터링된 서류
  const filteredDocuments = useMemo(() => {
    if (!stageFromUrl || showAll) {
      return DOCUMENTS;
    }
    const stageDocs = stageDocumentMap[stageFromUrl];
    if (!stageDocs) return DOCUMENTS;
    return DOCUMENTS.filter((doc) => stageDocs.write.includes(doc.id));
  }, [stageFromUrl, showAll]);

  // 단계별 필터링된 요청 서류
  const filteredRequestedDocuments = useMemo(() => {
    if (!stageFromUrl || showAll) {
      return null; // 전체 보기
    }
    const stageDocs = stageDocumentMap[stageFromUrl];
    if (!stageDocs) return null;
    
    // requiredStages를 단계 번호로 변환
    const stageMap: Record<number, string> = {
      1: 'initial',
      2: 'treatment',
      3: 'disability',
      4: 'return',
    };
    const stageKey = stageMap[stageFromUrl];
    if (!stageKey) return null;
    
    return getRequestedDocumentsByStage(stageKey as any);
  }, [stageFromUrl, showAll]);

  const handleShowAll = () => {
    setShowAll(true);
    // URL에서 stage 파라미터 제거
    const params = new URLSearchParams(searchParams.toString());
    params.delete('stage');
    router.push(`/documents?${params.toString()}`);
  };

  return (
    <div 
      className="space-y-6 sm:space-y-8"
      role="region"
      aria-label="서류 목록"
    >
      {/* 단계별 필터 배너 */}
      {stageFromUrl && !showAll && (
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                ✅ {stageFromUrl}단계에서 필요한 서류만 보여드립니다
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                총 {filteredDocuments.length + (filteredRequestedDocuments?.length || 0)}개의 서류가 필요합니다.
                (작성 {filteredDocuments.length}개 + 요청 {filteredRequestedDocuments?.length || 0}개)
              </p>
            </div>
            <button
              onClick={handleShowAll}
              className="text-sm font-medium text-primary hover:text-primary/80 underline whitespace-nowrap"
            >
              전체 서류 보기
            </button>
          </div>
        </div>
      )}

      {/* 섹션 1: 직접 작성하는 서류 */}
      <section
        aria-labelledby="section-write"
        className="bg-white rounded-lg border border-[var(--border-light)] shadow-sm p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5"
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.75} />
            <h2 id="section-write" className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
              직접 작성하는 서류
            </h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {filteredDocuments.length}
          </span>
        </header>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          role="list"
          aria-label="작성 서류 카드 목록"
        >
        {filteredDocuments.map((document) => {
          const Icon = documentIcons[document.id] || FileWarning;
          const iconColor = documentIconColors[document.id] || 'text-gray-600';

          return (
            <div
              key={document.id}
              className={cn(
                'group relative bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-5 md:p-6',
                'hover:border-primary transition-all duration-200',
                'text-left w-full h-full flex flex-col',
                'shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
              )}
              role="listitem"
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* 상단: 아이콘 + 제목 */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                      'bg-primary/10'
                    )}
                    aria-hidden="true"
                  >
                    <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', iconColor)} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-[27px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {document.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                      {document.description}
                    </p>
                  </div>
                </div>

                {/* 자세히 보기 버튼 */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-auto"
                  aria-label={`${document.name} 자세히 보기`}
                >
                  <Link href={`/documents/${document.id}`}>
                    <span className="text-base sm:text-lg font-bold">자세히 보기</span>
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* 섹션 2: 병원이나 회사에 요청해야 하는 서류 */}
      <section
        aria-labelledby="section-request"
        className="space-y-3 sm:space-y-4 border-t border-dashed border-[var(--border-medium)] pt-4 sm:pt-6 mt-2 sm:mt-4"
      >
        <header className="flex items-center gap-2 sm:gap-3">
          <FileQuestion className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.75} />
          <h2 id="section-request" className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
            병원이나 회사에 요청해야 하는 서류
          </h2>
        </header>

        {filteredRequestedDocuments ? (
          <RequestedDocumentsList filteredDocuments={filteredRequestedDocuments} />
        ) : (
          <RequestedDocumentsList />
        )}
      </section>
    </div>
  );
}


