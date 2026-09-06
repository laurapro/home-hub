import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthStatus = "loading" | "signed_in" | "signed_out";

export interface AuthSessionState {
  status: AuthStatus;
  session: Session | null;
  /** Non-fatal initialization error (e.g. refresh failed). Never blocks rendering. */
  error: string | null;
}

const AuthSessionContext = createContext<AuthSessionState | null>(null);

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
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthSessionState>({
    status: "loading",
    session: null,
    error: null,
  });
  const authEventVersion = useRef(0);

  useEffect(() => {
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        if (!active || event === "INITIAL_SESSION") return;
        authEventVersion.current += 1;
        setState({ session, ...resolveAuthStatus(session) });
      },
    );

    const initialVersion = authEventVersion.current;

    async function restoreSession() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (!active || authEventVersion.current !== initialVersion) return;

        if (sessionError || !sessionData.session) {
          setState({
            session: null,
            ...resolveAuthStatus(null, sessionError),
          });
          return;
        }

        // getSession() reads browser storage. getUser() also verifies the token
        // with Supabase Auth, so a stale or tampered stored value never unlocks
        // protected Household content.
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (!active || authEventVersion.current !== initialVersion) return;

        if (userError || !userData.user) {
          setState({ session: null, ...resolveAuthStatus(null, userError) });
          return;
        }

        setState({ session: sessionData.session, ...resolveAuthStatus(sessionData.session) });
      } catch (error: unknown) {
        if (!active || authEventVersion.current !== initialVersion) return;
        setState({
          session: null,
          status: "signed_out",
          error: error instanceof Error ? error.message : "Could not read your session.",
        });
      }
    }

    void restoreSession();

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return createElement(AuthSessionContext.Provider, { value: state }, children);
}

export function useAuthSession(): AuthSessionState {
  const state = useContext(AuthSessionContext);
  if (!state) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return state;
}
