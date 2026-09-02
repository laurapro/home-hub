alter table public.shopping_items
add column if not exists inventory_reconciled_at timestamptz;

create or replace function public.get_lovable_shopping_inventory_matches(
  p_household_slug text default 'home'
)
returns table (
  shopping_item_id uuid,
  inventory_id uuid,
  location_name text,
  inventory_reconciled_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    si.id,
    inv.id,
    l.name,
    si.inventory_reconciled_at
  from public.shopping_items si
  join public.households h on h.id = si.household_id
  join public.items i on i.id = si.item_id
  join lateral (
    select candidate.id, candidate.location_id
    from public.inventory candidate
    where candidate.household_id = si.household_id
      and candidate.item_id = si.item_id
    order by (candidate.location_id = i.default_location_id) desc, candidate.updated_at desc
    limit 1
  ) inv on true
  join public.locations l on l.id = inv.location_id
  where h.slug = p_household_slug
    and si.status = 'purchased'
    and si.updated_at >= now() - interval '7 days'
    and exists (
      select 1
      from public.household_memberships hm
      where hm.household_id = h.id
        and hm.user_id = auth.uid()
    );
$$;

create or replace function public.lovable_reconcile_shopping_item_inventory(
  p_household_slug text,
  p_shopping_item_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item public.shopping_items%rowtype;
  v_inventory public.inventory%rowtype;
  v_tracking_mode text;
  v_quantity numeric;
  v_unit text;
  v_result jsonb;
begin
  select si.*
  into v_item
  from public.shopping_items si
  join public.households h on h.id = si.household_id
  where si.id = p_shopping_item_id
    and h.slug = p_household_slug
    and exists (
      select 1
      from public.household_memberships hm
      where hm.household_id = h.id
        and hm.user_id = auth.uid()
    )
  for update of si;

  if not found then
    raise exception 'Shopping item access denied';
  end if;

  if v_item.status <> 'purchased' then
    raise exception 'Only purchased items can be added to inventory';
  end if;

  if v_item.inventory_reconciled_at is not null then
    return jsonb_build_object(
      'ok', true,
      'already_applied', true,
      'shopping_item_id', v_item.id,
      'inventory_reconciled_at', v_item.inventory_reconciled_at
    );
  end if;

  if v_item.item_id is null then
    raise exception 'Match this shopping item to an inventory item first';
  end if;

  select inv.*
  into v_inventory
  from public.inventory inv
  join public.items i on i.id = inv.item_id
  where inv.household_id = v_item.household_id
    and inv.item_id = v_item.item_id
  order by (inv.location_id = i.default_location_id) desc, inv.updated_at desc
  limit 1
  for update of inv;

  if not found then
    raise exception 'No inventory location is configured for this item';
  end if;

  select i.tracking_mode
  into v_tracking_mode
  from public.items i
  where i.id = v_item.item_id;

  v_quantity := greatest(coalesce(v_item.quantity, 1), 0);
  v_unit := coalesce(v_item.unit, v_inventory.quantity_unit);

  if v_tracking_mode = 'quantity' or v_inventory.quantity is not null then
    v_result := public.correct_food_inventory(
      p_inventory_id := v_inventory.id,
      p_status := 'plenty',
      p_quantity := coalesce(v_inventory.quantity, 0) + v_quantity,
      p_quantity_unit := v_unit,
      p_actor_ref := 'shopping_purchase'
    );
  else
    v_result := public.correct_food_inventory(
      p_inventory_id := v_inventory.id,
      p_status := 'plenty',
      p_actor_ref := 'shopping_purchase'
    );
  end if;

  update public.inventory
  set last_purchased_at = coalesce(v_item.purchased_at, now())
  where id = v_inventory.id;

  update public.shopping_items
  set inventory_reconciled_at = now()
  where id = v_item.id
  returning inventory_reconciled_at into v_item.inventory_reconciled_at;

  insert into public.events (
    household_id,
    event_type,
    entity_type,
    entity_id,
    actor_type,
    actor_ref,
    payload
  ) values (
    v_item.household_id,
    'shopping.purchase_added_to_inventory',
    'shopping_item',
    v_item.id,
    'human',
    'lovable_web',
    jsonb_build_object(
      'inventory_id', v_inventory.id,
      'item_id', v_item.item_id,
      'quantity', v_quantity,
      'unit', v_unit
    )
  );

  return v_result || jsonb_build_object(
    'shopping_item_id', v_item.id,
    'inventory_reconciled_at', v_item.inventory_reconciled_at
  );
end;
$$;

revoke all on function public.get_lovable_shopping_inventory_matches(text) from public, anon;
grant execute on function public.get_lovable_shopping_inventory_matches(text) to authenticated;

revoke all on function public.lovable_reconcile_shopping_item_inventory(text, uuid) from public, anon;
grant execute on function public.lovable_reconcile_shopping_item_inventory(text, uuid) to authenticated;
