import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Household OS is entirely auth-gated and the Supabase session lives in the
    // browser, so the server can never know who is signed in. Rendering route
    // bodies on the server produced a placeholder tree that the client then
    // replaced with the /auth redirect target, causing hydration mismatches
    // (React #418/#422) and an "Invariant failed" from the router's Match
    // bundle. Client-rendering route bodies removes the divergent tree; head()
    // metadata is still emitted from the server.
    defaultSsr: false,
  });


  return router;
};
