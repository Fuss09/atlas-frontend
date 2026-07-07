import { apiClient } from "./client";
import type {
  CompanyGraphResponse,
  EntityType,
  GraphStatsResponse,
  RelationResponse,
  RelationType,
} from "@/types";

export const graphApi = {
  listRelations: async (params: {
    entity_type?: EntityType;
    entity_id?: string;
    relation_type?: RelationType;
    direction?: "in" | "out" | "both";
    min_confidence?: number;
  }): Promise<RelationResponse[]> => {
    const res = await apiClient.get<RelationResponse[]>("/graph/relations", { params });
    return res.data;
  },

  getRelation: async (id: string): Promise<RelationResponse> => {
    const res = await apiClient.get<RelationResponse>(`/graph/relations/${id}`);
    return res.data;
  },

  getStats: async (): Promise<GraphStatsResponse> => {
    const res = await apiClient.get<GraphStatsResponse>("/graph/stats");
    return res.data;
  },

  getCompanyGraph: async (
    companyId: string,
    depth = 1,
    min_confidence = 0,
  ): Promise<CompanyGraphResponse> => {
    const res = await apiClient.get<CompanyGraphResponse>(`/companies/${companyId}/graph`, {
      params: { depth, min_confidence },
    });
    return res.data;
  },
};
