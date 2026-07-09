import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ScoreExplainerBanner } from "@/components/opportunity/score-explainer-banner";
import { OpportunitiesFilters, OpportunitiesFiltersSkeleton } from "@/components/opportunity/opportunities-filters";
import { OpportunitiesResults, OpportunitiesResultsSkeleton } from "@/components/opportunity/opportunities-results";
import { fetchSectors, fetchCountries, fetchThemes } from "@/lib/api/server-data";
import type { ConvictionLevel, OpportunityStage } from "@/types";

export const metadata: Metadata = {
  title: "Opportunities",
};

interface OpportunitiesPageProps {
  searchParams: Promise<{
    conviction?: string;
    stage?: string;
    sector?: string;
    country?: string;
    theme?: string;
    min_score?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 25;

/**
 * Same URL-as-source-of-truth architecture as /companies (Sprint 2):
 * every filter, plus pagination, lives in searchParams. The ranked list
 * itself streams in via its own Suspense boundary so filter controls
 * never unmount while a new page of results loads.
 */
export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [sectors, countries, themes] = await Promise.all([
    fetchSectors(),
    fetchCountries(),
    fetchThemes(),
  ]);

  const theme = themes.find((t) => t.slug === params.theme);
  const searchKey = JSON.stringify(params);

  return (
    <AppShell breadcrumb={[{ label: "Opportunities" }]}>
      <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-6 md:py-8 space-y-6">
        <div>
          <h1 className="text-h1 mb-1">Opportunities</h1>
          <p className="text-body-sm text-muted-foreground">
            Companies ranked by Atlas Opportunity Score — always explainable, never a black box.
          </p>
        </div>

        <ScoreExplainerBanner />

        <Suspense fallback={<OpportunitiesFiltersSkeleton />}>
          <OpportunitiesFilters sectors={sectors} countries={countries} themes={themes} />
        </Suspense>

        <Suspense key={searchKey} fallback={<OpportunitiesResultsSkeleton />}>
          <OpportunitiesResults
            conviction={params.conviction as ConvictionLevel | undefined}
            stage={params.stage as OpportunityStage | undefined}
            sector={params.sector}
            country={params.country}
            themeId={theme?.id}
            minScore={params.min_score ? Number(params.min_score) : undefined}
            page={page}
            pageSize={PAGE_SIZE}
          />
        </Suspense>
      </div>
    </AppShell>
  );
}
