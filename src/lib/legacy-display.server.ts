import { createHmac, timingSafeEqual } from "node:crypto";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ACTION_COOKIE_NAME = "home_hub_legacy_action";
const ACTION_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const RETRY_SECONDS = 5 * 60;

function secondsUntilDailyRefresh(now = new Date()): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)!.value);

  for (const dayOffset of [0, 1]) {
    // Noon UTC is 6 or 7 a.m. Central, safely after any DST transition.
    const candidate = new Date(Date.UTC(value("year"), value("month") - 1, value("day") + dayOffset, 12));
    const localHour = Number(formatter.formatToParts(candidate).find((part) => part.type === "hour")!.value);
    const target = candidate.getTime() - (localHour - 6) * 60 * 60 * 1000;
    if (target > now.getTime()) return Math.ceil((target - now.getTime()) / 1000);
  }
  throw new Error("Could not determine the next daily refresh");
}

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

type PetRow = {
  entity_id: string | null;
  entity_type: string | null;
  due_at: string | null;
  human_action: string | null;
  medication_name: string | null;
  pet_name: string | null;
  severity: string | null;
  scheduled_for: string | null;
};

type LegacyDisplayData = {
  attention: AttentionRow[];
  householdName: string;
  meals: MealRow[];
  pets: PetRow[];
  timeline: TimelineRow[];
};

