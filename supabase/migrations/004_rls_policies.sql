-- ENABLE RLS FOR ALL TABLES
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.webhook_events enable row level security;
alter table public.credit_balances enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.credit_plans enable row level security;

-- USERS
create policy "users_select_all" on public.users for select using (true);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_insert_service_role" on public.users for insert with check (auth.uid() = id);

-- SUBSCRIPTIONS
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "subscriptions_insert_service_role" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "subscriptions_update_service_role" on public.subscriptions for update using (auth.uid() = user_id);
create policy "subscriptions_delete_service_role" on public.subscriptions for delete using (auth.uid() = user_id);

-- WEBHOOK_EVENTS
create policy "webhook_events_select_service_role" on public.webhook_events for select using (auth.role() = 'service_role');
create policy "webhook_events_insert_service_role" on public.webhook_events for insert with check (auth.role() = 'service_role');
create policy "webhook_events_update_service_role" on public.webhook_events for update using (auth.role() = 'service_role');

-- CREDIT_BALANCES
create policy "credit_balances_select_own" on public.credit_balances for select using (auth.uid() = user_id);
create policy "credit_balances_insert_service_role" on public.credit_balances for insert with check (auth.uid() = user_id);
create policy "credit_balances_update_service_role" on public.credit_balances for update using (auth.uid() = user_id);

-- CREDIT_TRANSACTIONS
create policy "credit_transactions_select_own" on public.credit_transactions for select using (auth.uid() = user_id);
create policy "credit_transactions_insert_service_role" on public.credit_transactions for insert with check (auth.uid() = user_id);
create policy "credit_transactions_no_update" on public.credit_transactions for update using (false);
create policy "credit_transactions_no_delete" on public.credit_transactions for delete using (false);

-- CREDIT_PLANS
create policy "credit_plans_select_all" on public.credit_plans for select using (true);
create policy "credit_plans_insert_service_role" on public.credit_plans for insert with check (auth.role() = 'service_role');
create policy "credit_plans_update_service_role" on public.credit_plans for update using (auth.role() = 'service_role');
create policy "credit_plans_delete_service_role" on public.credit_plans for delete using (auth.role() = 'service_role');
