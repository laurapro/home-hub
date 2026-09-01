import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlanMealDialog } from "@/components/food/PlanMealDialog";
import { CorrectInventoryDialog } from "@/components/food/CorrectInventoryDialog";
import { MealActions } from "@/components/food/MealActions";
import { AddShoppingItemDialog } from "@/components/shopping/AddShoppingItemDialog";
import { ShoppingItemsList } from "@/components/shopping/ShoppingItemsList";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { PetsSection } from "@/components/pets/PetsSection";
import { InlineAttentionAction } from "@/components/home/InlineAttentionAction";
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
import { cn, getInteractiveCardClasses } from "@/lib/utils";
import { useProjects } from "@/lib/projects";
import { usePetsAttention, type PetAttention } from "@/lib/pets";

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
  return <div className={cardClasses(tone)}>{children}</div>;
}

function cardClasses(tone?: string, interactive = false) {
  const border =
    tone === "critical"
      ? "border-l-4 border-l-critical"
      : tone === "due"
        ? "border-l-4 border-l-warning"
        : "";
  return cn(
    "rounded-xl border bg-card p-4 shadow-sm",
    border,
    interactive && "group",
    interactive && getInteractiveCardClasses(),
  );
}

function AttentionCard({
  item,
  inlineAction = false,
  petAttention,
}: {
  item: AttentionItem;
  inlineAction?: boolean;
  petAttention?: PetAttention | undefined;
}) {
  const tone = severityTone(item.severity);
  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="break-words font-medium text-foreground">
            {item.title ?? item.attention_type}
          </p>
          {item.due_at && (
            <span className="text-xs text-muted-foreground">{formatDayTime(item.due_at)}</span>
          )}
        </div>
        {item.human_action && (
          <p className="mt-1 break-words text-sm text-muted-foreground">{item.human_action}</p>
        )}
        {item.domain && (
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
            {item.domain}
          </p>
        )}
      </div>
      <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
    </div>
  );

  const action = inlineAction ? (
    <InlineAttentionAction item={item} petAttention={petAttention} />
  ) : null;

  const linkedCard = (link: React.ReactNode) => (
    <div className={cn(cardClasses(tone), "flex overflow-hidden p-0")}>
      {action}
      {link}
    </div>
  );

  if (item.domain === "projects" && item.entity_id) {
    return linkedCard(
      <Link
        to="/projects/$projectId"
        params={{ projectId: item.entity_id }}
        className={cn(
          "min-w-0 flex-1 p-4",
          cardClasses(undefined, true),
          "rounded-none border-0 shadow-none",
        )}
      >
        {content}
      </Link>,
    );
  }
  if (item.domain === "pets") {
    return linkedCard(
      <Link
        to="/pets"
        className={cn(
          "min-w-0 flex-1 p-4",
          cardClasses(undefined, true),
          "rounded-none border-0 shadow-none",
        )}
      >
        {content}
      </Link>,
    );
  }
  if (item.domain === "shopping") {
    return linkedCard(
      <Link
        to="/shopping"
        className={cn(
          "min-w-0 flex-1 p-4",
          cardClasses(undefined, true),
          "rounded-none border-0 shadow-none",
        )}
      >
        {content}
      </Link>,
    );
  }
  if (item.domain === "food" && item.entity_type === "planned_meal" && item.entity_id) {
    return linkedCard(
      <Link
        to="/meals/$plannedMealId"
        params={{ plannedMealId: item.entity_id }}
        className={cn(
          "min-w-0 flex-1 p-4",
          cardClasses(undefined, true),
          "rounded-none border-0 shadow-none",
        )}
      >
        {content}
      </Link>,
    );
  }

  if (item.domain === "food" && item.entity_type === "shopping_item" && item.entity_id) {
    return linkedCard(
      <Link
        to="/shopping"
        className={cn(
          "min-w-0 flex-1 p-4",
          cardClasses(undefined, true),
          "rounded-none border-0 shadow-none",
        )}
      >
        {content}
      </Link>,
    );
  }

  return (
    <div className={cn(cardClasses(tone), action && "flex p-0")}>
      {action}
      <div className={cn("min-w-0 flex-1", action && "p-4")}>
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
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
            {item.domain}
          </p>
        )}
      </div>
    </div>
  );
}

function MealCard({ label, meals }: { label: string; meals: MealItem[] }) {
  if (meals.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="space-y-3">
        {meals.map((meal, i) => (
          <div
            key={meal.planned_meal_id ?? `${label}-${i}`}
            className="overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            {meal.planned_meal_id ? (
              <Link
                to="/meals/$plannedMealId"
                params={{ plannedMealId: meal.planned_meal_id }}
                className={cn("group block p-4", getInteractiveCardClasses())}
              >
                <div className="flex items-start justify-between gap-3">
                  <MealCardContent meal={meal} />
                  <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
              </Link>
            ) : (
              <div className="p-4">
                <MealCardContent meal={meal} />
              </div>
            )}
            <div className="border-t px-4 pb-4">
              <MealActions meal={meal} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MealCardContent({ meal }: { meal: MealItem }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <p className="break-words text-lg font-medium text-foreground">
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
      {meal.notes && <p className="mt-2 break-words text-sm text-muted-foreground">{meal.notes}</p>}
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;
  const data = useHomeData(isMember);
  const projects = useProjects(isMember);
  const pets = usePetsAttention(isMember);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const needsYou = data.attention.filter(isNeedsYou);
  const comingUp = data.attention.filter(isUpcoming).slice(0, 4);
  const hasProjectsAttention = data.attention.some((item) => item.domain === "projects");
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
            <AddShoppingItemDialog enabled={isMember} />
            <ProjectDialog
              trigger={
                <Button variant="outline" size="sm" className="h-11">
                  New project
                </Button>
              }
            />
          </>
        )}
        <Button variant="ghost" size="sm" className="h-11" asChild>
          <Link to="/kitchen">Kitchen mode</Link>
        </Button>
        <Button variant="ghost" size="sm" className="h-11" onClick={handleSignOut}>
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
      comingUp.length > 0 ||
      (projects.data?.length ?? 0) > 0 ||
      (pets.data?.length ?? 0) > 0 ||
      hasProjectsAttention;

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
                <AttentionCard
                  key={item.entity_id ?? `needs-${i}`}
                  item={item}
                  inlineAction
                  petAttention={pets.data?.find((pet) => pet.entity_id === item.entity_id)}
                />
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
                <Link
                  key={store.store_name ?? `store-${i}`}
                  to="/shopping"
                  className={cardClasses(undefined, true)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{store.store_name ?? "Store"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {store.item_count ?? 0} item{store.item_count === 1 ? "" : "s"}
                        {store.urgent_count ? ` · ${store.urgent_count} urgent` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {store.next_needed_by && formatDay(store.next_needed_by) && (
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                            needed by {formatDay(store.next_needed_by)}
                          </span>
                        )}
                        {store.dog_food_included && (
                          <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                            dog food
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                </Link>
              ))}
            </div>
            <ShoppingItemsList enabled={isMember} />
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

        <PetsSection enabled={isMember} />

        <ProjectsSection enabled={isMember} hasAttention={hasProjectsAttention} />

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
