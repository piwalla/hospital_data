import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RagChatbot from '@/components/rag-chatbot/RagChatbot';
import RiuIcon from '@/components/icons/riu-icon';

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
      <div className="leaf-section rounded-2xl border border-[var(--border-light)] shadow-canopy p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <RiuIcon variant="question" size={40} className="sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[30px] font-bold text-foreground">산재 상담 챗봇</h1>
        </div>
      </div>

      <RagChatbot />
    </div>
  );
}




