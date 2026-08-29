import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlanMealDialog } from "@/components/food/PlanMealDialog";
import { CorrectInventoryDialog } from "@/components/food/CorrectInventoryDialog";
import { MealActions } from "@/components/food/MealActions";
import {
  formatDay,
  formatDayTime,
  formatTime,
  isNeedsYou,
  isUpcoming,
  severityTone,
  todayKey,
  tomorrowKey,
  useHomeData,
  useHouseholdMembership,
  type AttentionItem,
  type MealItem,
} from "@/lib/household";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Today at Home — Household OS" },
      {
        name: "description",
        content:
          "A calm read-only view of today's household plan: schedule, what needs you, meals, and shopping.",
      },
      { property: "og:title", content: "Today at Home — Household OS" },
      {
        property: "og:description",
        content: "A calm read-only view of today's household plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Card({ children, tone }: { children: React.ReactNode; tone?: string }) {
  const border =
    tone === "critical"
      ? "border-l-4 border-l-critical"
      : tone === "due"
        ? "border-l-4 border-l-warning"
        : "";
  return <div className={`rounded-xl border bg-card p-4 shadow-sm ${border}`}>{children}</div>;
}

function AttentionCard({ item }: { item: AttentionItem }) {
  const tone = severityTone(item.severity);
  return (
    <Card tone={tone}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium text-foreground">{item.title ?? item.attention_type}</p>
        {item.due_at && (
          <span className="text-xs text-muted-foreground">{formatDayTime(item.due_at)}</span>
        )}
      </div>
      {item.human_action && (
        <p className="mt-1 text-sm text-muted-foreground">{item.human_action}</p>
      )}
      {item.domain && (
        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{item.domain}</p>
      )}
    </Card>
  );
}

function MealCard({ label, meals }: { label: string; meals: MealItem[] }) {
  if (meals.length === 0) return null;
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-3">
        {meals.map((meal, i) => (
          <div key={meal.planned_meal_id ?? `${label}-${i}`}>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <p className="text-lg font-medium text-foreground">
                {meal.recipe_name ?? meal.plan_type ?? "Planned meal"}
              </p>
              {meal.meal_slot && (
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {meal.meal_slot}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {meal.feasibility && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                  {meal.feasibility}
                </span>
              )}
              {meal.status && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                  {meal.status}
                </span>
              )}
              {!!meal.thaw_count && (
                <span className="rounded-full bg-warning/20 px-2.5 py-1 text-foreground">
                  thaw {meal.thaw_count}
                </span>
              )}
              {!!meal.missing_count && (
                <span className="rounded-full bg-critical/15 px-2.5 py-1 text-foreground">
                  missing {meal.missing_count}
                </span>
              )}
              {!!meal.unknown_count && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                  unknown {meal.unknown_count}
                </span>
              )}
            </div>
            {meal.notes && <p className="mt-2 text-sm text-muted-foreground">{meal.notes}</p>}
            <MealActions meal={meal} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;
  const data = useHomeData(isMember);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const needsYou = data.attention.filter(isNeedsYou);
  const comingUp = data.attention.filter(isUpcoming).slice(0, 4);
  const tonight = data.meals.filter((m) => m.planned_for === todayKey());
  const tomorrow = data.meals.filter((m) => m.planned_for === tomorrowKey());

  const header = (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Today at home
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: "America/Chicago",
          })}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isMember && (
          <>
            <PlanMealDialog enabled={isMember} />
            <CorrectInventoryDialog enabled={isMember} />
          </>
        )}
        <Button variant="ghost" size="sm" className="h-10" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );

  let body: React.ReactNode;

  if (membership.isPending || data.isLoading) {
    body = <p className="text-sm text-muted-foreground">Loading your household…</p>;
  } else if (membership.error) {
    body = (
      <Card>
        <p className="font-medium text-foreground">Couldn't check household access</p>
        <p className="mt-1 text-sm text-muted-foreground">{(membership.error as Error).message}</p>
      </Card>
    );
  } else if (!isMember) {
    body = (
      <Card tone="critical">
        <p className="font-medium text-foreground">Household access not configured</p>
        <p className="mt-1 text-sm text-muted-foreground">
          You're signed in, but this account isn't a member of the “home” household yet. Ask a
          household admin to add your user to household_memberships.
        </p>
      </Card>
    );
  } else if (data.errorMessage) {
    body = (
      <Card>
        <p className="font-medium text-foreground">Couldn't load household data</p>
        <p className="mt-1 text-sm text-muted-foreground">{data.errorMessage}</p>
      </Card>
    );
  } else {
    const hasAnything =
      data.timeline.length > 0 ||
      needsYou.length > 0 ||
      tonight.length + tomorrow.length > 0 ||
      data.shopping.length > 0 ||
      comingUp.length > 0;

    body = (
      <div className="space-y-8">
        {data.timeline.length > 0 && (
          <Section title="Today">
            <div className="space-y-2">
              {data.timeline.map((item, i) => {
                const informational = item.item_type !== "calendar_event";
                return (
                  <Card key={item.entity_id ?? `timeline-${i}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {item.all_day ? "All day" : formatTime(item.starts_at)}
                        {!item.all_day && item.ends_at ? ` – ${formatTime(item.ends_at)}` : ""}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {item.location && <span>{item.location}</span>}
                      {informational && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
                          informational
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </Section>
        )}

        {needsYou.length > 0 && (
          <Section title="Needs you">
            <div className="grid gap-3 sm:grid-cols-2">
              {needsYou.map((item, i) => (
                <AttentionCard key={item.entity_id ?? `needs-${i}`} item={item} />
              ))}
            </div>
          </Section>
        )}

        {tonight.length + tomorrow.length > 0 && (
          <Section title="Meals">
            <div className="grid gap-3 sm:grid-cols-2">
              <MealCard label="Tonight" meals={tonight} />
              <MealCard label={`Tomorrow · ${formatDay(tomorrowKey()) ?? ""}`} meals={tomorrow} />
            </div>
          </Section>
        )}

        {data.shopping.length > 0 && (
          <Section title="Shopping">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.shopping.map((store, i) => (
                <Card key={store.store_name ?? `store-${i}`}>
                  <p className="font-medium text-foreground">{store.store_name ?? "Store"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {store.item_count ?? 0} item{store.item_count === 1 ? "" : "s"}
                    {store.urgent_count ? ` · ${store.urgent_count} urgent` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {store.next_needed_by && (
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                        needed by {formatDay(store.next_needed_by) ?? store.next_needed_by}
                      </span>
                    )}
                    {store.dog_food_included && (
                      <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                        dog food
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {comingUp.length > 0 && (
          <Section title="Coming up">
            <div className="grid gap-3 sm:grid-cols-2">
              {comingUp.map((item, i) => (
                <AttentionCard key={item.entity_id ?? `upcoming-${i}`} item={item} />
              ))}
            </div>
          </Section>
        )}

        {!hasAnything && (
          <p className="text-sm text-muted-foreground">
            Nothing needs you right now. Enjoy the quiet.
          </p>
        )}
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      {header}
      <div className="mt-8">{body}</div>
    </main>
  );
}
