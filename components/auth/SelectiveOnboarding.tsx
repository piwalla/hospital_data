"use client";

import { useState, useEffect, useCallback } from 'react';
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import OnboardingModal from '@/components/dashboard/OnboardingModal';
import { getUserProfile, updateUserOnboarding } from '@/app/actions/user';
import { UserRole, InjuryPart, Region } from "@/lib/mock-admin-data";

const CORE_ROUTES = [
  // '/dashboard', // Handled by DashboardClient
  '/chatbot-v2',
  '/chat',
  '/documents',
  '/hospitals',
  '/timeline'
];

export default function SelectiveOnboarding() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isForced, setIsForced] = useState(false);

  // Listen for manual edit requests (from Header)
  useEffect(() => {
    const handleOpenEdit = () => {
      getUserProfile().then(profile => {
        setProfileData(profile);
        setIsForced(false); // Manual edit is never forced
        setShowModal(true);
      });
    };
    window.addEventListener('open-profile-edit', handleOpenEdit);
    return () => window.removeEventListener('open-profile-edit', handleOpenEdit);
  }, []);

  const checkOnboarding = useCallback(async () => {
    if (!isClerkLoaded || !user) {
      setShowModal(false);
      return;
    }

    // Check if the current route is a core feature page
    const isCoreRoute = CORE_ROUTES.some(route => pathname?.startsWith(route));
    if (!isCoreRoute) {
      // If not on core route, we don't force, but if it was manual edit, we might keep it?
      // Actually checkOnboarding runs on effect. 
      // If manual edit is open, checkOnboarding might interfere? 
      // For simplicity, if manual edit is open, we let it be.
      // But if user navigates away, dependent on logic.
      // Let's rely on showModal state primarily.
      return;
    }

    try {
      const profile = await getUserProfile();
      setProfileData(profile);
      setIsProfileLoaded(true);

      // If missing core info, trigger modal FORCE
      const isIncomplete = !profile?.region || !profile?.role || !profile?.injuryPart;
      if (isIncomplete) {
        setIsForced(true);
        setShowModal(true);
      } else {
        // If complete, allow close if it was forced, but if manual edit, keep it?
        // If it was forced and now complete, handleComplete will close it.
        // If it was just checking, do nothing.
      }
    } catch (error) {
      console.error("Failed to fetch user profile for onboarding:", error);
    }
  }, [isClerkLoaded, user, pathname]);

  useEffect(() => {
    // Only run checkOnboarding if we are not currently in a manual edit session?
    // or just let it run.
    checkOnboarding();
  }, [checkOnboarding]);

  const handleComplete = async (data: { role: UserRole; injuryPart: InjuryPart; region: Region; currentStep: number; agreedToTerms?: boolean; agreedToSensitive?: boolean }) => {
    try {
      await updateUserOnboarding({
        role: data.role,
        injuryPart: data.injuryPart,
        region: data.region,
        currentStep: data.currentStep,
        agreedToTerms: data.agreedToTerms,
        agreedToSensitive: data.agreedToSensitive
      });
      setShowModal(false);
      setIsForced(false);
      // Refresh state to ensure it doesn't pop up again
      setIsProfileLoaded(false);
      checkOnboarding();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  if (!isClerkLoaded || !user) return null;

  return (
    <OnboardingModal
      isOpen={showModal}
      initialData={profileData || undefined}
      onComplete={handleComplete}
      onClose={() => setShowModal(false)}
      isForced={isForced}
    />
  );
}
