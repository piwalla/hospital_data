"use client";

import { useState } from 'react';
import { SignInButton } from "@clerk/nextjs";
import { Lightbulb } from "lucide-react";
import { AdminUser, UserRole, InjuryPart, Region } from "@/lib/mock-admin-data";
import { StageWithDetails } from "@/lib/types/timeline";
import { updateUserOnboarding } from "@/app/actions/user";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActionChecklist from "@/components/dashboard/ActionChecklist";
import CuratedContent from "@/components/dashboard/CuratedContent";
import OnboardingModal from "@/components/dashboard/OnboardingModal"; 

// V2 Components (Insights & Actions)
import PaymentScheduleCard from "@/components/dashboard/insights/PaymentScheduleCard";
import DisabilityGradeCard from "@/components/dashboard/insights/DisabilityGradeCard";
import VocationalTrainingCard from "@/components/dashboard/insights/VocationalTrainingCard";
import LocalResourcesCard from "@/components/dashboard/insights/LocalResourcesCard";

import QuickActionGrid from "@/components/dashboard/QuickActionGrid";
import VideoCard from "@/components/dashboard/VideoCard";

import CommunityWidget from "@/components/dashboard/CommunityWidget";
import { getRecommendedVideos } from "@/lib/data/videos";
import { RecommendedBenefitsWidget } from "@/components/dashboard/RecommendedBenefitsWidget";
import PersonalizedStatsWidget from "@/components/dashboard/PersonalizedStatsWidget";


interface DashboardClientProps {
  initialUser: AdminUser;
  currentStage: StageWithDetails;
  isGuest?: boolean;
}

// Stage-specific action items (frontend-only, bypassing database)
const STAGE_ACTIONS: Record<number, Array<{ id: string; title: string; description?: string }>> = {
  1: [ // 산재 신청 및 승인
    { id: 'stage1-1', title: '진료 시 "일하다 다쳤음" 말하기', description: '의무기록에 남겨야 유리합니다.' },
    { id: 'stage1-2', title: '원무과에 "산재로 처리" 요청', description: '건강보험이 아닌 산재보험으로 접수하세요.' },
    { id: 'stage1-3', title: '현장 사진·목격자 확보', description: '치우기 전에 빨리 찍어두세요.' },
    { id: 'stage1-5', title: '요양급여신청서 제출', description: '근로복지공단에 사고를 알리는 서류입니다.' },
  ],
  2: [ // 요양 및 치료
    { id: 'stage2-1', title: '정기적으로 병원 방문하여 치료 지속하기', description: '치료를 중단하면 요양 중단 판정을 받을 수 있습니다.' },
    { id: 'stage2-2', title: '매월 휴업급여 청구서 제출하기', description: '치료 기간 동안 매월 휴업급여를 청구하세요.' },
    { id: 'stage2-3', title: '진료비 영수증 보관하기', description: '나중에 요양비 청구 시 필요할 수 있습니다.' },
    { id: 'stage2-4', title: '치료 중 무단 근로 절대 금지', description: '무단 근로 적발 시 급여가 환수될 수 있습니다.' },
  ],
  3: [ // 장해 심사
    { id: 'stage3-1', title: '치료 종결 후 장해급여 청구 여부 결정', description: '영구적인 장해가 남았다면 장해급여를 청구하세요.' },
    { id: 'stage3-2', title: '장해진단서 및 MRI/X-ray CD 준비', description: '영상 자료 없이는 심사가 불가능합니다.' },
    { id: 'stage3-3', title: '간편심사로 장해 등급 확정', description: '장해급여 청구서를 제출하고 결과를 기다리세요.' },
    { id: 'stage3-4', title: '불인정 시 이의 제기 준비', description: '등급이 낮거나 불인정되면 심사 청구를 고려하세요.' },
  ],
  4: [ // 직업 복귀
    { id: 'stage4-1', title: '원직장 복귀 상담', description: '원래 직장으로 돌아갈 수 있는지 상담하세요.' },
    { id: 'stage4-2', title: '새로운 직업 훈련 신청', description: '재활 훈련을 통해 새로운 직업을 준비하세요.' },
    { id: 'stage4-3', title: '직업재활급여 신청서 제출', description: '직업 재활 지원을 받기 위한 신청서를 제출하세요.' },
    { id: 'stage4-4', title: '재취업 지원 프로그램 참여', description: '공단의 재취업 지원 프로그램을 활용하세요.' },
  ],
};


