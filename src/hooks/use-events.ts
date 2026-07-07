"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { EventSearchParams } from "@/types";

export function useEvents(params: EventSearchParams) {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => eventsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.events.detail(id ?? ""),
    queryFn: () => eventsApi.getById(id as string),
    enabled: !!id,
  });
}

export function useEventTypes() {
  return useQuery({
    queryKey: queryKeys.events.types,
    queryFn: eventsApi.getTypes,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCompanyEvents(companyId: string | undefined, page = 1) {
  return useQuery({
    queryKey: queryKeys.events.forCompany(companyId ?? "", page),
    queryFn: () => eventsApi.getForCompany(companyId as string, page),
    enabled: !!companyId,
    placeholderData: (prev) => prev,
  });
}

export function useCompanyEventStats(companyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.events.statsForCompany(companyId ?? ""),
    queryFn: () => eventsApi.getStatsForCompany(companyId as string),
    enabled: !!companyId,
  });
}
