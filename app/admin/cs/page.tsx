"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Send,
  User,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { CSSession, MOCK_CS_SESSIONS, MOCK_CS_MESSAGES, CSMessage } from "@/lib/mock-admin-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CSCenterPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(MOCK_CS_SESSIONS[0].id);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const selectedSession = MOCK_CS_SESSIONS.find(s => s.id === selectedSessionId);
  const messages = selectedSessionId ? MOCK_CS_MESSAGES[selectedSessionId] : [];

  const filteredSessions = MOCK_CS_SESSIONS.filter(s => 
    filterStatus === "all" || s.status === filterStatus
  );

  return (
    <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm h-[calc(100vh-140px)] overflow-hidden">
      {/* 1. Chat List Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              상담 문의
            </h2>
            <div className="flex gap-1">
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {MOCK_CS_SESSIONS.filter(s => s.status === 'open').length} 대기
              </span>
            </div>
          </div>
          <div className="relative mb-3">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-slate-50 focus:bg-white transition-colors" placeholder="사용자 검색..." />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'open', 'pending', 'closed'].map(status => (
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
                <span className="font-semibold text-slate-900 text-sm">{session.userName}</span>
                <span className="text-xs text-slate-400">
                  {new Date(session.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className={cn(
                "text-sm line-clamp-1 mb-2",
                session.unreadCount > 0 ? "text-slate-900 font-medium" : "text-slate-500"
              )}>
                {session.lastMessage}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {session.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                {session.unreadCount > 0 && (
                   <span className="bg-blue-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                     {session.unreadCount}
                   </span>
                )}
              </div>
              {/* Status Indicator Bar */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                session.status === 'open' ? 'bg-red-500' : 
                session.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chat Conversation Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedSession ? (
           <>
             {/* Chat Header */}
             <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-500" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 flex items-center gap-2">
                     {selectedSession.userName}
                     <span className={cn(
                       "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                       selectedSession.status === 'open' ? "bg-red-100 text-red-700" :
                       selectedSession.status === 'pending' ? "bg-amber-100 text-amber-700" :
                       "bg-slate-100 text-slate-600"
                     )}>
                       {selectedSession.status}
                     </span>
                   </h3>
                   <span className="text-xs text-slate-500 flex items-center gap-1">
                     <Clock className="w-3 h-3" />
                     마지막 활동: 10분 전
                   </span>
                 </div>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm">
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                   상담 종료
                 </Button>
                 <Button variant="ghost" size="icon">
                   <MoreHorizontal className="w-5 h-5" />
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
                     msg.sender === 'admin' ? "justify-end" : "justify-start"
                   )}
                 >
                   <div className={cn(
                     "max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                     msg.sender === 'admin' 
                       ? "bg-blue-600 text-white rounded-br-none"
                       : "bg-white text-slate-800 border border-gray-100 rounded-bl-none"
                   )}>
                     {msg.content}
                   </div>
                 </div>
               ))}
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white border-t border-gray-200">
               <div className="flex gap-2">
                 <textarea 
                   className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-[50px]"
                   placeholder="답변을 입력하세요... (Enter to send)"
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                 />
                 <Button className="h-[50px] w-[50px] rounded-xl self-end" size="icon">
                   <Send className="w-5 h-5" />
                 </Button>
               </div>
               <div className="text-xs text-slate-400 mt-2 flex justify-between">
                 <span>Shift + Enter 줄바꿈</span>
                 <span>저장된 답변 단축키: /welcome</span>
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

      {/* 3. Right Session Info (Optional, Hidden on smaller screens) */}
      {selectedSession && (
        <div className="hidden xl:flex w-72 border-l border-gray-200 flex-col bg-white p-6">
           <h4 className="font-bold text-slate-900 mb-4">상담 정보</h4>
           
           <div className="space-y-6">
             <div>
               <label className="text-xs font-semibold text-slate-500 block mb-2">사용자 여정 요약</label>
               <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 space-y-2">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   Step 2: 요양급여 신청 중
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   서류 다운로드 완료
                 </div>
               </div>
             </div>

             <div>
               <label className="text-xs font-semibold text-slate-500 block mb-2">상담 메모</label>
               <textarea className="w-full h-24 border border-gray-200 rounded-lg bg-yellow-50/50 p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400" placeholder="사용자 특이사항 메모..." />
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
