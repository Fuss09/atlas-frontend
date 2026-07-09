import { SearchX } from "lucide-react";
import { fetchOpportunities } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";
import { CompaniesPagination } from "@/components/company/companies-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { ConvictionLevel, OpportunitySortOption, OpportunityStage, UUID } from "@/types";

interface OpportunitiesResultsProps {
  conviction?: ConvictionLevel;
  stage?: OpportunityStage;
  sector?: string;
  country?: string;
  themeId?: UUID;
  minScore?: number;
  sort?: OpportunitySortOption;
  page: number;
  pageSize: number;
}

/**
 * Same server-fetch-one-page pattern as CompaniesResults (Sprint 2):
 * the ranked list itself never holds more than one page in memory,
 * pagination is windowed (CompaniesPagination, reused as-is), and every
 * filter is a real query param — bookmarkable, shareable, correct
 * back-button behavior.
 */
export async function OpportunitiesResults({
  conviction,
  stage,
  sector,
  country,
  themeId,
  minScore,
  sort,
  page,
  pageSize,
}: OpportunitiesResultsProps) {
  let data;
  try {
    data = await fetchOpportunities({
      conviction,
      stage,
      sector,
      country,
      theme_id: themeId,
      min_score: minScore,
      sort,
      page,
      page_size: pageSize,
    });
  } catch (err) {
    return (
      <EmptyState
        variant="error"
        title="Couldn't load opportunities"
        description={err instanceof ServerApiError ? err.message : undefined}
        className="py-20"
      />
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No opportunities match these filters"
        description="Try widening your search — fewer filters, or a lower minimum score."
        className="py-20"
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));
  const startRank = (page - 1) * pageSize;

  return (
    <>
      <p className="text-body-sm text-muted-foreground">
        {data.total.toLocaleString("en-US")} {data.total === 1 ? "opportunity" : "opportunities"}
      </p>

      <div className="divide-y divide-border-subtle rounded-lg border border-border-subtle">
        {data.items.map((opp, i) => (
          <OpportunityCard key={opp.company_id} opportunity={opp} rank={startRank + i + 1} />
        ))}
      </div>

      {totalPages > 1 && <CompaniesPagination currentPage={page} totalPages={totalPages} />}
    </>
  );
}

export function OpportunitiesResultsSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </>
  );
}
