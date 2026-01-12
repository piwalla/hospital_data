import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, MessageSquare } from 'lucide-react';
import { clerkClient } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

export default async function ChatbotStatsPage() {
  const supabase = createClerkSupabaseClient();

  // 1. Fetch Logs
  const { data: logs, error } = await supabase
    .from('user_activity_logs')
    .select('user_id, timestamp, action')
    .eq('action', 'chatbot_question')
    .order('timestamp', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다: {error.message}
      </div>
    );
  }

  // 2. Aggregate Data
  const totalQuestions = logs?.length || 0;
  
  // Group by User
  const usageByUser: Record<string, number> = {};
  const userIds = new Set<string>();

  logs?.forEach((log) => {
    const key = log.user_id || 'guest';
    usageByUser[key] = (usageByUser[key] || 0) + 1;
    if (log.user_id) userIds.add(log.user_id);
  });

  const uniqueUsers = Object.keys(usageByUser).length;

  // 3. Fetch User Details
  const userMap: Record<string, { email?: string; name?: string }> = {};
  
  if (userIds.size > 0) {
      // 3-1. Get Clerk IDs from Supabase Users table
      const { data: dbUsers } = await supabase
          .from('users')
          .select('id, clerk_id, name')
          .in('id', Array.from(userIds));
      
      if (dbUsers && dbUsers.length > 0) {
          const clerkIds = dbUsers.map(u => u.clerk_id);
          
          try {
              // 3-2. Get Email from Clerk
              const client = await clerkClient();
              const clerkUsers = await client.users.getUserList({
                  userId: clerkIds,
                  limit: 100, // Limit for MVP
              });

              // Map Clerk Data
              const clerkUserMap = new Map(clerkUsers.data.map(u => [u.id, u]));

              // Combine DB Name + Clerk Email
              dbUsers.forEach(dbUser => {
                  const clerkUser = clerkUserMap.get(dbUser.clerk_id);
                  const email = clerkUser?.emailAddresses[0]?.emailAddress;
                  userMap[dbUser.id] = {
                      name: dbUser.name,
                      email: email
                  };
              });
          } catch (e) {
              console.error("Failed to fetch clerk users", e);
              // Fallback to just DB names if Clerk fails
               dbUsers.forEach(dbUser => {
                  userMap[dbUser.id] = { name: dbUser.name };
              });
          }
      }
  }

  // Sort by usage (descending)
  const sortedUsage = Object.entries(usageByUser)
    .sort(([, a], [, b]) => b - a)
    .map(([userId, count]) => ({ 
        userId, 
        count,
        details: userMap[userId]
    }));

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart className="w-8 h-8 text-blue-600" />
          AI 챗봇 사용 통계
        </h1>
        <p className="text-gray-500 mt-2">사용자별 질문 횟수를 모니터링하여 과금 및 사용량을 관리합니다.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 질문 수</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions.toLocaleString()}건</div>
            <p className="text-xs text-muted-foreground">누적 AI 응답 요청 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers.toLocaleString()}명</div>
            <p className="text-xs text-muted-foreground">질문을 1회 이상 시도한 사용자</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">평균 사용량</CardTitle>
             <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {uniqueUsers > 0 ? (totalQuestions / uniqueUsers).toFixed(1) : 0}회
            </div>
            <p className="text-xs text-muted-foreground">인당 평균 질문 횟수</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>사용자별 활동 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-4 py-3 border-b">순위</th>
                  <th className="px-4 py-3 border-b">사용자 정보</th>
                  <th className="px-4 py-3 border-b text-right">질문 횟수</th>
                  <th className="px-4 py-3 border-b text-right">비중</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsage.map((item, index) => (
                  <tr key={item.userId} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-500 w-16">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.userId === 'guest' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          비회원 (Total Guest)
                        </span>
                      ) : (
                        <div className="flex flex-col">
                            {item.details?.email ? (
                                <>
                                    <span className="font-semibold text-gray-900">{item.details.name || '이름 없음'}</span>
                                    <span className="text-xs text-gray-400">{item.details.email}</span>
                                </>
                            ) : (
                                <span className="text-blue-600 font-mono text-xs">{item.userId}</span>
                            )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {item.count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 w-24">
                        {((item.count / totalQuestions) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                {sortedUsage.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
