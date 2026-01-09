'use server';

import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { auth } from "@clerk/nextjs/server";

export interface OnboardingData {
  role: string | undefined;
  injuryPart: string | undefined;
  region: string | undefined;
  currentStep: number;
  wageInfo?: {
    type: 'monthly' | 'daily';
    amount: number;
  };
}

export async function updateUserOnboarding(data: OnboardingData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createClerkSupabaseClient();
  
  const payload = {
    id: userId,
    role: data.role,
    injury_part: data.injuryPart,
    region: data.region,
    current_step: data.currentStep,
    wage_info: data.wageInfo,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('user_profiles')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('Failed to update user profile:', error);
    throw new Error('Failed to save profile');
  }

  return { success: true };
}

export async function updateUserWageOnly(wageInfo: { type: 'monthly' | 'daily'; amount: number }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createClerkSupabaseClient();
  
  // 기존 프로필이 있는지 확인 후 update, 없으면 insert
  // 하지만 사용자 프로필은 로그인 시 생성되었을 것이라고 가정 (Onboarding 로직 상)
  // 안전하게 upsert 사용하되 payload를 최소화... 하지만 upsert는 전체 행을 다룸? No, with pg upsert it merges if logic handles it, but supabase upsert replaces if not careful.
  // 안전하게 user_profiles가 있다고 가정하고 update 사용. 
  // 만약 프로필이 아예 없으면 (Onboarding 전), 생성해야 함.
  
  // 1. Check if profile exists
  const { data: profile } = await supabase.from('user_profiles').select('id').eq('id', userId).single();
  
  if (profile) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        wage_info: wageInfo,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
  } else {
    // Profile doesn't exist? Create minimal one.
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        wage_info: wageInfo,
        updated_at: new Date().toISOString()
        // other fields null
      });
      
    if (error) throw error;
  }

  return { success: true };
}

export async function updateUserRegion(region: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createClerkSupabaseClient();
  
  // 프로필 존재 여부 확인 후 업데이트
  const { data: profile } = await supabase.from('user_profiles').select('id').eq('id', userId).single();
  
  if (profile) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        region: region,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
  } else {
    // 프로필이 없는 경우 생성
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        region: region,
        updated_at: new Date().toISOString()
      });
      
    if (error) throw error;
  }

  return { success: true };
}

export async function getUserProfile() {
    const { userId } = await auth();
    if (!userId) return null;
  
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
  
    if (error || !data) return null;

    return {
        id: data.id,
        role: data.role,
        injuryPart: data.injury_part,
        region: data.region,
        currentStep: data.current_step,
        wageInfo: data.wage_info
    };
}
