import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  completeShoppingItem,
  isOpenShoppingItem,
  isRecentlyResolved,
  restoreShoppingItem,
  skipShoppingItem,
  useShoppingAction,
  useShoppingItems,
  type ShoppingItem,
} from "@/lib/shopping";
import { HOUSEHOLD_SLUG, formatDay } from "@/lib/household";

type PendingAction = { kind: "complete" | "skip"; item: ShoppingItem } | null;

function ItemRow({
  item,
  children,
}: {
  item: ShoppingItem;
  children?: React.ReactNode;
}) {
  const label = item.item_name ?? item.custom_name ?? "Item";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3">
      <div className="min-w-0">
        <p className="font-medium text-foreground">
          {label}
          {item.quantity != null && (
            <span className="ml-1 text-sm text-muted-foreground">
              × {item.quantity}
              {item.unit ? ` ${item.unit}` : ""}
            </span>
          )}
        </p>
        <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
          {item.store_name && <span>{item.store_name}</span>}
          {item.priority && item.priority !== "normal" && <span>{item.priority}</span>}
          {item.needed_by && <span>needed by {formatDay(item.needed_by) ?? item.needed_by}</span>}
        </div>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function ShoppingItemsList({ enabled }: { enabled: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [confirm, setConfirm] = useState<PendingAction>(null);

  const items = useShoppingItems(enabled && expanded);
  const complete = useShoppingAction(completeShoppingItem, "Marked as purchased");
  const skip = useShoppingAction(skipShoppingItem, "Skipped");
  const restore = useShoppingAction(restoreShoppingItem, "Restored to list");
  const busy = complete.isPending || skip.isPending || restore.isPending;

  const all = items.data ?? [];
  const open = all.filter(isOpenShoppingItem);
  const recent = all.filter(isRecentlyResolved);

  function runConfirmed() {
    const action = confirm;
    setConfirm(null);
    if (!action) return;
    const args = {
      p_household_slug: HOUSEHOLD_SLUG,
      p_shopping_item_id: action.item.id,
    };
    if (action.kind === "complete") complete.mutate(args);
    if (action.kind === "skip") skip.mutate(args);
  }

  return (
    <div className="space-y-3">
      <Button
        size="sm"
        variant="ghost"
        className="h-10 px-2"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "Hide items" : "View items"}
      </Button>

      {expanded && (
        <div className="space-y-4">
          {items.isPending && <p className="text-sm text-muted-foreground">Loading items…</p>}
          {items.error && (
            <p className="text-sm text-critical">{(items.error as Error).message}</p>
          )}

          {!items.isPending && !items.error && (
            <>
              {open.length > 0 ? (
                <div className="space-y-2">
                  {open.map((item) => (
                    <ItemRow key={item.id} item={item}>
                      <Button
                        size="sm"
                        className="h-10"
                        disabled={busy}
                        onClick={() => setConfirm({ kind: "complete", item })}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10"
                        disabled={busy}
                        onClick={() => setConfirm({ kind: "skip", item })}
                      >
                        Skip
                      </Button>
                    </ItemRow>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No open shopping items.</p>
              )}

              {recent.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recently purchased or skipped
                  </p>
                  {recent.map((item) => (
                    <ItemRow key={item.id} item={item}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10"
                        disabled={busy}
                        onClick={() =>
                          restore.mutate({
                            p_household_slug: HOUSEHOLD_SLUG,
                            p_shopping_item_id: item.id,
                          })
                        }
                      >
                        Restore
                      </Button>
                    </ItemRow>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "complete" ? "Mark item as purchased?" : "Skip this item?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "complete"
                ? "The item will be recorded as purchased in the household record."
                : "The item will be skipped for this shopping trip."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Keep as is</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                runConfirmed();
              }}
            >
              {confirm?.kind === "complete" ? "Complete" : "Skip"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
