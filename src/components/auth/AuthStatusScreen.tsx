import { Loader2 } from "lucide-react";

/**
 * Visible auth lifecycle state. Rendered while the session is being read and
 * while a redirect to the right screen is in flight, so the app is never blank.
 */
export function AuthStatusScreen({
  title = "Checking your session…",
  detail,
}: {
  title?: string;
  detail?: string | null;
}) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-background px-4"
    >
      <div className="flex max-w-sm flex-col items-center text-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
        <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
        {detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}
      </div>
    </main>
  );
}
