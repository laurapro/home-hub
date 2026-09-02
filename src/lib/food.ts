import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { HOUSEHOLD_SLUG } from "./household";

type Fns = Database["public"]["Functions"];
export type RecipeOption = Fns["get_lovable_food_recipes"]["Returns"][number];
export type InventoryOption = Fns["get_lovable_food_inventory"]["Returns"][number];
export type PlannedMeal = Fns["get_lovable_planned_meal"]["Returns"][number];
export type InventoryQuickAction = "used_some" | "finished" | "still_have";

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

export function usePlannedMeal(plannedMealId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["planned-meal", HOUSEHOLD_SLUG, plannedMealId],
    enabled: enabled && plannedMealId !== "",
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_lovable_planned_meal", {
        p_household_slug: HOUSEHOLD_SLUG,
        p_planned_meal_id: plannedMealId,
      });
      if (error) throw new Error(error.message);
      return (data?.[0] as PlannedMeal | undefined) ?? null;
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
  "planned-meal",
];

async function refreshFoodData(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all(
    REFRESH_KEYS.map((key) => queryClient.invalidateQueries({ queryKey: [key, HOUSEHOLD_SLUG] })),
  );
}

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
      await refreshFoodData(queryClient);
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
export const undoFoodInventoryCorrection = (
  args: Fns["lovable_undo_food_inventory_correction"]["Args"],
) => rpc("lovable_undo_food_inventory_correction", args);

function correctionId(result: unknown): string | null {
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const value = (result as Record<string, unknown>)["correction_id"];
  return typeof value === "string" ? value : null;
}

export function useInventoryCorrectionAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: correctFoodInventory,
    onSuccess: async (result) => {
      const id = correctionId(result);
      toast.success("Inventory updated", {
        action: id
          ? {
              label: "Undo",
              onClick: async () => {
                try {
                  await undoFoodInventoryCorrection({ p_correction_id: id });
                  toast.success("Inventory change undone");
                  await refreshFoodData(queryClient);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Could not undo change");
                }
              },
            }
          : undefined,
      });
      await refreshFoodData(queryClient);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
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
export const INVENTORY_STATUSES = ["plenty", "some", "low", "out", "unknown"] as const;

export function inventoryQuickCorrection(
  item: InventoryOption,
  action: InventoryQuickAction,
): Fns["lovable_correct_food_inventory"]["Args"] {
  const base = { p_inventory_id: item.inventory_id };

  if (action === "finished") return { ...base, p_status: "out" };
  if (action === "still_have") return base;

  if (item.tracking_mode === "meals" && item.meals_remaining != null) {
    const remaining = Math.max(0, item.meals_remaining - 1);
    return {
      ...base,
      p_meals_remaining: remaining,
      ...(remaining === 0 ? { p_status: "out" } : {}),
    };
  }

  if (item.quantity != null) {
    const quantity = Math.max(0, item.quantity - 1);
    return {
      ...base,
      p_quantity: quantity,
      ...(quantity === 0 ? { p_status: "out" } : {}),
    };
  }

  const nextStatus: Record<string, string> = {
    plenty: "some",
    some: "low",
    low: "out",
    unknown: "some",
    out: "out",
  };
  return { ...base, p_status: nextStatus[item.status ?? "unknown"] ?? "some" };
}
