-- Keep the Costco list focused on the next trip. A completed receipt already
-- updates purchase history, so recently purchased items should not be surfaced
-- again immediately by the automatic prediction scan.
create or replace view public.costco_item_predictions
with (security_invoker = true)
as
with last_costco_trip as (
  select
    purchase.household_id,
    max(purchase.purchased_at) as last_trip_at
  from public.purchases purchase
  join public.stores store on store.id = purchase.store_id
  where store.name = 'Costco'
  group by purchase.household_id
),
last_item_purchase as (
  select distinct on (purchase.household_id, purchase_item.item_id)
    purchase.household_id,
    purchase_item.item_id,
    purchase.purchased_at as last_purchased_at,
    purchase.created_at as receipt_processed_at
  from public.purchase_items purchase_item
  join public.purchases purchase on purchase.id = purchase_item.purchase_id
  join public.stores store on store.id = purchase.store_id
  where store.name = 'Costco'
    and purchase_item.item_id is not null
  order by
    purchase.household_id,
    purchase_item.item_id,
    purchase.purchased_at desc,
    purchase.created_at desc
)
select
  item.household_id,
  item.id as item_id,
  item.name,
  item.restock_policy,
  item.typical_lifespan_days,
  inventory.status as inventory_status,
  inventory.confidence as inventory_confidence,
  last_purchase.last_purchased_at,
  coalesce(
    last_trip.last_trip_at + interval '14 days',
    now() + interval '14 days'
  ) as next_expected_trip_at,
  case
    when last_purchase.last_purchased_at >= now() - interval '7 days'
      and (
        inventory.last_confirmed_at is null
        or inventory.last_confirmed_at
          <= last_purchase.receipt_processed_at + interval '15 minutes'
      )
      then 'probably_dont_need'
    when item.restock_policy = 'every_trip'
      and (
        last_trip.last_trip_at is null
        or now() >= last_trip.last_trip_at + interval '11 days'
      )
      then 'automatic'
    when item.restock_policy = 'every_trip'
      then 'probably_dont_need'
    when item.restock_policy = 'predicted_depletion'
      and item.typical_lifespan_days is not null
      and (
        last_purchase.last_purchased_at is null
        or last_purchase.last_purchased_at
          + make_interval(days => item.typical_lifespan_days)
          <= coalesce(
            last_trip.last_trip_at + interval '14 days',
            now() + interval '14 days'
          )
      )
      then 'automatic'
    when inventory.status in ('low', 'out')
      then 'automatic'
    when inventory.id is null
      or inventory.status = 'unknown'
      or inventory.confidence < 0.65
      then 'check'
    else 'probably_dont_need'
  end as prediction_bucket,
  case
    when last_purchase.last_purchased_at >= now() - interval '7 days'
      and (
        inventory.last_confirmed_at is null
        or inventory.last_confirmed_at
          <= last_purchase.receipt_processed_at + interval '15 minutes'
      )
      then 'Purchased recently'
    when item.restock_policy = 'every_trip'
      and (
        last_trip.last_trip_at is null
        or now() >= last_trip.last_trip_at + interval '11 days'
      )
      then 'Regular Costco staple for the upcoming trip'
    when item.restock_policy = 'every_trip'
      then 'Regular Costco staple; add three days before the next expected trip'
    when item.restock_policy = 'predicted_depletion'
      and last_purchase.last_purchased_at is null
      then 'No purchase history'
    when item.restock_policy = 'predicted_depletion'
      and item.typical_lifespan_days is not null
      and last_purchase.last_purchased_at
        + make_interval(days => item.typical_lifespan_days)
        <= coalesce(
          last_trip.last_trip_at + interval '14 days',
          now() + interval '14 days'
        )
      then 'Predicted to run out by next Costco trip'
    when inventory.status in ('low', 'out')
      then 'Inventory reported low or out'
    when inventory.id is null or inventory.status = 'unknown'
      then 'Inventory unknown'
    when inventory.confidence < 0.65
      then 'Inventory confidence is low'
    else 'Likely sufficiently stocked'
  end as prediction_reason
from public.items item
join public.stores preferred_store
  on preferred_store.id = item.preferred_store_id
  and preferred_store.name = 'Costco'
left join public.inventory inventory
  on inventory.item_id = item.id
  and inventory.location_id = item.default_location_id
left join last_item_purchase last_purchase
  on last_purchase.household_id = item.household_id
  and last_purchase.item_id = item.id
left join last_costco_trip last_trip
  on last_trip.household_id = item.household_id
where item.active = true;

revoke all on table public.costco_item_predictions
from public, anon, authenticated;
grant select on table public.costco_item_predictions to service_role;

create index if not exists purchase_items_purchase_id_idx
on public.purchase_items (purchase_id);

create index if not exists purchase_items_item_purchase_idx
on public.purchase_items (item_id, purchase_id)
where item_id is not null;

-- Repair currently open Costco rows only when the same normalized item appears
-- on a confirmed receipt from the last seven days. Items absent from the receipt
-- remain open.
with recent_matches as (
  select distinct on (shopping_item.id)
    shopping_item.id as shopping_item_id,
    purchase.id as purchase_id,
    purchase.purchased_at
  from public.shopping_items shopping_item
  join public.purchase_items purchase_item
    on purchase_item.item_id = shopping_item.item_id
  join public.purchases purchase
    on purchase.id = purchase_item.purchase_id
    and purchase.household_id = shopping_item.household_id
    and (
      shopping_item.store_id = purchase.store_id
      or shopping_item.store_id is null
    )
  where shopping_item.status in ('suggested', 'needed')
    and purchase.purchased_at >= now() - interval '7 days'
  order by shopping_item.id, purchase.purchased_at desc
)
update public.shopping_items shopping_item
set
  status = 'purchased',
  purchased_at = recent_match.purchased_at,
  purchase_id = recent_match.purchase_id,
  updated_at = now()
from recent_matches recent_match
where shopping_item.id = recent_match.shopping_item_id;
