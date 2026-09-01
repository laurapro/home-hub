import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function DetailPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to="/home"
        className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>
      <header className="mt-5 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-1 break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
      </header>
      <div className="mt-7">{children}</div>
    </main>
  );
}

export function UnavailableDetail() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="font-medium text-foreground">Not found or unavailable</p>
      <p className="mt-1 text-sm text-muted-foreground">
        This item may no longer be active, or it may not be available to your household.
      </p>
    </div>
  );
}
