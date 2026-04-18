-- MeetingDrop Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- meetings table
-- ============================================================
create table if not exists public.meetings (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  google_event_id  text,
  title            text not null,
  meeting_date     timestamptz not null,
  attendees        jsonb not null default '[]',
  transcript       text,
  summary          text,
  action_items     jsonb,
  follow_up_email  text,
  status           text not null default 'pending' check (status in ('pending', 'complete')),
  created_at       timestamptz not null default now()
);

alter table public.meetings enable row level security;

create policy "Users can view their own meetings"
  on public.meetings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own meetings"
  on public.meetings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own meetings"
  on public.meetings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own meetings"
  on public.meetings for delete
  using (auth.uid() = user_id);

-- ============================================================
-- subscriptions table
-- ============================================================
create table if not exists public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  status                  text not null default 'active',
  plan                    text not null default 'free' check (plan in ('free', 'pro')),
  meeting_count           int not null default 0,
  created_at              timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Service role bypass (for webhook updates)
create policy "Service role can do anything on subscriptions"
  on public.subscriptions
  using (true)
  with check (true);

-- ============================================================
-- Auto-create subscription row for new users
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.subscriptions (user_id, plan, meeting_count)
  values (new.id, 'free', 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists meetings_user_id_idx on public.meetings(user_id);
create index if not exists meetings_status_idx on public.meetings(status);
create index if not exists meetings_google_event_id_idx on public.meetings(google_event_id);
