-- Migration: create profiles and subscriptions with entitlements view
set check_function_bodies = off;

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text,
    job_role text,
    subscription_tier text default 'free'::text,
    subscription_status text default 'inactive'::text,
    expires_at timestamptz,
    features jsonb default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create table if not exists public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles (id) on delete cascade,
    provider text not null,
    provider_customer_id text,
    plan_code text,
    status text not null,
    current_period_end timestamptz,
    cancel_at timestamptz,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists subscriptions_profile_provider_plan_idx
on public.subscriptions (profile_id, provider, plan_code);

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute procedure public.set_updated_at();

create or replace view public.user_entitlements as
with entitlements as (
    select
        p.id as user_id,
        p.subscription_tier,
        p.subscription_status,
        p.expires_at,
        (p.subscription_status = 'active'
            and coalesce(p.subscription_tier, 'free') not in ('free', 'trial')
            and (p.expires_at is null or p.expires_at > timezone('utc', now()))
        ) as can_view_premium
    from public.profiles p
)
select *
from entitlements
where user_id = auth.uid();

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles are readable by owners" on public.profiles
for select
using (auth.uid() = id);

create policy "profiles are insertable by owners" on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles are updatable by owners" on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles are deletable by owners" on public.profiles
for delete
using (auth.uid() = id);

create policy "subscriptions readable by owners" on public.subscriptions
for select
using (auth.uid() = profile_id);

create policy "subscriptions insertable by owners" on public.subscriptions
for insert
with check (auth.uid() = profile_id);

create policy "subscriptions updatable by owners" on public.subscriptions
for update
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "subscriptions deletable by owners" on public.subscriptions
for delete
using (auth.uid() = profile_id);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.user_entitlements to anon, authenticated, service_role;
