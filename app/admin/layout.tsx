import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ReWorkCare Admin",
  description: "ReWorkCare 관리자 대시보드",
};

const ADMIN_EMAIL = "highstar0301@gmail.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Check if user is logged in
  if (!user) {
    redirect("/");
  }

  // Check if user has the correct email
  const userList = user.emailAddresses;
  const isAdmin = userList.some((email) => email.emailAddress === ADMIN_EMAIL);

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Optional - for breadcrumbs or user profile) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="text-sm font-medium text-gray-500">
            관리자 모드
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">
              {user.fullName || user.username} (Admin)
            </span>
            {/* 추후 관리자 프로필 등 추가 */}
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dashbaord Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
