-- Seed application data for the existing auth users below.
-- This file assumes supabase/migrations/20260422_role_cleanup.sql
-- has already been run.
--
-- Required existing auth users:
--   alonlevy04@gmail.com  -> donor
--   alevy4@uw.edu         -> organization
--
-- Do not run seed_auth_users.sql for this flow.
-- That helper is only for creating separate demo auth accounts directly in auth.users.

do $$
declare
  missing_emails text;
begin
  select string_agg(seed.email, ', ' order by seed.email)
  into missing_emails
  from (
    values
      ('alonlevy04@gmail.com'::text),
      ('alevy4@uw.edu'::text)
  ) as seed(email)
  where not exists (
    select 1
    from auth.users as user_row
    where user_row.email = seed.email
  );

  if missing_emails is not null then
    raise exception
      'Missing required auth users. Create these users in Supabase Auth first, then rerun seed.sql: %',
      missing_emails;
  end if;
end
$$;

insert into public.user_roles (id, role)
select
  user_row.id,
  seed.role
from (
  values
    ('alonlevy04@gmail.com'::text, 'donor'::text),
    ('alevy4@uw.edu'::text, 'organization'::text)
) as seed(email, role)
join auth.users as user_row
  on user_row.email = seed.email
on conflict (id) do update
set role = excluded.role;

insert into public.profiles (
  id,
  org_name,
  description,
  location,
  contact_email
)
select
  user_row.id,
  seed.org_name,
  seed.description,
  seed.location,
  seed.contact_email
from (
  values
    (
      'alevy4@uw.edu'::text,
      'Community Compass UW'::text,
      'University-connected organization coordinating item drives, direct support requests, and local donation intake.'::text,
      'Seattle, WA'::text,
      'alevy4@uw.edu'::text
    )
) as seed(email, org_name, description, location, contact_email)
join auth.users as user_row
  on user_row.email = seed.email
on conflict (id) do update
set
  org_name = excluded.org_name,
  description = excluded.description,
  location = excluded.location,
  contact_email = excluded.contact_email;

insert into public.donor_profiles (
  id,
  full_name,
  bio,
  location,
  contact_email,
  focus_area
)
select
  user_row.id,
  seed.full_name,
  seed.bio,
  seed.location,
  seed.contact_email,
  seed.focus_area
from (
  values
    (
      'alonlevy04@gmail.com'::text,
      'Alon Levy'::text,
      'Supports campus-adjacent donation drives and can help with recurring item drop-offs.'::text,
      'Seattle, WA'::text,
      'alonlevy04@gmail.com'::text,
      'Household essentials and clothing'::text
    )
) as seed(email, full_name, bio, location, contact_email, focus_area)
join auth.users as user_row
  on user_row.email = seed.email
on conflict (id) do update
set
  full_name = excluded.full_name,
  bio = excluded.bio,
  location = excluded.location,
  contact_email = excluded.contact_email,
  focus_area = excluded.focus_area;

insert into public.listings (
  profile_id,
  title,
  description,
  item_type,
  condition,
  location,
  priority,
  status,
  image_url
)
select
  profile.id,
  seed.title,
  seed.description,
  seed.item_type,
  seed.condition,
  seed.location,
  seed.priority,
  seed.status,
  seed.image_url
from (
  values
    (
      'alevy4@uw.edu'::text,
      'Sleeping Bags'::text,
      'Need durable sleeping bags for overnight cold-weather response.'::text,
      'Cold Weather Gear'::text,
      'New or gently used'::text,
      'Seattle, WA'::text,
      'High'::text,
      'Open'::text,
      '/items/sleeping-bags.png'::text
    ),
    (
      'alevy4@uw.edu'::text,
      'Women''s Socks'::text,
      'Clean socks are one of the most requested basic-needs items in our resource center.'::text,
      'Clothing'::text,
      'New'::text,
      'Seattle, WA'::text,
      'Medium'::text,
      'Open'::text,
      '/items/womens-socks.png'::text
    ),
    (
      'alevy4@uw.edu'::text,
      'Rice Cooker'::text,
      'Seeking a working rice cooker for a newly housed family.'::text,
      'Kitchen Appliance'::text,
      'Working'::text,
      'Seattle, WA'::text,
      'Low'::text,
      'Pending'::text,
      '/items/rice-cooker.png'::text
    ),
    (
      'alevy4@uw.edu'::text,
      'Children''s Jackets'::text,
      'Stocking a family resource closet with youth winter jackets.'::text,
      'Clothing'::text,
      'New or gently used'::text,
      'Seattle, WA'::text,
      'High'::text,
      'Open'::text,
      '/items/childrens-jackets.png'::text
    ),
    (
      'alevy4@uw.edu'::text,
      'Canned Soups'::text,
      'Shelf-stable soups for emergency meal kits and community deliveries.'::text,
      'Food'::text,
      'Unopened'::text,
      'Seattle, WA'::text,
      'Medium'::text,
      'Open'::text,
      '/items/canned-soups.png'::text
    ),
    (
      'alevy4@uw.edu'::text,
      'Blankets'::text,
      'Need blankets ahead of the next weather shift for evening outreach.'::text,
      'Bedding'::text,
      'New or freshly laundered'::text,
      'Seattle, WA'::text,
      'Critical'::text,
      'Open'::text,
      '/items/blankets.png'::text
    )
) as seed(
  email,
  title,
  description,
  item_type,
  condition,
  location,
  priority,
  status,
  image_url
)
join auth.users as user_row
  on user_row.email = seed.email
