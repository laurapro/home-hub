create or replace function public.get_lovable_tomorrow_timeline(
  p_household_slug text default 'home'
)
returns table (
  household_id uuid,
  item_type text,
  entity_id uuid,
  title text,
  starts_at timestamptz,
  ends_at timestamptz,
  all_day boolean,
  location text,
  sort_rank integer,
  metadata jsonb
)
language sql
stable
security definer
set search_path = ''
as $function$
  with household as (
    select h.id, coalesce(h.timezone, 'UTC') as timezone
    from public.households h
    where h.slug = p_household_slug
      and exists (
        select 1
        from public.household_memberships m
        where m.household_id = h.id
          and m.user_id = auth.uid()
      )
  ), timeline as (
    select
      c.household_id,
      'calendar'::text as item_type,
      c.calendar_event_id as entity_id,
      c.title,
      c.starts_at,
      c.ends_at,
      c.all_day,
      c.location,
      10 as sort_rank,
      jsonb_build_object(
        'external_event_id', c.external_event_id,
        'occurrence_key', c.occurrence_key,
        'calendar_source_id', c.calendar_source_id,
        'is_recurring', c.is_recurring
      ) as metadata
    from public.calendar_today_next_items c
    join household h on h.id = c.household_id
    where c.local_start_date = ((now() at time zone h.timezone)::date + 1)

    union all

    select
      r.household_id,
      'routine'::text as item_type,
      r.id as entity_id,
      r.label as title,
      ((((now() at time zone h.timezone)::date + 1) + r.time_of_day) at time zone h.timezone) as starts_at,
      null::timestamptz as ends_at,
      false as all_day,
      null::text as location,
      20 as sort_rank,
      r.metadata || jsonb_build_object('routine_key', r.routine_key) as metadata
    from public.household_routine_schedule r
    join household h on h.id = r.household_id
    where r.active
      and r.routine_key = 'nanny_departure'
      and r.weekday = extract(
        dow from ((now() at time zone h.timezone)::date + 1)
      )::smallint
  )
  select *
  from timeline
  order by sort_rank nulls last, starts_at nulls last;
$function$;

revoke all on function public.get_lovable_tomorrow_timeline(text) from public, anon;
grant execute on function public.get_lovable_tomorrow_timeline(text) to authenticated;
