import { auth } from '@clerk/nextjs/server';
import RagChatbot from '@/components/rag-chatbot/RagChatbot';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { MessageSquare, Shield, CheckCircle } from 'lucide-react';

/**
 * @file page.tsx
 * @description 산재 상담 챗봇 페이지
 * 
 * n8n RAG 챗봇을 통한 산업재해 전문 상담 서비스를 제공합니다.
 * 로그인한 사용자만 접근 가능합니다.
 */
export default async function ChatbotPage() {
  try {
    const { userId } = await auth();

    // 로그인하지 않은 경우 로그인 안내 페이지 표시
    if (!userId) {
      return (
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            {/* 헤더 */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary" strokeWidth={1.75} />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                산재 전문 상담 서비스
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                로그인 후 이용 가능한 서비스입니다
              </p>
            </div>

            {/* 기능 소개 */}
            <div className="bg-white border border-[var(--border-light)] rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  이 서비스는 무엇인가요?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">AI 기반 산재 전문 상담 챗봇</strong>입니다. 
                  근로복지공단과 법제처에서 제공하는 산재 규정을 전문으로 학습한 RAG(검색 기반 생성) 기술을 활용하여, 
                  산재 관련 궁금한 점을 자유롭게 물어보고 정확한 답변을 받을 수 있습니다.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-light)]">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-medium text-foreground">정확한 정보 제공</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      공식 문서 기반의 신뢰할 수 있는 답변
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-medium text-foreground">24시간 언제든지 상담</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      원하는 시간에 자유롭게 질문하고 답변받기
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-medium text-foreground">개인 맞춤 상담</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      이전 대화 내용을 기억하여 맥락 있는 답변 제공
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 로그인 안내 */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 sm:p-8 text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="w-8 h-8 text-primary" strokeWidth={1.75} />
              </div>
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-foreground font-medium">
                  로그인하시면 상담 서비스를 이용하실 수 있습니다
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  간단한 로그인으로 바로 시작하세요
                </p>
              </div>
              <div className="pt-2">
                <SignInButton mode="modal">
                  <Button size="lg" className="w-full sm:w-auto px-8 font-semibold">
                    로그인하고 시작하기
                  </Button>
                </SignInButton>
              </div>
            </div>

            {/* 법적 고지 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                <strong className="font-semibold text-amber-800">법적 고지</strong>
                <br />
                본 챗봇은 근로복지공단과 법제처에서 제공하는 각종 산재 규정을 전문으로 학습된 RAG 챗봇입니다.
                <br />
                <strong className="font-semibold text-amber-800">정확한 사항은 꼭 근로복지공단(www.comwel.or.kr)에 확인하시기 바랍니다.</strong>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
        {/* 페이지 헤더 */}
        <div className="text-center relative">
          <h1 className="text-senior-title">
            산재 전문 챗봇과 상담하세요
          </h1>
          <p className="mt-4 sm:mt-6 text-senior-body text-muted-foreground">
            산재 관련 궁금한 점을 자유롭게 물어보세요
          </p>
        </div>

        <RagChatbot />

        {/* 학습자료 출처 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">
            학습자료 출처
          </h3>
          <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
            본 챗봇은 다음 기관에서 제공하는 산재 규정 자료를 학습했습니다:
            <br />
            • 근로복지공단 (www.comwel.or.kr)
            <br />
            • 법제처 (www.moleg.go.kr)
          </p>
        </div>

        {/* 법적 고지 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            <strong className="font-semibold text-amber-800">법적 고지</strong>
            <br />
            본 챗봇은 근로복지공단과 법제처에서 제공하는 각종 산재 규정을 전문으로 학습된 RAG 챗봇입니다.
            <br />
            <strong className="font-semibold text-amber-800">정확한 사항은 꼭 근로복지공단(www.comwel.or.kr)에 확인하시기 바랍니다.</strong>
          </p>
        </div>
      </div>
    );
  } catch (error: any) {
    // 에러 로깅
    const errorMessage = error?.message || '알 수 없는 오류';
    const errorName = error?.name || 'Error';
    const errorStack = error?.stack;
    
    console.error('[ChatbotPage] 에러 발생:', {
      name: errorName,
      message: errorMessage,
      stack: errorStack,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    });

    // 개발 환경 여부 확인
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isVercelPreview = process.env.VERCEL_ENV === 'preview';

    // 에러 타입별 메시지 구분
    let errorTitle = '오류가 발생했습니다';
    let errorDescription = '';
    let errorDetails = '';

    // Clerk 인증 관련 에러
    if (errorMessage.includes('Clerk') || errorMessage.includes('auth') || errorMessage.includes('authentication')) {
      errorTitle = '인증 오류';
      errorDescription = '로그인 인증 중 문제가 발생했습니다.';
      errorDetails = isDevelopment || isVercelPreview 
        ? `Clerk 인증 설정을 확인해주세요. 에러: ${errorMessage}`
        : 'Clerk 환경 변수가 올바르게 설정되었는지 확인해주세요.';
    }
    // 환경 변수 관련 에러
    else if (errorMessage.includes('NEXT_PUBLIC') || errorMessage.includes('environment') || errorMessage.includes('env')) {
      errorTitle = '환경 설정 오류';
      errorDescription = '필수 환경 변수가 설정되지 않았습니다.';
      errorDetails = isDevelopment || isVercelPreview
        ? `환경 변수를 확인해주세요. 에러: ${errorMessage}`
        : 'Vercel 환경 변수 설정을 확인해주세요. (NEXT_PUBLIC_CLERK_*, CLERK_SECRET_KEY 등)';
    }
    // 네트워크/API 관련 에러
    else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
      errorTitle = '네트워크 오류';
      errorDescription = '서버와의 통신 중 문제가 발생했습니다.';
      errorDetails = isDevelopment || isVercelPreview
        ? `네트워크 연결을 확인해주세요. 에러: ${errorMessage}`
        : '인터넷 연결을 확인하고 잠시 후 다시 시도해주세요.';
    }
    // 일반 에러
    else {
      errorTitle = '페이지 로드 오류';
      errorDescription = '페이지를 불러오는 중 문제가 발생했습니다.';
      errorDetails = isDevelopment || isVercelPreview
        ? `에러 상세: ${errorMessage}`
        : '잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의해주세요.';
    }

    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 space-y-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-red-800 mb-2">
              {errorTitle}
            </h2>
            <p className="text-sm sm:text-base text-red-700 mb-2">
              {errorDescription}
            </p>
            <p className="text-xs sm:text-sm text-red-600">
              {errorDetails}
            </p>
          </div>
          
          {/* 개발 환경에서만 상세 에러 정보 표시 */}
          {(isDevelopment || isVercelPreview) && errorStack && (
            <details className="mt-4">
              <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                상세 에러 정보 보기
              </summary>
              <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto max-h-60">
                {errorStack}
              </pre>
            </details>
          )}
          
          <div className="mt-4 pt-4 border-t border-red-200">
            <p className="text-xs text-red-600">
              <strong>해결 방법:</strong>
              <br />
              1. 페이지를 새로고침해보세요 (F5 또는 Ctrl+R)
              <br />
              2. 브라우저 캐시를 삭제하고 다시 시도해보세요
              <br />
              3. 다른 브라우저에서 시도해보세요
              <br />
              4. 문제가 계속되면 관리자에게 문의해주세요
            </p>
          </div>
        </div>
      </div>
    );
  }
}




