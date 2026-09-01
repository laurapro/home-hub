import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, UnavailableDetail } from "@/components/DetailPage";
import { MealActions } from "@/components/food/MealActions";
import { formatDay, useHouseholdMembership } from "@/lib/household";
import { parseMissingItems, parseThawItems, parseUnknownItems, usePlannedMeal } from "@/lib/food";

export const Route = createFileRoute("/_authenticated/meals/$plannedMealId")({
  component: MealDetailPage,
});

function ItemList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <ul className="mt-2 space-y-1 text-sm text-foreground">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="break-words">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MealDetailPage() {
  const { plannedMealId } = Route.useParams();
  const membership = useHouseholdMembership();
  const meal = usePlannedMeal(plannedMealId, !!membership.data);
  const value = meal.data;

  const missing = parseMissingItems(value?.missing_items).map((item) => item.item);
  const unknown = parseUnknownItems(value?.unknown_items).map((item) => item.item);
  const thaw = parseThawItems(value?.thaw_items).map((item) => item.item);

  return (
    <DetailPage
      title={value?.recipe_name ?? value?.plan_type ?? "Planned meal"}
      eyebrow="Planned meal"
    >
      {membership.isPending || meal.isPending ? (
        <p className="text-sm text-muted-foreground">Loading meal…</p>
      ) : membership.error || meal.error ? (
        <p className="text-sm text-critical">
          {((membership.error ?? meal.error) as Error).message}
        </p>
      ) : !membership.data || !value ? (
        <UnavailableDetail />
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap gap-2 text-xs">
              {value.planned_for && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                  {formatDay(value.planned_for)}
                </span>
              )}
              {value.meal_slot && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                  {value.meal_slot}
                </span>
              )}
              {value.feasibility && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                  {value.feasibility}
                </span>
              )}
              {value.status && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                  {value.status}
                </span>
              )}
            </div>
            {value.notes && (
              <p className="mt-4 break-words text-sm text-muted-foreground">{value.notes}</p>
            )}
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <ItemList title="Thaw" items={thaw} />
              <ItemList title="Missing" items={missing} />
              <ItemList title="Unknown" items={unknown} />
            </div>
          </div>
          <MealActions meal={value} />
        </div>
      )}
    </DetailPage>
  );
}
