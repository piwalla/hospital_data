/**
 * @file RequestedDocumentsList.tsx
 * @description 요청 서류 목록 컴포넌트
 *
 * 병원/회사에 요청해야 하는 서류를 카드 형태로 표시합니다.
 * 직접 작성 서류와 유사한 틀로, 클릭 시 상세 설명이 펼쳐지도록 구성합니다.
 */

'use client';

import { useEffect, useState } from 'react';
import { Hospital, Building2, Scale, FileText } from 'lucide-react';
import { REQUESTED_DOCUMENTS } from '@/lib/data/requested-documents';
import type { RequestedDocument } from '@/lib/types/document';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { defaultLocale, documentsTranslations, type Locale } from '@/lib/i18n/config';


// 발급처별 아이콘 및 색상
const sourceConfig: Record<
  RequestedDocument['source'],
  { icon: typeof Hospital; label: string; color: string; bgColor: string; labelKey: 'hospital' | 'company' | 'court' | 'other' }
> = {
  hospital: {
    icon: Hospital,
    label: '병원',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    labelKey: 'hospital',
  },
  company: {
    icon: Building2,
    label: '회사',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    labelKey: 'company',
  },
  court: {
    icon: Scale,
    label: '법원/기타',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    labelKey: 'court',
  },
  other: {
    icon: FileText,
    label: '기타',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    labelKey: 'other',
  },
};

interface RequestedDocumentsListProps {
  filteredDocuments?: RequestedDocument[];
}

export default function RequestedDocumentsList({ filteredDocuments }: RequestedDocumentsListProps = {}) {
  const documentsToShow = filteredDocuments || REQUESTED_DOCUMENTS;

  // Localization State
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const updateLocale = () => {
      const savedLocale = localStorage.getItem('user_locale') as Locale;
      if (savedLocale && documentsTranslations[savedLocale]) {
        setLocale(savedLocale);
      }
    };

    // Initial load
    updateLocale();

    // Listen for changes
    window.addEventListener('localeChange', updateLocale);
    window.addEventListener('storage', updateLocale);

    return () => {
      window.removeEventListener('localeChange', updateLocale);
      window.removeEventListener('storage', updateLocale);
    };
  }, []);

  const t = documentsTranslations[locale] || documentsTranslations['ko'];

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="space-y-6 sm:space-y-8"
      role="region"
      aria-label="요청 서류 목록"
    >
      {/* 안내 문구 */}
      <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
          {t.ui.sections.requestGuide.split('"')[0]} 
          <strong className="text-[#14532d] font-black">&quot;{t.ui.sections.request.replace('해주세요', '')}&quot;</strong>
          {t.ui.sections.requestGuide.split('"')[2] || '.'}
        </p>
      </div>

      {/* 요청 서류 카드 목록 (직접 작성 서류와 유사한 틀) */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7"
        role="list"
        aria-label="요청 서류 카드 목록"
      >
        {documentsToShow.map((doc) => {
          const config = sourceConfig[doc.source];
          const Icon = config.icon;
          const localizedName = t.items[doc.id]?.name || doc.name;
          const localizedDesc = t.items[doc.id]?.description || doc.description;

          return (
            <Link
              key={doc.id}
              href={`/requested-documents/${doc.id}`}
              className="block group"
              aria-label={`${localizedName} 상세 정보 보기`}
            >
              <div
                className={cn(
                  'relative h-full bg-white rounded-3xl p-6 md:p-8',
                  'border border-gray-200/50',
                  'shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
                  'transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
                  'hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2',
                  'hover:border-[#14532d]/20',
                  'flex flex-col overflow-hidden text-left'
                )}
                role="listitem"
              >
                 {/* Premium Brand Accent */}
                 <div className={cn("absolute top-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300", 
                   doc.source === 'hospital' ? "bg-primary" : "bg-blue-500")} />
                <div className="relative z-10 flex flex-col h-full">
                  {/* 상단: 아이콘 + 제목 + 발급처/선택 뱃지 */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                        'bg-[#F8FAFC] border border-gray-100 shadow-sm group-hover:bg-gray-50 transition-all duration-300'
                      )}
                      aria-hidden="true"
                    >
                      <Icon className={cn('w-7 h-7', config.color)} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start gap-2 flex-wrap mb-2">
                        {(() => {
                           // Korean check to see if we should parse brackets
                          const isKorean = locale === 'ko';
                          const match = localizedName.match(/^(.+?)\s*\((.+?)\)\s*$/);
                          
                          if (match && isKorean) {
                            const [, mainName, bracketContent] = match;
                            return (
                              <div className="flex-1 min-w-0">
                                <h3 className="group-hover:text-[#14532d] transition-colors leading-tight">
                                  <span className="block text-lg md:text-xl font-black text-gray-900">{mainName}</span>
                                  <span className="block text-sm text-gray-400 font-bold group-hover:text-[#14532d]/60 mt-0.5">
                                    {bracketContent}
                                  </span>
                                </h3>
                              </div>
                            );
                          }
                          return (
                            <h3 className="text-lg md:text-xl font-black text-gray-900 group-hover:text-[#14532d] transition-colors leading-tight flex-1">
                              {localizedName}
                            </h3>
                          );
                        })()}
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-bold">
                            {t.ui.badges[config.labelKey]}
                          </span>
                          {doc.isOptional && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-bold">
                              {t.ui.badges.optional}
                            </span>
                          )}
                        </div>
                      </div>
                      <p
                        className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: localizedDesc.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-gray-100/60 flex items-center justify-between group/link">
                     <span className="text-xs font-black uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
                       Request Guide
                     </span>
                     <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
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
    </div>
  );
}

