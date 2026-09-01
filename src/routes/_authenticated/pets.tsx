import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, UnavailableDetail } from "@/components/DetailPage";
import { PetsContent } from "@/components/pets/PetsSection";
import { useHouseholdMembership } from "@/lib/household";

export const Route = createFileRoute("/_authenticated/pets")({
  component: PetsPage,
});

function PetsPage() {
  const membership = useHouseholdMembership();
  const isMember = !!membership.data;

  return (
    <DetailPage title="Pets" eyebrow="Care and supplies">
      {membership.isPending ? (
        <p className="text-sm text-muted-foreground">Loading Pets…</p>
      ) : membership.error ? (
        <p className="text-sm text-critical">{(membership.error as Error).message}</p>
      ) : !isMember ? (
        <UnavailableDetail />
      ) : (
        <PetsContent enabled={isMember} />
      )}
    </DetailPage>
  );
}
