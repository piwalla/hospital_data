// ... imports
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { Users, AlertCircle, MousePointer2, TrendingUp } from "lucide-react";
import { TimelineFunnelChart } from "@/components/admin/charts/TimelineFunnelChart";
import { WeeklyActiveUsersChart } from "@/components/admin/charts/WeeklyActiveUsersChart";
import { FeatureUsageChart } from "@/components/admin/charts/FeatureUsageChart";
import { formatDistanceToNow, subDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createClerkSupabaseClient();

  // 1. Fetch Users (for Total Count & Funnel)
  const { data: users } = await supabase
    .from('users')
    .select('id, name, clerk_id, created_at, current_step');
  
  const totalUsers = users?.length || 0;
  
  // Calculate Funnel Data (Group by Step)
  const stepCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  users?.forEach(u => {
      const step = u.current_step as 1|2|3|4;
      if (stepCounts[step] !== undefined) stepCounts[step]++;
  });
  const funnelData = [
      { name: "Step 1 (신청)", value: stepCounts[1], fill: "#3b82f6" },
      { name: "Step 2 (치료)", value: stepCounts[2], fill: "#6366f1" },
      { name: "Step 3 (보상)", value: stepCounts[3], fill: "#8b5cf6" },
      { name: "Step 4 (재활)", value: stepCounts[4], fill: "#ec4899" },
  ];
  
  // Step 1 Percentage for KPI
  const step1Ratio = totalUsers > 0 ? ((stepCounts[1] / totalUsers) * 100).toFixed(0) : 0;


  // 2. Fetch Recent Logs (for WAU & Feature Usage - Last 7 Days)
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);
  
  const { data: recentLogs } = await supabase
    .from('user_activity_logs')
    .select('action, timestamp, user_id')
    .gte('timestamp', sevenDaysAgo.toISOString());

  // Calculate WAU (Daily Active Users)
  const dailyActive: Record<string, Set<string>> = {};
  // Init last 7 days keys
  for(let i=6; i>=0; i--) {
      const d = subDays(today, i);
      const key = format(d, 'MM/dd'); // e.g. 01/12
      dailyActive[key] = new Set();
  }
  
  recentLogs?.forEach(log => {
      const dateKey = format(new Date(log.timestamp), 'MM/dd');
      if (dailyActive[dateKey]) {
          dailyActive[dateKey].add(log.user_id || 'guest');
      }
  });
  
  const wauData = Object.entries(dailyActive).map(([name, set]) => ({
      name,
      users: set.size
  }));

  // Calculate Feature Usage (by Action Type)
  // Map actions to readable names
  const actionMap: Record<string, string> = {
      'chatbot_question': 'AI 챗봇 질문',
      'benefit_calculation': '예상급여 계산',
      'hospital_search': '병원 찾기',
      // Add other tracked actions if they exist in logs, otherwise defaults
  };
  
  const featureCounts: Record<string, number> = {};
  recentLogs?.forEach(log => {
     const label = actionMap[log.action] || log.action;
     featureCounts[label] = (featureCounts[label] || 0) + 1;
  });
  
  // Convert to array and sort
  const featureData = Object.entries(featureCounts)
    .map(([name, value], idx) => ({ 
        name, 
        value, 
        fill: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][idx % 5] 
    }))
    .sort((a,b) => b.value - a.value)
    .slice(0, 5); // Top 5

  // 3. Fetch Recent Users List (Re-use fetched users or fetch specific if needed order)
  // Since we fetched all users above (lightweight), we can just sort/slice here or fetch again for efficiency if list is huge.
  // For <1000 users, JS sort is fine. 
  const recentUsersList = [...(users || [])]
      .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

  const todayActivityCount = recentLogs?.filter(l => 
      new Date(l.timestamp).getDate() === today.getDate()
  ).length || 0;


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">대시보드 (Real Data)</h2>
        <p className="text-slate-500 mt-1">
          현재 플랫폼의 주요 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 사용자"
          value={totalUsers.toLocaleString()}
          description="전체 가입 회원 수"
          icon={Users}
        />
        <StatsCard
          title="진행 중인 상담"
          value="-"
          description="기능 준비 중"
          icon={AlertCircle}
          highlight
        />
        <StatsCard
          title="오늘 사용자 활동"
          value={todayActivityCount.toLocaleString()}
          description="오늘 발생한 이벤트 수"
          icon={TrendingUp}
        />
        <StatsCard
          title="Step 1 진입비율"
          value={`${step1Ratio}%`}
          description="전체 중 Step 1 사용자"
          icon={MousePointer2}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Activity */}
        <div className="col-span-4 rounded-xl border border-gray-200 bg-white shadow-sm p-6 overflow-hidden">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            주간 활성 사용자 (WAU)
          </h3>
          {/* Create Props for Chart */}
          <WeeklyActiveUsersChart data={wauData} />
        </div>

        {/* Timeline Funnel */}
        <div className="col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm p-6 overflow-hidden">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-violet-500" />
            단계별 진행 현황
          </h3>
          <TimelineFunnelChart data={funnelData} />
        </div>
      </div>

       {/* Bottom Row: Feature Usage & Recent Users */}
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Feature Usage */}
        <div className="col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm p-6 overflow-hidden">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-green-500" />
            주요 기능 활용도 (최근 7일)
          </h3>
           <FeatureUsageChart data={featureData} />
        </div>

        {/* Recent Users */}
        <div className="col-span-4 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            최근 가입 회원
          </h3>
          <div className="space-y-4">
            {recentUsersList.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                  {user.name?.slice(0,1) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-500 truncate font-mono">
                    {user.clerk_id}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ko })}
                </div>
              </div>
            ))}
            {recentUsersList.length === 0 && (
                <div className="text-center text-slate-500 py-4">가입된 회원이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  highlight = false,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-slate-500">
          {title}
        </h3>
        <Icon className={`w-4 h-4 ${highlight ? 'text-red-500' : 'text-slate-500'}`} />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
