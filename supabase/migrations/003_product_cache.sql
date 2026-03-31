create table public.credit_plans (
  creem_product_id text primary key,
  credits_per_cycle integer not null default 0,
  name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index credit_plans_credits_per_cycle_idx on public.credit_plans (credits_per_cycle) where credits_per_cycle > 0;
