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
  FileText,
  Calendar,
  FileCheck,
  Receipt,
  Briefcase,
  RefreshCw,
  FileEdit,
  FileQuestion,
} from 'lucide-react';

import { DOCUMENTS } from '@/lib/data/documents';
import Link from 'next/link';
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
  'workplace-accident-application': 'text-[#14532d]', // primary
  'accident-report': 'text-[#14532d]',
  'medical-benefit-application': 'text-[#14532d]',
  'sick-leave-benefit-application': 'text-[#14532d]',
  'disability-rating-application': 'text-[#14532d]',
  'employment-support-application': 'text-[#14532d]',
  're-treatment-application': 'text-[#14532d]',
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
      className="space-y-8 sm:space-y-12"
      role="region"
      aria-label="서류 목록"
    >
      {/* 탭 네비게이션 */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        <button
          onClick={() => {
            setShowAll(true);
            const params = new URLSearchParams(searchParams.toString());
            params.delete('stage');
            router.push(`/documents?${params.toString()}`);
          }}
          className={cn(
            'px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300',
            showAll
              ? 'bg-[#14532d] text-white shadow-[0_8px_20px_rgba(20,83,45,0.25)] scale-105'
              : 'bg-white/80 backdrop-blur-md text-gray-500 hover:text-[#14532d] border border-gray-200/50 shadow-sm'
          )}
        >
          전체 보기
        </button>
        {[
          { id: 1, label: '1. 신청 단계' },
          { id: 2, label: '2. 치료 중' },
          { id: 3, label: '3. 장해 평가' },
          { id: 4, label: '4. 사회 복귀' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setShowAll(false);
              router.push(`/documents?stage=${tab.id}`);
            }}
            className={cn(
              'px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300',
              stageFromUrl === tab.id && !showAll
                ? 'bg-[#14532d] text-white shadow-[0_8px_20px_rgba(20,83,45,0.25)] scale-105'
                : 'bg-white/80 backdrop-blur-md text-gray-500 hover:text-[#14532d] border border-gray-200/50 shadow-sm'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 검색바 */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#14532d]/20 to-[#4ADE80]/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-gray-400 group-focus-within:text-[#14532d] transition-colors"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="찾으시는 서류 이름이 있나요?"
              className="w-full pl-14 pr-12 py-4.5 bg-transparent border-none focus:ring-0 placeholder-gray-400 text-gray-800 text-base font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100/50 rounded-full transition-all"
                aria-label="검색어 지우기"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {searchQuery && (
          <p className="mt-3 text-sm text-gray-500 text-center animate-fade-in font-medium">
            <span className="font-bold text-[#14532d]">{filteredDocuments.length}개</span>의 서류를 찾았습니다
          </p>
        )}
      </div>

      {/* 단계별 필터 배너 */}
      {stageFromUrl && !showAll && (
        <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#14532d] mb-1 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#14532d] text-white text-[10px] font-black">
                  {stageFromUrl}
                </span>
                현재 단계에서 꼭 필요한 서류입니다
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                총 {filteredDocuments.length + (filteredRequestedDocuments?.length || 0)}개의 서류가 필요합니다.
                (작성 {filteredDocuments.length}개 + 요청 {filteredRequestedDocuments?.length || 0}개)
              </p>
            </div>
            <button
              onClick={handleShowAll}
              className="text-sm font-bold text-[#14532d] hover:bg-[#14532d]/10 px-5 py-2 rounded-xl transition-all"
            >
              전체 서류 보기 &rarr;
            </button>
          </div>
        </div>
      )}

      <section
        aria-labelledby="section-write"
        className="space-y-6"
      >
        <header className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#14532d]/10 rounded-xl">
              <FileEdit className="w-6 h-6 text-[#14532d]" strokeWidth={2.5} />
            </div>
            <h2 id="section-write" className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              직접 작성해주세요
            </h2>
          </div>
          <span className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/50 text-xs font-bold text-[#14532d] shadow-sm">
            총 {filteredDocuments.length}종
          </span>
        </header>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
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
              className="group block h-full"
              aria-label={`${document.name} 상세 정보 보기`}
            >
              <div
                className={cn(
                  'relative h-full bg-white rounded-3xl p-5 sm:p-6 md:p-8',
                  'border border-gray-200/50',
                  'shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
                  'transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
                  'hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2',
                  'hover:border-[#14532d]/20',
                  'flex flex-col overflow-hidden',
                  'min-h-[180px]' // Ensure minimum click area
                )}
                role="listitem"
              >
                 {/* Premium Brand Accent */}
                 <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#14532d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 
                 {/* Subtle Light Effect on Hover */}
                 <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* 상단: 아이콘 + 제목 */}
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-5">
                    <div
                      className={cn(
                        'w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0',
                        'bg-[#F8FAFC] border border-gray-100 shadow-sm group-hover:bg-[#14532d] group-hover:border-[#14532d] transition-all duration-300'
                      )}
                      aria-hidden="true"
                    >
                      <Icon className={cn('w-5 h-5 md:w-7 md:h-7 transition-colors duration-300 group-hover:text-white', iconColor)} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      {(() => {
                        const match = document.name.match(/^(.+?)\s*\((.+?)\)\s*$/);
                        if (match) {
                          const [, mainName, bracketContent] = match;
                          return (
                            <h3 className="group-hover:text-[#14532d] transition-colors leading-tight">
                              <span className="block text-lg md:text-xl font-black text-gray-900">{mainName}</span>
                              <span className="block text-sm text-gray-400 font-bold group-hover:text-[#14532d]/60 mt-0.5">
                                {bracketContent}
                              </span>
                            </h3>
                          );
                        }
                        return (
                          <h3 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-[#14532d] transition-colors leading-tight">
                            {document.name}
                          </h3>
                        );
                      })()}
                    </div>
                  </div>

                   <p className="text-gray-500 font-medium leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-[15px] group-hover:text-gray-600 transition-colors">
                      {document.description}
                   </p>

                  <div className="mt-auto pt-3 md:pt-5 border-t border-gray-100/60 flex items-center justify-between group/link">
                     <span className="text-xs font-black uppercase tracking-wider text-gray-400 group-hover:text-[#14532d] transition-colors">
                       Guides & Details
                     </span>
                     <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#14532d] group-hover:text-white transition-all duration-500 shadow-sm">
                        <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                     </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        </div>
      </section>

      <section
        aria-labelledby="section-request"
        className="space-y-6 pt-12"
      >
        <header className="flex items-center gap-3 px-2">
            <div className="p-2 bg-[#14532d]/10 rounded-xl">
              <FileQuestion className="w-6 h-6 text-[#14532d]" strokeWidth={2.5} />
            </div>
            <h2 id="section-request" className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              발급 요청해주세요
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
