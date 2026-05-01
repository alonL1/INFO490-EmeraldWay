-- Collapse donation workflow to submitted | accepted | declined.
-- Migrate any existing in-flight statuses to 'accepted'.

alter table public.donations
  drop constraint if exists donations_status_check;

update public.donations
  set status = 'accepted'
  where status in ('reviewing', 'scheduled', 'received');

alter table public.donations
  add constraint donations_status_check
  check (status in ('submitted', 'accepted', 'declined'));
