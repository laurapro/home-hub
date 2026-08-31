import { useMemo, useState } from "react";
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
  correctFoodInventory,
  useFoodAction,
  useFoodInventory,
} from "@/lib/food";

export function CorrectInventoryDialog({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [inventoryId, setInventoryId] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [mealsRemaining, setMealsRemaining] = useState("");
  const [markOpened, setMarkOpened] = useState(false);

  const inventory = useFoodInventory(enabled && open);
  const action = useFoodAction(correctFoodInventory, "Inventory corrected");

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
    action.mutate(
      {
        p_inventory_id: inventoryId,
        ...(status ? { p_status: status } : {}),
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

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-10">
          Correct inventory
        </Button>
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
            <p className="text-xs text-muted-foreground">
              Currently {selected.status ?? "unknown"}
              {isMealsMode
                ? ` · ${selected.meals_remaining ?? 0} meals left`
                : selected.quantity != null
                  ? ` · ${selected.quantity} ${selected.quantity_unit ?? ""}`.trimEnd()
                  : ""}
            </p>
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
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (optional)</Label>
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
