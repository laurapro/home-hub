import { Button } from "@/components/ui/button";

export type HomeSectionQueryState = {
  isPending: boolean;
  error: Error | null;
  refetch: () => unknown;
};

export function HomeSectionState({
  query,
  isEmpty,
  loadingMessage,
  emptyMessage,
  errorMessage,
  children,
}: {
  query: HomeSectionQueryState;
  isEmpty: boolean;
  loadingMessage: string;
  emptyMessage: string;
  errorMessage: string;
  children: React.ReactNode;
}) {
  const hasContent = !isEmpty;

  return (
    <div className="space-y-3">
      {query.error && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/50 p-4"
        >
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <Button type="button" size="sm" variant="ghost" onClick={() => query.refetch()}>
            Retry
          </Button>
        </div>
      )}

      {hasContent ? (
        children
      ) : query.isPending ? (
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
      ) : !query.error ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : null}
    </div>
  );
}
