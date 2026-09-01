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
  addPlannedMealItemToShopping,
  cancelFoodMeal,
  completeFoodMeal,
  completeFoodThaw,
  parseMissingItems,
  parseThawItems,
  useFoodAction,
} from "@/lib/food";
import type { MealItem } from "@/lib/household";

const INACTIVE_STATUSES = new Set(["completed", "cancelled", "canceled", "skipped"]);

type ActionableMeal = Pick<MealItem, "planned_meal_id" | "status" | "thaw_items" | "missing_items">;

export function MealActions({ meal }: { meal: ActionableMeal }) {
  const [confirm, setConfirm] = useState<null | "complete" | "cancel">(null);
  const plannedMealId = meal.planned_meal_id;

  const complete = useFoodAction(completeFoodMeal, "Meal completed");
  const cancel = useFoodAction(cancelFoodMeal, "Meal cancelled");
  const thaw = useFoodAction(completeFoodThaw, "Thaw logged");
  const toShopping = useFoodAction(addPlannedMealItemToShopping, "Added to shopping");

  if (!plannedMealId) return null;
  if (meal.status && INACTIVE_STATUSES.has(meal.status)) return null;

  const thawItems = parseThawItems(meal.thaw_items);
  const missingItems = parseMissingItems(meal.missing_items);
  const busy = complete.isPending || cancel.isPending;

  return (
    <div className="mt-3 space-y-3">
      {thawItems.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {thawItems.map((item) => (
            <Button
              key={`thaw-${item.item_id}`}
              size="sm"
              variant="outline"
              className="h-11"
              disabled={thaw.isPending}
              onClick={() =>
                thaw.mutate({ p_planned_meal_id: plannedMealId, p_item_id: item.item_id })
              }
            >
              Thaw {item.item}
            </Button>
          ))}
        </div>
      )}

      {missingItems.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {missingItems.map((item) => (
            <Button
              key={`missing-${item.item_id}`}
              size="sm"
              variant="outline"
              className="h-11"
              disabled={toShopping.isPending}
              onClick={() =>
                toShopping.mutate({ p_planned_meal_id: plannedMealId, p_item_id: item.item_id })
              }
            >
              Add {item.item} to shopping
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button size="sm" className="h-11" disabled={busy} onClick={() => setConfirm("complete")}>
          Complete meal
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-11"
          disabled={busy}
          onClick={() => setConfirm("cancel")}
        >
          Cancel meal
        </Button>
      </div>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "cancel" ? "Cancel this meal?" : "Mark this meal complete?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "cancel"
                ? "The planned meal will be cancelled in the household record."
                : "Portions will use the recipe servings recorded in the household record."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <AlertDialogCancel disabled={busy}>Keep as is</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                const action = confirm;
                setConfirm(null);
                if (action === "cancel") cancel.mutate({ p_planned_meal_id: plannedMealId });
                if (action === "complete") complete.mutate({ p_planned_meal_id: plannedMealId });
              }}
            >
              {confirm === "cancel" ? "Cancel meal" : "Complete meal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
