import { Circle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { completeFoodThaw, useFoodAction } from "@/lib/food";
import { HOUSEHOLD_SLUG, type AttentionItem } from "@/lib/household";
import { useMarkPetMedicationGiven, type PetAttention } from "@/lib/pets";
import { completeShoppingItem, useShoppingAction } from "@/lib/shopping";

type InlineAction =
  | {
      kind: "pet-medication";
      label: string;
      args: {
        p_confirm: true;
        p_household_slug: string;
        p_pet_medication_id: string;
        p_scheduled_for: string;
      };
    }
  | {
      kind: "food-thaw";
      label: string;
      args: { p_planned_meal_id: string; p_item_id: string };
    }
  | {
      kind: "shopping-item";
      label: string;
      args: { p_household_slug: string; p_shopping_item_id: string };
    };

function metadataRecord(item: AttentionItem): Record<string, unknown> | null {
  const metadata = item.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  return metadata;
}

function inlineActionFor(item: AttentionItem, petAttention?: PetAttention): InlineAction | null {
  if (item.severity !== "critical" && item.severity !== "due") return null;

  const metadata = metadataRecord(item);

  if (
    item.domain === "pets" &&
    item.entity_type === "pet_medication" &&
    (item.attention_type === "medication_due" || item.attention_type === "medication_overdue") &&
    item.entity_id &&
    petAttention?.entity_id === item.entity_id &&
    petAttention.can_mark_given &&
    petAttention.scheduled_for
  ) {
    const petName = typeof metadata?.["pet_name"] === "string" ? metadata["pet_name"] : null;
    const medicationName =
      typeof metadata?.["medication_name"] === "string" ? metadata["medication_name"] : null;
    const subject =
      [petName, medicationName].filter(Boolean).join(" ") || item.title || "medication";
    return {
      kind: "pet-medication",
      label: `Mark ${subject} as given`,
      args: {
        p_confirm: true,
        p_household_slug: HOUSEHOLD_SLUG,
        p_pet_medication_id: item.entity_id,
        p_scheduled_for: petAttention.scheduled_for,
      },
    };
  }

  const metadataPlannedMealId = metadata?.["planned_meal_id"];
  const metadataItemId = metadata?.["item_id"];
  if (
    item.domain === "food" &&
    item.attention_type === "thaw_due" &&
    item.entity_type === "planned_meal" &&
    item.entity_id &&
    metadataPlannedMealId === item.entity_id &&
    typeof metadataItemId === "string"
  ) {
    const itemName = typeof metadata?.["item_name"] === "string" ? metadata["item_name"] : null;
    return {
      kind: "food-thaw",
      label: `Mark ${itemName ?? "meal item"} as thawed`,
      args: { p_planned_meal_id: item.entity_id, p_item_id: metadataItemId },
    };
  }

  if (
    item.domain === "food" &&
    item.attention_type === "costco_prediction" &&
    item.entity_type === "shopping_item" &&
    item.entity_id &&
    metadata?.["shopping_status"] === "needed"
  ) {
    return {
      kind: "shopping-item",
      label: `Mark ${item.title ?? "shopping item"} as purchased`,
      args: { p_household_slug: HOUSEHOLD_SLUG, p_shopping_item_id: item.entity_id },
    };
  }

  return null;
}

export function InlineAttentionAction({
  item,
  petAttention,
}: {
  item: AttentionItem;
  petAttention?: PetAttention | undefined;
}) {
  const action = inlineActionFor(item, petAttention);
  const petGiven = useMarkPetMedicationGiven();
  const foodThaw = useFoodAction(completeFoodThaw, "Thaw logged");
  const shoppingComplete = useShoppingAction(completeShoppingItem, "Marked as purchased");

  if (!action) return null;

  const pending =
    (action.kind === "pet-medication" && petGiven.isPending) ||
    (action.kind === "food-thaw" && foodThaw.isPending) ||
    (action.kind === "shopping-item" && shoppingComplete.isPending);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="m-1.5 h-11 w-11 shrink-0 rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={action.label}
      disabled={pending}
      onClick={() => {
        if (action.kind === "pet-medication") petGiven.mutate(action.args);
        if (action.kind === "food-thaw") foodThaw.mutate(action.args);
        if (action.kind === "shopping-item") shoppingComplete.mutate(action.args);
      }}
    >
      {pending ? <LoaderCircle className="animate-spin" /> : <Circle />}
    </Button>
  );
}
