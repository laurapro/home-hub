import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthStatusScreen } from "@/components/auth/AuthStatusScreen";
import { useAuthSession } from "@/lib/auth-session";

// Decide the landing screen in the component, after hydration, instead of a
// `beforeLoad` redirect (see _authenticated/route.tsx for why).
export const Route = createFileRoute("/")({
  ssr: false,
  component: IndexPage,
  pendingComponent: () => <AuthStatusScreen />,
});

function IndexPage() {
  const auth = useAuthSession();

  if (auth.status === "loading") return <AuthStatusScreen />;

  return (
    <>
      <AuthStatusScreen title={auth.status === "signed_in" ? "Opening your home…" : "Redirecting to sign in…"} />
      <Navigate to={auth.status === "signed_in" ? "/home" : "/auth"} replace />
    </>
  );
}
