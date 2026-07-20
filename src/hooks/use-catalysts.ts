"use client";

import { useQuery } from "@tanstack/react-query";
import { catalystsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useUpcomingCatalysts(horizonDays = 365) {
  return useQuery({
    queryKey: queryKeys.catalysts.upcoming(horizonDays),
    queryFn: () => catalystsApi.listUpcoming(horizonDays),
  });
}
