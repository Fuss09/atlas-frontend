import { apiClient } from "./client";
import type {
  EventListItem,
  EventResponse,
  EventSearchParams,
  EventStatsResponse,
  PaginatedResponse,
} from "@/types";

export const eventsApi = {
  list: async (params: EventSearchParams): Promise<PaginatedResponse<EventListItem>> => {
    const res = await apiClient.get<PaginatedResponse<EventListItem>>("/events", { params });
    return res.data;
  },

  getById: async (id: string): Promise<EventResponse> => {
    const res = await apiClient.get<EventResponse>(`/events/${id}`);
    return res.data;
  },

  getTypes: async (): Promise<Array<{ type: string; score_boost: number; sentiment: string }>> => {
    const res = await apiClient.get("/events/types");
    return res.data;
  },

  getForCompany: async (
    companyId: string,
    page = 1,
    page_size = 20,
  ): Promise<PaginatedResponse<EventListItem>> => {
    const res = await apiClient.get<PaginatedResponse<EventListItem>>(
      `/companies/${companyId}/events`,
      { params: { page, page_size } },
    );
    return res.data;
  },

  getStatsForCompany: async (companyId: string): Promise<EventStatsResponse> => {
    const res = await apiClient.get<EventStatsResponse>(`/companies/${companyId}/events/stats`);
    return res.data;
  },
};
