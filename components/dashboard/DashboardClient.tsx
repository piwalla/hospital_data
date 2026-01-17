"use client";

import { useState, useEffect } from 'react';
import { SignInButton } from "@clerk/nextjs";

import { AdminUser, UserRole, InjuryPart, Region } from "@/lib/mock-admin-data";
import { StageWithDetails } from "@/lib/types/timeline";
import { updateUserOnboarding } from "@/app/actions/user";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActionChecklist from "@/components/dashboard/ActionChecklist";
import CuratedContent from "@/components/dashboard/CuratedContent";
import OnboardingModal from "@/components/dashboard/OnboardingModal"; 
import { Locale, dashboardTranslations } from "@/lib/i18n/config";

// V2 Components (Insights & Actions)
import PaymentScheduleCard from "@/components/dashboard/insights/PaymentScheduleCard";
import DisabilityGradeCard from "@/components/dashboard/insights/DisabilityGradeCard";
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

// Stage-specific action IDs only (content comes from translation config)
const STAGE_ACTION_IDS: Record<number, string[]> = {
  1: ['stage1-1', 'stage1-2', 'stage1-3', 'stage1-5'], // Application
  2: ['stage2-1', 'stage2-2', 'stage2-3', 'stage2-4'], // Treatment
  3: ['stage3-1', 'stage3-2', 'stage3-3', 'stage3-4'], // Disability
  4: ['stage4-1', 'stage4-2', 'stage4-3', 'stage4-4'], // Return
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    // Initial load
    const savedLocale = localStorage.getItem('user_locale') as Locale;
    if (savedLocale && dashboardTranslations[savedLocale]) {
      setLocale(savedLocale);
    }

    // Event listener for dynamic updates
    const handleLocaleChange = () => {
      const updatedLocale = localStorage.getItem('user_locale') as Locale;
      if (updatedLocale && dashboardTranslations[updatedLocale]) {
        setLocale(updatedLocale);
      }
    };

    window.addEventListener('user_locale', handleLocaleChange);
    window.addEventListener('localeChange', handleLocaleChange);
    window.addEventListener('storage', handleLocaleChange);

    return () => {
      window.removeEventListener('user_locale', handleLocaleChange);
      window.removeEventListener('localeChange', handleLocaleChange);
      window.removeEventListener('storage', handleLocaleChange);
    };
  }, []);



  const t = dashboardTranslations[locale] || dashboardTranslations['ko'];

  // Derive actions from IDs and current locale
  const currentActionIds = STAGE_ACTION_IDS[user.currentStep] || [];
  const actions = currentActionIds.map(id => {
    const item = t.checklist.items[id];
    return {
      id,
      title: item?.title || id,
      description: item?.description
    };
  });
  
  // Also pass locale to widgets if they need specific control (User name logic needs to be localized too inside them)

  // Handlers for Onboarding
  const handleOnboardingComplete = async (data: any) => {
    // Optimistic Update
    const updatedUser = { 
      ...user, 
      ...data,
      userRole: data.role // Explicitly map role -> userRole
    };
    setUser(updatedUser);
    setShowOnboarding(false);

    // Persist to Server (Server Action)
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
              <span className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center border border-primary/40">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                    <path d="M2 12h20M12 2v20M12 12l5-5M12 12l-5 5" />
                 </svg>
              </span>
              <span dangerouslySetInnerHTML={{ __html: t.guest.banner.mode }} />
            </p>
            <SignInButton mode="modal">
              <button 
                className="whitespace-nowrap bg-white text-primary px-4 py-1.5 rounded-full text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm"
              >
                {t.guest.banner.start}
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {/* 1. Header Section - Full width on mobile, rounded/padded on desktop */}
      {/* 1. Header Section - Full width on mobile, rounded/padded on desktop */}
      {/* Mobile: No margins initially (Header handles padding). Desktop: Standard margins. */}
      <div className="max-w-7xl mx-auto sm:px-6 sm:py-6 mb-0 mt-0 pt-0">
        <DashboardHeader
          user={user}
          onEditProfile={() => window.dispatchEvent(new CustomEvent('open-profile-edit'))}
        />
      </div>

      {/* 2. Main Content Section - Padded on mobile */}
      {/* Mobile: px-5 (20px) for standard alignment. pt-6 for breathing room after header. */}
      <div className="max-w-7xl mx-auto px-0 pt-6 sm:px-6 sm:pt-0 pb-20 space-y-8 sm:space-y-5">



        {/* AREA A: Main Insight Card (Dynamic) */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             {renderInsightCard()}
        </section>


        {/* AREA A-2: Recommended Benefits (Moved to Top) */}
        <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
            <RecommendedBenefitsWidget currentStep={user.currentStep} averageWage={user.wageInfo?.amount} userName={user.name} isGuest={isGuest} />
        </section>

        {/* AREA A-3: Local Resources & Video (Moved to Top) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
            {/* 1. Our Neighborhood Hospital */}
            <LocalResourcesCard user={user} isGuest={isGuest} />

            {/* 2. Recommended Video */}
            {(() => {
                const recommendedVideos = getRecommendedVideos(
                isGuest ? 1 : user.currentStep, // Guest defaults to Step 1 (Application)
                isGuest ? 'patient' : (user.userRole === 'patient' ? 'patient' : 'family'),
                isGuest ? 'hand_arm' : ( // Guest defaults to hand_arm (common) or any valid type to get results
                    user.injuryPart === 'hand_arm' ? 'hand_arm' :
                    user.injuryPart === 'foot_leg' ? 'foot_leg' :
                    user.injuryPart === 'spine' ? 'spine' :
                    user.injuryPart === 'brain_neuro' ? 'brain_neuro' : 'other'
                ),
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
                    checklist={actions}
                />
                ) : (
                <div className="bg-white rounded-2xl border border-[var(--border-medium)] shadow-sm p-5 flex items-center justify-center">
                    <p className="text-sm text-slate-500">{t.videoCard.preparing}</p>
                </div>
                );
            })()}
        </section>

        {/* AREA B & C: Actions + Checklist (Better ratio on desktop) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {/* Quick Actions */}
             <QuickActionGrid currentStep={user.currentStep} userName={user.name} />
             
             {/* 1. Community Widget (맞춤 커뮤니티) - Moved from below */}
             <CommunityWidget user={user} isGuest={isGuest} />

             {/* Today's To-Do (Mobile Only - Hybrid View) */}
             <div className="block md:hidden">
                <ActionChecklist 
                    actions={actions}
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

      {/* Onboarding Modal for New Users */}
      <OnboardingModal 
        isOpen={!isGuest && user.role !== 'admin' && (!user.userRole || user.currentStep === 0)}
        onComplete={handleOnboardingComplete}
        initialData={user}
      />
    </div>
  );
}
