"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getUserProfile, deleteUserAccount } from "@/app/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, MapPin, Gauge, ShieldAlert, LogOut, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        try {
          const data = await getUserProfile();
          setProfile(data);
        } catch (error) {
          console.error("Failed to load profile", error);
        } finally {
          setLoading(false);
        }
      }
    }
    if (isLoaded) {
      loadProfile();
    }
  }, [isLoaded, user]);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteUserAccount();
      await signOut();
      router.push("/");
    } catch (error) {
      alert("회원 탈퇴 중 오류가 발생했습니다.");
      console.error(error);
      setDeleting(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-emerald-700 transition-colors group mb-2">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          대시보드로 돌아가기
        </Link>

        {/* Header Card */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
            <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-3xl shadow-sm">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-24 h-24 rounded-[1.4rem] object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-[1.4rem] bg-emerald-50 flex items-center justify-center">
                  <User className="w-12 h-12 text-emerald-600" />
                </div>
              )}
            </div>
          </div>
          <CardContent className="pt-14 pb-8 px-8">
            <h1 className="text-2xl font-black text-slate-900">{user?.fullName || "이용자"}님</h1>
            <p className="text-slate-500 font-medium">{user?.primaryEmailAddress?.emailAddress}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personalization Info */}
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-3 px-6 pt-7">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                나의 맞춤 정보
              </CardTitle>
              <CardDescription>개인정보 처리방침에 따라 동의하신 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-bold">이용 유형</span>
                </div>
                <span className="font-black text-slate-900">{profile?.role === 'patient' ? '산재 환자 본인' : '보호자 (가족)'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-sm font-bold">치료 부위</span>
                </div>
                <span className="font-black text-slate-900">
                   {profile?.injuryPart === 'hand_arm' ? '팔 / 손 (상지)' :
                    profile?.injuryPart === 'foot_leg' ? '다리 / 발 (하지)' :
                    profile?.injuryPart === 'spine' ? '척추 / 허리' :
                    profile?.injuryPart === 'brain_neuro' ? '뇌심혈관 / 신경' : '기타'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-bold">거주 지역</span>
                </div>
                <span className="font-black text-slate-900">{profile?.region || '미설정'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                <div className="flex items-center gap-2 text-slate-600">
                  <Gauge className="w-4 h-4" />
                  <span className="text-sm font-bold">진행 단계</span>
                </div>
                <span className="font-black text-slate-900">{profile?.currentStep || 1}단계</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 px-6 pt-7">
                <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-900">
                  <span className="w-1.5 h-6 bg-slate-400 rounded-full" />
                  계정 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-3">
                <Button variant="outline" className="w-full justify-between h-12 text-slate-700 font-bold" onClick={() => signOut()}>
                  <span>로그아웃</span>
                  <LogOut className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-rose-50/50 border border-rose-100">
              <CardHeader className="pb-3 px-6 pt-7 text-rose-900">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
                  회원 탈퇴
                </CardTitle>
                <CardDescription className="text-rose-600/80">탈퇴 시 모든 정보가 영구 파기됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {!showDeleteConfirm ? (
                  <Button variant="ghost" className="w-full justify-between h-12 text-rose-600 hover:text-rose-700 hover:bg-rose-100 font-bold" onClick={() => setShowDeleteConfirm(true)}>
                    <span>회원 탈퇴 (가입 해지)</span>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-rose-800 font-bold bg-white p-3 rounded-lg border border-rose-200">
                      정말로 탈퇴하시겠습니까? <br/>
                      저장된 모든 정보가 즉시 복구 불가능하게 삭제됩니다.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>취소</Button>
                      <Button variant="destructive" className="flex-1 bg-rose-600" onClick={handleDeleteAccount} disabled={deleting}>
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "영구 탈퇴"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
