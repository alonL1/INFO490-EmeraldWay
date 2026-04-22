-- Supabase schema snapshot for the current MVP app.
-- Captured from live database introspection on 2026-04-17.
--
-- This file is intended to document the current database shape and provide
-- a reproducible baseline for new environments. If the live database changes,
-- update this file alongside the app code.
--
-- Assumptions:
-- - public.profiles.id is the primary key.
-- - public.listings.id is the primary key.
-- Those constraints were inferred from the app's usage and the foreign key
-- relationship you shared, even though the primary-key introspection query
-- was not included in the exported metadata.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key,
  org_name text not null,
  description text,
  location text,
  contact_email text,
  created_at timestamp with time zone default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id),
  title text not null,
  description text,
  item_type text,
  condition text,
  location text,
  priority text default 'Medium',
  status text default 'Pending',
  image_url text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Profiles are public'
  ) then
    create policy "Profiles are public"
      on public.profiles
      for select
      to public
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'User can insert own profile'
  ) then
    create policy "User can insert own profile"
      on public.profiles
      for insert
      to public
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'User can update own profile'
  ) then
    create policy "User can update own profile"
      on public.profiles
      for update
      to public
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'listings'
      and policyname = 'Listings are public'
  ) then
    create policy "Listings are public"
      on public.listings
      for select
      to public
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'listings'
      and policyname = 'User can insert own listings'
  ) then
    create policy "User can insert own listings"
      on public.listings
      for insert
      to public
      with check (auth.uid() = profile_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'listings'
      and policyname = 'User can update own listings'
  ) then
    create policy "User can update own listings"
      on public.listings
      for update
      to public
      using (auth.uid() = profile_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'listings'
      and policyname = 'User can delete own listings'
  ) then
    create policy "User can delete own listings"
      on public.listings
      for delete
      to public
      using (auth.uid() = profile_id);
  end if;
end
$$;
