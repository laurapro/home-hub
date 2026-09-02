import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INVENTORY_STATUSES,
  inventoryQuickCorrection,
  useInventoryCorrectionAction,
  useFoodInventory,
  type InventoryQuickAction,
} from "@/lib/food";

export function CorrectInventoryDialog({
  enabled,
  inventoryId: initialInventoryId = "",
  trigger,
}: {
  enabled: boolean;
  inventoryId?: string;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [inventoryId, setInventoryId] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [mealsRemaining, setMealsRemaining] = useState("");
  const [markOpened, setMarkOpened] = useState(false);

  const inventory = useFoodInventory(enabled && open);
  const action = useInventoryCorrectionAction();

  const selected = useMemo(
    () => (inventory.data ?? []).find((row) => row.inventory_id === inventoryId),
    [inventory.data, inventoryId],
  );
  const isMealsMode = selected?.tracking_mode === "meals";

  function reset() {
    setInventoryId("");
    setStatus("");
    setQuantity("");
    setUnit("");
    setMealsRemaining("");
    setMarkOpened(false);
  }

  const hasChange =
    !!inventoryId &&
    (status !== "" || quantity !== "" || unit !== "" || mealsRemaining !== "" || markOpened);

  function submit() {
    const editedAmount = isMealsMode ? mealsRemaining : quantity;
    const inferredStatus =
      editedAmount !== ""
        ? Number(editedAmount) === 0
          ? "out"
          : selected?.status === "out"
            ? "some"
            : ""
        : "";
    action.mutate(
      {
        p_inventory_id: inventoryId,
        ...(status || inferredStatus ? { p_status: status || inferredStatus } : {}),
        ...(!isMealsMode && quantity !== "" ? { p_quantity: Number(quantity) } : {}),
        ...(!isMealsMode && unit !== "" ? { p_quantity_unit: unit } : {}),
        ...(isMealsMode && mealsRemaining !== ""
          ? { p_meals_remaining: Number(mealsRemaining) }
          : {}),
        p_mark_opened: markOpened,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  }

  function runQuick(actionName: InventoryQuickAction) {
    if (!selected) return;
    action.mutate(inventoryQuickCorrection(selected, actionName), {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  }

  function adjustNumber(kind: "quantity" | "meals", amount: number) {
    if (!selected) return;
    if (kind === "meals") {
      const current =
        mealsRemaining === "" ? (selected.meals_remaining ?? 0) : Number(mealsRemaining);
      setMealsRemaining(String(Math.max(0, current + amount)));
      return;
    }
    const current = quantity === "" ? (selected.quantity ?? 0) : Number(quantity);
    setQuantity(String(Math.max(0, current + amount)));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setInventoryId(initialInventoryId);
        else reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline" className="h-11">
            Correct inventory
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Correct inventory</DialogTitle>
          <DialogDescription>
            Every submission is recorded as a correction, so submit once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Item</Label>
            <Select value={inventoryId} onValueChange={setInventoryId}>
              <SelectTrigger className="h-11">
                <SelectValue
                  placeholder={inventory.isPending ? "Loading inventory…" : "Choose an item"}
                />
              </SelectTrigger>
              <SelectContent>
                {(inventory.data ?? []).map((row) => (
                  <SelectItem key={row.inventory_id} value={row.inventory_id}>
                    {row.item_name} · {row.location_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {inventory.error && (
              <p className="text-xs text-critical">{(inventory.error as Error).message}</p>
            )}
          </div>

          {selected && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Currently {selected.status ?? "unknown"}
                {isMealsMode
                  ? ` · ${selected.meals_remaining ?? 0} meals left`
                  : selected.quantity != null
                    ? ` · ${selected.quantity} ${selected.quantity_unit ?? ""}`.trimEnd()
                    : ""}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  disabled={action.isPending || selected.status === "out"}
                  onClick={() => runQuick("used_some")}
                >
                  Used some
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  disabled={action.isPending || selected.status === "out"}
                  onClick={() => runQuick("finished")}
                >
                  Finished
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  disabled={action.isPending || selected.status === "out"}
                  onClick={() => runQuick("still_have")}
                >
                  Still have it
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                “Used some” removes one tracked unit or moves the status down one level.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Status (optional)</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Leave unchanged" />
              </SelectTrigger>
              <SelectContent>
                {INVENTORY_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isMealsMode ? (
            <div className="space-y-2">
              <Label htmlFor="meals-remaining">Meals remaining (optional)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => adjustNumber("meals", -1)}
                >
                  −1
                </Button>
                <Input
                  id="meals-remaining"
                  className="h-11"
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  value={mealsRemaining}
                  onChange={(e) => setMealsRemaining(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={() => adjustNumber("meals", 1)}
                >
                  +1
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (optional)</Label>
                <div className="flex gap-2 sm:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => adjustNumber("quantity", -1)}
                  >
                    −1
                  </Button>
                  <Input
                    id="quantity"
                    className="h-11"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => adjustNumber("quantity", 1)}
                  >
                    +1
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit (optional)</Label>
                <Input
                  id="unit"
                  className="h-11"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder={selected?.quantity_unit ?? "e.g. lb"}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="mark-opened">Mark as opened</Label>
            <Switch id="mark-opened" checked={markOpened} onCheckedChange={setMarkOpened} />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto"
            disabled={!hasChange || action.isPending}
            onClick={submit}
          >
            {action.isPending ? "Saving…" : "Save correction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
