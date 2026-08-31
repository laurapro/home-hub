import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { HOUSEHOLD_SLUG } from "./household";

type Fns = Database["public"]["Functions"];
export type Project = Fns["get_lovable_projects"]["Returns"][number];

export const PROJECT_STATUSES = [
  "action_required",
  "waiting_external",
  "scheduled",
  "blocked",
] as const;

export function useProjects(enabled: boolean) {
  return useQuery({
    queryKey: ["projects", HOUSEHOLD_SLUG],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_lovable_projects", {
        p_household_slug: HOUSEHOLD_SLUG,
        p_include_complete: false,
      });
      if (error) throw new Error(error.message);
      return (data ?? []) as Project[];
    },
  });
}

const REFRESH_KEYS = ["projects", "household-attention", "today-timeline"];

export function useProjectAction<TArgs>(
  run: (args: TArgs) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: run,
    onSuccess: async () => {
      toast.success(successMessage);
      await Promise.all(
        REFRESH_KEYS.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key, HOUSEHOLD_SLUG] }),
        ),
      );
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

async function rpc<K extends keyof Fns & string>(name: K, args: Fns[K]["Args"]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await supabase.rpc(name as any, args as any);
  if (error) throw new Error(error.message);
  return data;
}

export const createProject = (args: Fns["lovable_create_project"]["Args"]) =>
  rpc("lovable_create_project", args);
export const updateProject = (args: Fns["lovable_update_project"]["Args"]) =>
  rpc("lovable_update_project", args);
export const completeProject = (args: Fns["lovable_complete_project"]["Args"]) =>
  rpc("lovable_complete_project", args);

/** Client-side mirror of backend rules; backend remains authoritative. */
export function validateProject(fields: {
  name: string;
  status: string;
  waiting_on: string;
  next_action: string;
  follow_up_at: string;
}): string | null {
  if (fields.name.trim() === "") return "Name is required.";
  if (fields.status === "waiting_external") {
    if (fields.waiting_on.trim() === "") return "Waiting on is required for waiting_external.";
    if (fields.follow_up_at === "") return "A follow-up date is required for waiting_external.";
  }
  if (fields.status === "scheduled" && fields.follow_up_at === "") {
    return "A scheduled date is required for scheduled.";
  }
  if (
    (fields.status === "action_required" || fields.status === "blocked") &&
    fields.next_action.trim() === ""
  ) {
    return "Next action is required for this status.";
  }
  return null;
}
