-- Migration: create cards and card_sections tables with RLS
set check_function_bodies = off;

create table if not exists public.cards (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    protocol text,
    title text not null,
    version text,
    tags text[] default '{}'::text[],
    icon text,
    accent_color text,
    sources jsonb default '[]'::jsonb,
    content jsonb default '{}'::jsonb,
    is_premium boolean not null default false,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists cards_slug_idx on public.cards (slug);
create index if not exists cards_protocol_idx on public.cards (protocol);

create trigger set_cards_updated_at
before update on public.cards
for each row execute procedure public.set_updated_at();

create table if not exists public.card_sections (
    id uuid primary key default gen_random_uuid(),
    card_id uuid not null references public.cards (id) on delete cascade,
    title text not null,
    body text,
    content jsonb default '{}'::jsonb,
    position integer default 0,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists card_sections_card_idx on public.card_sections (card_id);
create index if not exists card_sections_position_idx on public.card_sections (card_id, position);

create trigger set_card_sections_updated_at
before update on public.card_sections
for each row execute procedure public.set_updated_at();

alter table public.cards enable row level security;
alter table public.card_sections enable row level security;

create policy "public can read free cards" on public.cards
for select
using (is_premium = false);

create policy "authenticated can read all cards" on public.cards
for select
to authenticated
using (true);

create policy "public can read sections of free cards" on public.card_sections
for select
using (exists (
    select 1
    from public.cards c
    where c.id = card_sections.card_id
      and c.is_premium = false
));

create policy "authenticated can read all sections" on public.card_sections
for select
to authenticated
using (true);
