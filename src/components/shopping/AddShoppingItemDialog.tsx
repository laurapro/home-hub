import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHOPPING_PRIORITIES, addShoppingItem, useShoppingAction, useStores } from "@/lib/shopping";
import { HOUSEHOLD_SLUG } from "@/lib/household";

const NO_STORE = "__none__";

export function AddShoppingItemDialog({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [storeId, setStoreId] = useState(NO_STORE);
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("");
  const [priority, setPriority] = useState<string>("normal");

  const stores = useStores(enabled && open);
  const action = useShoppingAction(addShoppingItem, "Added to shopping");

  function reset() {
    setName("");
    setStoreId(NO_STORE);
    setQuantity("1");
    setUnit("");
    setPriority("normal");
  }

  const qty = Number(quantity);
  const canSubmit = name.trim() !== "" && Number.isFinite(qty) && qty > 0;

  function submit() {
    action.mutate(
      {
        p_household_slug: HOUSEHOLD_SLUG,
        p_name: name.trim(),
        ...(storeId !== NO_STORE ? { p_store_id: storeId } : {}),
        p_quantity: qty,
        ...(unit.trim() ? { p_unit: unit.trim() } : {}),
        p_priority: priority,
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
        <Button size="sm" variant="outline" className="h-11">
          Add shopping item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add shopping item</DialogTitle>
          <DialogDescription>Add one item to the household shopping list.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item</Label>
            <Input
              id="item-name"
              className="h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paper towels"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Store (optional)</Label>
            <Select value={storeId} onValueChange={setStoreId}>
              <SelectTrigger className="h-11">
                <SelectValue
                  placeholder={stores.isPending ? "Loading stores…" : "No store preference"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_STORE}>No store preference</SelectItem>
                {(stores.data ?? []).map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stores.error && (
              <p className="text-xs text-critical">{(stores.error as Error).message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-quantity">Quantity</Label>
              <Input
                id="item-quantity"
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
              <Label htmlFor="item-unit">Unit (optional)</Label>
              <Input
                id="item-unit"
                className="h-11"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. rolls"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHOPPING_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto"
            disabled={!canSubmit || action.isPending}
            onClick={submit}
          >
            {action.isPending ? "Adding…" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
