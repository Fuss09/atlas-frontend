"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { watchlistApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { WatchlistIdsResponse } from "@/types";

/** Full watchlist with embedded companies — powers the /watchlist page. */
export function useWatchlist() {
  return useQuery({
    queryKey: queryKeys.watchlist.list,
    queryFn: () => watchlistApi.list(),
  });
}

/**
 * Lightweight set of watched company IDs — powers every star button.
 * One request, cached; each button derives its own state from the set.
 */
export function useWatchlistIds() {
  const query = useQuery({
    queryKey: queryKeys.watchlist.ids,
    queryFn: () => watchlistApi.listIds(),
    staleTime: 30_000,
  });
  const ids = new Set(query.data?.company_ids ?? []);
  return { ...query, ids };
}

/**
 * Optimistic add/remove. The star flips instantly by patching the cached
 * ID set; on error the previous set is restored. Both watchlist queries
 * are invalidated on settle so the /watchlist page stays in sync.
 */
export function useToggleWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyId, watched }: { companyId: string; watched: boolean }) => {
      if (watched) {
        await watchlistApi.remove(companyId);
      } else {
        await watchlistApi.add({ company_id: companyId });
      }
    },
    onMutate: async ({ companyId, watched }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.watchlist.ids });
      const previous = queryClient.getQueryData<WatchlistIdsResponse>(queryKeys.watchlist.ids);

      queryClient.setQueryData<WatchlistIdsResponse>(queryKeys.watchlist.ids, (old) => {
        const current = old?.company_ids ?? [];
        return {
          company_ids: watched
            ? current.filter((id) => id !== companyId)
            : [...current, companyId],
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.watchlist.ids, context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.watchlist.all });
    },
  });
}
