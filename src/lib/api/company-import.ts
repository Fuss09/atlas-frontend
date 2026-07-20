import { apiClient } from "./client";
import type { CompanyResponse } from "@/types";

export interface CompanyImportPayload {
  ticker: string;
  exchange?: string | null;
}

export const companyImportApi = {
  importByTicker: async (payload: CompanyImportPayload): Promise<CompanyResponse> => {
    const res = await apiClient.post<CompanyResponse>("/companies/import", payload);
    return res.data;
  },
};
