import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const HOUSEHOLD_SLUG = "home";

type Fns = Database["public"]["Functions"];
export type TimelineItem = Fns["get_lovable_today_timeline"]["Returns"][number];
export type AttentionItem = Fns["get_lovable_household_attention"]["Returns"][number];
export type MealItem = Fns["get_lovable_home_meals"]["Returns"][number];
export type ShoppingSummary = Fns["get_lovable_shopping_summary"]["Returns"][number];

export type HouseholdAccessError = { kind: "no-access" } | { kind: "error"; message: string };

/**
 * Supabase surfaces "member of no household / not authorized for this slug"
 * as a raised exception or a permission error from the RPC.
 */
function classify(error: { message?: string; code?: string } | null): HouseholdAccessError | null {
  if (!error) return null;
  const message = error.message ?? "Unknown error";
  const normalized = message.toLowerCase();
  if (
    normalized.includes("not authorized") ||
    normalized.includes("not a member") ||
    normalized.includes("permission denied") ||
    normalized.includes("forbidden") ||
    normalized.includes("household not found") ||
    error.code === "42501" ||
    error.code === "PGRST301"
  ) {
    return { kind: "no-access" };
  }
  return { kind: "error", message };
}

async function callRpc<T>(
  fn:
    | "get_lovable_today_timeline"
    | "get_lovable_household_attention"
    | "get_lovable_home_meals"
    | "get_lovable_shopping_summary",
): Promise<{ rows: T[]; failure: HouseholdAccessError | null }> {
  const { data, error } = await supabase.rpc(fn, { p_household_slug: HOUSEHOLD_SLUG });
  const failure = classify(error);
  return { rows: (data ?? []) as T[], failure };
}

export function useHomeData() {
  const timeline = useQuery({
    queryKey: ["today-timeline", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<TimelineItem>("get_lovable_today_timeline"),
  });
  const attention = useQuery({
    queryKey: ["household-attention", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<AttentionItem>("get_lovable_household_attention"),
  });
  const meals = useQuery({
    queryKey: ["home-meals", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<MealItem>("get_lovable_home_meals"),
  });
  const shopping = useQuery({
    queryKey: ["shopping-summary", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<ShoppingSummary>("get_lovable_shopping_summary"),
  });

  const queries = [timeline, attention, meals, shopping];
  const isLoading = queries.some((q) => q.isPending);
  const failures = queries
    .map((q) => q.data?.failure ?? (q.error ? classify(q.error as Error) : null))
    .filter(Boolean) as HouseholdAccessError[];

  const noAccess = failures.length > 0 && failures.every((f) => f.kind === "no-access");
  const hardError = failures.find((f) => f.kind === "error") as
    | { kind: "error"; message: string }
    | undefined;

  return {
    isLoading,
    noAccess,
    errorMessage: hardError?.message ?? null,
    timeline: timeline.data?.rows ?? [],
    attention: attention.data?.rows ?? [],
    meals: meals.data?.rows ?? [],
    shopping: shopping.data?.rows ?? [],
    refetchAll: () => queries.forEach((q) => void q.refetch()),
  };
}

const CRITICAL_SEVERITIES = new Set(["critical", "urgent", "overdue", "high", "due"]);

export function isNeedsYou(item: AttentionItem): boolean {
  const severity = (item.severity ?? "").toLowerCase();
  if (CRITICAL_SEVERITIES.has(severity)) return true;
  if (!item.due_at) return false;
  const due = new Date(item.due_at).getTime();
  if (Number.isNaN(due)) return false;
  return due <= Date.now() + 12 * 60 * 60 * 1000;
}

export function severityTone(severity: string | null): "critical" | "warning" | "calm" {
  const value = (severity ?? "").toLowerCase();
  if (CRITICAL_SEVERITIES.has(value)) return "critical";
  if (value === "warning" || value === "soon" || value === "medium") return "warning";
  return "calm";
}

export function formatTime(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatDayTime(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString([], {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
