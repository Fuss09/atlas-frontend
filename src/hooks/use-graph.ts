"use client";

import { useQuery } from "@tanstack/react-query";
import { graphApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { CompanyGraphResponse, EntityType, RelationType } from "@/types";

export function useCompanyGraph(
  companyId: string | undefined,
  depth = 1,
  initialData?: CompanyGraphResponse,
) {
  return useQuery({
    queryKey: queryKeys.graph.forCompany(companyId ?? "", depth),
    queryFn: () => graphApi.getCompanyGraph(companyId as string, depth),
    enabled: !!companyId,
    // Only seed depth 1 — the server only ever pre-fetches the initial
    // depth, so seeding any other depth would mislabel that data.
    initialData: depth === 1 ? initialData : undefined,
  });
}

export function useGraphRelations(params: {
  entity_type?: EntityType;
  entity_id?: string;
  relation_type?: RelationType;
  direction?: "in" | "out" | "both";
}) {
  return useQuery({
    queryKey: queryKeys.graph.relations(params),
    queryFn: () => graphApi.listRelations(params),
    enabled: !!(params.entity_type && params.entity_id),
  });
}

export function useGraphStats() {
  return useQuery({
    queryKey: queryKeys.graph.stats,
    queryFn: graphApi.getStats,
  });
}
