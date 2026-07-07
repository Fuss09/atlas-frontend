"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { CompanySearchParams, CompanyUpdate } from "@/types";

export function useCompanies(params: CompanySearchParams) {
  return useQuery({
    queryKey: queryKeys.companies.list(params),
    queryFn: () => companiesApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.companies.detail(id ?? ""),
    queryFn: () => companiesApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCompanyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.companies.bySlug(slug ?? ""),
    queryFn: () => companiesApi.getBySlug(slug as string),
    enabled: !!slug,
  });
}

export function useFeaturedCompanies(limit = 10) {
  return useQuery({
    queryKey: queryKeys.companies.featured(limit),
    queryFn: () => companiesApi.getFeatured(limit),
  });
}

export function useSectors() {
  return useQuery({
    queryKey: queryKeys.companies.sectors,
    queryFn: companiesApi.getSectors,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCountries() {
  return useQuery({
    queryKey: queryKeys.companies.countries,
    queryFn: companiesApi.getCountries,
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompanyUpdate) => companiesApi.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
    },
  });
}
