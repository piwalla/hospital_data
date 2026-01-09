import { currentUser } from "@clerk/nextjs/server";
import { getAllStagesWithDetails } from '@/lib/api/timeline';
import DashboardClient from '@/components/dashboard/DashboardClient';
import MyJourneyHero from '@/components/dashboard/MyJourneyHero';
import { MOCK_USERS } from '@/lib/mock-admin-data';
import { getUserProfile } from '@/app/actions/user';

export const metadata = {
  title: '나의 산재 여정 | 산재 가이드',
  description: '개인 맞춤형 산재 절차 및 재정 관리 대시보드',
};

export default async function DashboardPage() {
  // 1. Get all timeline stages
  const stages = await getAllStagesWithDetails();
  
  // 2. Fetch real user profile if logged in
  const profile = await getUserProfile();
  const clerkUser = await currentUser();

  // 3. Merge with Mock User-1 but prioritize real profile
  let user = { ...MOCK_USERS[0], wageInfo: undefined };
  
  if (profile) {
    const calculatedProgress = 10 + (profile.currentStep * 20);

    user = {
      ...user,
      id: profile.id,
      name: clerkUser?.firstName || clerkUser?.fullName || user.name,
      userRole: profile.role as any,
      injuryPart: profile.injuryPart as any,
      region: profile.region as any,
      currentStep: profile.currentStep,
      progress: Math.min(calculatedProgress, 100),
      wageInfo: profile.wageInfo || undefined,
    };
  } else {
    user.userRole = undefined;
    user.injuryPart = undefined;
    user.region = undefined;
    user.currentStep = 0;
    user.progress = 0;
    user.wageInfo = undefined;

    if (clerkUser) {
        user.name = clerkUser.firstName || clerkUser.fullName || user.name;
    }
  }
  
  // 4. Find current stage data
  const currentStage = stages.find(s => s.step_number === user.currentStep) || stages[0];

  const isGuest = !clerkUser;

  return (
    <div className="relative min-h-screen">
      {/* 프리미엄 Full-bleed 배경 */}
      <div className="absolute inset-0 w-screen left-[calc(-50vw+50%)] bg-[#eff2f5] -z-10" />

      {/* Hero at root for full width */}
      <MyJourneyHero />
      
      <div className="container mx-auto px-0 max-w-7xl">
        <div className="px-4 sm:px-6 pb-20">
          <DashboardClient 
            initialUser={user} 
            currentStage={currentStage} 
            isGuest={isGuest}
          />
        </div>
      </div>
    </div>
  );
}
