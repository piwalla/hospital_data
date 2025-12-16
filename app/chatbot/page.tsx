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

      <RagChatbot />
    </div>
  );
}




