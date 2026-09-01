create or replace view public.household_today_timeline as
select
  e.household_id,
  'calendar'::text as item_type,
  e.id as entity_id,
  e.title,
  e.starts_at,
  e.ends_at,
  e.all_day,
  nullif(e.location, '') as location,
  10 as sort_rank,
  jsonb_build_object(
    'external_event_id', e.external_event_id,
    'occurrence_key', e.occurrence_key,
    'calendar_source_id', e.calendar_source_id,
    'is_recurring', e.is_recurring
  ) as metadata
from public.calendar_events e
join public.households h on h.id = e.household_id
where e.status <> 'cancelled'
  and (
    (
      e.all_day
      and e.start_date <= (now() at time zone coalesce(h.timezone, 'UTC'))::date
      and coalesce(e.end_date, e.start_date + 1) >
        (now() at time zone coalesce(h.timezone, 'UTC'))::date
    )
    or
    (
      not e.all_day
      and e.starts_at < (
        ((now() at time zone coalesce(h.timezone, 'UTC'))::date + 1)::timestamp
        at time zone coalesce(h.timezone, 'UTC')
      )
      and coalesce(e.ends_at, e.starts_at) >= (
        (now() at time zone coalesce(h.timezone, 'UTC'))::date::timestamp
        at time zone coalesce(h.timezone, 'UTC')
      )
    )
  )

union all

select
  r.household_id,
  'routine'::text as item_type,
  r.id as entity_id,
  r.label as title,
  (
    ((now() at time zone coalesce(h.timezone, 'UTC'))::date + r.time_of_day)
    at time zone coalesce(h.timezone, 'UTC')
  ) as starts_at,
  null::timestamptz as ends_at,
  false as all_day,
  null::text as location,
  20 as sort_rank,
  r.metadata || jsonb_build_object('routine_key', r.routine_key) as metadata
from public.household_routine_schedule r
join public.households h on h.id = r.household_id
where r.active
  and r.routine_key = 'nanny_departure'
  and r.weekday = extract(
    dow from (now() at time zone coalesce(h.timezone, 'UTC'))
  )::smallint;
