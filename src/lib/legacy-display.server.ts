import { createHmac, timingSafeEqual } from "node:crypto";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

const COOKIE_NAME = "home_hub_legacy_display";
const COOKIE_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;
const REFRESH_SECONDS = 24 * 60 * 60;

type TimelineRow = {
  all_day: boolean | null;
  ends_at: string | null;
  item_type: string | null;
  location: string | null;
  starts_at: string | null;
  title: string | null;
};

type AttentionRow = {
  domain: string | null;
  due_at: string | null;
  human_action: string | null;
  severity: string | null;
  title: string | null;
};

type MealRow = {
  meal_slot: string | null;
  notes: string | null;
  planned_for: string | null;
  recipe_name: string | null;
  status: string | null;
};

type ShoppingRow = {
  item_count: number | null;
  urgent_count: number | null;
};

type PetRow = {
  due_at: string | null;
  human_action: string | null;
  medication_name: string | null;
  pet_name: string | null;
  severity: string | null;
};

type LegacyDisplayData = {
  attention: AttentionRow[];
  householdName: string;
  meals: MealRow[];
  pets: PetRow[];
  shoppingCount: number;
  timeline: TimelineRow[];
  urgentShoppingCount: number;
};

function pageHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "no-store, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  headers.set(
    "content-security-policy",
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  );
  return headers;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cookieValue(request: Request, name: string): string | null {
  const cookies = request.headers.get("cookie") ?? "";
  for (const part of cookies.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return null;
}

function displaySignature(pin: string): string {
  return createHmac("sha256", pin).update("home-hub-legacy-display-v1").digest("hex");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function shell(title: string, body: string, refresh = false): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${refresh ? `<meta http-equiv="refresh" content="${REFRESH_SECONDS}">` : ""}
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    html, body { margin: 0; padding: 0; background: #fff9ed; color: #2d2823; font-family: Arial, Helvetica, sans-serif; }
    body { font-size: 18px; line-height: 1.4; }
    .wrap { width: 92%; max-width: 1180px; margin: 0 auto; padding: 28px 0 48px; }
    .header { padding: 22px 26px; background: #f8f0df; border: 1px solid #ddd2bf; }
    h1 { margin: 0; font-size: 38px; }
    h2 { margin: 30px 0 12px; font-size: 18px; text-transform: uppercase; color: #71675f; }
    .subtle { color: #756b62; }
    .cards { margin: -8px; overflow: hidden; }
    .card { display: inline-block; vertical-align: top; width: 43%; min-height: 90px; margin: 8px; padding: 18px; background: #fffdf8; border: 1px solid #ddd2bf; border-left: 6px solid #b9d9c2; }
    .calendar { background: #f4ead3; border-left-color: #e6bd6c; }
    .attention { background: #fae5dd; border-left-color: #e99579; }
    .meal { background: #e7f1e1; border-left-color: #91bd83; }
    .shopping { background: #e1f1e4; border-left-color: #75b28a; }
    .pets { background: #e6edf8; border-left-color: #8aa9d4; }
    .title { font-size: 21px; font-weight: bold; }
    .meta { margin-top: 7px; color: #756b62; }
    .empty { padding: 18px; background: #fffdf8; border: 1px solid #ddd2bf; color: #756b62; }
    .login { width: 360px; max-width: 85%; margin: 80px auto; padding: 28px; background: #fffdf8; border: 1px solid #ddd2bf; }
    label { display: block; margin: 18px 0 6px; font-weight: bold; }
    input { box-sizing: border-box; width: 100%; padding: 12px; font-size: 20px; border: 1px solid #998f85; }
    button { margin-top: 16px; padding: 12px 22px; font-size: 18px; color: #fff; background: #5c9b75; border: 0; }
    .error { color: #9b342b; font-weight: bold; }
    @media screen and (max-width: 700px) { .card { display: block; width: auto; } h1 { font-size: 30px; } }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function renderLogin(errorMessage?: string): string {
  return shell(
    "Home Hub Display",
    `<div class="login">
      <h1>Home Hub</h1>
      <p class="subtle">Enter the display PIN once on this tablet.</p>
      ${errorMessage ? `<p class="error">${escapeHtml(errorMessage)}</p>` : ""}
      <form method="post" action="/legacy-display">
        <label for="pin">Display PIN</label>
        <input id="pin" name="pin" type="password" inputmode="numeric" autocomplete="off" minlength="8" required>
        <button type="submit">Open display</button>
      </form>
    </div>`,
  );
}

function formatDateTime(value: string | null, timeZone = "America/Chicago"): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function cards<T>(items: T[], render: (item: T) => string, empty: string): string {
  return items.length
    ? `<div class="cards">${items.map(render).join("")}</div>`
    : `<div class="empty">${escapeHtml(empty)}</div>`;
}

export function renderLegacyDisplayPage(data: LegacyDisplayData): string {
  const now = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const schedule = cards(
    data.timeline,
    (item) =>
      `<div class="card calendar"><div class="title">${escapeHtml(item.title || "Scheduled item")}</div><div class="meta">${item.all_day ? "All day" : escapeHtml(formatDateTime(item.starts_at))}${item.location ? ` &middot; ${escapeHtml(item.location)}` : ""}</div></div>`,
    "Nothing scheduled today.",
  );
  const attention = cards(
    data.attention,
    (item) =>
      `<div class="card attention"><div class="title">${escapeHtml(item.title || "Needs attention")}</div><div class="meta">${escapeHtml(item.human_action || item.domain || "")}${item.due_at ? ` &middot; ${escapeHtml(formatDateTime(item.due_at))}` : ""}</div></div>`,
    "Nothing needs you right now.",
  );
  const meals = cards(
    data.meals,
    (item) =>
      `<div class="card meal"><div class="title">${escapeHtml(item.recipe_name || item.notes || "Meal planned")}</div><div class="meta">${escapeHtml(item.meal_slot || "Meal")} &middot; ${escapeHtml(item.status || "planned")}</div></div>`,
    "No meals planned today.",
  );
  const pets = cards(
    data.pets,
    (item) =>
      `<div class="card pets"><div class="title">${escapeHtml(item.pet_name || "Pet")} ${item.medication_name ? `&mdash; ${escapeHtml(item.medication_name)}` : ""}</div><div class="meta">${escapeHtml(item.human_action || item.severity || "")}${item.due_at ? ` &middot; ${escapeHtml(formatDateTime(item.due_at))}` : ""}</div></div>`,
    "Pets are all set.",
  );

  return shell(
    `${data.householdName} — Home Hub`,
    `<div class="wrap">
      <div class="header"><h1>Today at home</h1><div class="subtle">${escapeHtml(now)} &middot; Read-only daily display</div></div>
      <h2>Schedule</h2>${schedule}
      <h2>Needs you</h2>${attention}
      <h2>Meals</h2>${meals}
      <h2>Shopping</h2><div class="card shopping"><div class="title">Shopping list</div><div class="meta">${data.shoppingCount} item${data.shoppingCount === 1 ? "" : "s"}${data.urgentShoppingCount ? ` &middot; ${data.urgentShoppingCount} urgent` : ""}</div></div>
      <h2>Pets</h2>${pets}
    </div>`,
    true,
  );
}

async function loadDisplayData(): Promise<LegacyDisplayData> {
  const { data: household, error: householdError } = await supabaseAdmin
    .from("households")
    .select("id, name")
    .eq("slug", "home")
    .single();
  if (householdError) throw householdError;

  const [timeline, attention, meals, shopping, pets] = await Promise.all([
    supabaseAdmin
      .from("household_today_timeline")
      .select("title, starts_at, ends_at, all_day, location, item_type")
      .eq("household_id", household.id)
      .order("sort_rank")
      .order("starts_at"),
    supabaseAdmin
      .from("household_attention_items")
      .select("title, human_action, due_at, domain, severity")
      .eq("household_id", household.id)
      .in("severity", ["critical", "due"])
      .order("sort_rank")
      .limit(8),
    supabaseAdmin
      .from("household_home_meals")
      .select("recipe_name, notes, meal_slot, status, planned_for")
      .eq("household_id", household.id)
      .eq(
        "planned_for",
        new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date()),
      )
      .order("meal_slot"),
    supabaseAdmin
      .from("household_shopping_summary")
      .select("item_count, urgent_count")
      .eq("household_id", household.id),
    supabaseAdmin
      .from("pets_medication_attention_items")
      .select("pet_name, medication_name, human_action, due_at, severity")
      .eq("household_id", household.id)
      .in("severity", ["critical", "due", "upcoming"])
      .order("severity_rank")
      .limit(8),
  ]);

  const firstError = [
    timeline.error,
    attention.error,
    meals.error,
    shopping.error,
    pets.error,
  ].find(Boolean);
  if (firstError) throw firstError;

  return {
    householdName: household.name,
    timeline: timeline.data ?? [],
    attention: attention.data ?? [],
    meals: meals.data ?? [],
    pets: pets.data ?? [],
    shoppingCount: (shopping.data ?? []).reduce((total, row) => total + (row.item_count ?? 0), 0),
    urgentShoppingCount: (shopping.data ?? []).reduce(
      (total, row) => total + (row.urgent_count ?? 0),
      0,
    ),
  };
}

export async function handleLegacyDisplay(request: Request): Promise<Response> {
  const configuredPin = process.env["LEGACY_DISPLAY_PIN"];
  if (!configuredPin || configuredPin.length < 8) {
    return new Response(
      shell(
        "Display unavailable",
        '<div class="login"><h1>Display unavailable</h1><p>The display PIN has not been configured yet.</p></div>',
      ),
      {
        status: 503,
        headers: pageHeaders(),
      },
    );
  }

  const expectedSignature = displaySignature(configuredPin);
  let authorized = safeEqual(cookieValue(request, COOKIE_NAME) ?? "", expectedSignature);
  let setCookie: string | undefined;

  if (request.method === "POST") {
    const form = await request.formData();
    const submittedPin = String(form.get("pin") ?? "");
    authorized = safeEqual(submittedPin, configuredPin);
    if (!authorized) {
      return new Response(renderLogin("That PIN was not accepted."), {
        status: 401,
        headers: pageHeaders(),
      });
    }
    setCookie = `${COOKIE_NAME}=${encodeURIComponent(expectedSignature)}; Path=/legacy-display; Max-Age=${COOKIE_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
  }

  if (!authorized) return new Response(renderLogin(), { headers: pageHeaders() });

  try {
    const data = await loadDisplayData();
    return new Response(renderLegacyDisplayPage(data), {
      headers: pageHeaders(setCookie ? { "set-cookie": setCookie } : undefined),
    });
  } catch (error) {
    console.error("Legacy display failed", error);
    return new Response(
      shell(
        "Display temporarily unavailable",
        '<div class="login"><h1>Temporarily unavailable</h1><p>The display could not load household data. It is safe to refresh and try again.</p></div>',
      ),
      {
        status: 503,
        headers: pageHeaders(),
      },
    );
  }
}
