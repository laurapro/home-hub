create or replace function public.lovable_set_shopping_item_store(
  p_household_slug text,
  p_shopping_item_id uuid,
  p_store_id uuid default null
)
returns public.shopping_items
language plpgsql
security definer
set search_path = 'public', 'auth'
as $function$
declare
  v_household_id uuid;
  v_result public.shopping_items;
begin
  select h.id
  into v_household_id
  from public.households h
  where h.slug = p_household_slug
    and exists (
      select 1
      from public.household_memberships m
      where m.household_id = h.id
        and m.user_id = auth.uid()
    );

  if v_household_id is null then
    raise exception 'Household access denied';
  end if;

  if not exists (
    select 1
    from public.shopping_items si
    where si.id = p_shopping_item_id
      and si.household_id = v_household_id
  ) then
    raise exception 'Shopping item access denied';
  end if;

  if p_store_id is not null and not exists (
    select 1
    from public.stores s
    where s.id = p_store_id
      and s.household_id = v_household_id
      and s.active = true
  ) then
    raise exception 'Invalid store';
  end if;

  update public.shopping_items
  set store_id = p_store_id,
      updated_at = now()
  where id = p_shopping_item_id
  returning * into v_result;

  return v_result;
end;
$function$;

revoke all on function public.lovable_set_shopping_item_store(text, uuid, uuid) from public;
grant execute on function public.lovable_set_shopping_item_store(text, uuid, uuid) to authenticated;
