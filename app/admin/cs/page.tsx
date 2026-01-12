"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  MessageSquare, 
  Send,
  User,
  Clock,
  CheckCircle2,
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { CSSession, CSMessage } from "@/lib/types/cs";
import { subscribeToMessages, sendMessage } from "@/lib/api/cs";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function CSCenterPage() {
  const client = useClerkSupabaseClient();
  
  const [sessions, setSessions] = useState<CSSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CSMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Sessions
  const fetchSessions = useCallback(async () => {
    // Note: This query requires Admin Policies to see all rows.
    const { data } = await client
      .from('cs_sessions')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (data) {
      setSessions(data);
    }
  }, [client]);

  useEffect(() => {
    fetchSessions();

    const channel = client
      .channel('cs_sessions_admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cs_sessions' },
        () => {
          fetchSessions(); // Refresh list on any change
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [client, fetchSessions]);

  // 2. Fetch Messages when Session Selected
  useEffect(() => {
    if (!selectedSessionId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data } = await client
        .from('cs_messages')
        .select('*')
        .eq('session_id', selectedSessionId)
        .order('created_at', { ascending: true });
      
      if (data) {
        setMessages(data);
        scrollToBottom();
      }
    };

    fetchMessages();

    // Subscribe to new messages in this session
    const channel = subscribeToMessages(client, selectedSessionId, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
      scrollToBottom();
      // Also update session list to show 'last message'? (Requires refetch or smart update)
      fetchSessions();
    });

    return () => {
      client.removeChannel(channel);
    };
  }, [selectedSessionId, client, fetchSessions]);



  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async () => {
    if (!replyText.trim() || !selectedSessionId) return;
    
    const content = replyText.trim();
    setReplyText("");

    try {
      await sendMessage(client, selectedSessionId, content, 'admin');
      // Update session timestamp
      await client
        .from('cs_sessions')
        .update({ updated_at: new Date().toISOString(), status: 'open' }) // Admin reply keeps it open or changes?
        .eq('id', selectedSessionId);
    } catch (e) {
      console.error(e);
      alert("전송 실패");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleStatus = async () => {
    if (!selectedSessionId) return;
    const current = sessions.find(s => s.id === selectedSessionId);
    if (!current) return;
    const newStatus = current.status === 'open' ? 'closed' : 'open';

    await client.from('cs_sessions').update({ status: newStatus }).eq('id', selectedSessionId);
  };

  // Helper to clear selection (Back to list)
  const handleBackToList = () => setSelectedSessionId(null);

  const filteredSessions = sessions.filter(s => 
    filterStatus === "all" || s.status === filterStatus
  );

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm h-[calc(100vh-140px)] overflow-hidden">
      {/* 1. Chat List Sidebar */}
      <div className={cn(
        "w-full md:w-80 border-r border-gray-200 flex flex-col bg-slate-50/50 transition-all duration-300",
        selectedSessionId ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              상담 문의 (Admin)
            </h2>
            <div className="flex gap-1">
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {sessions.filter(s => s.status === 'open').length} 대기
              </span>
            </div>
          </div>
          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'open', 'closed'].map(status => (
               <button
                 key={status}
                 onClick={() => setFilterStatus(status)}
                 className={cn(
                   "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap capitalize border",
                   filterStatus === status 
                     ? "bg-slate-900 text-white border-slate-900" 
                     : "bg-white text-slate-600 border-gray-200 hover:bg-slate-50"
                 )}
               >
                 {status}
               </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredSessions.length === 0 && (
             <div className="p-4 text-center text-slate-400 text-sm">문의 내역이 없습니다.</div>
          )}
          {filteredSessions.map(session => (
            <button
              key={session.id}
              onClick={() => setSelectedSessionId(session.id)}
              className={cn(
                "w-full text-left p-4 border-b border-gray-100 hover:bg-slate-50 transition-colors relative",
                selectedSessionId === session.id && "bg-blue-50/50 hover:bg-blue-50/50 border-blue-100"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-slate-900 text-sm">User {session.user_id.slice(0,4)}...</span>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true, locale: ko })}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-1 truncate">
                 ID: {session.id}
              </p>
              {/* Status Indicator Bar */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                session.status === 'open' ? 'bg-red-500' : 'bg-slate-300'
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chat Conversation Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-white transition-all duration-300",
        !selectedSessionId ? "hidden md:flex" : "flex"
      )}>
        {selectedSession ? (
           <>
             {/* Chat Header */}
             <div className="h-16 px-4 md:px-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
               <div className="flex items-center gap-3">
                 {/* Back Button (Mobile Only) */}
                 <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={handleBackToList}>
                    <ChevronLeft className="w-5 h-5" />
                 </Button>
                 
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-500" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 flex items-center gap-2">
                     User {selectedSession.user_id.slice(0,8)}
                     <span className={cn(
                       "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                       selectedSession.status === 'open' ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                     )}>
                       {selectedSession.status}
                     </span>
                   </h3>
                   <span className="text-xs text-slate-500 flex items-center gap-1">
                     <Clock className="w-3 h-3" />
                     {new Date(selectedSession.created_at).toLocaleString()}
                   </span>
                 </div>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={toggleStatus}>
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                   {selectedSession.status === 'open' ? '종료하기' : '다시 열기'}
                 </Button>
               </div>
             </div>

             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
               {messages?.map((msg) => (
                 <div 
                   key={msg.id} 
                   className={cn(
                     "flex w-full",
                     msg.sender_role === 'admin' ? "justify-end" : "justify-start"
                   )}
                 >
                   <div className={cn(
                     "max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                     msg.sender_role === 'admin' 
                       ? "bg-blue-600 text-white rounded-br-none"
                       : "bg-white text-slate-800 border border-gray-100 rounded-bl-none"
                   )}>
                     {msg.content}
                   </div>
                   <div className="text-[10px] text-slate-400 self-end ml-1 mr-1">
                      {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                   </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white border-t border-gray-200">
               <div className="flex gap-2">
                 <textarea 
                   className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-[50px]"
                   placeholder="답변을 입력하세요... (Enter to send)"
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   onKeyDown={handleKeyDown}
                 />
                 <Button className="h-[50px] w-[50px] rounded-xl self-end" size="icon" onClick={handleSend}>
                   <Send className="w-5 h-5" />
                 </Button>
               </div>
             </div>
           </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>상담 목록에서 대화를 선택하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
