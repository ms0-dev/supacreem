-- TRIGGER: sync to users table on sign up
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- TRIGGER: sync users table when metadata changes
create or replace function public.handle_updated_user()
returns trigger
set search_path = ''
as $$
begin
  update public.users
  set
    full_name = new.raw_user_meta_data->>'full_name',
    avatar_url = new.raw_user_meta_data->>'avatar_url',
    updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row
  execute procedure public.handle_updated_user();
-- ============================================================
-- FUNCTION: Upsert subscription from Creem webhook payload
-- Idempotent: uses ON CONFLICT so duplicate webhook deliveries
-- don't create duplicates or overwrite user-initiated changes.
-- ============================================================
create or replace function public.upsert_subscription(
  p_creem_subscription_id text,
  p_user_id uuid,
  p_creem_product_id text,
  p_status text,
  p_current_period_start timestamptz,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean,
  p_canceled_at timestamptz default null
)
returns public.subscriptions
set search_path = ''
as $$
declare
  v_result public.subscriptions;
begin
  insert into public.subscriptions (
    user_id,
    creem_subscription_id,
    creem_product_id,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    canceled_at
  )
  values (
    p_user_id,
    p_creem_subscription_id,
    p_creem_product_id,
    p_status,
    p_current_period_start,
    p_current_period_end,
    p_cancel_at_period_end,
    p_canceled_at
  )
  on conflict (creem_subscription_id) do update set
    creem_product_id       = excluded.creem_product_id,
    status                 = excluded.status,
    current_period_start   = excluded.current_period_start,
    current_period_end     = excluded.current_period_end,
    cancel_at_period_end   = excluded.cancel_at_period_end,
    canceled_at            = excluded.canceled_at,
    updated_at             = now()
  returning *
  into v_result;
  return v_result;
end;
$$ language plpgsql security definer;
-- ============================================================
-- FUNCTION: Grant credits atomically
-- Updates balance and inserts ledger entry in a single transaction.
-- Use within a transaction block for atomicity.
-- ============================================================
create or replace function public.grant_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_reference text default null,
  p_description text default null
)
returns public.credit_balances
set search_path = ''
as $$
declare
  v_balance public.credit_balances;
begin
  if p_amount <= 0 then
    raise exception 'grant_credits requires a positive amount, got %', p_amount;
  end if;
  insert into public.credit_balances (user_id, balance)
  values (p_user_id, p_amount)
  on conflict (user_id) do update set
    balance = credit_balances.balance + p_amount,
    updated_at = now()
  returning *
  into v_balance;
  insert into public.credit_transactions (user_id, amount, type, reference, description)
  values (p_user_id, p_amount, p_type, p_reference, p_description);
  return v_balance;
end;
$$ language plpgsql security definer;
-- ============================================================
-- FUNCTION: Revoke/deduct credits atomically
-- Fails with a check violation if balance would go negative.
-- Use within a transaction block for atomicity.
-- ============================================================
create or replace function public.revoke_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_reference text default null,
  p_description text default null
)
returns public.credit_balances
set search_path = ''
as $$
declare
  v_balance public.credit_balances;
begin
  if p_amount <= 0 then
    raise exception 'revoke_credits requires a positive amount, got %', p_amount;
  end if;
  update public.credit_balances
  set
    balance = balance - p_amount,
    updated_at = now()
  where user_id = p_user_id
    and balance >= p_amount  -- CHECK constraint will fail if this is false
  returning *
  into v_balance;
  if v_balance is null then
    raise exception 'Insufficient credit balance for user %', p_user_id;
  end if;
  insert into public.credit_transactions (user_id, amount, type, reference, description)
  values (p_user_id, -p_amount, p_type, p_reference, p_description);
  return v_balance;
end;
$$ language plpgsql security definer;
