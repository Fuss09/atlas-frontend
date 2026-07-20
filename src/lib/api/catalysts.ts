import { apiClient } from "./client";
import type { Catalyst } from "@/types";

export const catalystsApi = {
  listUpcoming: async (horizonDays = 365): Promise<Catalyst[]> => {
    const res = await apiClient.get<Catalyst[]>("/catalysts", {
      params: { horizon_days: horizonDays },
    });
    return res.data;
  },

  listForCompany: async (companyId: string): Promise<Catalyst[]> => {
    const res = await apiClient.get<Catalyst[]>(`/companies/${companyId}/catalysts`);
    return res.data;
  },
};
