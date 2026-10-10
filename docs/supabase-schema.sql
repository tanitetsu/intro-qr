-- Intro QR: 公開プロフィール用テーブル
-- Supabase SQL Editor で実行してください

create table if not exists public.profile_pages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  slug text not null,
  display_name text not null,
  bio text,
  icon_data_url text,
  links jsonb not null default '[]'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 既存テーブル向け
alter table public.profile_pages
  add column if not exists icon_data_url text;

create unique index if not exists profile_pages_owner_slug_uidx
  on public.profile_pages (owner_id, slug);

alter table public.profile_pages enable row level security;

drop policy if exists "Public can read profile pages" on public.profile_pages;
drop policy if exists "Owners can insert their pages" on public.profile_pages;
drop policy if exists "Owners can update their pages" on public.profile_pages;
drop policy if exists "Owners can delete their pages" on public.profile_pages;

create policy "Public can read profile pages"
  on public.profile_pages
  for select
  using (true);

create policy "Owners can insert their pages"
  on public.profile_pages
  for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their pages"
  on public.profile_pages
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their pages"
  on public.profile_pages
  for delete
  using (auth.uid() = owner_id);
