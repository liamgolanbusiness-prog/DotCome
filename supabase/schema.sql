-- Run this in Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  client_name text,
  project_description text,
  price_amount numeric(12,2) not null,
  price_currency text not null default 'ILS',
  status text not null default 'pending' check (status in ('pending','signed','voided')),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  signed_at timestamptz
);

create table if not exists signatures (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  full_name text not null,
  id_number text not null,
  address text not null,
  phone text not null,
  email text not null,
  company_name text,
  company_id text,
  signature_data_url text not null,
  contract_text text not null,
  contract_hash text not null,
  agreed boolean not null,
  ip text,
  user_agent text,
  signed_at timestamptz not null default now()
);

create index if not exists signatures_contract_id_idx on signatures(contract_id);
create index if not exists contracts_token_idx on contracts(token);

-- RLS: only service-role key (used by server) may read/write. Anon key has no access.
alter table contracts enable row level security;
alter table signatures enable row level security;
