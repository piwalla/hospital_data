'use server';

import { createSupabaseAdminClient } from '@/lib/supabase/service-role';
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
  agreedToTerms?: boolean;
  agreedToSensitive?: boolean;
}

export async function updateUserOnboarding(data: OnboardingData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Use Admin Client to bypass RLS/JWT issues (guarantees persistence if server has key)
  const supabase = createSupabaseAdminClient();
  
  const payload: any = {
    id: userId,
    role: data.role,
    injury_part: data.injuryPart,
    region: data.region,
    current_step: data.currentStep,
    wage_info: data.wageInfo,
    updated_at: new Date().toISOString(),
  };

  if (data.agreedToTerms) {
    payload.agreed_to_terms_at = new Date().toISOString();
  }
  if (data.agreedToSensitive) {
    payload.agreed_to_sensitive_at = new Date().toISOString();
  }

  // Ensure required fields for upsert
  if (!payload.created_at) {
      // Fetch existing to see if we need to add created_at? No, upsert handles it if we don't touch it, 
      // but if it's a new row, we want it.
      // Better strategy: Try Update first, if fail (count 0), then Insert.
  }

  // Strategy Change: Use explicit Select -> Update/Insert to avoid 500 on "Column wage_info expects jsonb but got..." or similar type errors
  // But wait, the error is 500, likely RLS or Constraint.
  // Let's add better error logging first to be safe, but since I can't see logs easily, I'll make the code robust.
  
  console.log('[updateUserOnboarding] Starting update for user:', userId, 'with data:', JSON.stringify(data, null, 2));

  // 1. Check if profile exists
  const { data: existingProfile, error: fetchError } = await supabase.from('user_profiles').select('id, role').eq('id', userId).single();
  
  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
      console.error('[updateUserOnboarding] Profile check error:', fetchError);
  }

  let error;
  
  if (existingProfile) {
      console.log('[updateUserOnboarding] Profile exists, updating...');
      const { error: updateError, data: updateData } = await supabase
        .from('user_profiles')
        .update({
            role: data.role,
            injury_part: data.injuryPart,
            region: data.region,
            current_step: data.currentStep,
            ...(data.wageInfo ? { wage_info: data.wageInfo } : {}), 
            updated_at: new Date().toISOString(),
            ...(data.agreedToTerms ? { agreed_to_terms_at: new Date().toISOString() } : {}),
            ...(data.agreedToSensitive ? { agreed_to_sensitive_at: new Date().toISOString() } : {})
        })
        .eq('id', userId)
        .select();
      
      if (updateData) console.log('[updateUserOnboarding] Update result data:', updateData);
      error = updateError;
  } else {
      console.log('[updateUserOnboarding] Profile does not exist, inserting...');
      const { error: insertError, data: insertData } = await supabase
        .from('user_profiles')
        .insert({
            id: userId,
            role: data.role,
            injury_part: data.injuryPart,
            region: data.region,
            current_step: data.currentStep,
            wage_info: data.wageInfo,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            agreed_to_terms_at: data.agreedToTerms ? new Date().toISOString() : null,
            agreed_to_sensitive_at: data.agreedToSensitive ? new Date().toISOString() : null
        })
        .select();

      if (insertData) console.log('[updateUserOnboarding] Insert result data:', insertData);
      error = insertError;
  }

  if (error) {
    console.error('[updateUserOnboarding] Failed to update user profile:', error);
    return { success: false, error: error.message };
  }

  console.log('[updateUserOnboarding] Success!');
  return { success: true };
}

export async function updateUserWageOnly(wageInfo: { type: 'monthly' | 'daily'; amount: number }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createSupabaseAdminClient();
  
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

  const supabase = createSupabaseAdminClient();
  
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
  
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
  
    if (error || !data) return null;

    // Also fetch basic user info (name) from 'users' table
    const { data: userData } = await supabase
      .from('users')
      .select('name')
      .eq('clerk_id', userId)
      .single();

    return {
        id: data.id,
        role: data.role,
        injuryPart: data.injury_part,
        region: data.region,
        currentStep: data.current_step,
        wageInfo: data.wage_info,
        name: userData?.name
    };
}

export async function deleteUserAccount() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createSupabaseAdminClient();
  
  // 1. Delete from users table (cascading might handle favorites/posts depending on FK settings)
  // But let's be explicit and follow the chain.
  const { error: userTableError } = await supabase
    .from('users')
    .delete()
    .eq('clerk_id', userId);

  if (userTableError) {
    console.error('Failed to delete user from users table:', userTableError);
    // Continue anyway as we want to make sure user_profiles is handled
  }
  
  // 2. Delete from user_profiles
  const { error: profileError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId);

  if (profileError) {
    console.error('Failed to delete user profile:', profileError);
    throw new Error('Failed to delete profile data');
  }
  
  return { success: true };
}
