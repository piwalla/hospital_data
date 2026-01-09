
import { auth } from '@clerk/nextjs/server';
import RagChatbotV2 from '@/components/rag-chatbot/RagChatbotV2';
import ChatbotHero from '@/components/chatbot/ChatbotHero';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle } from 'lucide-react';

export default async function ChatbotV2Page() {
  const { userId } = await auth();

  // 로그인하지 않은 경우
  if (!userId) {
    return (
      <>
        <ChatbotHero />
        
        <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] min-h-screen -mt-12">
          <div className="container mx-auto px-4 sm:px-6 pb-20 pt-16 max-w-7xl">
            <div className="max-w-4xl mx-auto space-y-12">
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mt-4">똑똑한 산재 AI 비서</h2>
                <p className="text-gray-500 mt-2">24시간 언제나 곁에서 대기하고 있습니다.</p>
              </div>

              {/* 기능 소개 카드 섹션 */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group bg-white/80 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-7 h-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Google Gemini Technology</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">
                    구글의 최신 1.5 Pro/Flash 모델을 사용하여 문서 이해력이 대폭 향상되었습니다.
                  </p>
                </div>
                {/* ... 나머지 카드는 동일하게 유지하거나 생략 ... */}
              </div>

              {/* 로그인 안내 & CTA */}
              <div className="relative overflow-hidden bg-white rounded-[2rem] p-10 sm:p-16 shadow-[0_32px_64px_rgba(0,0,0,0.05)] border border-gray-100 text-center">
                 {/* ... 배경 장식 등 동일 ... */}
                <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        로그인하고 V2 베타 체험하기
                    </h2>
                  </div>

                  <div className="pt-4">
                    <SignInButton mode="modal">
                      <Button size="lg" className="h-16 px-12 text-lg font-black bg-[#14532d] text-white rounded-2xl">
                        상담 시작하기
                      </Button>
                    </SignInButton>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </>
    );
  }

  // 로그인 상태
  return (
    <>
      <ChatbotHero />

      <div className="relative w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] min-h-screen -mt-12">
        <div className="container mx-auto px-4 sm:px-6 pb-20 pt-12 max-w-6xl">
          <div className="space-y-12">
            {/* 챗봇 메인 컨테이너 */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden ring-1 ring-black/[0.02] relative">
              <RagChatbotV2 />
            </div>

            {/* 하단 푸터 가이드 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-8 shadow-sm">
                <h3 className="text-sm font-black text-blue-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  신뢰할 수 있는 데이터 출처
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  본 서비스는 RAG 기술을 사용하여 근로복지공단의 산업재해 문서를 실시간으로 분석합니다.
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
}
