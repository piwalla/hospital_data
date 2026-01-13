import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import {
  User,
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function UserListPage() {
  const supabase = createClerkSupabaseClient();

  // 1. Fetch Users from Supabase
  const { data: dbUsers, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Error loading users: {error.message}</div>;
  }

  // 2. Fetch Emails from Clerk
  const userMap: Record<string, { email?: string; lastSignInAt?: number; imageUrl?: string }> = {};
  if (dbUsers && dbUsers.length > 0) {
      try {
          const clerkIds = dbUsers.map(u => u.clerk_id);
          const client = await clerkClient();
          const clerkUsers = await client.users.getUserList({
              userId: clerkIds,
              limit: 100, 
          });
          
          clerkUsers.data.forEach(u => {
              userMap[u.id] = {
                  email: u.emailAddresses[0]?.emailAddress,
                  lastSignInAt: u.lastSignInAt,
                  imageUrl: u.imageUrl
              };
          });
      } catch (e) {
          console.error("Clerk fetch failed", e);
      }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">사용자 관리 (Real Data)</h2>
          <p className="text-slate-500 mt-1">
            실제 가입된 사용자 목록입니다. (총 {dbUsers?.length || 0}명)
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">사용자</th>
                <th className="px-6 py-4">Clerk ID</th>
                <th className="px-6 py-4">가입일</th>
                <th className="px-6 py-4">최근 접속</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dbUsers?.map((user) => {
                 const clerkInfo = userMap[user.clerk_id] || {};
                 return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {clerkInfo.imageUrl ? (
                          <Image src={clerkInfo.imageUrl} width={40} height={40} className="rounded-full" alt="profile" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-slate-500 text-xs">{clerkInfo.email || "No Email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">
                    {user.clerk_id}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                     {clerkInfo.lastSignInAt ? new Date(clerkInfo.lastSignInAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {(!dbUsers || dbUsers.length === 0) && (
          <div className="p-8 text-center text-slate-500">
            가입된 사용자가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
