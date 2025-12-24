"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "월", users: 140 },
  { name: "화", users: 230 },
  { name: "수", users: 180 },
  { name: "목", users: 290 },
  { name: "금", users: 350 },
  { name: "토", users: 210 },
  { name: "일", users: 160 },
];

export function WeeklyActiveUsersChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#94a3b8" }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#94a3b8" }} 
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
