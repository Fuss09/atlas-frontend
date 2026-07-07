"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { discoveryApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { TriggerJobRequest } from "@/types";

export function useDiscoverySources() {
  return useQuery({
    queryKey: queryKeys.discovery.sources,
    queryFn: discoveryApi.getSources,
  });
}

export function useDiscoveryJobs() {
  return useQuery({
    queryKey: queryKeys.discovery.jobs,
    queryFn: discoveryApi.listJobs,
    refetchInterval: 15_000,
  });
}

export function useDiscoveryJob(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.discovery.job(id ?? ""),
    queryFn: () => discoveryApi.getJob(id as string),
    enabled: !!id,
    refetchInterval: (query) => (query.state.data?.status === "running" ? 3_000 : false),
  });
}

export function useTriggerDiscoveryJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TriggerJobRequest) => discoveryApi.triggerJob(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.discovery.jobs });
    },
  });
}
