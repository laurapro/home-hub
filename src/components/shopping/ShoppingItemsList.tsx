import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  reconcileShoppingItemInventory,
  restoreShoppingItem,
  skipShoppingItem,
  useShoppingAction,
  useShoppingItems,
  useShoppingInventoryMatches,
  useSetShoppingItemStore,
  useStores,
  type ShoppingItem,
  type Store,
} from "@/lib/shopping";
import { groupShoppingItemsByStore, UNCATEGORIZED_STORE_KEY } from "@/lib/shopping-groups";
import { HOUSEHOLD_SLUG, formatDay } from "@/lib/household";

type PendingAction = { kind: "complete" | "skip" | "reconcile"; item: ShoppingItem } | null;
const NO_STORE = "__none__";

function ItemRow({
  item,
  stores,
  storeBusy,
  onStoreChange,
  children,
}: {
  item: ShoppingItem;
  stores: Store[];
  storeBusy: boolean;
  onStoreChange: (item: ShoppingItem, storeId: string) => void;
  children?: React.ReactNode;
}) {
  const label = item.item_name ?? item.custom_name ?? "Item";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-shopping/70 p-3">
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
          {item.needed_by && formatDay(item.needed_by) && (
            <span>needed by {formatDay(item.needed_by)}</span>
          )}
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        <Select
          value={item.store_id ?? NO_STORE}
          onValueChange={(value) => onStoreChange(item, value)}
          disabled={storeBusy}
        >
          <SelectTrigger
            className="h-11 min-w-0 flex-1 bg-background sm:w-[150px] sm:flex-none"
            aria-label={`Store for ${label}`}
          >
            <SelectValue placeholder="Uncategorized" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_STORE}>Uncategorized</SelectItem>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {children}
      </div>
    </div>
  );
}

export function ShoppingItemsList({
  enabled,
  defaultExpanded = false,
  showToggle = true,
}: {
  enabled: boolean;
  defaultExpanded?: boolean;
  showToggle?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [confirm, setConfirm] = useState<PendingAction>(null);
  const [expandedStoreGroups, setExpandedStoreGroups] = useState<string[] | null>(null);

  const items = useShoppingItems(enabled && expanded);
  const complete = useShoppingAction(completeShoppingItem, "Marked as purchased");
  const reconcile = useShoppingAction(
    reconcileShoppingItemInventory,
    "Added purchase to inventory",
  );
  const skip = useShoppingAction(skipShoppingItem, "Skipped");
  const restore = useShoppingAction(restoreShoppingItem, "Restored to list");
  const stores = useStores(enabled && expanded);
  const inventoryMatches = useShoppingInventoryMatches(enabled && expanded);
  const setStore = useSetShoppingItemStore(stores.data ?? []);
  const busy =
    complete.isPending ||
    reconcile.isPending ||
    skip.isPending ||
    restore.isPending ||
    setStore.isPending;

  const all = items.data ?? [];
  const open = all.filter(isOpenShoppingItem);
  const recent = all.filter(isRecentlyResolved);
  const matchByShoppingItem = new Map(
    (inventoryMatches.data ?? []).map((match) => [match.shopping_item_id, match]),
  );
  const storeGroups = groupShoppingItemsByStore(open, stores.data ?? []);

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
    if (action.kind === "reconcile") reconcile.mutate(args);
  }

  function changeStore(item: ShoppingItem, storeId: string) {
    const targetGroup = storeId === NO_STORE ? UNCATEGORIZED_STORE_KEY : storeId;
    setExpandedStoreGroups((current) => [
      ...new Set([...(current ?? storeGroups.map((group) => group.key)), targetGroup]),
    ]);
    setStore.mutate({
      p_household_slug: HOUSEHOLD_SLUG,
      p_shopping_item_id: item.id,
      p_store_id: storeId === NO_STORE ? null : storeId,
    });
  }

  return (
    <div className="space-y-3">
      {showToggle && (
        <Button
          size="sm"
          variant="ghost"
          className="h-11 px-2"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide items" : "View items"}
        </Button>
      )}

      {expanded && (
        <div className="space-y-4">
          {items.isPending && <p className="text-sm text-muted-foreground">Loading items…</p>}
          {items.error && <p className="text-sm text-critical">{(items.error as Error).message}</p>}
          {stores.error && (
            <p className="text-sm text-critical">{(stores.error as Error).message}</p>
          )}

          {!items.isPending && !items.error && (
            <>
              {open.length > 0 ? (
                <Accordion
                  type="multiple"
                  value={expandedStoreGroups ?? storeGroups.map((group) => group.key)}
                  onValueChange={setExpandedStoreGroups}
                  className="space-y-3"
                >
                  {storeGroups.map((group) => (
                    <AccordionItem
                      key={group.key}
                      value={group.key}
                      className="rounded-xl border bg-card px-3"
                    >
                      <AccordionTrigger className="min-w-0 py-3 hover:no-underline">
                        <span className="flex min-w-0 items-center gap-2 text-left">
                          <span className="truncate">{group.name}</span>
                          <span className="shrink-0 text-xs font-normal text-muted-foreground">
                            {group.items.length} {group.items.length === 1 ? "item" : "items"}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {group.items.map((item) => (
                          <ItemRow
                            key={item.id}
                            item={item}
                            stores={stores.data ?? []}
                            storeBusy={setStore.isPending}
                            onStoreChange={changeStore}
                          >
                            <Button
                              size="sm"
                              className="h-11"
                              disabled={busy}
                              onClick={() => setConfirm({ kind: "complete", item })}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-11"
                              disabled={busy}
                              onClick={() => setConfirm({ kind: "skip", item })}
                            >
                              Skip
                            </Button>
                          </ItemRow>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground">No open shopping items.</p>
              )}

              {recent.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recently purchased or skipped
                  </p>
                  {recent.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      stores={stores.data ?? []}
                      storeBusy={setStore.isPending}
                      onStoreChange={changeStore}
                    >
                      {matchByShoppingItem.get(item.id) &&
                        (matchByShoppingItem.get(item.id)?.inventory_reconciled_at ? (
                          <span className="px-2 text-sm text-muted-foreground">
                            Added to inventory
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            className="h-11"
                            disabled={busy}
                            onClick={() => setConfirm({ kind: "reconcile", item })}
                          >
                            Put away
                          </Button>
                        ))}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-11"
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
              {confirm?.kind === "complete"
                ? "Mark item as purchased?"
                : confirm?.kind === "reconcile"
                  ? "Add this purchase to inventory?"
                  : "Skip this item?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "complete"
                ? "The item will be recorded as purchased in the household record."
                : confirm?.kind === "reconcile"
                  ? `Add ${confirm.item.quantity ?? 1}${confirm.item.unit ? ` ${confirm.item.unit}` : ""} to ${matchByShoppingItem.get(confirm.item.id)?.location_name ?? "inventory"}. This only happens after you confirm.`
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
              {confirm?.kind === "complete"
                ? "Complete"
                : confirm?.kind === "reconcile"
                  ? "Add to inventory"
                  : "Skip"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
