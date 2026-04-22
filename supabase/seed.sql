-- Seed demo data for the donor + organization MVP.
-- This file assumes the schema in supabase/migrations/20260422_role_cleanup.sql
-- has already been run and that the following auth users already exist:
--
--   shelter.one@commcompass.demo
--   outreach.collective@commcompass.demo
--   taylor.donor@commcompass.demo
--   jordan.helper@commcompass.demo
--
-- Recommended setup:
-- 1. Create those users in Supabase Auth or through the app signup flow.
-- 2. Run this seed file in SQL Editor.

do $$
declare
  missing_emails text;
begin
  select string_agg(seed.email, ', ' order by seed.email)
  into missing_emails
  from (
    values
      ('shelter.one@commcompass.demo'::text),
      ('outreach.collective@commcompass.demo'::text),
      ('taylor.donor@commcompass.demo'::text),
      ('jordan.helper@commcompass.demo'::text)
  ) as seed(email)
  where not exists (
    select 1
    from auth.users as user_row
    where user_row.email = seed.email
  );

  if missing_emails is not null then
    raise exception
      'Missing required auth users. Create these users first in Supabase Auth, then rerun seed.sql: %',
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
    ('shelter.one@commcompass.demo'::text, 'organization'::text),
    ('outreach.collective@commcompass.demo'::text, 'organization'::text),
    ('taylor.donor@commcompass.demo'::text, 'donor'::text),
    ('jordan.helper@commcompass.demo'::text, 'donor'::text)
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
      'shelter.one@commcompass.demo'::text,
      'Community Compass Shelter Network'::text,
      'Emergency shelter and direct-service team coordinating urgent requests for unhoused neighbors across Seattle.'::text,
      'Seattle, WA'::text,
      'shelter.one@commcompass.demo'::text
    ),
    (
      'outreach.collective@commcompass.demo'::text,
      'North Sound Outreach Collective'::text,
      'Regional outreach group providing rapid-response item support, family supplies, and housing move-in essentials.'::text,
      'Everett, WA'::text,
      'outreach.collective@commcompass.demo'::text
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
      'taylor.donor@commcompass.demo'::text,
      'Taylor Donor'::text,
      'Supports emergency item drives and recurring donation drop-offs on weeknights.'::text,
      'Seattle, WA'::text,
      'taylor.donor@commcompass.demo'::text,
      'Winter gear and hygiene kits'::text
    ),
    (
      'jordan.helper@commcompass.demo'::text,
      'Jordan Helper'::text,
      'Focuses on pantry goods, starter-home supplies, and family resource requests.'::text,
      'Shoreline, WA'::text,
      'jordan.helper@commcompass.demo'::text,
      'Food support and household basics'::text
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
      'shelter.one@commcompass.demo'::text,
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
      'shelter.one@commcompass.demo'::text,
      'Women''s Socks'::text,
      'Clean socks are one of the most requested basic-needs items at our day center.'::text,
      'Clothing'::text,
      'New'::text,
      'Seattle, WA'::text,
      'Medium'::text,
      'Open'::text,
      '/items/womens-socks.png'::text
    ),
    (
      'shelter.one@commcompass.demo'::text,
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
      'outreach.collective@commcompass.demo'::text,
      'Children''s Jackets'::text,
      'Stocking a family resource closet with youth winter jackets.'::text,
      'Clothing'::text,
      'New or gently used'::text,
      'Everett, WA'::text,
      'High'::text,
      'Open'::text,
      '/items/childrens-jackets.png'::text
    ),
    (
      'outreach.collective@commcompass.demo'::text,
      'Canned Soups'::text,
      'Shelf-stable soups for emergency meal kits and senior deliveries.'::text,
      'Food'::text,
      'Unopened'::text,
      'Tacoma, WA'::text,
      'Medium'::text,
      'Open'::text,
      '/items/canned-soups.png'::text
    ),
    (
      'outreach.collective@commcompass.demo'::text,
      'Blankets'::text,
      'Need blankets ahead of the next weather shift for evening outreach.'::text,
      'Bedding'::text,
      'New or freshly laundered'::text,
      'Kent, WA'::text,
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
    ('taylor.donor@commcompass.demo'::text, 'Sleeping Bags'::text),
    ('taylor.donor@commcompass.demo'::text, 'Children''s Jackets'::text),
    ('jordan.helper@commcompass.demo'::text, 'Women''s Socks'::text),
    ('jordan.helper@commcompass.demo'::text, 'Blankets'::text)
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
      'taylor.donor@commcompass.demo'::text,
      'Taylor Donor'::text,
      'taylor.donor@commcompass.demo'::text,
      'I can drop off three sleeping bags after work this Thursday.'::text,
      'Thursday 5:30 PM - 7:00 PM'::text,
      'CC-1001'::text,
      'scheduled'::text,
      now() + interval '2 days',
      'Front desk will be ready for intake.'::text
    ),
    (
      'Women''s Socks'::text,
      'jordan.helper@commcompass.demo'::text,
      'Jordan Helper'::text,
      'jordan.helper@commcompass.demo'::text,
      'I have two unopened packs ready to bring over.'::text,
      'Friday lunch hour'::text,
      'CC-1002'::text,
      'reviewing'::text,
      null::timestamp with time zone,
      'We are confirming the next intake window now.'::text
    ),
    (
      'Rice Cooker'::text,
      'taylor.donor@commcompass.demo'::text,
      'Taylor Donor'::text,
      'taylor.donor@commcompass.demo'::text,
      'I found a working cooker and can bring it once approved.'::text,
      'Saturday morning'::text,
      'CC-1003'::text,
      'submitted'::text,
      null::timestamp with time zone,
      null::text
    ),
    (
      'Children''s Jackets'::text,
      'jordan.helper@commcompass.demo'::text,
      'Jordan Helper'::text,
      'jordan.helper@commcompass.demo'::text,
      'I can donate four youth jackets in assorted sizes.'::text,
      'Monday evening'::text,
      'CC-1004'::text,
      'received'::text,
      now() - interval '1 day',
      'Items received and distributed. Thank you.'::text
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
