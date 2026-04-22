-- Optional dev-only helper.
-- This file creates demo auth accounts directly in auth.users/auth.identities.
-- Use it only if you explicitly want SQL-created auth users in a non-production environment.
--
-- After running this file, run supabase/seed.sql to populate application data.
--
-- Demo auth accounts created:
--   shelter.one@commcompass.demo        / Password123!
--   outreach.collective@commcompass.demo / Password123!
--   taylor.donor@commcompass.demo       / Password123!
--   jordan.helper@commcompass.demo      / Password123!

create extension if not exists pgcrypto;

with demo_users as (
  select *
  from (
    values
      (
        '11111111-1111-1111-1111-111111111111'::uuid,
        'shelter.one@commcompass.demo'::text,
        'Password123!'::text,
        'organization'::text,
        'Community Compass Shelter Network'::text
      ),
      (
        '22222222-2222-2222-2222-222222222222'::uuid,
        'outreach.collective@commcompass.demo'::text,
        'Password123!'::text,
        'organization'::text,
        'North Sound Outreach Collective'::text
      ),
      (
        '33333333-3333-3333-3333-333333333333'::uuid,
        'taylor.donor@commcompass.demo'::text,
        'Password123!'::text,
        'donor'::text,
        'Taylor Donor'::text
      ),
      (
        '44444444-4444-4444-4444-444444444444'::uuid,
        'jordan.helper@commcompass.demo'::text,
        'Password123!'::text,
        'donor'::text,
        'Jordan Helper'::text
      )
  ) as t(id, email, password, role, display_name)
),
inserted_users as (
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  select
    '00000000-0000-0000-0000-000000000000'::uuid,
    demo.id,
    'authenticated',
    'authenticated',
    demo.email,
    crypt(demo.password, gen_salt('bf')),
    now(),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('requested_role', demo.role, 'display_name', demo.display_name),
    now(),
    now()
  from demo_users as demo
  where not exists (
    select 1
    from auth.users as existing
    where existing.email = demo.email
  )
  returning id, email
),
all_demo_users as (
  select user_row.id, user_row.email, demo.role, demo.display_name
  from auth.users as user_row
  join demo_users as demo
    on demo.email = user_row.email
),
inserted_identities as (
  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    created_at,
    updated_at,
    last_sign_in_at
  )
  select
    gen_random_uuid(),
    demo.id,
    demo.id::text,
    jsonb_build_object(
      'sub', demo.id::text,
      'email', demo.email,
      'email_verified', true
    ),
    'email',
    now(),
    now(),
    now()
  from all_demo_users as demo
  where not exists (
    select 1
    from auth.identities as existing
    where existing.user_id = demo.id
      and existing.provider = 'email'
  )
  returning user_id
)
select count(*) as demo_user_count
from all_demo_users;
