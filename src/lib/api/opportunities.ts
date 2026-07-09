import { apiClient } from "./client";
import type { OpportunityListItem, OpportunityScoreResponse, OpportunitySearchParams, PaginatedResponse } from "@/types";

export const opportunitiesApi = {
  list: async (params?: OpportunitySearchParams): Promise<PaginatedResponse<OpportunityListItem>> => {
    const res = await apiClient.get<PaginatedResponse<OpportunityListItem>>("/opportunities", {
      params,
    });
    return res.data;
  },

  getForCompany: async (companyId: string): Promise<OpportunityScoreResponse> => {
    const res = await apiClient.get<OpportunityScoreResponse>(
      `/companies/${companyId}/opportunity`,
    );
    return res.data;
  },

  recompute: async (companyId: string): Promise<OpportunityScoreResponse> => {
    const res = await apiClient.post<OpportunityScoreResponse>(
      `/companies/${companyId}/opportunity/recompute`,
    );
    return res.data;
  },
};
