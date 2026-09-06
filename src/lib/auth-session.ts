import { useEffect, useState } from "react";
import type { AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthStatus = "loading" | "signed_in" | "signed_out";

export interface AuthSessionState {
  status: AuthStatus;
  session: Session | null;
  /** Non-fatal initialization error (e.g. refresh failed). Never blocks rendering. */
  error: string | null;
}

/**
 * Pure mapping from a Supabase session lookup to the auth lifecycle status.
 * An expired/invalid session (error or missing session) is treated as signed out.
 */
export function resolveAuthStatus(
  session: Session | null | undefined,
  error?: AuthError | Error | null,
): Pick<AuthSessionState, "status" | "error"> {
  if (session?.access_token) return { status: "signed_in", error: null };
  return { status: "signed_out", error: error?.message ?? null };
}

/**
 * Browser-only Supabase session state. Starts in an explicit `loading` state,
 * resolves once from local storage (refreshing an expired token if needed), and
 * then follows `onAuthStateChange`. Route components use this instead of doing
 * auth work in `beforeLoad`, so no redirect is ever thrown while React is still
 * hydrating the server shell.
 */
export function useAuthSession(): AuthSessionState {
  const [state, setState] = useState<AuthSessionState>({
    status: "loading",
    session: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setState({ session, ...resolveAuthStatus(session) });
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        setState({ session: data.session, ...resolveAuthStatus(data.session, error) });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          session: null,
          status: "signed_out",
          error: error instanceof Error ? error.message : "Could not read your session.",
        });
      });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}
