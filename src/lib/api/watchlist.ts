import { apiClient } from "./client";
import type { WatchlistAddPayload, WatchlistIdsResponse, WatchlistItem } from "@/types";

export const watchlistApi = {
  list: async (): Promise<WatchlistItem[]> => {
    const res = await apiClient.get<WatchlistItem[]>("/watchlist");
    return res.data;
  },

  listIds: async (): Promise<WatchlistIdsResponse> => {
    const res = await apiClient.get<WatchlistIdsResponse>("/watchlist/ids");
    return res.data;
  },

  add: async (payload: WatchlistAddPayload): Promise<WatchlistItem> => {
    const res = await apiClient.post<WatchlistItem>("/watchlist", payload);
    return res.data;
  },

  remove: async (companyId: string): Promise<void> => {
    await apiClient.delete(`/watchlist/${companyId}`);
  },
};
