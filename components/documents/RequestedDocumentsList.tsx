/**
 * @file RequestedDocumentsList.tsx
 * @description 요청 서류 목록 컴포넌트
 *
 * 병원/회사에 요청해야 하는 서류를 카드 형태로 표시합니다.
 * 직접 작성 서류와 유사한 틀로, 클릭 시 상세 설명이 펼쳐지도록 구성합니다.
 */

'use client';

import { Hospital, Building2, Scale, FileText } from 'lucide-react';
import { REQUESTED_DOCUMENTS } from '@/lib/data/requested-documents';
import type { RequestedDocument } from '@/lib/types/document';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// 발급처별 아이콘 및 색상
const sourceConfig: Record<
  RequestedDocument['source'],
  { icon: typeof Hospital; label: string; color: string; bgColor: string }
> = {
  hospital: {
    icon: Hospital,
    label: '병원',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  company: {
    icon: Building2,
    label: '회사',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  court: {
    icon: Scale,
    label: '법원/기타',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  other: {
    icon: FileText,
    label: '기타',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
};

interface RequestedDocumentsListProps {
  filteredDocuments?: RequestedDocument[];
}

export default function RequestedDocumentsList({ filteredDocuments }: RequestedDocumentsListProps = {}) {
  const documentsToShow = filteredDocuments || REQUESTED_DOCUMENTS;

  return (
    <div
      className="space-y-6 sm:space-y-8"
      role="region"
      aria-label="요청 서류 목록"
    >
      {/* 안내 문구 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          이 서류들은 환자가 쓰는 게 아닙니다. <strong className="text-blue-700">"의사 선생님께 말씀하세요"</strong> 또는{' '}
          <strong className="text-blue-700">"원무과에서 떼세요"</strong>라고 가이드해야 합니다. 각 카드를 클릭하면 자세한 설명 페이지로 이동합니다.
        </p>
      </div>

      {/* 요청 서류 카드 목록 (직접 작성 서류와 유사한 틀) */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        role="list"
        aria-label="요청 서류 카드 목록"
      >
        {documentsToShow.map((doc) => {
          const config = sourceConfig[doc.source];
          const Icon = config.icon;

          return (
            <div
              key={doc.id}
              className={cn(
                'group relative bg-white rounded-lg border border-[var(--border-light)] p-4 sm:p-5 md:p-6',
                'hover:border-primary transition-all duration-200',
                'text-left w-full h-full flex flex-col',
                'shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
              )}
              role="listitem"
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* 상단: 아이콘 + 제목 + 발급처/선택 뱃지 */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                      config.bgColor
                    )}
                    aria-hidden="true"
                  >
                    <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', config.color)} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base sm:text-lg md:text-[27px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {doc.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {config.label} 발급
                      </span>
                      {doc.isOptional && (
                        <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                          선택
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs sm:text-sm text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: doc.description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                      }}
                    />
                  </div>
                </div>

                {/* 자세히 보기 버튼 (새 페이지) */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-auto"
                  aria-label={`${doc.name} 자세히 보기`}
                >
                  <Link href={`/requested-documents/${doc.id}`}>
                    <span className="text-base sm:text-lg font-bold">자세히 보기</span>
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

