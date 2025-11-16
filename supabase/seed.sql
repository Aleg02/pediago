-- Seed data for local development
-- Replace the UUID below with an existing auth.users.id from your environment before running.
insert into public.profiles (id, full_name, job_role, subscription_tier, subscription_status, expires_at, features)
values (
  '00000000-0000-4000-8000-000000000001',
  'Dr. Demo Premium',
  'Urgentiste pédiatrique',
  'premium',
  'active',
  timezone('utc', now()) + interval '30 days',
  jsonb_build_object('can_access_drugs', true, 'can_download_pdf', true)
)
on conflict (id) do update set
  full_name = excluded.full_name,
  job_role = excluded.job_role,
  subscription_tier = excluded.subscription_tier,
  subscription_status = excluded.subscription_status,
  expires_at = excluded.expires_at,
  features = excluded.features,
  updated_at = timezone('utc', now());

insert into public.subscriptions (profile_id, provider, provider_customer_id, plan_code, status, current_period_end, metadata)
values (
  '00000000-0000-4000-8000-000000000001',
  'stripe',
  'cus_pediago_demo',
  'premium-monthly',
  'active',
  timezone('utc', now()) + interval '30 days',
  jsonb_build_object('trial', false)
)
on conflict (profile_id, provider, plan_code)
do update set
  status = excluded.status,
  current_period_end = excluded.current_period_end,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now());
