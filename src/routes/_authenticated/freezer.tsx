import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, UnavailableDetail } from "@/components/DetailPage";
import { InventoryList } from "@/components/inventory/InventoryList";
import { useHouseholdMembership } from "@/lib/household";

export const Route = createFileRoute("/_authenticated/freezer")({
  head: () => ({
    meta: [
      { title: "Freezer Inventory — Household OS" },
      { name: "description", content: "Everything currently tracked in your freezer." },
      { property: "og:title", content: "Freezer Inventory — Household OS" },
      { property: "og:description", content: "Everything currently tracked in your freezer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FreezerPage,
});

function FreezerPage() {
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;

  return (
    <DetailPage title="Freezer" eyebrow="Inventory">
      {membership.isPending ? (
        <p className="text-sm text-muted-foreground">Loading freezer…</p>
      ) : membership.error ? (
        <p className="text-sm text-critical">{(membership.error as Error).message}</p>
      ) : !isMember ? (
        <UnavailableDetail />
      ) : (
        <InventoryList
          enabled={isMember}
          locationType="freezer"
          emptyMessage="Nothing tracked in the freezer right now."
        />
      )}
    </DetailPage>
  );
}
