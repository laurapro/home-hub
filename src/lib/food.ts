import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { HOUSEHOLD_SLUG } from "./household";

type Fns = Database["public"]["Functions"];
export type RecipeOption = Fns["get_lovable_food_recipes"]["Returns"][number];
export type InventoryOption = Fns["get_lovable_food_inventory"]["Returns"][number];

/** Canonical JSON shapes returned by get_lovable_home_meals. */
export type MissingItem = { item_id: string; item: string; quantity?: number; unit?: string };
export type UnknownItem = { item_id: string; item: string };
export type ThawItem = { item_id: string; item: string; thaw_lead_hours?: number };

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export const parseMissingItems = (v: unknown) => asArray<MissingItem>(v);
export const parseUnknownItems = (v: unknown) => asArray<UnknownItem>(v);
export const parseThawItems = (v: unknown) => asArray<ThawItem>(v);

export function useFoodRecipes(enabled: boolean) {
  return useQuery({
    queryKey: ["food-recipes", HOUSEHOLD_SLUG],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_lovable_food_recipes", {
        p_household_slug: HOUSEHOLD_SLUG,
      });
      if (error) throw new Error(error.message);
      return (data ?? []) as RecipeOption[];
    },
  });
}

export function useFoodInventory(enabled: boolean) {
  return useQuery({
    queryKey: ["food-inventory", HOUSEHOLD_SLUG],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_lovable_food_inventory", {
        p_household_slug: HOUSEHOLD_SLUG,
      });
      if (error) throw new Error(error.message);
      return (data ?? []) as InventoryOption[];
    },
  });
}

/** All canonical Home reads plus Food helper reads. */
const REFRESH_KEYS = [
  "today-timeline",
  "household-attention",
  "home-meals",
  "shopping-summary",
  "food-recipes",
  "food-inventory",
];

/**
 * Thin wrapper: React only gathers parameters and invokes the membership-gated RPC.
 * All domain logic, idempotency and auditing stay in Supabase.
 */
export function useFoodAction<TArgs>(
  run: (args: TArgs) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: run,
    onSuccess: async (result) => {
      const applied =
        result &&
        typeof result === "object" &&
        (result as Record<string, unknown>)["already_applied"];
      toast.success(applied ? "Already up to date" : successMessage);
      await Promise.all(
        REFRESH_KEYS.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key, HOUSEHOLD_SLUG] }),
        ),
      );
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

async function rpc<K extends keyof Fns & string>(name: K, args: Fns[K]["Args"]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await supabase.rpc(name as any, args as any);
  if (error) throw new Error(error.message);
  return data;
}

export const planFoodMeal = (args: Fns["lovable_plan_food_meal"]["Args"]) =>
  rpc("lovable_plan_food_meal", args);
export const correctFoodInventory = (args: Fns["lovable_correct_food_inventory"]["Args"]) =>
  rpc("lovable_correct_food_inventory", args);
export const completeFoodThaw = (args: Fns["lovable_complete_food_thaw"]["Args"]) =>
  rpc("lovable_complete_food_thaw", args);
export const completeFoodMeal = (args: Fns["lovable_complete_food_meal"]["Args"]) =>
  rpc("lovable_complete_food_meal", args);
export const cancelFoodMeal = (args: Fns["lovable_cancel_food_meal"]["Args"]) =>
  rpc("lovable_cancel_food_meal", args);
export const addPlannedMealItemToShopping = (
  args: Fns["lovable_add_planned_meal_item_to_shopping"]["Args"],
) => rpc("lovable_add_planned_meal_item_to_shopping", args);

export const MEAL_SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;
export const INVENTORY_STATUSES = [
  "available",
  "low",
  "out",
  "opened",
  "expired",
  "unknown",
] as const;