// Helper to normalize region input (string code, JSON string, or object) to a simple prefix for DB search
// e.g., "seoul" -> "seoul" (handled by API mapping)
// e.g., "서울특별시" -> "서울"
// e.g., JSON -> "인천"
function getNormalizedRegion(region: any): string {
  if (!region) return '';

  let value = region;

  // 1. Parse JSON string if needed
  if (typeof region === 'string' && region.trim().startsWith('{')) {
    try {
       const parsed = JSON.parse(region);
       value = parsed.provinceName || region;
    } catch {
       // ignore
    }
  } else if (typeof region === 'object') {
     value = region.provinceName || '';
  }

  // 2. Normalize Korean Province Names to 2-char prefixes (matching DB)
  if (typeof value === 'string') {
     if (value.startsWith('서울')) return '서울';
     if (value.startsWith('부산')) return '부산';
     if (value.startsWith('대구')) return '대구';
     if (value.startsWith('인천')) return '인천';
     if (value.startsWith('광주')) return '광주';
     if (value.startsWith('대전')) return '대전';
     if (value.startsWith('울산')) return '울산';
     if (value.startsWith('세종')) return '세종';
     if (value.startsWith('경기')) return '경기';
     if (value.startsWith('강원')) return '강원';
     if (value.startsWith('충청북')) return '충북';
     if (value.startsWith('충청남')) return '충남';
     if (value.startsWith('전라북') || value.startsWith('전북')) return '전북';
     if (value.startsWith('전라남')) return '전남';
     if (value.startsWith('경상북')) return '경북';
     if (value.startsWith('경상남')) return '경남';
     if (value.startsWith('제주')) return '제주';
     
     // If it's a code like "seoul", return as is (API handles it)
     return value;
  }

  return 'seoul'; // Fallback
}

