-- Seed baseline nonprofit wishlist data for the homepage.
-- This file inserts data only. It does not create or alter tables.
-- It assumes the existing schema documented in supabase/schema.sql.
-- Run this in the Supabase SQL Editor after at least one auth user exists.

do $$
begin
  if not exists (select 1 from auth.users) then
    raise exception 'No auth.users records found. Create at least one user through /signup first.';
  end if;
end
$$;

with primary_user as (
  select id, email
  from auth.users
  order by created_at asc
  limit 1
),
upserted_profile as (
  insert into public.profiles (
    id,
    org_name,
    description,
    location,
    contact_email
  )
  select
    id,
    'Community Compass Shelter Network',
    'Emergency shelter and outreach team coordinating direct item requests for unhoused neighbors.',
    'Seattle, WA',
    email
  from primary_user
  on conflict (id) do update
  set
    org_name = excluded.org_name,
    description = excluded.description,
    location = excluded.location,
    contact_email = excluded.contact_email
  returning id
)
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
from upserted_profile as profile
cross join (
  values
    (
      'Sleeping Bags',
      'Our outreach team needs durable sleeping bags for overnight cold-weather response.',
      'Cold Weather Gear',
      'New or gently used',
      'Seattle, WA',
      'High',
      'Open',
      '/items/sleeping-bags.png'
    ),
    (
      'Children''s Jackets',
      'We are stocking a family resource closet with youth winter jackets in sizes toddler through teen.',
      'Clothing',
      'New or gently used',
      'Everett, WA',
      'High',
      'Open',
      '/items/childrens-jackets.png'
    ),
    (
      'Canned Soups',
      'Shelf-stable soups help us build emergency meal kits for seniors and households facing food insecurity.',
      'Food',
      'Unopened',
      'Tacoma, WA',
      'Medium',
      'Open',
      '/items/canned-soups.png'
    ),
    (
      'Women''s Socks',
      'Clean socks are one of the most requested basic-needs items at our day center.',
      'Clothing',
      'New',
      'Seattle, WA',
      'Medium',
      'Open',
      '/items/womens-socks.png'
    ),
    (
      'Blankets',
      'We distribute blankets during evening street outreach and need more stock ahead of the next weather shift.',
      'Bedding',
      'New or freshly laundered',
      'Kent, WA',
      'Critical',
      'Open',
      '/items/blankets.png'
    ),
    (
      'Rice Cooker',
      'A newly housed family needs a basic rice cooker and small kitchen appliances as they settle into permanent housing.',
      'Kitchen Appliance',
      'Working',
      'Burien, WA',
      'Low',
      'Open',
      '/items/rice-cooker.png'
    )
) as seed(
  title,
  description,
  item_type,
  condition,
  location,
  priority,
  status,
  image_url
)
where not exists (
  select 1
  from public.listings as existing
  where existing.profile_id = profile.id
    and existing.title = seed.title
);
