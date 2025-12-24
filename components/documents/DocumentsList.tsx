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
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태

  // 단계별 필터링된 서류
  const filteredDocuments = useMemo(() => {
    let docs = DOCUMENTS;
    
    // 단계 필터링
    if (stageFromUrl && !showAll) {
      const stageDocs = stageDocumentMap[stageFromUrl];
      if (stageDocs) {
        docs = docs.filter((doc) => stageDocs.write.includes(doc.id));
      }
    }
    
    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      docs = docs.filter((doc) => {
        // 검색 대상: 서류명, 설명, 검색 키워드
        const searchTargets = [
          doc.name,
          doc.description,
          ...(doc.searchKeywords || [])
        ];
        
        return searchTargets.some(target => 
          target.toLowerCase().includes(query)
        );
      });
    }
    
    return docs;
  }, [stageFromUrl, showAll, searchQuery]);

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
      {/* 탭 네비게이션 */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
        <button
          onClick={() => {
            setShowAll(true);
            const params = new URLSearchParams(searchParams.toString());
            params.delete('stage');
            router.push(`/documents?${params.toString()}`);
          }}
          className={cn(
            'px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200',
            showAll
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          )}
        >
          전체
        </button>
        <button
          onClick={() => {
            setShowAll(false);
            router.push('/documents?stage=1');
          }}
          className={cn(
            'px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200',
            stageFromUrl === 1 && !showAll
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          )}
        >
          신청 단계
        </button>
        <button
          onClick={() => {
            setShowAll(false);
            router.push('/documents?stage=2');
          }}
          className={cn(
            'px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200',
            stageFromUrl === 2 && !showAll
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          )}
        >
          치료 중
        </button>
        <button
          onClick={() => {
            setShowAll(false);
            router.push('/documents?stage=3');
          }}
          className={cn(
            'px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200',
            stageFromUrl === 3 && !showAll
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          )}
        >
          장해 평가
        </button>
        <button
          onClick={() => {
            setShowAll(false);
            router.push('/documents?stage=4');
          }}
          className={cn(
            'px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200',
            stageFromUrl === 4 && !showAll
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          )}
        >
          사회복귀
        </button>
      </div>

      {/* 검색바 */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="서류 이름이나 설명으로 검색하세요..."
            className="w-full pl-12 pr-12 py-3 sm:py-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="검색어 지우기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            <span className="font-semibold text-primary">{filteredDocuments.length}개</span>의 서류를 찾았습니다
          </p>
        )}
      </div>

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
        className="space-y-4 sm:space-y-5 bg-blue-50/30 rounded-2xl p-6"
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileEdit className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.75} />
            <h2 id="section-write" className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
              직접 작성하게 되는 서류 12가지예요
            </h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {filteredDocuments.length}
          </span>
        </header>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7"
          role="list"
          aria-label="작성 서류 카드 목록"
        >
        {filteredDocuments.map((document) => {
          const Icon = documentIcons[document.id] || FileWarning;
          const iconColor = documentIconColors[document.id] || 'text-gray-600';

          return (
            <Link
              key={document.id}
              href={`/documents/${document.id}`}
              className="block group"
              aria-label={`${document.name} 상세 정보 보기`}
            >
              <div
                className={cn(
                  'relative bg-white rounded-lg border border-[var(--border-light)] p-5 sm:p-6 md:p-7 lg:p-8',
                  'hover:border-primary transition-all duration-300',
                  'text-left w-full h-full flex flex-col',
                  'shadow-sm hover:shadow-xl hover:-translate-y-1'
                )}
                role="listitem"
              >
                <div className="relative z-10 flex flex-col h-full">
                  {/* 상단: 아이콘 + 제목 */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0',
                        'bg-primary/10'
                      )}
                      aria-hidden="true"
                    >
                      <Icon className={cn('w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8', iconColor)} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {(() => {
                        // 괄호 안의 내용을 분리
                        const match = document.name.match(/^(.+?)\s*\((.+?)\)\s*$/);
                        if (match) {
                          const [, mainName, bracketContent] = match;
                          return (
                            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                              <span className="block">{mainName}</span>
                              <span className="block text-base sm:text-lg md:text-xl lg:text-xl text-gray-600 font-normal">
                                ({bracketContent})
                              </span>
                            </h3>
                          );
                        }
                        return (
                          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {document.name}
                          </h3>
                        );
                      })()}
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-3 mt-2">
                        {document.description}
                      </p>
                    </div>
                  </div>

                  {/* 시각적 표시 (자세히 보기 제거, 화살표 아이콘으로 대체) */}
                  <div className="flex items-center justify-end mt-auto pt-4 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    <span>자세히 보기</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        </div>
      </section>

      {/* 섹션 2: 병원이나 회사에 요청해야 하는 서류 */}
      <section
        aria-labelledby="section-request"
        className="space-y-3 sm:space-y-4 bg-green-50/30 rounded-2xl p-6 mt-6"
      >
        <header className="flex items-center gap-2 sm:gap-3">
          <FileQuestion className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.75} />
          <h2 id="section-request" className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
            발급 요청하게 되는 서류
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


