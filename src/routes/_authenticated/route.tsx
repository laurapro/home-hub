import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthStatusScreen } from "@/components/auth/AuthStatusScreen";
import { useAuthSession } from "@/lib/auth-session";

// The Supabase session lives only in the browser, so this subtree is client
// rendered. The auth decision is made in the component (after hydration) rather
// than in `beforeLoad`: throwing a redirect while React is still hydrating the
// server shell swaps the router's match tree mid-hydration, which produced the
// "Invariant failed" / React #418 #422 #520 errors and a blank page on fresh
// browsers. Protected content never renders until a session is confirmed.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
  pendingComponent: () => <AuthStatusScreen />,
});

function AuthenticatedLayout() {
  const auth = useAuthSession();

  if (auth.status === "loading") return <AuthStatusScreen />;

  if (auth.status === "signed_out") {
    return (
      <>
        <AuthStatusScreen
          title="Redirecting to sign in…"
          detail={auth.error ? `Your session ended: ${auth.error}` : null}
        />
        <Navigate to="/auth" replace />
      </>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-12 items-center border-b px-2">
            <SidebarTrigger />
          </header>
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
