import { useFoodInventory, type InventoryOption } from "@/lib/food";
import { cn } from "@/lib/utils";
import { HomeSectionState } from "@/components/home/HomeSectionState";

function statusClasses(status: string | null) {
  if (status === "out") return "bg-critical/10 text-critical";
  if (status === "low") return "bg-warning/10 text-warning-foreground";
  if (status === "plenty" || status === "some") return "bg-secondary text-secondary-foreground";
  return "bg-muted text-muted-foreground";
}

function amountLabel(item: InventoryOption): string | null {
  if (item.tracking_mode === "meals" && item.meals_remaining != null) {
    const n = Number(item.meals_remaining);
    return `${n} ${n === 1 ? "meal" : "meals"} left`;
  }
  if (item.quantity != null) {
    return `${Number(item.quantity)}${item.quantity_unit ? ` ${item.quantity_unit}` : ""}`;
  }
  return null;
}

export function InventoryList({
  enabled,
  locationType,
  emptyMessage,
}: {
  enabled: boolean;
  locationType: string;
  emptyMessage: string;
}) {
  const query = useFoodInventory(enabled);
  const items = (query.data ?? [])
    .filter((item) => item.location_type === locationType)
    .sort((a, b) => (a.item_name ?? "").localeCompare(b.item_name ?? ""));

  return (
    <HomeSectionState
      query={query}
      isEmpty={items.length === 0}
      loadingMessage="Loading items…"
      emptyMessage={emptyMessage}
      errorMessage="Couldn't load this list."
    >
      <ul className="space-y-2">
        {items.map((item) => {
          const amount = amountLabel(item);
          return (
            <li
              key={item.inventory_id}
              className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{item.item_name}</p>
                {amount && <p className="mt-0.5 text-sm text-muted-foreground">{amount}</p>}
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                  statusClasses(item.status),
                )}
              >
                {item.status ?? "unknown"}
              </span>
            </li>
          );
        })}
      </ul>
    </HomeSectionState>
  );
}
