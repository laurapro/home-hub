-- These tables are implementation details behind SECURITY DEFINER RPCs and
-- service-role automations. They must not be directly accessible through the
-- public Data API. RLS provides defense in depth while the explicit revokes
-- prevent accidental direct use by browser clients.

alter table public.food_ui_commands enable row level security;
alter table public.inventory_corrections enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.meal_completions enable row level security;
alter table public.meal_consumptions enable row level security;
alter table public.planned_meals enable row level security;

revoke all on table public.food_ui_commands from anon, authenticated;
revoke all on table public.inventory_corrections from anon, authenticated;
revoke all on table public.inventory_movements from anon, authenticated;
revoke all on table public.meal_completions from anon, authenticated;
revoke all on table public.meal_consumptions from anon, authenticated;
revoke all on table public.planned_meals from anon, authenticated;
