import { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
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
  
  // Transform user object for client component
  const userProps = {
      fullName: user.fullName || "Admin", // Fallback for fullName
      username: user.username,
      imageUrl: user.imageUrl
  };

  return (
    <AdminLayoutClient user={userProps}>
        {children}
    </AdminLayoutClient>
  );
}
