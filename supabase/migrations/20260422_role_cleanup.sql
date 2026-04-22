create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.profiles
  add column if not exists updated_at timestamp with time zone default now();

update public.profiles
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

alter table public.listings
  add column if not exists updated_at timestamp with time zone default now();

update public.listings
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

create table if not exists public.user_roles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('donor', 'organization')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.donor_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  bio text,
  location text,
  contact_email text,
  focus_area text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.saved_listings (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (donor_id, listing_id)
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  donor_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references public.profiles(id) on delete cascade,
  donor_display_name text not null,
  donor_email text not null,
  message text,
  preferred_dropoff_window text,
  confirmation_code text not null unique,
  status text not null default 'submitted' check (
    status in ('submitted', 'reviewing', 'scheduled', 'received', 'declined')
  ),
  scheduled_for timestamp with time zone,
  organization_response text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists idx_listings_profile_created_at
  on public.listings (profile_id, created_at desc);

create index if not exists idx_saved_listings_donor_created_at
  on public.saved_listings (donor_id, created_at desc);

create index if not exists idx_saved_listings_listing
  on public.saved_listings (listing_id);

create index if not exists idx_donations_org_status_created_at
  on public.donations (organization_id, status, created_at desc);

create index if not exists idx_donations_donor_created_at
  on public.donations (donor_id, created_at desc);

create index if not exists idx_donations_listing
  on public.donations (listing_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_listings_updated_at on public.listings;
create trigger set_listings_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

drop trigger if exists set_user_roles_updated_at on public.user_roles;
create trigger set_user_roles_updated_at
before update on public.user_roles
for each row
execute function public.set_updated_at();

drop trigger if exists set_donor_profiles_updated_at on public.donor_profiles;
create trigger set_donor_profiles_updated_at
before update on public.donor_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_donations_updated_at on public.donations;
create trigger set_donations_updated_at
before update on public.donations
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.user_roles enable row level security;
alter table public.donor_profiles enable row level security;
alter table public.saved_listings enable row level security;
alter table public.donations enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_roles'
      and policyname = 'Users can view own role'
  ) then
    create policy "Users can view own role"
      on public.user_roles
      for select
      to authenticated
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_roles'
      and policyname = 'Users can insert own role'
  ) then
    create policy "Users can insert own role"
      on public.user_roles
      for insert
      to authenticated
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_roles'
      and policyname = 'Users can update own role'
  ) then
    create policy "Users can update own role"
      on public.user_roles
      for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'donor_profiles'
      and policyname = 'Users can view own donor profile'
  ) then
    create policy "Users can view own donor profile"
      on public.donor_profiles
      for select
      to authenticated
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'donor_profiles'
      and policyname = 'Users can insert own donor profile'
  ) then
    create policy "Users can insert own donor profile"
      on public.donor_profiles
      for insert
      to authenticated
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'donor_profiles'
      and policyname = 'Users can update own donor profile'
  ) then
    create policy "Users can update own donor profile"
      on public.donor_profiles
      for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'saved_listings'
      and policyname = 'Donors can view own saved listings'
  ) then
    create policy "Donors can view own saved listings"
      on public.saved_listings
      for select
      to authenticated
      using (auth.uid() = donor_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'saved_listings'
      and policyname = 'Donors can insert own saved listings'
  ) then
    create policy "Donors can insert own saved listings"
      on public.saved_listings
      for insert
      to authenticated
      with check (auth.uid() = donor_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'saved_listings'
      and policyname = 'Donors can delete own saved listings'
  ) then
    create policy "Donors can delete own saved listings"
      on public.saved_listings
      for delete
      to authenticated
      using (auth.uid() = donor_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'donations'
      and policyname = 'Donors can view own donations'
  ) then
    create policy "Donors can view own donations"
      on public.donations
      for select
      to authenticated
      using (auth.uid() = donor_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'donations'
      and policyname = 'Organizations can view incoming donations'
  ) then
    create policy "Organizations can view incoming donations"
      on public.donations
      for select
      to authenticated
      using (auth.uid() = organization_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'donations'
      and policyname = 'Donors can insert own donations'
  ) then
    create policy "Donors can insert own donations"
      on public.donations
      for insert
      to authenticated
      with check (auth.uid() = donor_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'donations'
      and policyname = 'Organizations can update incoming donations'
  ) then
    create policy "Organizations can update incoming donations"
      on public.donations
      for update
      to authenticated
      using (auth.uid() = organization_id)
      with check (auth.uid() = organization_id);
  end if;
end
$$;
