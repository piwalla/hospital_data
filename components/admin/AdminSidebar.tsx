"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut,
  Megaphone,
  FileText,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "대시보드",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "사용자 관리",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "상담 센터",
    href: "/admin/cs",
    icon: MessageSquare,
  },
  {
    title: "공지사항 관리",
    href: "/admin/notices",
    icon: Megaphone,
  },
  {
    title: "RAG 문서 관리",
    href: "/admin/rag",
    icon: FileText,
  },
  {
    title: "챗봇 사용 통계",
    href: "/admin/chatbot/stats",
    icon: Bot,
  },
  {
    title: "SEO & 광고 설정",
    href: "/admin/settings/seo",
    icon: Settings,
  },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">RW</span>
          Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
            <LogOut className="w-5 h-5" />
            사이트로 돌아가기
        </Link>
      </div>
    </div>
  );
}
