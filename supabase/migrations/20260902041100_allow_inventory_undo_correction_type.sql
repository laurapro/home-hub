alter table public.inventory_corrections
drop constraint inventory_corrections_type_check;

alter table public.inventory_corrections
add constraint inventory_corrections_type_check
check (
  correction_type in (
    'confirm',
    'status',
    'quantity',
    'meals_remaining',
    'opened',
    'undo'
  )
);
