import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { HOUSEHOLD_SLUG } from "./household";

type Fns = Database["public"]["Functions"];
export type PetAttention = Fns["get_lovable_pets_attention"]["Returns"][number];
type MarkGivenArgs = Fns["lovable_mark_pet_medication_given"]["Args"];

const REFRESH_KEYS = ["pets-attention", "household-attention", "today-timeline"];

export function usePetsAttention(enabled: boolean) {
  return useQuery({
    queryKey: ["pets-attention", HOUSEHOLD_SLUG],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_lovable_pets_attention", {
        p_household_slug: HOUSEHOLD_SLUG,
      });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

function isDuplicateResult(result: Json): boolean {
  return typeof result === "object" && result !== null && !Array.isArray(result)
    ? result["duplicate"] === true
    : false;
}

export function useMarkPetMedicationGiven() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: MarkGivenArgs) => {
      const { data, error } = await supabase.rpc("lovable_mark_pet_medication_given", args);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result) => {
      toast.success(
        isDuplicateResult(result) ? "Medication was already recorded" : "Medication recorded",
      );
      await Promise.all(
        REFRESH_KEYS.map((key) =>
          queryClient.invalidateQueries({ queryKey: [key, HOUSEHOLD_SLUG] }),
        ),
      );
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
