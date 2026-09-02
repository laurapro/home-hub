import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { HOUSEHOLD_SLUG } from "./household";

type Fns = Database["public"]["Functions"];
export type ShoppingItem = Fns["get_lovable_shopping_items"]["Returns"][number];
export type Store = Fns["get_lovable_stores"]["Returns"][number];

export const SHOPPING_PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export function useStores(enabled: boolean) {
  return useQuery({
    queryKey: ["stores", HOUSEHOLD_SLUG],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_lovable_stores", {
        p_household_slug: HOUSEHOLD_SLUG,
      });
      if (error) throw new Error(error.message);
      return (data ?? []) as Store[];
    },
  });
}

export function useShoppingItems(enabled: boolean) {
  return useQuery({
    queryKey: ["shopping-items", HOUSEHOLD_SLUG],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_lovable_shopping_items", {
        p_household_slug: HOUSEHOLD_SLUG,
        p_include_completed: true,
      });
      if (error) throw new Error(error.message);
      return (data ?? []) as ShoppingItem[];
    },
  });
}

/** Canonical reads to refresh after any Shopping write. */
const REFRESH_KEYS = ["shopping-summary", "shopping-items", "household-attention", "home-meals"];

export function useShoppingAction<TArgs>(
  run: (args: TArgs) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: run,
    onSuccess: async () => {
      toast.success(successMessage);
      await Promise.all(
        REFRESH_KEYS.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key, HOUSEHOLD_SLUG] }),
        ),
      );
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

type SetStoreArgs = Fns["lovable_set_shopping_item_store"]["Args"];

export function useSetShoppingItemStore(stores: Store[]) {
  const queryClient = useQueryClient();
  const queryKey = ["shopping-items", HOUSEHOLD_SLUG] as const;

  return useMutation({
    mutationFn: setShoppingItemStore,
    onMutate: async (args: SetStoreArgs) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ShoppingItem[]>(queryKey);
      const selectedStore = stores.find((store) => store.id === args.p_store_id);

      queryClient.setQueryData<ShoppingItem[]>(queryKey, (current = []) =>
        current.map((item) =>
          item.id === args.p_shopping_item_id
            ? ({
                ...item,
                store_id: args.p_store_id ?? null,
                store_name: selectedStore?.name ?? null,
              } as unknown as ShoppingItem)
            : item,
        ),
      );

      return { previous };
    },
    onSuccess: () => toast.success("Store updated"),
    onError: (error: Error, _args, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.error(error.message);
    },
    onSettled: async () => {
      await Promise.all(
        REFRESH_KEYS.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key, HOUSEHOLD_SLUG] }),
        ),
      );
    },
  });
}

async function rpc<K extends keyof Fns & string>(name: K, args: Fns[K]["Args"]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await supabase.rpc(name as any, args as any);
  if (error) throw new Error(error.message);
  return data;
}

export const addShoppingItem = (args: Fns["lovable_add_shopping_item"]["Args"]) =>
  rpc("lovable_add_shopping_item", args);
export const completeShoppingItem = (args: Fns["lovable_complete_shopping_item"]["Args"]) =>
  rpc("lovable_complete_shopping_item", args);
export const skipShoppingItem = (args: Fns["lovable_skip_shopping_item"]["Args"]) =>
  rpc("lovable_skip_shopping_item", args);
export const restoreShoppingItem = (args: Fns["lovable_restore_shopping_item"]["Args"]) =>
  rpc("lovable_restore_shopping_item", args);
export const setShoppingItemStore = (args: Fns["lovable_set_shopping_item_store"]["Args"]) =>
  rpc("lovable_set_shopping_item_store", args);

const DONE_STATUSES = new Set(["purchased", "skipped", "completed"]);

export function isOpenShoppingItem(item: ShoppingItem): boolean {
  return !DONE_STATUSES.has(item.status);
}

/** Recently resolved (purchased/skipped) within the last 7 days. */
export function isRecentlyResolved(item: ShoppingItem): boolean {
  if (!DONE_STATUSES.has(item.status)) return false;
  const stamp = item.purchased_at ?? item.updated_at;
  if (!stamp) return false;
  const when = new Date(stamp).getTime();
  if (Number.isNaN(when)) return false;
  return Date.now() - when <= 7 * 24 * 60 * 60 * 1000;
}
