import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RagChatbot from '@/components/rag-chatbot/RagChatbot';

/**
 * @file page.tsx
 * @description 산재 상담 챗봇 페이지
 * 
 * n8n RAG 챗봇을 통한 산업재해 전문 상담 서비스를 제공합니다.
 * 로그인한 사용자만 접근 가능합니다.
 */
export default async function ChatbotPage() {
  const { userId } = await auth();

  // 로그인하지 않은 경우 홈으로 리다이렉트
  if (!userId) {
    redirect('/');
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

      <RagChatbot />
    </div>
  );
}




