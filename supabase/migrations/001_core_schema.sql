-- EXTENSIONS
create extension if not exists "pgcrypto";

-- USERS (mirror auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  creem_customer_id text unique, -- set after first checkout
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  creem_subscription_id text unique not null,
  creem_product_id text,
  status text not null check (status in ('active', 'trialing', 'past_due', 'paused', 'canceled', 'expired', 'scheduled_cancel', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  canceled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- WEBHOOK EVENTS (idempotency)
create table public.webhook_events (
  id text primary key, -- Creem event ID
  event_type text not null,
  payload jsonb,
  processed boolean default false,
  processed_at timestamptz,
  created_at timestamptz default now()
);

-- INDEXES
create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_creem_subscription_id_idx on public.subscriptions (creem_subscription_id);
create index subscriptions_status_idx on public.subscriptions (status);
create index subscriptions_user_status_idx on public.subscriptions (user_id, status);
create index webhook_events_processed_idx on public.webhook_events (processed) where processed = false;
create index webhook_events_created_at_idx on public.webhook_events (created_at desc);
