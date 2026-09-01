import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  formatCompactDateTime,
  formatTime,
  isNeedsYou,
  isUpcoming,
  severityTone,
  todayKey,
  useHomeData,
  useHouseholdMembership,
  HOUSEHOLD_TIMEZONE,
  type AttentionItem,
  type MealItem,
} from "@/lib/household";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/kitchen")({
  head: () => ({
    meta: [
      { title: "Kitchen Display — Household OS" },
      {
        name: "description",
        content:
          "A large-format, read-only kitchen display of today's household schedule, what needs you, and tonight's dinner.",
      },
      { property: "og:title", content: "Kitchen Display — Household OS" },
      {
        property: "og:description",
        content: "Large-format household display for today's plan and tonight's dinner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KitchenPage,
});

function useLocalClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function KitchenSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold uppercase tracking-widest text-muted-foreground sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function KitchenCard({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 shadow-sm sm:p-8",
        tone === "critical" && "border-l-8 border-l-critical",
        tone === "due" && "border-l-8 border-l-warning",
        className,
      )}
    >
      {children}
    </div>
  );
}

function AttentionRow({ item }: { item: AttentionItem }) {
  return (
    <KitchenCard tone={severityTone(item.severity)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="break-words text-2xl font-semibold text-foreground sm:text-3xl">
          {item.title ?? item.attention_type}
        </p>
        {item.due_at && (
          <span className="text-lg text-muted-foreground sm:text-xl">
            {formatCompactDateTime(item.due_at)}
          </span>
        )}
      </div>
      {item.human_action && (
        <p className="mt-2 break-words text-xl text-muted-foreground sm:text-2xl">
          {item.human_action}
        </p>
      )}
    </KitchenCard>
  );
}

function DinnerCard({ meal }: { meal: MealItem }) {
  return (
    <KitchenCard className="bg-food/55">
      <div className="flex flex-wrap items-baseline gap-x-4">
        <p className="break-words text-3xl font-semibold text-foreground sm:text-4xl">
          {meal.recipe_name ?? meal.plan_type ?? "Planned meal"}
        </p>
        {meal.meal_slot && (
          <span className="text-lg uppercase tracking-widest text-muted-foreground">
            {meal.meal_slot}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-lg">
        {meal.feasibility && (
          <span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">
            {meal.feasibility}
          </span>
        )}
        {meal.status && (
          <span className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">
            {meal.status}
          </span>
        )}
        {!!meal.thaw_count && (
          <span className="rounded-full bg-warning/20 px-4 py-2 text-foreground">
            thaw {meal.thaw_count}
          </span>
        )}
        {!!meal.missing_count && (
          <span className="rounded-full bg-critical/15 px-4 py-2 text-foreground">
            missing {meal.missing_count}
          </span>
        )}
      </div>
      {meal.notes && <p className="mt-3 break-words text-xl text-muted-foreground">{meal.notes}</p>}
    </KitchenCard>
  );
}

function KitchenPage() {
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;
  const data = useHomeData(isMember);
  const now = useLocalClock();

  const needsYou = data.attention.filter(isNeedsYou);
  const comingUp = data.attention.filter(isUpcoming).slice(0, 3);
  const tonight = data.meals.filter((m) => m.planned_for === todayKey());
  const storeCount = data.shopping.reduce((sum, s) => sum + (s.item_count ?? 0), 0);

  let body: React.ReactNode;

  if (membership.isPending || data.isLoading) {
    body = <p className="text-2xl text-muted-foreground">Loading…</p>;
  } else if (!isMember) {
    body = (
      <KitchenCard tone="critical">
        <p className="text-2xl font-semibold text-foreground">Household access not configured</p>
        <p className="mt-2 text-xl text-muted-foreground">
          This account isn't a member of the “home” household yet.
        </p>
      </KitchenCard>
    );
  } else if (data.errorMessage) {
    body = (
      <KitchenCard>
        <p className="text-2xl font-semibold text-foreground">Couldn't load household data</p>
        <p className="mt-2 text-xl text-muted-foreground">{data.errorMessage}</p>
      </KitchenCard>
    );
  } else {
    const hasAnything =
      data.timeline.length > 0 ||
      needsYou.length > 0 ||
      tonight.length > 0 ||
      comingUp.length > 0 ||
      storeCount > 0;

    body = (
      <div className="space-y-12">
        {data.timeline.length > 0 && (
          <KitchenSection title="Today">
            <div className="space-y-4">
              {data.timeline.map((item, i) => {
                const isCalendar = item.item_type === "calendar_event";
                return (
                  <KitchenCard
                    key={item.entity_id ?? `timeline-${i}`}
                    className={isCalendar ? "bg-calendar/55" : "bg-routine/55"}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="break-words text-2xl font-semibold text-foreground sm:text-3xl">
                        {item.title}
                      </p>
                      <span className="text-xl tabular-nums text-muted-foreground sm:text-2xl">
                        {item.all_day ? "All day" : formatTime(item.starts_at)}
                        {!item.all_day && item.ends_at ? ` – ${formatTime(item.ends_at)}` : ""}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-lg text-muted-foreground">
                      {item.location && <span>{item.location}</span>}
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 font-medium",
                          isCalendar
                            ? "bg-calendar text-calendar-foreground"
                            : "bg-routine text-routine-foreground",
                        )}
                      >
                        {isCalendar ? "Calendar" : "Routine"}
                      </span>
                    </div>
                  </KitchenCard>
                );
              })}
            </div>
          </KitchenSection>
        )}

        {needsYou.length > 0 && (
          <KitchenSection title="Needs you">
            <div className="space-y-4">
              {needsYou.map((item, i) => (
                <AttentionRow key={item.entity_id ?? `needs-${i}`} item={item} />
              ))}
            </div>
          </KitchenSection>
        )}

        {tonight.length > 0 && (
          <KitchenSection title="Tonight">
            <div className="space-y-4">
              {tonight.map((meal, i) => (
                <DinnerCard key={meal.planned_meal_id ?? `tonight-${i}`} meal={meal} />
              ))}
            </div>
          </KitchenSection>
        )}

        {comingUp.length > 0 && (
          <KitchenSection title="Coming up">
            <div className="space-y-4">
              {comingUp.map((item, i) => (
                <AttentionRow key={item.entity_id ?? `upcoming-${i}`} item={item} />
              ))}
            </div>
          </KitchenSection>
        )}

        {storeCount > 0 && (
          <p className="text-xl text-muted-foreground">
            Shopping: {storeCount} item{storeCount === 1 ? "" : "s"} across {data.shopping.length}{" "}
            store{data.shopping.length === 1 ? "" : "s"}
          </p>
        )}

        {!hasAnything && (
          <p className="text-2xl text-muted-foreground">
            Nothing needs you right now. Enjoy the quiet.
          </p>
        )}
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-10 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-5xl font-semibold tabular-nums tracking-tight text-foreground sm:text-7xl">
            {now
              ? now.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: HOUSEHOLD_TIMEZONE,
                })
              : "—"}
          </p>
          <p className="mt-1 text-xl text-muted-foreground sm:text-2xl">
            {now
              ? now.toLocaleDateString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  timeZone: HOUSEHOLD_TIMEZONE,
                })
              : ""}
          </p>
        </div>
        <Link
          to="/home"
          className="inline-flex min-h-[44px] items-center rounded-xl border px-4 py-2 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          Exit kitchen mode
        </Link>
      </header>
      <div className="mt-10">{body}</div>
    </main>
  );
}
