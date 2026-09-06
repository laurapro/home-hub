import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, UnavailableDetail } from "@/components/DetailPage";
import { InventoryList } from "@/components/inventory/InventoryList";
import { useHouseholdMembership } from "@/lib/household";

export const Route = createFileRoute("/_authenticated/fridge")({
  head: () => ({
    meta: [
      { title: "Fridge Inventory — Household OS" },
      { name: "description", content: "Everything currently tracked in your fridge." },
      { property: "og:title", content: "Fridge Inventory — Household OS" },
      { property: "og:description", content: "Everything currently tracked in your fridge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FridgePage,
});

function FridgePage() {
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;

  return (
    <DetailPage title="Fridge" eyebrow="Inventory">
      {membership.isPending ? (
        <p className="text-sm text-muted-foreground">Loading fridge…</p>
      ) : membership.error ? (
        <p className="text-sm text-critical">{(membership.error as Error).message}</p>
      ) : !isMember ? (
        <UnavailableDetail />
      ) : (
        <InventoryList
          enabled={isMember}
          locationType="fridge"
          emptyMessage="Nothing tracked in the fridge right now."
        />
      )}
    </DetailPage>
  );
}
