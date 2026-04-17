import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { Baby } from "../types";

async function fetchBaby(): Promise<Baby> {
  const { data } = await apiClient.get<Baby>("/baby");
  return data;
}

export function useBaby() {
  return useQuery({
    queryKey: ["baby"],
    queryFn: fetchBaby,
    staleTime: 1000 * 60 * 30, // 30 minutes — baby info rarely changes
  });
}
