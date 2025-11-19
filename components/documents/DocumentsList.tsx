/**
 * @file DocumentsList.tsx
 * @description 서류 목록 컴포넌트
 *
 * 그리드 레이아웃으로 서류 목록을 카드 형태로 표시합니다.
 * 각 서류 카드를 클릭하면 Sheet로 상세 정보가 표시됩니다.
 */

'use client';

import { useState } from 'react';
import {
  FileWarning,
  Heart,
  Calendar,
  FileCheck,
  Receipt,
  DollarSign,
  Users,
  Flower,
  ChevronRight,
} from 'lucide-react';
import type { Document } from '@/lib/types/document';
import { DOCUMENTS } from '@/lib/data/documents';
import DocumentSummary from './DocumentSummary';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// 각 서류에 맞는 아이콘 매핑
const documentIcons: Record<string, typeof FileWarning> = {
  'workplace-accident-application': FileWarning,
  'medical-benefit-application': Heart,
  'sick-leave-benefit-application': Calendar,
  'disability-rating-application': FileCheck,
  'medical-benefit-payment-application': Receipt,
  'disease-compensation-application': DollarSign,
  'survivor-benefit-application': Users,
  'funeral-expense-application': Flower,
};

// 각 서류에 맞는 배경색 그라데이션 (초록색 계열로 통일, 2025년 개선 버전)
const documentGradients: Record<string, string> = {
  'workplace-accident-application': 'from-[#2F6E4F]/5 to-[#2F6E4F]/10',
  'medical-benefit-application': 'from-[#2F6E4F]/8 to-[#2F6E4F]/12',
  'sick-leave-benefit-application': 'from-[#2F6E4F]/5 to-[#2F6E4F]/10',
  'disability-rating-application': 'from-[#2F6E4F]/8 to-[#2F6E4F]/12',
  'medical-benefit-payment-application': 'from-[#2F6E4F]/5 to-[#2F6E4F]/10',
  'disease-compensation-application': 'from-[#2F6E4F]/8 to-[#2F6E4F]/12',
  'survivor-benefit-application': 'from-[#2F6E4F]/5 to-[#2F6E4F]/10',
  'funeral-expense-application': 'from-[#2F6E4F]/8 to-[#2F6E4F]/12',
};

// 각 서류에 맞는 아이콘 색상 (초록색 계열로 통일, 2025년 개선 버전)
const documentIconColors: Record<string, string> = {
  'workplace-accident-application': 'text-[#2F6E4F]',
  'medical-benefit-application': 'text-[#2F6E4F]',
  'sick-leave-benefit-application': 'text-[#2F6E4F]',
  'disability-rating-application': 'text-[#2F6E4F]',
  'medical-benefit-payment-application': 'text-[#2F6E4F]',
  'disease-compensation-application': 'text-[#2F6E4F]',
  'survivor-benefit-application': 'text-[#2F6E4F]',
  'funeral-expense-application': 'text-[#2F6E4F]',
};

export default function DocumentsList() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCardClick = (document: Document) => {
    setSelectedDocument(document);
    setIsSheetOpen(true);
  };


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {DOCUMENTS.map((document) => {
          const Icon = documentIcons[document.id] || FileWarning;
          const gradient = documentGradients[document.id] || 'from-gray-50 to-gray-100';
          const iconColor = documentIconColors[document.id] || 'text-gray-600';

          return (
            <button
              key={document.id}
              onClick={() => handleCardClick(document)}
              className={cn(
                'group relative bg-white rounded-xl border border-[#E4E7E7] p-6',
                'hover:border-[#2F6E4F] transition-all duration-200',
                'text-left w-full h-full flex flex-col',
                'focus:outline-none focus:ring-2 focus:ring-[#2F6E4F] focus:ring-offset-2'
              )}
            >
              {/* 배경 그라데이션 */}
              <div
                className={cn(
                  'absolute inset-0 rounded-xl bg-gradient-to-br',
                  gradient
                )}
              />

              {/* 카드 내용 */}
              <div className="relative z-10">
                {/* 아이콘 */}
                <div className="mb-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      'bg-[#2F6E4F]/10',
                      'group-hover:bg-[#2F6E4F]/20 group-hover:scale-110 transition-all duration-200'
                    )}
                  >
                    <Icon className={cn('w-6 h-6', iconColor)} strokeWidth={1.75} />
                  </div>
                </div>

                {/* 서류명 */}
                <h3 className="text-[18px] font-semibold text-[#1C1C1E] mb-2 group-hover:text-[#2F6E4F] transition-colors">
                  {document.name}
                </h3>

                {/* 설명 */}
                <p className="text-[14px] text-[#555555] mb-4 flex-grow overflow-hidden">
                  <span className="line-clamp-2 block">{document.description}</span>
                </p>

                {/* 처리 기간 */}
                {document.processingPeriod && (
                  <div className="flex items-center gap-2 text-[13px] text-[#555555] mb-4">
                    <Calendar className="w-4 h-4" strokeWidth={1.75} />
                    <span>처리 기간: {document.processingPeriod}</span>
                  </div>
                )}

                {/* 더보기 아이콘 */}
                <div className="flex items-center gap-1 text-[#2F6E4F] text-[14px] font-medium">
                  <span>자세히 보기</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.75} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 상세 정보 Sheet */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            // Sheet가 완전히 닫힌 후 selectedDocument 초기화
            setTimeout(() => setSelectedDocument(null), 300);
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedDocument && (
            <>
              <SheetHeader>
                <SheetTitle className="text-[24px] font-bold text-[#1C1C1E]">
                  {selectedDocument.name}
                </SheetTitle>
                <SheetDescription className="text-[15px] text-[#555555]">
                  {selectedDocument.description}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <DocumentSummary document={selectedDocument} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}


