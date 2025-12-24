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
  { name: "Step 1 (신청)", value: 1200, fill: "#3b82f6" }, // blue-500
  { name: "Step 2 (치료)", value: 900, fill: "#6366f1" },  // indigo-500
  { name: "Step 3 (보상)", value: 400, fill: "#8b5cf6" },  // violet-500
  { name: "Step 4 (재활)", value: 150, fill: "#ec4899" },  // pink-500
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg text-sm">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <p className="text-blue-600 font-semibold">
          {payload[0].value.toLocaleString()}명
        </p>
        <p className="text-slate-400 text-xs mt-1">
          전 단계 대비 {(payload[0].value / 1200 * 100).toFixed(1)}% 유지
        </p>
      </div>
    );
  }
  return null;
};

export function TimelineFunnelChart() {
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.5 }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
