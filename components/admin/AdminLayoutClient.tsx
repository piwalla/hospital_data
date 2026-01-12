"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    fullName?: string | null;
    username?: string | null;
    imageUrl?: string;
  };
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Responsive Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 h-16 flex-shrink-0">
          <div className="flex items-center gap-3">
             {/* Mobile Menu Button */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-slate-500"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <div className="text-sm font-medium text-gray-500 hidden sm:block">
              관리자 모드
            </div>
            {/* Mobile Title - Only visible on small screens */}
             <div className="text-sm font-bold text-slate-900 sm:hidden">
              ReWorkCare Admin
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {user.fullName || user.username} (Admin)
            </span>
             
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
               {user.imageUrl ? (
                   <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <div className="h-full w-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">A</div>
               )}
            </div>
          </div>
        </header>

        {/* Dashbaord Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
           {/* 
              Wrap children in a container that handles overflow safely.
              Using w-full max-w-[1600px] mx-auto for centering on huge screens 
           */}
           <div className="w-full max-w-[1600px] mx-auto">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
