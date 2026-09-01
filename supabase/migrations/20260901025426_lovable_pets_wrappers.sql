-- Pets browser surface: membership-gated reads and medication acknowledgement.

create or replace function public.get_lovable_pets_attention(
  p_household_slug text default 'home'
)
returns table (
  severity text,
  attention_type text,
  entity_type text,
  entity_id uuid,
  pet_id uuid,
  pet_name text,
  medication_name text,
  human_action text,
  due_at timestamptz,
  scheduled_for date,
  order_by_date date,
  quantity_remaining numeric,
  quantity_unit text,
  metadata jsonb,
  can_mark_given boolean
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    attention.severity,
    attention.attention_type,
    attention.entity_type,
    attention.entity_id,
    attention.pet_id,
    attention.pet_name,
    attention.medication_name,
    attention.human_action,
    attention.due_at,
    case
      when attention.entity_type = 'pet_medication'
        then (attention.due_at at time zone 'America/Chicago')::date
      else null
    end as scheduled_for,
    attention.order_by_date,
    attention.quantity_remaining,
    attention.quantity_unit,
    attention.metadata,
    attention.entity_type = 'pet_medication'
      and attention.severity in ('critical', 'due') as can_mark_given
  from public.pets_medication_attention_items attention
  join public.households household
    on household.id = attention.household_id
  where household.slug = p_household_slug
    and exists (
      select 1
      from public.household_memberships membership
      where membership.household_id = household.id
        and membership.user_id = auth.uid()
    )
  order by
    case attention.severity
      when 'critical' then 1
      when 'due' then 2
      when 'upcoming' then 3
      else 4
    end,
    attention.due_at nulls last,
    attention.order_by_date nulls last,
    attention.pet_name nulls last;
$$;

create or replace function public.lovable_mark_pet_medication_given(
  p_household_slug text,
  p_pet_medication_id uuid,
  p_scheduled_for date,
  p_confirm boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_household_id uuid;
  v_canonical_scheduled_for date;
  v_local_today date := (now() at time zone 'America/Chicago')::date;
begin
  if p_confirm is not true then
    raise exception 'Explicit confirmation required';
  end if;

  select household.id
  into v_household_id
  from public.households household
  where household.slug = p_household_slug
    and exists (
      select 1
      from public.household_memberships membership
      where membership.household_id = household.id
        and membership.user_id = auth.uid()
    );

  if v_household_id is null then
    raise exception 'Household access denied';
  end if;

  select (medication.next_due_at at time zone 'America/Chicago')::date
  into v_canonical_scheduled_for
  from public.pet_medications medication
  where medication.id = p_pet_medication_id
    and medication.household_id = v_household_id
    and medication.active = true
    and medication.next_due_at is not null
  for update;

  if v_canonical_scheduled_for is null then
    raise exception 'Active pet medication was not found';
  end if;

  if p_scheduled_for is distinct from v_canonical_scheduled_for then
    raise exception 'Medication schedule has changed; refresh and try again';
  end if;

  if v_canonical_scheduled_for > v_local_today then
    raise exception 'Medication is not due yet';
  end if;

  if not exists (
    select 1
    from public.pets_medication_attention_items attention
    where attention.household_id = v_household_id
      and attention.entity_type = 'pet_medication'
      and attention.entity_id = p_pet_medication_id
      and attention.severity in ('critical', 'due')
  ) then
    raise exception 'Medication is not currently due';
  end if;

  return public.mark_pet_medication_given(
    p_pet_medication_id,
    p_scheduled_for,
    'lovable-pets-ui'
  );
end;
$$;

-- The raw functions and underlying projections are not browser APIs.
revoke execute on function public.get_pets_attention(text) from public, anon, authenticated;
revoke execute on function public.mark_pet_medication_given(uuid, date, text)
  from public, anon, authenticated;

revoke all on table public.pet_medication_administrations from anon, authenticated;
revoke all on table public.pet_medication_supplies from anon, authenticated;
revoke all on table public.pet_medication_reorder_projection from anon, authenticated;
revoke all on table public.pets_attention_items from anon, authenticated;
revoke all on table public.pets_medication_attention_items from anon, authenticated;
revoke insert, update, delete on table public.pets from anon, authenticated;
revoke insert, update, delete on table public.pet_medications from anon, authenticated;

revoke all on function public.get_lovable_pets_attention(text) from public;
revoke all on function public.lovable_mark_pet_medication_given(text, uuid, date, boolean)
  from public;
grant execute on function public.get_lovable_pets_attention(text)
  to authenticated, service_role;
grant execute on function public.lovable_mark_pet_medication_given(text, uuid, date, boolean)
  to authenticated, service_role;
