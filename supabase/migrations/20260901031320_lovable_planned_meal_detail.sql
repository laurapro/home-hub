create or replace function public.get_lovable_planned_meal(
  p_household_slug text,
  p_planned_meal_id uuid
)
returns table (
  planned_meal_id uuid,
  planned_for date,
  meal_slot text,
  plan_type text,
  status text,
  recipe_id uuid,
  recipe_name text,
  notes text,
  source text,
  created_at timestamptz,
  updated_at timestamptz,
  household_timezone text,
  feasibility text,
  missing_count bigint,
  unknown_count bigint,
  thaw_count bigint,
  missing_items jsonb,
  unknown_items jsonb,
  thaw_items jsonb
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    meal.planned_meal_id,
    meal.planned_for,
    meal.meal_slot,
    meal.plan_type,
    meal.status,
    meal.recipe_id,
    meal.recipe_name,
    meal.notes,
    meal.source,
    meal.created_at,
    meal.updated_at,
    meal.household_timezone,
    meal.feasibility,
    meal.missing_count,
    meal.unknown_count,
    meal.thaw_count,
    meal.missing_items,
    meal.unknown_items,
    meal.thaw_items
  from public.food_planned_meal_state meal
  join public.households household
    on household.id = meal.household_id
  where household.slug = p_household_slug
    and meal.planned_meal_id = p_planned_meal_id
    and exists (
      select 1
      from public.household_memberships membership
      where membership.household_id = household.id
        and membership.user_id = auth.uid()
    );
$$;

revoke all on function public.get_lovable_planned_meal(text, uuid)
  from public, anon;
grant execute on function public.get_lovable_planned_meal(text, uuid)
  to authenticated, service_role;
