"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Loader2, HeadphonesIcon, MessageSquare } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { getOrCreateSession, getMessages, sendMessage, subscribeToMessages } from "@/lib/api/cs";
import { CSMessage, CSSession } from "@/lib/types/cs";
import { cn } from "@/lib/utils";

export default function CSChatDialog() {
  const { user } = useUser();
  const client = useClerkSupabaseClient();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<CSSession | null>(null);
  const [messages, setMessages] = useState<CSMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user]);

  useEffect(() => {
    if (!session) return;
    
    // Subscribe to realtime messages
    const channel = subscribeToMessages(client, session.id, (newMsg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      scrollToBottom();
    });

    return () => {
      client.removeChannel(channel);
    };
  }, [session, client]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const loadSession = async () => {
    setLoading(true);
    try {
        if (!user) return;
        const { session: sess, error } = await getOrCreateSession(client, user.id);
        if (error) throw error;
        if (sess) {
            setSession(sess);
            const { data: msgs } = await getMessages(client, sess.id);
            setMessages(msgs || []);
            scrollToBottom();
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !session) return;
    
    const content = inputValue.trim();
    setInputValue("");
    
    try {
        const { data, error } = await sendMessage(client, session.id, content, 'user');
        
        if (error) throw error;

        // Immediate update (Optimistic-like, but wait for DB ack)
        if (data) {
           setMessages(prev => [...prev, data]);
           scrollToBottom();
        }
    } catch(e) {
        console.error(e);
        alert("메시지 전송 실패");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span 
          className="text-sm text-muted-foreground leading-relaxed hover:text-foreground cursor-pointer transition-colors"
          role="button"
          tabIndex={0}
        >
          1:1 문의하기
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] h-[600px] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 border-b bg-slate-50">
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <HeadphonesIcon className="w-5 h-5 text-indigo-600" />
            1:1 고객센터 문의
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4" ref={scrollRef}>
          {loading && messages.length === 0 ? (
             <div className="flex h-full items-center justify-center">
               <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
             </div>
          ) : messages.length === 0 ? (
             <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-2">
               <MessageSquare className="w-12 h-12 opacity-20" />
               <p className="text-sm">문의사항을 남겨주시면<br/>담당자가 답변해 드립니다.</p>
             </div>
          ) : (
             messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex w-full mb-4",
                    msg.sender_role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    msg.sender_role === 'user' 
                      ? "bg-indigo-600 text-white rounded-br-none" 
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
             ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <Input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="문의 내용을 입력하세요..."
              className="flex-1 bg-slate-50"
            />
            <Button onClick={handleSend} size="icon" className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
