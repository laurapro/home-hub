import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, UnavailableDetail } from "@/components/DetailPage";
import { InventoryList } from "@/components/inventory/InventoryList";
import { useHouseholdMembership } from "@/lib/household";

export const Route = createFileRoute("/_authenticated/pantry")({
  head: () => ({
    meta: [
      { title: "Pantry Inventory — Household OS" },
      { name: "description", content: "Everything currently tracked in your pantry." },
      { property: "og:title", content: "Pantry Inventory — Household OS" },
      { property: "og:description", content: "Everything currently tracked in your pantry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PantryPage,
});

function PantryPage() {
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;

  return (
    <DetailPage title="Pantry" eyebrow="Inventory">
      {membership.isPending ? (
        <p className="text-sm text-muted-foreground">Loading pantry…</p>
      ) : membership.error ? (
        <p className="text-sm text-critical">{(membership.error as Error).message}</p>
      ) : !isMember ? (
        <UnavailableDetail />
      ) : (
        <InventoryList
          enabled={isMember}
          locationType="pantry"
          emptyMessage="Nothing tracked in the pantry right now."
        />
      )}
    </DetailPage>
  );
}
