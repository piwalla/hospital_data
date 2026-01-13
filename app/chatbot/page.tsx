import { auth } from '@clerk/nextjs/server';
import RagChatbot from '@/components/rag-chatbot/RagChatbot';
import ChatbotHero from '@/components/chatbot/ChatbotHero';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { MessageSquare, Shield, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
        <>
          <ChatbotHero />
          
          <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] min-h-screen -mt-12">
            <div className="container mx-auto px-4 sm:px-6 pb-20 pt-16 max-w-7xl">
              <div className="max-w-4xl mx-auto space-y-12">
                
                {/* 기능 소개 카드 섹션 */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="group bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-7 h-7 text-primary" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">정확한 정보</h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      공식 문서와 최신 산재 규정을 기반으로 신뢰할 수 있는 답변을 제공합니다.
                    </p>
                  </div>

                  <div className="group bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">24시간 대기</h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      장소와 시간에 구애받지 않고 언제 어디서나 즉각적인 상담이 가능합니다.
                    </p>
                  </div>

                  <div className="group bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Shield className="w-7 h-7 text-amber-600" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">맥락 이해</h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      단순 질의응답을 넘어 이전 대화의 맥락을 기억하여 맞춤형 정보를 드립니다.
                    </p>
                  </div>
                </div>

                {/* 로그인 안내 & CTA */}
                <div className="relative overflow-hidden bg-white rounded-[2rem] p-10 sm:p-16 shadow-[0_32px_64px_rgba(0,0,0,0.05)] border border-gray-100 text-center">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32"></div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      Smart AI Counselor
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        로그인 한 번으로<br />전문적인 산재 상담을 시작하세요
                      </h2>
                      <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                        복잡한 산재 규정, 이제 혼자 고민하지 마세요.<br />
                        리워크케어 AI가 24시간 당신의 곁을 지킵니다.
                      </p>
                    </div>

                    <div className="pt-4">
                      <SignInButton mode="modal">
                        <Button size="lg" className="h-16 px-12 text-lg font-black bg-[#14532d] hover:bg-[#114023] text-white rounded-2xl shadow-[0_12px_24px_rgba(20,83,45,0.2)] hover:shadow-[0_20px_40px_rgba(20,83,45,0.3)] transition-all transform hover:-translate-y-1 active:scale-95">
                          지금 바로 무료 상담하기
                        </Button>
                      </SignInButton>
                    </div>
                  </div>
                </div>

                {/* 법적 고지 (최하단 정렬) */}
                <div className="text-center space-y-4 max-w-2xl mx-auto opacity-60">
                  <div className="flex items-center justify-center gap-2 text-[#14532d] font-bold text-sm">
                    <Shield className="w-4 h-4" />
                    법적 고지 가이드라인
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    본 챗봇은 근로복지공단과 법제처의 공신력 있는 데이터를 학습한 AI 보조 도구입니다.<br />
                    제공되는 모든 정보는 참고용이며, 최종적인 법적 결정이나 처분은 반드시 <strong>근로복지공단 공식 채널</strong>을 통해 확인하시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <ChatbotHero />

        <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] min-h-screen -mt-12">
          <div className="container mx-auto px-4 sm:px-6 pb-20 pt-12 max-w-6xl">
            <div className="space-y-12">
              {/* 챗봇 메인 컨테이너 */}
              <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden ring-1 ring-black/[0.02]">
                <RagChatbot />
              </div>

              {/* 하단 푸터 가이드 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-black text-blue-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    신뢰할 수 있는 데이터 출처
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    리워크케어 AI는 근로복지공단(www.comwel.or.kr)과 법제처(www.moleg.go.kr)에서 관리하는 최신 산재 법령 및 실무 가이드를 학습하여 정확한 정보를 전달합니다.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-black text-amber-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    상용화 및 책임 한계 고지
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    제공된 답변은 산재 처리를 돕기 위한 참고 자료이며, 개별 사례에 따른 정확한 법적 효력은 관계 기관의 공식적인 상담과 심사를 통해 결정됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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




