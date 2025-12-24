"use client";

import { Users, AlertCircle, MousePointer2, TrendingUp } from "lucide-react";
import { TimelineFunnelChart } from "@/components/admin/charts/TimelineFunnelChart";
import { WeeklyActiveUsersChart } from "@/components/admin/charts/WeeklyActiveUsersChart";
import { FeatureUsageChart } from "@/components/admin/charts/FeatureUsageChart";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">대시보드</h2>
        <p className="text-slate-500 mt-1">
          현재 플랫폼의 주요 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 사용자"
          value="1,234"
          description="전월 대비 +12%"
          icon={Users}
        />
        <StatsCard
          title="진행 중인 상담"
          value="23"
          description="답변 대기 5건"
          icon={AlertCircle}
          highlight
        />
        <StatsCard
          title="오늘 방문자"
          value="142"
          description="실시간 12명 접속 중"
          icon={TrendingUp}
        />
        <StatsCard
          title="타임라인 시작"
          value="89%"
          description="가입자 중 Step 1 진입률"
          icon={MousePointer2}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Activity */}
        <div className="col-span-4 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            주간 활성 사용자 (WAU)
          </h3>
          <WeeklyActiveUsersChart />
        </div>

        {/* Timeline Funnel */}
        <div className="col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-violet-500" />
            단계별 진행 현황
          </h3>
          <TimelineFunnelChart />
        </div>
      </div>

       {/* Bottom Row: Feature Usage & Recent Users */}
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Feature Usage */}
        <div className="col-span-3 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-green-500" />
            주요 기능 활용도
          </h3>
           <FeatureUsageChart />
        </div>

        {/* Recent Users */}
        <div className="col-span-4 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            최근 가입 회원
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    User {i}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    user{i}@example.com
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {i}분 전
                </div>
              </div>
            ))}
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
