create table public.credit_balances (
  user_id uuid primary key references public.users(id) on delete cascade,
  balance integer not null default 0,
  updated_at timestamptz default now(),
  constraint balance_non_negative check (balance >= 0)
);

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount integer not null, -- positive = credit, negative = debit
  type text not null check (type in ('subscription_grant', 'signup_bonus', 'purchase', 'usage', 'admin_adjustment', 'refund')),
  reference text, -- subscription_id, order_id, etc.
  description text,
  created_at timestamptz default now() not null
);

-- INDEXES
create index credit_transactions_user_id_idx on public.credit_transactions (user_id);
create index credit_transactions_type_idx on public.credit_transactions (type);
create index credit_transactions_created_at_idx on public.credit_transactions (created_at desc);
