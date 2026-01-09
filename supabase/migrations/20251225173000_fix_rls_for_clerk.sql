-- Drop existing policies that use auth.uid() which causes errors with Clerk text IDs
drop policy if exists "Users can view their own profile" on public.user_profiles;
drop policy if exists "Users can insert their own profile" on public.user_profiles;
drop policy if exists "Users can update their own profile" on public.user_profiles;

-- Create new policies using auth.jwt() ->> 'sub' which handles text IDs safely
create policy "Users can view their own profile" on public.user_profiles
  for select using (
    (select auth.jwt() ->> 'sub') = id
  );

create policy "Users can insert their own profile" on public.user_profiles
  for insert with check (
    (select auth.jwt() ->> 'sub') = id
  );

create policy "Users can update their own profile" on public.user_profiles
  for update using (
    (select auth.jwt() ->> 'sub') = id
  );
