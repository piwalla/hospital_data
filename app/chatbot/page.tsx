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
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
      <div className="leaf-section rounded-2xl border border-[#E8F5E9] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3">
          <RiuIcon variant="question" size={56} />
          <h1 className="text-[30px] font-bold text-[#1C1C1E]">산재 상담 챗봇</h1>
        </div>
      </div>

      <RagChatbot />
    </div>
  );
}

