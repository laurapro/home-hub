-- Public-schema functions receive project-default grants at creation time.
-- Keep these browser wrappers authenticated-only.
revoke all on function public.get_lovable_pets_attention(text)
  from public, anon;
revoke all on function public.lovable_mark_pet_medication_given(text, uuid, date, boolean)
  from public, anon;