function pageHeaders(): Headers {
  const headers = new Headers();
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
  headers.set("referrer-policy", "no-referrer");
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

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
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

function actionCookieSignature(secret: string): string {
  return createHmac("sha256", secret).update("home-hub-legacy-action-device-v1").digest("hex");
}

function medicationActionProof(secret: string, medicationId: string, scheduledFor: string): string {
  return createHmac("sha256", secret)
    .update(`give-medication:${medicationId}:${scheduledFor}`)
    .digest("hex");
}

function shell(title: string, body: string, refreshSeconds?: number): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${refreshSeconds ? `<meta http-equiv="refresh" content="${refreshSeconds}; url=/legacy-display">` : ""}
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
    .pets { background: #e6edf8; border-left-color: #8aa9d4; }
    .title { font-size: 21px; font-weight: bold; }
    .meta { margin-top: 7px; color: #756b62; }
    .empty { padding: 18px; background: #fffdf8; border: 1px solid #ddd2bf; color: #756b62; }
    .message { width: 520px; max-width: 85%; margin: 80px auto; padding: 28px; background: #fffdf8; border: 1px solid #ddd2bf; }
    .notice { margin-top: 14px; padding: 12px 16px; background: #dff1df; border: 1px solid #9fc49f; font-weight: bold; }
    form { margin-top: 14px; }
    button { padding: 12px 18px; font-size: 18px; font-weight: bold; color: #2d2823; background: #d8eddc; border: 2px solid #75a681; cursor: pointer; }
    @media screen and (max-width: 700px) { .card { display: block; width: auto; } h1 { font-size: 30px; } }
  </style>
</head>
<body>${body}</body>
</html>`;
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

export function renderLegacyDisplayPage(
  data: LegacyDisplayData,
  medicationActionSecret?: string,
  notice?: string,
): string {
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
    data.attention.filter((item) => item.domain !== "pets"),
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
  const isMedicationDue = (item: PetRow) =>
    item.entity_type === "pet_medication" &&
    (item.severity === "critical" || item.severity === "due");
  const renderPet = (item: PetRow) => {
    const canMarkGiven = Boolean(
      medicationActionSecret && item.entity_id && item.scheduled_for && isMedicationDue(item),
    );
    const action = canMarkGiven
      ? `<form method="post" action="/legacy-display">
            <input type="hidden" name="action" value="give-medication">
            <input type="hidden" name="medication_id" value="${escapeHtml(item.entity_id)}">
            <input type="hidden" name="scheduled_for" value="${escapeHtml(item.scheduled_for)}">
            <input type="hidden" name="proof" value="${medicationActionProof(medicationActionSecret!, item.entity_id!, item.scheduled_for!)}">
            <button type="submit">&#10003; Mark pill given</button>
          </form>`
      : "";
    return `<div class="card pets"><div class="title">${escapeHtml(item.pet_name || "Pet")} ${item.medication_name ? `&mdash; ${escapeHtml(item.medication_name)}` : ""}</div><div class="meta">${escapeHtml(item.human_action || item.severity || "")}${item.due_at ? ` &middot; ${escapeHtml(formatDateTime(item.due_at))}` : ""}</div>${action}</div>`;
  };
  const medication = cards(data.pets.filter(isMedicationDue), renderPet, "No medication is due.");
  const pets = cards(
    data.pets.filter((item) => !isMedicationDue(item)),
    renderPet,
    "Pets are all set.",
  );

  return shell(
    `${data.householdName} — Home Hub`,
    `<div class="wrap">
      <div class="header"><h1>Today at home</h1><div class="subtle">${escapeHtml(now)} &middot; Daily display</div>${notice ? `<div class="notice">${escapeHtml(notice)}</div>` : ""}</div>
      <h2>Medication</h2>${medication}
      <h2>Schedule</h2>${schedule}
      <h2>Needs you</h2>${attention}
      <h2>Meals</h2>${meals}
      <h2>Pets</h2>${pets}
    </div>`,
    secondsUntilDailyRefresh(),
  );
}

async function loadDisplayData(): Promise<LegacyDisplayData> {
  const { data: household, error: householdError } = await supabaseAdmin
    .from("households")
    .select("id, name")
    .eq("slug", "home")
    .single();
  if (householdError) throw householdError;

  const [timeline, attention, meals, pets] = await Promise.all([
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
      .from("pets_medication_attention_items")
      .select("pet_name, medication_name, human_action, due_at, severity, entity_id, entity_type")
      .eq("household_id", household.id)
      .in("severity", ["critical", "due", "upcoming"])
      .order("severity_rank")
      .limit(8),
  ]);

  const firstError = [timeline.error, attention.error, meals.error, pets.error].find(Boolean);
  if (firstError) throw firstError;

  return {
    householdName: household.name,
    timeline: timeline.data ?? [],
    attention: attention.data ?? [],
    meals: meals.data ?? [],
    pets: (pets.data ?? []).map((item) => ({
      ...item,
      scheduled_for:
        item.entity_type === "pet_medication" && item.due_at
          ? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(
              new Date(item.due_at),
            )
          : null,
    })),
  };
}

function validActionSecret(): string | null {
  const secret = process.env["LEGACY_DISPLAY_ACTION_TOKEN"];
  return secret && secret.length >= 32 ? secret : null;
}

function redirectToDisplay(headers?: HeadersInit): Response {
  return new Response(null, {
    status: 303,
    headers: { location: "/legacy-display", ...headers },
  });
}

export async function handleLegacyDisplay(request: Request): Promise<Response> {
  const secret = validActionSecret();
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    secret &&
    safeEqual(url.searchParams.get("device") ?? "", secret)
  ) {
    return redirectToDisplay({
      "set-cookie": `${ACTION_COOKIE_NAME}=${actionCookieSignature(secret)}; Path=/legacy-display; Max-Age=${ACTION_COOKIE_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Strict`,
    });
  }

  const actionEnabled =
    !!secret &&
    safeEqual(cookieValue(request, ACTION_COOKIE_NAME) ?? "", actionCookieSignature(secret));

  if (request.method === "POST") {
    if (!secret || !actionEnabled) {
      return new Response(
        shell(
          "Action unavailable",
          '<div class="message"><h1>Action unavailable</h1><p>This tablet is not enrolled to record medication.</p></div>',
        ),
        { status: 403, headers: pageHeaders() },
      );
    }

    const form = await request.formData();
    const medicationId = String(form.get("medication_id") ?? "");
    const scheduledFor = String(form.get("scheduled_for") ?? "");
    const proof = String(form.get("proof") ?? "");
    const validMedicationId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        medicationId,
      );
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(scheduledFor);
    const validProof = safeEqual(proof, medicationActionProof(secret, medicationId, scheduledFor));

    if (
      form.get("action") !== "give-medication" ||
      !validMedicationId ||
      !validDate ||
      !validProof
    ) {
      return new Response(
        shell(
          "Invalid action",
          '<div class="message"><h1>Invalid action</h1><p>The medication was not changed. Refresh the display and try again.</p></div>',
        ),
        { status: 400, headers: pageHeaders() },
      );
    }

    const { error } = await supabaseAdmin.rpc("mark_pet_medication_given", {
      p_actor_ref: "legacy-display",
      p_pet_medication_id: medicationId,
      p_scheduled_for: scheduledFor,
    });
    if (error) {
      console.error("Legacy medication action failed", error);
      return new Response(
        shell(
          "Medication not recorded",
          '<div class="message"><h1>Medication not recorded</h1><p>The pill was not changed. Refresh the display and try again.</p></div>',
        ),
        { status: 409, headers: pageHeaders() },
      );
    }

    return new Response(null, {
      status: 303,
      headers: { location: "/legacy-display?pill=recorded" },
    });
  }

  try {
    const data = await loadDisplayData();
    const notice =
      url.searchParams.get("pill") === "recorded" ? "Pill recorded as given." : undefined;
    return new Response(renderLegacyDisplayPage(data, actionEnabled ? secret : undefined, notice), {
      headers: pageHeaders(),
    });
  } catch (error) {
    console.error("Legacy display failed", error);
    return new Response(
      shell(
        "Display temporarily unavailable",
        '<div class="message"><h1>Temporarily unavailable</h1><p>The display could not load household data. It is safe to refresh and try again.</p></div>',
        RETRY_SECONDS,
      ),
      {
        status: 503,
        headers: pageHeaders(),
      },
    );
  }
}
