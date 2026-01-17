import { auth } from '@clerk/nextjs/server';
import ChatbotV2Client from '@/components/chatbot/ChatbotV2Client';

export const dynamic = 'force-dynamic';

export default async function ChatbotV2Page() {
  await auth();

  return (
    <ChatbotV2Client />
  );
}
