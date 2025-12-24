"use client";

import { ActivityLog } from "@/lib/mock-admin-data";
import { 
  LogIn, 
  FileText, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  Info 
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  login: LogIn,
  view_page: FileText,
  download_doc: FileText,
  search_hospital: MapPin,
  start_chat: MessageSquare,
  complete_step: CheckCircle2,
};

const colorMap = {
  info: "bg-slate-100 text-slate-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-amber-100 text-amber-600",
};

export function UserActivityTimeline({ logs }: { logs: ActivityLog[] }) {
  if (logs.length === 0) {
    return <div className="text-slate-500 text-center py-8">아직 활동 기록이 없습니다.</div>;
  }

  // Sort logs by timestamp desc
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative pl-6 border-l border-slate-200/60 space-y-8 py-2">
      {sortedLogs.map((log) => {
        const Icon = iconMap[log.action] || Info;
        const colorClass = colorMap[log.severity || 'info'];

        return (
          <div key={log.id} className="relative">
            {/* Timeline Dot */}
            <div className={cn(
              "absolute -left-[33px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10",
              colorClass
            )}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {log.details}
                </p>
                <p className="text-xs text-slate-500 capitalize mt-0.5">
                  Action: {log.action.replace('_', ' ')}
                </p>
              </div>
              <time className="text-xs text-slate-400 whitespace-nowrap tabular-nums">
                {new Date(log.timestamp).toLocaleString()}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
