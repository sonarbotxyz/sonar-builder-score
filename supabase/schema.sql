-- Supabase schema for Base Builder Score
-- Run this in the Supabase SQL editor to set up the database

-- Scores table
create table if not exists public.scores (
  id bigint generated always as identity primary key,
  address text not null,
  ens_name text,
  total_score integer not null default 0,
  contracts_deployed integer not null default 0,
  transactions integer not null default 0,
  token_activity integer not null default 0,
  wallet_age integer not null default 0,
  verified_contracts integer not null default 0,
  grade text not null default 'D',
  tier text not null default 'Newcomer',
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint scores_address_unique unique (address)
);

-- Index for leaderboard queries
create index if not exists idx_scores_total_score on public.scores (total_score desc);

-- Index for address lookups
create index if not exists idx_scores_address on public.scores (address);

-- Enable Row Level Security
alter table public.scores enable row level security;

-- Allow public read access
create policy "Allow public read access"
  on public.scores
  for select
  to anon
  using (true);

-- Allow insert/update from service role and anon (for API routes)
create policy "Allow insert from anon"
  on public.scores
  for insert
  to anon
  with check (true);

create policy "Allow update from anon"
  on public.scores
  for update
  to anon
  using (true)
  with check (true);
