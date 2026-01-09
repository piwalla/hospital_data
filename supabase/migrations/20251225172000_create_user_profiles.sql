-- Create user_profiles table for storing onboarding choices
-- We use ID from Clerk (managed via Supabase Auth integration)
create table if not exists public.user_profiles (
  id text primary key, -- Matches auth.uid() from Clerk token
  role text, -- 'patient' | 'family'
  injury_part text,
  region text,
  current_step integer default 0,
  wage_info jsonb, -- { type: 'monthly', amount: 3000000 }
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Policies
create policy "Users can view their own profile" on public.user_profiles
  for select using (auth.uid()::text = id);

create policy "Users can insert their own profile" on public.user_profiles
  for insert with check (auth.uid()::text = id);

create policy "Users can update their own profile" on public.user_profiles
  for update using (auth.uid()::text = id);

-- Grant access
grant select, insert, update on public.user_profiles to authenticated;
grant select, insert, update on public.user_profiles to service_role;
