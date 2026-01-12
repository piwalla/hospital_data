
import { auth } from '@clerk/nextjs/server';
import RagChatbotV2 from '@/components/rag-chatbot/RagChatbotV2';
import ChatbotHero from '@/components/chatbot/ChatbotHero';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle } from 'lucide-react';

export default async function ChatbotV2Page() {
  const { userId } = await auth();

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
                  본 서비스는 RAG 기술을 사용하여 근로복지공단과 법제처에서 제공한 산재 규정을 분석합니다.
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
