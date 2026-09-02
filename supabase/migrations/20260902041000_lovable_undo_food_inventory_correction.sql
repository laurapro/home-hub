create or replace function public.lovable_undo_food_inventory_correction(
  p_correction_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_correction public.inventory_corrections%rowtype;
  v_inventory public.inventory%rowtype;
  v_latest_correction_id uuid;
  v_before jsonb;
  v_after jsonb;
  v_undo_correction_id uuid;
begin
  select c.*
  into v_correction
  from public.inventory_corrections c
  where c.id = p_correction_id
    and exists (
      select 1
      from public.household_memberships m
      where m.household_id = c.household_id
        and m.user_id = auth.uid()
    );

  if not found then
    raise exception 'Inventory correction access denied';
  end if;

  if v_correction.created_at < now() - interval '15 minutes' then
    raise exception 'This inventory change is too old to undo';
  end if;

  select inv.*
  into v_inventory
  from public.inventory inv
  where inv.id = v_correction.inventory_id
  for update;

  if not found then
    raise exception 'Inventory row was not found';
  end if;

  select c.id
  into v_latest_correction_id
  from public.inventory_corrections c
  where c.inventory_id = v_correction.inventory_id
  order by c.created_at desc, c.id desc
  limit 1;

  if v_latest_correction_id is distinct from p_correction_id then
    raise exception 'A newer inventory change exists; refresh before undoing';
  end if;

  v_before := jsonb_build_object(
    'status', v_inventory.status,
    'quantity', v_inventory.quantity,
    'quantity_unit', v_inventory.quantity_unit,
    'meals_remaining', v_inventory.meals_remaining,
    'location_id', v_inventory.location_id,
    'confidence', v_inventory.confidence,
    'source', v_inventory.source,
    'last_purchased_at', v_inventory.last_purchased_at,
    'last_confirmed_at', v_inventory.last_confirmed_at,
    'opened_at', v_inventory.opened_at
  );

  update public.inventory
  set
    status = coalesce(v_correction.before_state ->> 'status', 'unknown'),
    quantity = nullif(v_correction.before_state ->> 'quantity', '')::numeric,
    quantity_unit = v_correction.before_state ->> 'quantity_unit',
    meals_remaining = nullif(v_correction.before_state ->> 'meals_remaining', '')::numeric,
    confidence = coalesce(
      nullif(v_correction.before_state ->> 'confidence', '')::numeric,
      1
    ),
    source = v_correction.before_state ->> 'source',
    last_purchased_at = nullif(
      v_correction.before_state ->> 'last_purchased_at',
      ''
    )::timestamptz,
    last_confirmed_at = nullif(
      v_correction.before_state ->> 'last_confirmed_at',
      ''
    )::timestamptz,
    opened_at = nullif(v_correction.before_state ->> 'opened_at', '')::timestamptz,
    updated_at = now()
  where id = v_correction.inventory_id
  returning jsonb_build_object(
    'status', status,
    'quantity', quantity,
    'quantity_unit', quantity_unit,
    'meals_remaining', meals_remaining,
    'location_id', location_id,
    'confidence', confidence,
    'source', source,
    'last_purchased_at', last_purchased_at,
    'last_confirmed_at', last_confirmed_at,
    'opened_at', opened_at
  ) into v_after;

  insert into public.inventory_corrections (
    household_id,
    inventory_id,
    item_id,
    location_id,
    correction_type,
    before_state,
    after_state,
    actor_type,
    actor_ref
  ) values (
    v_correction.household_id,
    v_correction.inventory_id,
    v_correction.item_id,
    v_correction.location_id,
    'undo',
    v_before,
    v_after,
    'human',
    'lovable_web'
  ) returning id into v_undo_correction_id;

  insert into public.events (
    household_id,
    event_type,
    entity_type,
    entity_id,
    actor_type,
    actor_ref,
    payload
  ) values (
    v_correction.household_id,
    'food.inventory_correction_undone',
    'inventory',
    v_correction.inventory_id,
    'human',
    'lovable_web',
    jsonb_build_object(
      'undone_correction_id', p_correction_id,
      'undo_correction_id', v_undo_correction_id,
      'before', v_before,
      'after', v_after
    )
  );

  return jsonb_build_object(
    'ok', true,
    'inventory_id', v_correction.inventory_id,
    'undone_correction_id', p_correction_id,
    'correction_id', v_undo_correction_id,
    'inventory', v_after
  );
end;
$function$;

revoke all on function public.lovable_undo_food_inventory_correction(uuid) from public, anon;
grant execute on function public.lovable_undo_food_inventory_correction(uuid) to authenticated;
