import { apiClient } from "./client";
import type { AvailableSource, DiscoveryJobResponse, TriggerJobRequest } from "@/types";

export const discoveryApi = {
  getSources: async (): Promise<AvailableSource[]> => {
    const res = await apiClient.get<AvailableSource[]>("/discovery/sources");
    return res.data;
  },

  listJobs: async (): Promise<DiscoveryJobResponse[]> => {
    const res = await apiClient.get<DiscoveryJobResponse[]>("/discovery/jobs");
    return res.data;
  },

  getJob: async (id: string): Promise<DiscoveryJobResponse> => {
    const res = await apiClient.get<DiscoveryJobResponse>(`/discovery/jobs/${id}`);
    return res.data;
  },

  triggerJob: async (data: TriggerJobRequest): Promise<DiscoveryJobResponse> => {
    const res = await apiClient.post<DiscoveryJobResponse>("/discovery/jobs", data);
    return res.data;
  },
};
