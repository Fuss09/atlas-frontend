"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { themesApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useThemes(params?: { category?: string; maturity_level?: string }) {
  return useQuery({
    queryKey: queryKeys.themes.list(params ?? {}),
    queryFn: () => themesApi.list(params),
  });
}

export function useTheme(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.themes.detail(id ?? ""),
    queryFn: () => themesApi.getById(id as string),
    enabled: !!id,
  });
}

export function useThemeBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.themes.bySlug(slug ?? ""),
    queryFn: () => themesApi.getBySlug(slug as string),
    enabled: !!slug,
  });
}

export function useThemeCategories() {
  return useQuery({
    queryKey: queryKeys.themes.categories,
    queryFn: themesApi.getCategories,
    staleTime: 10 * 60 * 1000,
  });
}

export function useThemeCompanies(themeId: string | undefined, page = 1) {
  return useQuery({
    queryKey: queryKeys.themes.companies(themeId ?? "", page),
    queryFn: () => themesApi.getCompanies(themeId as string, page),
    enabled: !!themeId,
    placeholderData: (prev) => prev,
  });
}

export function useCompanyThemes(companyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.themes.forCompany(companyId ?? ""),
    queryFn: () => themesApi.getForCompany(companyId as string),
    enabled: !!companyId,
  });
}

export function useAddCompanyToTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ themeId, companyId }: { themeId: string; companyId: string }) =>
      themesApi.addCompany(themeId, companyId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.themes.forCompany(variables.companyId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.themes.detail(variables.themeId) });
    },
  });
}
