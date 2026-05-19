-- message_threads: one row per (donation), wires donor + org + unread flags.
-- FK constraints are NAMED explicitly so PostgREST disambiguation joins are stable.
create table if not exists public.message_threads (
  id              uuid primary key default gen_random_uuid(),
  donation_id     uuid not null unique
                    constraint message_threads_donation_id_fkey
                    references public.donations(id) on delete cascade,
  donor_id        uuid not null
                    constraint message_threads_donor_id_fkey
                    references auth.users(id) on delete cascade,
  organization_id uuid not null
                    constraint message_threads_organization_id_fkey
                    references public.profiles(id) on delete cascade,
  donor_unread    boolean not null default false,
  org_unread      boolean not null default false,
  created_at      timestamp with time zone not null default now(),
  updated_at      timestamp with time zone not null default now()
);

-- messages: append-only chat; sender_id is the actor (donor or org user id)
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.message_threads(id) on delete cascade,
  sender_id   uuid not null references auth.users(id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 4000),
  created_at  timestamp with time zone not null default now(),
  deleted_at  timestamp with time zone
);

-- message_reports: a flag from a participant; admin reviews out-of-band
create table if not exists public.message_reports (
  id           uuid primary key default gen_random_uuid(),
  message_id   uuid not null references public.messages(id) on delete cascade,
  reporter_id  uuid not null references auth.users(id) on delete cascade,
  reason       text,
  created_at   timestamp with time zone not null default now()
);

create index if not exists idx_message_threads_donor on public.message_threads (donor_id);
create index if not exists idx_message_threads_org on public.message_threads (organization_id);
create index if not exists idx_messages_thread_created on public.messages (thread_id, created_at);

-- Realtime publication (idempotent — guarded)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename  = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- Updated-at trigger (reuses existing public.set_updated_at)
-- IMPORTANT: drop-then-create so the migration is re-runnable.
drop trigger if exists set_message_threads_updated_at on public.message_threads;
create trigger set_message_threads_updated_at
before update on public.message_threads
for each row execute function public.set_updated_at();

-- RPC: collapse the "set the OTHER side's unread flag" step into one SQL call.
-- security definer so a single UPDATE runs under elevated rights, but we re-check
-- auth.uid() against the thread participants inside the function — so a malicious
-- caller cannot flip flags on threads they don't belong to, and cannot accidentally
-- flip their own side's flag.
create or replace function public.mark_thread_other_side_unread(p_thread_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_donor uuid;
  v_org uuid;
  v_caller uuid := auth.uid();
begin
  select donor_id, organization_id into v_donor, v_org
  from public.message_threads where id = p_thread_id;
  if v_donor is null then
    raise exception 'thread not found';
  end if;
  if v_caller = v_donor then
    update public.message_threads set org_unread = true where id = p_thread_id;
  elsif v_caller = v_org then
    update public.message_threads set donor_unread = true where id = p_thread_id;
  else
    raise exception 'not a participant';
  end if;
end;
$$;
revoke all on function public.mark_thread_other_side_unread(uuid) from public;
grant execute on function public.mark_thread_other_side_unread(uuid) to authenticated;

-- RLS
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.message_reports enable row level security;

-- RLS policies (each wrapped in idempotent pg_policies guard)

-- message_threads -----------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'message_threads'
      and policyname = 'Participants can view threads'
  ) then
    create policy "Participants can view threads"
      on public.message_threads for select to authenticated
      using (auth.uid() = donor_id or auth.uid() = organization_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'message_threads'
      and policyname = 'Org can create thread for own donation'
  ) then
    create policy "Org can create thread for own donation"
      on public.message_threads for insert to authenticated
      with check (
        auth.uid() = organization_id
        and exists (
          select 1 from public.donations d
          where d.id = donation_id
            and d.donor_id = message_threads.donor_id
            and d.organization_id = message_threads.organization_id
        )
      );
  end if;
end $$;

-- UPDATE must have BOTH using and with check; with check prevents a participant
-- from rewriting donor_id / organization_id to hijack a thread.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'message_threads'
      and policyname = 'Participants can update thread unread flags'
  ) then
    create policy "Participants can update thread unread flags"
      on public.message_threads for update to authenticated
      using (auth.uid() = donor_id or auth.uid() = organization_id)
      with check (auth.uid() = donor_id or auth.uid() = organization_id);
  end if;
end $$;

-- messages ------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'Participants can view messages'
  ) then
    create policy "Participants can view messages"
      on public.messages for select to authenticated
      using (
        exists (
          select 1 from public.message_threads t
          where t.id = messages.thread_id
            and (t.donor_id = auth.uid() or t.organization_id = auth.uid())
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'Participants can insert own messages'
  ) then
    create policy "Participants can insert own messages"
      on public.messages for insert to authenticated
      with check (
        sender_id = auth.uid()
        and exists (
          select 1 from public.message_threads t
          where t.id = thread_id
            and (t.donor_id = auth.uid() or t.organization_id = auth.uid())
        )
      );
  end if;
end $$;

-- No UPDATE / DELETE policies on messages — soft-delete is service-role only.

-- message_reports -----------------------------------------------------------
-- The two-table EXISTS is required; without it, any authenticated user could
-- file a report against any message by guessing the message_id.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'message_reports'
      and policyname = 'Participants can insert reports'
  ) then
    create policy "Participants can insert reports"
      on public.message_reports for insert to authenticated
      with check (
        reporter_id = auth.uid()
        and exists (
          select 1
          from public.messages m
          join public.message_threads t on t.id = m.thread_id
          where m.id = message_reports.message_id
            and (t.donor_id = auth.uid() or t.organization_id = auth.uid())
        )
      );
  end if;
end $$;

-- No SELECT policy on message_reports for `authenticated` — admins use service role.
