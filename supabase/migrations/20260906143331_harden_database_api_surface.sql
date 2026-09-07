-- Keep internal reporting views from bypassing the RLS policies on their
-- underlying tables, and expose them only to trusted server-side automation.
alter view public.costco_item_predictions set (security_invoker = true);
alter view public.open_shopping_items set (security_invoker = true);

revoke all on table public.costco_item_predictions from public, anon, authenticated;
revoke all on table public.open_shopping_items from public, anon, authenticated;
grant select on table public.costco_item_predictions to service_role;
grant select on table public.open_shopping_items to service_role;

-- Trigger support functions are not public RPC endpoints. Remove the default
-- PUBLIC execute privilege while retaining explicit service-role access.
revoke all on function public.process_calendar_sync_command() from public, anon, authenticated;
revoke all on function public.process_food_ui_command() from public, anon, authenticated;
revoke all on function public.process_pet_attention_scan() from public, anon, authenticated;
revoke all on function public.process_pet_medication_command() from public, anon, authenticated;
revoke all on function public.reconcile_shopping_item_from_purchase() from public, anon, authenticated;
revoke all on function public.set_purchase_receipt_fingerprint() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

grant execute on function public.process_calendar_sync_command() to service_role;
grant execute on function public.process_food_ui_command() to service_role;
grant execute on function public.process_pet_attention_scan() to service_role;
grant execute on function public.process_pet_medication_command() to service_role;
grant execute on function public.reconcile_shopping_item_from_purchase() to service_role;
grant execute on function public.set_purchase_receipt_fingerprint() to service_role;
grant execute on function public.set_updated_at() to service_role;

-- Pin lookup order for older trigger functions. Browser roles cannot create
-- objects in any of these schemas, preventing search-path object shadowing.
alter function public.reconcile_shopping_item_from_purchase()
  set search_path = pg_catalog, public;
alter function public.set_purchase_receipt_fingerprint()
  set search_path = pg_catalog, extensions;
alter function public.set_updated_at()
  set search_path = pg_catalog;
