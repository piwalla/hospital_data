/**
 * @file DocumentsList.tsx
 * @description 서류 목록 컴포넌트
 *
 * 그리드 레이아웃으로 서류 목록을 카드 형태로 표시합니다.
 * 각 서류 카드를 클릭하면 Sheet로 상세 정보가 표시됩니다.
 */

'use client';

import {
  FileWarning,
  Heart,
  Calendar,
  FileCheck,
  Receipt,
  DollarSign,
  Users,
  Flower,
} from 'lucide-react';
import type { Document } from '@/lib/types/document';
import { DOCUMENTS } from '@/lib/data/documents';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  'workplace-accident-application': 'from-primary/5 to-primary/10',
  'medical-benefit-application': 'from-primary/8 to-primary/12',
  'sick-leave-benefit-application': 'from-primary/5 to-primary/10',
  'disability-rating-application': 'from-primary/8 to-primary/12',
  'medical-benefit-payment-application': 'from-primary/5 to-primary/10',
  'disease-compensation-application': 'from-primary/8 to-primary/12',
  'survivor-benefit-application': 'from-primary/5 to-primary/10',
  'funeral-expense-application': 'from-primary/8 to-primary/12',
};

// 각 서류에 맞는 아이콘 색상 (초록색 계열로 통일, 2025년 개선 버전)
const documentIconColors: Record<string, string> = {
  'workplace-accident-application': 'text-primary',
  'medical-benefit-application': 'text-primary',
  'sick-leave-benefit-application': 'text-primary',
  'disability-rating-application': 'text-primary',
  'medical-benefit-payment-application': 'text-primary',
  'disease-compensation-application': 'text-primary',
  'survivor-benefit-application': 'text-primary',
  'funeral-expense-application': 'text-primary',
};

export default function DocumentsList() {
  return (
    <div 
      className="leaf-section rounded-2xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3 sm:p-4 md:p-6"
      role="region"
      aria-label="서류 목록"
    >
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        role="list"
        aria-label="서류 카드 목록"
      >
        {DOCUMENTS.map((document) => {
          const Icon = documentIcons[document.id] || FileWarning;
          const gradient = documentGradients[document.id] || 'from-gray-50 to-gray-100';
          const iconColor = documentIconColors[document.id] || 'text-gray-600';

          return (
            <div
              key={document.id}
              className={cn(
                'group relative bg-white rounded-2xl border border-[var(--border-light)] p-4 sm:p-5 md:p-6',
                'hover:border-primary transition-all duration-200',
                'text-left w-full h-full flex flex-col',
                'shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              )}
              role="listitem"
            >
              {/* 배경 그라데이션 */}
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl bg-gradient-to-br',
                  gradient
                )}
              />

              {/* 카드 내용 */}
              <div className="relative z-10 flex flex-col h-full">
                {/* 아이콘 */}
                <div className="mb-3 sm:mb-4">
                  <div
                    className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center',
                      'bg-primary/10',
                      'group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200'
                    )}
                    aria-hidden="true"
                  >
                    <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', iconColor)} strokeWidth={1.75} />
                  </div>
                </div>

                {/* 서류명 */}
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {document.name}
                </h3>

                {/* 설명 */}
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-grow overflow-hidden">
                  <span className="line-clamp-2 block">{document.description}</span>
                </p>

                {/* 작성방법 보기 버튼 */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-auto"
                  aria-label={`${document.name} 작성방법 보기`}
                >
                  <Link href={`/documents/${document.id}`}>
                    <span className="text-xs sm:text-sm">작성방법 보기</span>
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


