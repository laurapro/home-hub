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
import { Textarea } from "@/components/ui/textarea";
import { HOUSEHOLD_SLUG, todayKey, tomorrowKey } from "@/lib/household";
import { MEAL_SLOTS, planFoodMeal, useFoodAction, useFoodRecipes } from "@/lib/food";

export function PlanMealDialog({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [plannedFor, setPlannedFor] = useState(todayKey());
  const [mealSlot, setMealSlot] = useState<string>("dinner");
  const [planType, setPlanType] = useState<"planned" | "open">("planned");
  const [recipeId, setRecipeId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const recipes = useFoodRecipes(enabled && open);
  const action = useFoodAction(planFoodMeal, "Meal planned");

  const canSubmit = plannedFor !== "" && (planType === "open" || recipeId !== "");

  function submit() {
    action.mutate(
      {
        p_household_slug: HOUSEHOLD_SLUG,
        p_planned_for: plannedFor,
        p_meal_slot: mealSlot,
        p_plan_type: planType,
        ...(planType === "planned" ? { p_recipe_id: recipeId } : {}),
        ...(notes.trim() ? { p_notes: notes.trim() } : {}),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNotes("");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-10">
          Plan meal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plan a meal</DialogTitle>
          <DialogDescription>Pick a day and slot, then a recipe or an open meal.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planned-for">Date</Label>
            <Input
              id="planned-for"
              type="date"
              className="h-11"
              value={plannedFor}
              onChange={(e) => setPlannedFor(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPlannedFor(todayKey())}>
                Today
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPlannedFor(tomorrowKey())}
              >
                Tomorrow
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Meal slot</Label>
            <Select value={mealSlot} onValueChange={setMealSlot}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEAL_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={planType}
              onValueChange={(v) => setPlanType(v as "planned" | "open")}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Recipe</SelectItem>
                <SelectItem value="open">Open / decide later</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {planType === "planned" && (
            <div className="space-y-2">
              <Label>Recipe</Label>
              <Select value={recipeId} onValueChange={setRecipeId}>
                <SelectTrigger className="h-11">
                  <SelectValue
                    placeholder={recipes.isPending ? "Loading recipes…" : "Choose a recipe"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(recipes.data ?? []).map((r) => (
                    <SelectItem key={r.recipe_id} value={r.recipe_id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {recipes.error && (
                <p className="text-xs text-critical">{(recipes.error as Error).message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="meal-notes">Notes (optional)</Label>
            <Textarea
              id="meal-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything to remember"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="h-11 w-full sm:w-auto"
            disabled={!canSubmit || action.isPending}
            onClick={submit}
          >
            {action.isPending ? "Planning…" : "Plan meal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
