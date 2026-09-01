import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const HOUSEHOLD_SLUG = "home";
export const HOUSEHOLD_TIMEZONE = "America/Chicago";

type Fns = Database["public"]["Functions"];
export type TimelineItem = Fns["get_lovable_today_timeline"]["Returns"][number];
export type TomorrowTimelineItem = Fns["get_lovable_tomorrow_timeline"]["Returns"][number];
export type AttentionItem = Fns["get_lovable_household_attention"]["Returns"][number];
export type MealItem = Fns["get_lovable_home_meals"]["Returns"][number];
export type ShoppingSummary = Fns["get_lovable_shopping_summary"]["Returns"][number];

type RpcName =
  | "get_lovable_today_timeline"
  | "get_lovable_tomorrow_timeline"
  | "get_lovable_household_attention"
  | "get_lovable_home_meals"
  | "get_lovable_shopping_summary";

async function callRpc<T>(fn: RpcName): Promise<T[]> {
  const { data, error } = await supabase.rpc(fn, { p_household_slug: HOUSEHOLD_SLUG });
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

/**
 * Authorization is decided by an RLS-protected SELECT on household_memberships,
 * never by whether the read RPCs happened to return rows.
 */
export function useHouseholdMembership() {
  return useQuery({
    queryKey: ["household-membership", HOUSEHOLD_SLUG],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("household_memberships")
        .select("household_id, role, households!inner(slug, name, timezone)")
        .eq("households.slug", HOUSEHOLD_SLUG)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });
}

/** Lightweight periodic refresh for the Home read RPCs (~2 minutes). */
const HOME_REFETCH_INTERVAL_MS = 2 * 60 * 1000;

export function useHomeData(enabled: boolean) {
  const timeline = useQuery({
    queryKey: ["today-timeline", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<TimelineItem>("get_lovable_today_timeline"),
    enabled,
    refetchInterval: HOME_REFETCH_INTERVAL_MS,
  });
  const tomorrowTimeline = useQuery({
    queryKey: ["tomorrow-timeline", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<TomorrowTimelineItem>("get_lovable_tomorrow_timeline"),
    enabled,
    refetchInterval: HOME_REFETCH_INTERVAL_MS,
  });
  const attention = useQuery({
    queryKey: ["household-attention", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<AttentionItem>("get_lovable_household_attention"),
    enabled,
    refetchInterval: HOME_REFETCH_INTERVAL_MS,
  });
  const meals = useQuery({
    queryKey: ["home-meals", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<MealItem>("get_lovable_home_meals"),
    enabled,
    refetchInterval: HOME_REFETCH_INTERVAL_MS,
  });
  const shopping = useQuery({
    queryKey: ["shopping-summary", HOUSEHOLD_SLUG],
    queryFn: () => callRpc<ShoppingSummary>("get_lovable_shopping_summary"),
    enabled,
    refetchInterval: HOME_REFETCH_INTERVAL_MS,
  });

  const queries = [timeline, tomorrowTimeline, attention, meals, shopping];

  return {
    isLoading: enabled && queries.some((q) => q.isPending),
    errorMessage: (queries.find((q) => q.error)?.error as Error | undefined)?.message ?? null,
    timeline: timeline.data ?? [],
    tomorrowTimeline: tomorrowTimeline.data ?? [],
    attention: attention.data ?? [],
    meals: meals.data ?? [],
    shopping: shopping.data ?? [],
  };
}

/** Canonical severities only — no aliases, no time heuristics. */
export function isNeedsYou(item: AttentionItem): boolean {
  return item.severity === "critical" || item.severity === "due";
}

export function isUpcoming(item: AttentionItem): boolean {
  return item.severity === "upcoming";
}

export function severityTone(severity: string | null): "critical" | "due" | "calm" {
  if (severity === "critical") return "critical";
  if (severity === "due") return "due";
  return "calm";
}

function dateKey(offsetDays: number): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: HOUSEHOLD_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const householdToday = formatter.format(new Date());
  const date = new Date(`${householdToday}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return formatter.format(date);
}

export function todayKey() {
  return dateKey(0);
}

export function tomorrowKey() {
  return dateKey(1);
}

const WEEKDAY_ABBR = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Format as time only: "1:00 PM"
 * Input: ISO timestamp or null
 */
export function formatTime(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: HOUSEHOLD_TIMEZONE,
  });
}

/**
 * Format as compact date: "Tu 08/22"
 * Handles both ISO timestamps and DATE-only strings (YYYY-MM-DD).
 * America/Chicago timezone is applied explicitly.
 */
export function formatCompactDate(value: string | null): string | null {
  if (!value) return null;

  // Detect if this is a DATE-only string (YYYY-MM-DD) or ISO timestamp
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);

  // Noon UTC stays on the same calendar date in Chicago, including across DST.
  const date = new Date(isDateOnly ? `${value}T12:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return null;

  // Get components in the household timezone
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HOUSEHOLD_TIMEZONE,
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const partsByType = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    partsByType["weekday"] ?? "",
  );
  const weekdayAbbr = WEEKDAY_ABBR[weekdayIndex] ?? "??";
  const month = partsByType["month"];
  const day = partsByType["day"];

  return `${weekdayAbbr} ${month}/${day}`;
}

/**
 * Format as compact date + time: "Tu 08/22 · 1:00 PM"
 * Input: ISO timestamp or null
 * America/Chicago timezone is applied explicitly.
 */
export function formatCompactDateTime(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  // Get the compact date part
  const datePart = formatCompactDate(value);
  if (!datePart) return null;

  // Get the time part
  const timePart = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: HOUSEHOLD_TIMEZONE,
  });

  return `${datePart} · ${timePart}`;
}

/**
 * Legacy alias: Format as compact date "Tu 08/22"
 * @deprecated Use formatCompactDate directly
 */
export function formatDay(value: string | null): string | null {
  return formatCompactDate(value);
}

/**
 * Legacy alias: Format as compact date + time "Tu 08/22 · 1:00 PM"
 * @deprecated Use formatCompactDateTime directly
 */
export function formatDayTime(value: string | null): string | null {
  return formatCompactDateTime(value);
}
