"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { opportunitiesApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { OpportunitySearchParams } from "@/types";

export function useOpportunities(params?: OpportunitySearchParams) {
  return useQuery({
    queryKey: queryKeys.opportunities.list(params ?? {}),
    queryFn: () => opportunitiesApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useCompanyOpportunity(companyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.opportunities.forCompany(companyId ?? ""),
    queryFn: () => opportunitiesApi.getForCompany(companyId as string),
    enabled: !!companyId,
  });
}

export function useRecomputeOpportunity(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => opportunitiesApi.recompute(companyId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.forCompany(companyId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(companyId) });
    },
  });
}
