-- Add consent fields to user_profiles table
alter table public.user_profiles 
add column if not exists agreed_to_terms_at timestamptz,
add column if not exists agreed_to_sensitive_at timestamptz;

comment on column public.user_profiles.agreed_to_terms_at is '이용약관 및 개인정보 수집 이용 동의 일시';
comment on column public.user_profiles.agreed_to_sensitive_at is '건강 관련 민감정보 수집 및 이용 동의 일시';
