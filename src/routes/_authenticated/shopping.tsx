import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, UnavailableDetail } from "@/components/DetailPage";
import { AddShoppingItemDialog } from "@/components/shopping/AddShoppingItemDialog";
import { ShoppingItemsList } from "@/components/shopping/ShoppingItemsList";
import { useHouseholdMembership } from "@/lib/household";

export const Route = createFileRoute("/_authenticated/shopping")({
  component: ShoppingPage,
});

function ShoppingPage() {
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;

  return (
    <DetailPage title="Shopping" eyebrow="Household list">
      {membership.isPending ? (
        <p className="text-sm text-muted-foreground">Loading shopping…</p>
      ) : membership.error ? (
        <p className="text-sm text-critical">{(membership.error as Error).message}</p>
      ) : !isMember ? (
        <UnavailableDetail />
      ) : (
        <div className="space-y-5">
          <AddShoppingItemDialog enabled={isMember} />
          <ShoppingItemsList enabled={isMember} defaultExpanded showToggle={false} />
        </div>
      )}
    </DetailPage>
  );
}
