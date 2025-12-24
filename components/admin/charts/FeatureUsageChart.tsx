"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "병원 찾기", value: 850, fill: "#3b82f6" },
  { name: "요양급여신청", value: 620, fill: "#10b981" },
  { name: "휴업급여신청", value: 480, fill: "#f59e0b" },
  { name: "심리상담", value: 340, fill: "#8b5cf6" },
  { name: "1:1 채팅", value: 290, fill: "#ec4899" },
];

export function FeatureUsageChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
             contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
             cursor={{ fill: '#f1f5f9', opacity: 0.5 }} 
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
