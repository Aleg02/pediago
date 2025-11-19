-- Migration: create trigger to auto-provision profiles and adjust RLS
set check_function_bodies = off;

-- Ensure required columns and defaults
alter table public.profiles
  alter column subscription_status set default 'inactive'::text;

update public.profiles
set subscription_status = 'inactive'
where subscription_status is null;

alter table public.profiles
  alter column subscription_status set not null;

-- Function to handle new auth users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger to create profile automatically when a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Update RLS policies: only select and update own profile
alter table public.profiles enable row level security;

drop policy if exists "profiles are readable by owners" on public.profiles;
drop policy if exists "profiles are insertable by owners" on public.profiles;
drop policy if exists "profiles are updatable by owners" on public.profiles;
drop policy if exists "profiles are deletable by owners" on public.profiles;

create policy "profiles are readable by owners" on public.profiles
for select
using (auth.uid() = id);

create policy "profiles are updatable by owners" on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);
