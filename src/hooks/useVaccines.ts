import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import { useAuth } from "./useAuth";
import type { Vaccine, VaccineUpdatePayload } from "../types";

async function fetchVaccines(): Promise<Vaccine[]> {
  const { data } = await apiClient.get<Vaccine[]>("/vaccines");
  return data;
}

async function updateVaccine({
  id,
  payload,
}: {
  id: string;
  payload: VaccineUpdatePayload;
}): Promise<Vaccine> {
  const { data } = await apiClient.patch<Vaccine>(`/vaccines/${id}`, payload);
  return data;
}

export function useVaccines() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["vaccines"],
    queryFn: fetchVaccines,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!session,
  });
}

export function useUpdateVaccine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVaccine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccines"] });
    },
  });
}