join public.profiles as profile
  on profile.id = user_row.id
where not exists (
  select 1
  from public.listings as existing
  where existing.profile_id = profile.id
    and existing.title = seed.title
);

insert into public.saved_listings (donor_id, listing_id)
select
  donor_user.id,
  listing.id
from (
  values
    ('alonlevy04@gmail.com'::text, 'Sleeping Bags'::text),
    ('alonlevy04@gmail.com'::text, 'Women''s Socks'::text),
    ('alonlevy04@gmail.com'::text, 'Blankets'::text)
) as seed(donor_email, listing_title)
join auth.users as donor_user
  on donor_user.email = seed.donor_email
join public.listings as listing
  on listing.title = seed.listing_title
on conflict (donor_id, listing_id) do nothing;

insert into public.donations (
  listing_id,
  donor_id,
  organization_id,
  donor_display_name,
  donor_email,
  message,
  preferred_dropoff_window,
  confirmation_code,
  status,
  scheduled_for,
  organization_response
)
select
  listing.id,
  donor_user.id,
  listing.profile_id,
  seed.donor_display_name,
  seed.donor_email,
  seed.message,
  seed.preferred_dropoff_window,
  seed.confirmation_code,
  seed.status,
  seed.scheduled_for,
  seed.organization_response
from (
  values
    (
      'Sleeping Bags'::text,
      'alonlevy04@gmail.com'::text,
      'Alon Levy'::text,
      'alonlevy04@gmail.com'::text,
      'I can drop off two sleeping bags this week after 5 PM.'::text,
      'Thursday 5:30 PM - 7:00 PM'::text,
      'CC-ALON-1001'::text,
      'accepted'::text,
      now() + interval '2 days',
      'Front desk will be ready for intake.'
    ),
    (
      'Women''s Socks'::text,
      'alonlevy04@gmail.com'::text,
      'Alon Levy'::text,
      'alonlevy04@gmail.com'::text,
      'I have several unopened packs ready to bring over.'::text,
      'Friday afternoon'::text,
      'CC-ALON-1002'::text,
      'submitted'::text,
      null::timestamp with time zone,
      'We are confirming the next intake window now.'
    ),
    (
      'Rice Cooker'::text,
      'alonlevy04@gmail.com'::text,
      'Alon Levy'::text,
      'alonlevy04@gmail.com'::text,
      'I found a working rice cooker and can bring it once approved.'::text,
      'Saturday morning'::text,
      'CC-ALON-1003'::text,
      'submitted'::text,
      null::timestamp with time zone,
      null::text
    ),
    (
      'Blankets'::text,
      'alonlevy04@gmail.com'::text,
      'Alon Levy'::text,
      'alonlevy04@gmail.com'::text,
      'I can donate three blankets and drop them off Monday evening.'::text,
      'Monday evening'::text,
      'CC-ALON-1004'::text,
      'accepted'::text,
      now() - interval '1 day',
      'Items received. Thank you.'
    )
) as seed(
  listing_title,
  donor_lookup_email,
  donor_display_name,
  donor_email,
  message,
  preferred_dropoff_window,
  confirmation_code,
  status,
  scheduled_for,
  organization_response
)
join auth.users as donor_user
  on donor_user.email = seed.donor_lookup_email
join public.listings as listing
  on listing.title = seed.listing_title
where not exists (
  select 1
  from public.donations as existing
  where existing.confirmation_code = seed.confirmation_code
);
