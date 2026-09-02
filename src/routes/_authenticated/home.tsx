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
import { HomeSectionState } from "@/components/home/HomeSectionState";
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
  type TimelineItem,
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

function Card({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone?: string;
  className?: string;
}) {
  return <div className={cn(cardClasses(tone), className)}>{children}</div>;
}

function domainLabelClasses(domain: string | null) {
  if (domain === "food") return "bg-food text-food-foreground";
  if (domain === "shopping") return "bg-shopping text-shopping-foreground";
  if (domain === "projects") return "bg-projects text-projects-foreground";
  if (domain === "pets") return "bg-pets text-pets-foreground";
  return "bg-secondary text-secondary-foreground";
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

function ScheduleList({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isCalendar = item.item_type === "calendar_event" || item.item_type === "calendar";
        return (
          <Card
            key={item.entity_id ?? `timeline-${i}`}
            className={isCalendar ? "bg-calendar/75" : "bg-routine/75"}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium text-foreground">{item.title}</p>
              <span className="text-sm tabular-nums text-muted-foreground">
                {item.all_day ? "All day" : formatTime(item.starts_at)}
                {!item.all_day && item.ends_at ? ` – ${formatTime(item.ends_at)}` : ""}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {item.location && <span>{item.location}</span>}
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 font-medium",
                  isCalendar
                    ? "bg-calendar text-calendar-foreground"
                    : "bg-routine text-routine-foreground",
                )}
              >
                {isCalendar ? "Calendar" : "Routine"}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
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
          <p
            className={cn(
              "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
              domainLabelClasses(item.domain),
            )}
          >
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
          <p
            className={cn(
              "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
              domainLabelClasses(item.domain),
            )}
          >
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
            className="overflow-hidden rounded-xl border bg-food/75 shadow-sm"
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

/** Compact side card: inventory the household could use up soon. */
function UseSoonCard({ items }: { items: AttentionItem[] }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border bg-food/75 shadow-sm">
        <ul className="divide-y divide-border/70">
          {items.map((item, i) => (
            <li key={item.entity_id ?? `use-soon-${i}`}>
              <CorrectInventoryDialog
                enabled
                inventoryId={item.entity_id ?? ""}
                trigger={
                  <button
                    type="button"
                    className={cn(
                      "group flex w-full items-center gap-3 p-4 text-left",
                      getInteractiveCardClasses(),
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="break-words text-sm font-medium text-foreground">
                          {item.title ?? item.attention_type}
                        </p>
                        {item.due_at && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatDay(item.due_at)}
                          </span>
                        )}
                      </div>
                      {item.human_action && (
                        <p className="mt-0.5 break-words text-xs text-muted-foreground">
                          {item.human_action}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </button>
                }
              />
            </li>
          ))}
        </ul>
      </div>
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
  const timeline = data.timeline;
  const tomorrowTimeline = data.tomorrowTimeline;
  const attention = data.attention;
  const meals = data.meals;
  const shoppingStores = data.shopping;

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  // Shopping-list items live in the Shopping section; inventory "use soon"
  // nudges get their own compact card. Neither belongs in Needs you.
  const isShoppingListItem = (item: AttentionItem) => item.entity_type === "shopping_item";
  const isUseSoon = (item: AttentionItem) => item.entity_type === "inventory";

  const needsYou = attention.filter(
    (item) => isNeedsYou(item) && !isShoppingListItem(item) && !isUseSoon(item),
  );
  const useSoon = attention.filter(isUseSoon);
  const comingUp = attention
    .filter((item) => isUpcoming(item) && !isShoppingListItem(item) && !isUseSoon(item))
    .slice(0, 4);
  const hasProjectsAttention = attention.some((item) => item.domain === "projects");
  const tonight = meals.filter((m) => m.planned_for === todayKey());
  const tomorrow = meals.filter((m) => m.planned_for === tomorrowKey());

  const header = (
    <header className="sticky top-0 z-40 -mx-4 flex flex-wrap items-start justify-between gap-4 border-b bg-background/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:-mx-6 sm:px-6">
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

  if (membership.isPending) {
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
  } else {
    const shopping = shoppingStores.reduce(
      (summary, store) => {
        summary.itemCount += store.item_count ?? 0;
        summary.urgentCount += store.urgent_count ?? 0;
        summary.dogFoodIncluded ||= !!store.dog_food_included;
        if (
          store.next_needed_by &&
          (!summary.nextNeededBy || store.next_needed_by < summary.nextNeededBy)
        ) {
          summary.nextNeededBy = store.next_needed_by;
        }
        return summary;
      },
      { itemCount: 0, urgentCount: 0, dogFoodIncluded: false, nextNeededBy: null as string | null },
    );

    const hasAnything =
      timeline.length > 0 ||
      tomorrowTimeline.length > 0 ||
      needsYou.length > 0 ||
      tonight.length + tomorrow.length > 0 ||
      shoppingStores.length > 0 ||
      comingUp.length > 0 ||
      useSoon.length > 0 ||
      (projects.data?.length ?? 0) > 0 ||
      (pets.data?.length ?? 0) > 0 ||
      hasProjectsAttention;

    body = (
      <div className="grid items-start gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Section title="Today">
            <HomeSectionState
              query={data.queries.timeline}
              isEmpty={timeline.length === 0}
              loadingMessage="Loading today’s schedule…"
              emptyMessage="Nothing scheduled today."
              errorMessage="Today’s schedule is temporarily unavailable."
            >
              <ScheduleList items={timeline} />
            </HomeSectionState>
          </Section>

          <Section title="Needs you">
            <HomeSectionState
              query={data.queries.attention}
              isEmpty={needsYou.length === 0}
              loadingMessage="Loading household attention…"
              emptyMessage="Nothing needs you right now."
              errorMessage="Household attention is temporarily unavailable."
            >
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
            </HomeSectionState>
          </Section>

          <Section title="Meals">
            <HomeSectionState
              query={data.queries.meals}
              isEmpty={tonight.length + tomorrow.length === 0}
              loadingMessage="Loading meals…"
              emptyMessage="No meals planned for today or tomorrow."
              errorMessage="Meals are temporarily unavailable."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <MealCard label="Tonight" meals={tonight} />
                <MealCard label={`Tomorrow · ${formatDay(tomorrowKey()) ?? ""}`} meals={tomorrow} />
              </div>
            </HomeSectionState>
          </Section>

          <Section title="Shopping">
            <HomeSectionState
              query={data.queries.shopping}
              isEmpty={shoppingStores.length === 0}
              loadingMessage="Loading shopping…"
              emptyMessage="The shopping list is empty."
              errorMessage="Shopping is temporarily unavailable."
            >
              <Link
                to="/shopping"
                className={cn(cardClasses(undefined, true), "block bg-shopping/70")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">Shopping list</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {shopping.itemCount} item{shopping.itemCount === 1 ? "" : "s"}
                      {shopping.urgentCount ? ` · ${shopping.urgentCount} urgent` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {shopping.nextNeededBy && formatDay(shopping.nextNeededBy) && (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                          needed by {formatDay(shopping.nextNeededBy)}
                        </span>
                      )}
                      {shopping.dogFoodIncluded && (
                        <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                          dog food
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                </div>
              </Link>
              <ShoppingItemsList enabled={isMember} />
            </HomeSectionState>
          </Section>

          <Section title="Coming up">
            <HomeSectionState
              query={data.queries.attention}
              isEmpty={comingUp.length === 0}
              loadingMessage="Loading what’s coming up…"
              emptyMessage="Nothing coming up."
              errorMessage="Household attention is temporarily unavailable."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {comingUp.map((item, i) => (
                  <AttentionCard key={item.entity_id ?? `upcoming-${i}`} item={item} />
                ))}
              </div>
            </HomeSectionState>
          </Section>

          <PetsSection enabled={isMember} />

          <ProjectsSection enabled={isMember} hasAttention={hasProjectsAttention} />

          <Section title="Tomorrow" hint="FYI">
            <HomeSectionState
              query={data.queries.tomorrowTimeline}
              isEmpty={tomorrowTimeline.length === 0}
              loadingMessage="Loading tomorrow’s schedule…"
              emptyMessage="Nothing scheduled tomorrow."
              errorMessage="Tomorrow’s schedule is temporarily unavailable."
            >
              <ScheduleList items={tomorrowTimeline} />
            </HomeSectionState>
          </Section>

          {!hasAnything && (
            <p className="text-sm text-muted-foreground">
              Nothing needs you right now. Enjoy the quiet.
            </p>
          )}
        </div>

        {(data.queries.attention.isPending ||
          data.queries.attention.error ||
          useSoon.length > 0) && (
          <aside>
            <Section title="Use soon">
              <HomeSectionState
                query={data.queries.attention}
                isEmpty={useSoon.length === 0}
                loadingMessage="Loading items to use soon…"
                emptyMessage="Nothing to use soon."
                errorMessage="Household attention is temporarily unavailable."
              >
                <UseSoonCard items={useSoon} />
              </HomeSectionState>
            </Section>
          </aside>
        )}
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6 sm:pb-10">
      {header}
      <div className="mt-8">{body}</div>
    </main>
  );
}
