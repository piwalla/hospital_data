"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  MessageSquare,
  MoreVertical
} from "lucide-react";
import { getUser, getActivityLogs } from "@/lib/mock-admin-data";
import { UserActivityTimeline } from "@/components/admin/UserActivityTimeline";
import { Button } from "@/components/ui/button";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  
  const user = getUser(userId);
  const logs = getActivityLogs(userId);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold text-slate-800">사용자를 찾을 수 없습니다.</h2>
        <Link href="/admin/users">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Back Nav */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/admin/users" 
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-slate-500 text-sm">사용자 상세 프로필 및 활동 내역</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
             <MessageSquare className="w-4 h-4 mr-2" />
             메시지 보내기
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-4">
                {user.name[0]}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
              <p className="text-slate-500 text-sm mb-2">{user.email}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {user.status === 'active' ? '활동 중' : '비활성'}
              </span>
            </div>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {user.location || "위치 정보 없음"}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                가입일: {new Date(user.joinedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                권한: {user.role}
              </div>
            </div>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h4 className="font-semibold text-slate-900 mb-4">진행 현황</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">현재 단계</span>
                  <span className="font-medium text-blue-600">Step {user.currentStep}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(user.currentStep / 4) * 100}%` }} />
                </div>
              </div>
              <div>
                 <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">전체 달성률</span>
                  <span className="font-medium text-slate-900">{user.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${user.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User Journey (Activity Timeline) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
               사용자 여정 (User Journey)
               <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-normal">
                 Total {logs.length} activities
               </span>
            </h3>
            
            {/* Timeline Component */}
            <UserActivityTimeline logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