export default function DashboardClient({ initialUser, currentStage, isGuest = false }: DashboardClientProps) {
  const [user, setUser] = useState<AdminUser>(initialUser);
  const [showOnboarding, setShowOnboarding] = useState(
    !initialUser.region || !initialUser.userRole || !initialUser.injuryPart
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Handle Onboarding/Profile Updates
  const handleOnboardingComplete = async (data: { role: UserRole; injuryPart: InjuryPart; region: Region; currentStep: number; agreedToTerms?: boolean; agreedToSensitive?: boolean }) => {
    // Optimistic Update
    const updatedUser = {
      ...user,
      userRole: data.role,
      injuryPart: data.injuryPart,
      region: data.region,
      currentStep: data.currentStep,
      progress: Math.min(10 + (data.currentStep * 20), 100),
    } as AdminUser;

    setUser(updatedUser);
    setShowOnboarding(false);
    setIsEditingProfile(false);

    // Skip server update for guest users
    if (isGuest) return;

    try {
      await updateUserOnboarding({
        role: data.role,
        injuryPart: data.injuryPart,
        region: data.region,
        currentStep: data.currentStep,
        agreedToTerms: data.agreedToTerms,
        agreedToSensitive: data.agreedToSensitive,
        // wageInfo: user.wageInfo, // Do not save mock/transient wage info
        wageInfo: undefined,
      });
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  // --- Dynamic Component Selection Logic ---
  const renderInsightCard = () => {
    switch (user.currentStep) {
      case 1: return <PersonalizedStatsWidget userName={user.name} injury={user.injuryPart} region={getNormalizedRegion(user.region)} className="mb-6" />;
      case 2: return <PaymentScheduleCard user={user} />;
      case 3: return <DisabilityGradeCard />;
      case 4: return null; // User requested to hide stats for Return/Rehab stage
      default: return <PersonalizedStatsWidget userName={user.name} injury={user.injuryPart} region={getNormalizedRegion(user.region)} className="mb-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Guest Mode Banner */}
      {isGuest && (
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white px-4 py-3 shadow-md relative z-20 border-b border-emerald-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-medium text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-200">
                    <path d="M2 12h20M12 2v20M12 12l5-5M12 12l-5 5" />
                 </svg>
              </span>
              <span>
                현재 <strong>체험 모드</strong>입니다. 내 정보를 저장하고 맞춤형 가이드를 계속 받으시려면?
              </span>
            </p>
            <SignInButton mode="modal">
              <button 
                className="whitespace-nowrap bg-white text-emerald-900 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm"
              >
                3초 만에 시작하기
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <OnboardingModal
        isOpen={showOnboarding || isEditingProfile}
        onComplete={handleOnboardingComplete}
        initialData={isEditingProfile ? user : undefined}
        onClose={() => {
          setIsEditingProfile(false);
          setShowOnboarding(false);
        }}
      />

      {/* 1. Header Section - Full width on mobile, rounded/padded on desktop */}
      {/* 1. Header Section - Full width on mobile, rounded/padded on desktop */}
      {/* Mobile: No margins initially (Header handles padding). Desktop: Standard margins. */}
      <div className="max-w-7xl mx-auto sm:px-6 sm:py-6 mb-0 mt-0 pt-0">
        <DashboardHeader
          user={user}
          onEditProfile={() => setIsEditingProfile(true)}
        />
      </div>

      {/* 2. Main Content Section - Padded on mobile */}
      {/* Mobile: px-5 (20px) for standard alignment. pt-6 for breathing room after header. */}
      <div className="max-w-7xl mx-auto px-5 pt-6 sm:px-6 sm:pt-0 pb-20 space-y-8 sm:space-y-5">



        {/* AREA A: Main Insight Card (Dynamic) */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             {renderInsightCard()}
        </section>


        {/* AREA A-2: Recommended Benefits (Moved to Top) */}
        <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
            <RecommendedBenefitsWidget currentStep={user.currentStep} averageWage={user.wageInfo?.amount} userName={user.name} />
        </section>

        {/* AREA A-3: Local Resources & Video (Moved to Top) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
            {/* 1. Our Neighborhood Hospital */}
            <LocalResourcesCard user={user} isGuest={isGuest} />

            {/* 2. Recommended Video */}
            {(() => {
                const recommendedVideos = getRecommendedVideos(
                user.currentStep,
                user.userRole === 'patient' ? 'patient' : 'family',
                user.injuryPart === 'hand_arm' ? 'hand_arm' :
                user.injuryPart === 'foot_leg' ? 'foot_leg' :
                user.injuryPart === 'spine' ? 'spine' :
                user.injuryPart === 'brain_neuro' ? 'brain_neuro' : 'other',
                1 // Only show 1 video in dashboard
                );
                
                return recommendedVideos.length > 0 ? (
                <VideoCard 
                    video={recommendedVideos[0]} 
                    showPersonalizationBadge={
                    recommendedVideos[0].targetRole === (user.userRole === 'patient' ? 'patient' : 'family') ||
                    recommendedVideos[0].targetInjury?.includes(
                        user.injuryPart === 'hand_arm' ? 'hand_arm' :
                        user.injuryPart === 'foot_leg' ? 'foot_leg' :
                        user.injuryPart === 'spine' ? 'spine' :
                        user.injuryPart === 'brain_neuro' ? 'brain_neuro' : 'other'
                    )
                    }
                    checklist={STAGE_ACTIONS[user.currentStep]}
                />
                ) : (
                <div className="bg-white rounded-2xl border border-[var(--border-medium)] shadow-sm p-5 flex items-center justify-center">
                    <p className="text-sm text-slate-500">추천 영상 준비 중...</p>
                </div>
                );
            })()}
        </section>

        {/* AREA B & C: Actions + Checklist (Better ratio on desktop) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {/* Quick Actions */}
             <QuickActionGrid currentStep={user.currentStep} userName={user.name} />
             
             {/* 1. Community Widget (맞춤 커뮤니티) - Moved from below */}
             <CommunityWidget user={user} />

             {/* Today's To-Do (Mobile Only - Hybrid View) */}
             <div className="block md:hidden">
                <ActionChecklist 
                    actions={STAGE_ACTIONS[user.currentStep] || []}
                    initialCompletedIds={user.completed_actions || []} 
                />
             </div>
        </section>

          {/* AREA C & D: 주요 서류 및 주의사항 (전체 너비) */}
          <div className="space-y-4">
               <CuratedContent 
                  documents={currentStage.documents}
                  warnings={currentStage.warnings} 
                  stepNumber={user.currentStep}
                  userName={user.name}
                />
          </div>


       </div>
    </div>
  );
}
