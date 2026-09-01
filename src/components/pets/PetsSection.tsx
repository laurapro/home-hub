import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOUSEHOLD_SLUG, formatDay, formatDayTime } from "@/lib/household";
import { useMarkPetMedicationGiven, usePetsAttention, type PetAttention } from "@/lib/pets";
import { cn, getInteractiveCardClasses } from "@/lib/utils";

const ATTENTION_LABELS: Record<string, string> = {
  medication_overdue: "Overdue",
  medication_due: "Due",
  medication_upcoming: "Upcoming",
  medication_reorder_due: "Reorder due",
  medication_reorder_upcoming: "Reorder soon",
  medication_stock_unknown: "Count needed",
};

function metadataText(item: PetAttention, key: string): string | null {
  if (!item.metadata || typeof item.metadata !== "object" || Array.isArray(item.metadata)) {
    return null;
  }
  const value = item.metadata[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : null;
}

function PetsCard({ item, navigable }: { item: PetAttention; navigable: boolean }) {
  const given = useMarkPetMedicationGiven();
  const doseText = metadataText(item, "dose_text");
  const due = formatDayTime(item.due_at);
  const orderBy = formatDay(item.order_by_date);
  const canMarkGiven = item.can_mark_given && !!item.entity_id && !!item.scheduled_for;

  const content = (
    <div className="flex min-w-0 flex-1 gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="break-words font-medium text-foreground">
              {[item.pet_name, item.medication_name].filter(Boolean).join(" · ") || "Pet care"}
            </p>
            {doseText && (
              <p className="mt-1 break-words text-sm text-muted-foreground">{doseText}</p>
            )}
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            {ATTENTION_LABELS[item.attention_type] ?? "Pet care"}
          </span>
        </div>

        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          {due && <p>Due {due}</p>}
          {item.quantity_remaining !== null && (
            <p>
              Supply: {item.quantity_remaining}
              {item.quantity_unit ? ` ${item.quantity_unit}` : ""}
            </p>
          )}
          {orderBy && <p>Order by {orderBy}</p>}
          {!canMarkGiven && item.human_action && <p className="break-words">{item.human_action}</p>}
        </div>
      </div>
      {navigable && (
        <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      )}
    </div>
  );

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-sm">
      {navigable ? (
        <Link
          to="/pets"
          className={cn("group flex p-4", getInteractiveCardClasses())}
          aria-label="View Pets details"
        >
          {content}
        </Link>
      ) : (
        <div className="p-4">{content}</div>
      )}

      {canMarkGiven && (
        <div className="border-t px-4 py-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-24"
            disabled={given.isPending}
            onClick={() =>
              given.mutate({
                p_household_slug: HOUSEHOLD_SLUG,
                p_pet_medication_id: item.entity_id,
                p_scheduled_for: item.scheduled_for,
                p_confirm: true,
              })
            }
          >
            {given.isPending ? "Recording…" : "○ Given"}
          </Button>
        </div>
      )}
    </div>
  );
}

export function PetsContent({
  enabled,
  navigable = false,
}: {
  enabled: boolean;
  navigable?: boolean;
}) {
  const pets = usePetsAttention(enabled);
  const items = pets.data ?? [];

  if (!enabled || pets.isPending) {
    return <p className="text-sm text-muted-foreground">Loading Pets…</p>;
  }
  if (pets.error) return <p className="text-sm text-critical">{(pets.error as Error).message}</p>;
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>;
  }

  return <PetsCards items={items} navigable={navigable} />;
}

function PetsCards({ items, navigable }: { items: PetAttention[]; navigable: boolean }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <PetsCard
          key={`${item.attention_type}-${item.entity_id}-${item.scheduled_for ?? item.order_by_date}`}
          item={item}
          navigable={navigable}
        />
      ))}
    </div>
  );
}

export function PetsSection({ enabled }: { enabled: boolean }) {
  const pets = usePetsAttention(enabled);
  const items = pets.data ?? [];

  if (!enabled || pets.isPending || (!pets.error && items.length === 0)) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pets</h2>
      {pets.error ? (
        <p className="text-sm text-critical">{(pets.error as Error).message}</p>
      ) : (
        <PetsCards items={items} navigable />
      )}
    </section>
  );
}
