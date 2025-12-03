/**
 * @file error.tsx
 * @description 전역 에러 핸들러 (Error Boundary)
 * 
 * Next.js Error Boundary를 사용하여 예상치 못한 에러를 처리합니다.
 * 에러 발생 시 구조화된 로깅을 수행하고 사용자 친화적인 에러 페이지를 표시합니다.
 */

'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/utils/error-logging';
import { Button } from '@/components/ui/button';
import RiuIcon from '@/components/icons/riu-icon';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅
    logError(error, {
      component: 'ErrorBoundary',
      action: 'render',
      metadata: {
        digest: error.digest,
        stack: error.stack,
      },
    });
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="leaf-section rounded-2xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <RiuIcon variant="question" size={64} className="text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            문제가 발생했습니다
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left w-full max-w-md">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                개발자 정보 (개발 환경에서만 표시)
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={reset}
              className="flex items-center gap-2"
              aria-label="다시 시도"
            >
              다시 시도
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex items-center gap-2"
              aria-label="홈으로 이동"
            >
              홈으로 이동
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

