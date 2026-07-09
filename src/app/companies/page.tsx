import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CompaniesFilters, CompaniesFiltersSkeleton } from "@/components/company/companies-filters";
import { CompaniesResults, CompaniesResultsSkeleton } from "@/components/company/companies-results";
import { fetchSectors, fetchCountries } from "@/lib/api/server-data";
import type { CompanySortOption, CompanyType } from "@/types";

export const metadata: Metadata = {
  title: "Companies",
};

interface CompaniesPageProps {
  searchParams: Promise<{
    q?: string;
    sector?: string;
    country?: string;
    type?: string;
    sort?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 24;

/**
 * The URL is the single source of truth for search state (query, filters,
 * sort, page) — not React state. This means:
 *   - Back/forward navigation and bookmarking/sharing a filtered view
 *     just work, with no extra code.
 *   - The initial result set renders fully on the server (no loading
 *     flash on first paint), which matters once this list holds tens of
 *     thousands of companies — the client never has to fetch page 1
 *     itself.
 *   - Changing a filter is a client-side `router.push` that updates
 *     `?sector=...`, which re-triggers this Server Component render;
 *     only <CompaniesResults> suspends while the new page streams in,
 *     the filter controls themselves never unmount or lose focus.
 */
export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [sectors, countries] = await Promise.all([fetchSectors(), fetchCountries()]);

  const searchKey = JSON.stringify(params);

  return (
    <AppShell breadcrumb={[{ label: "Companies" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <Suspense fallback={<CompaniesFiltersSkeleton />}>
            <CompaniesFilters sectors={sectors} countries={countries} />
          </Suspense>

          <div>
            {/* Keying on the full query re-mounts the Suspense boundary per
                search, so pagination/filter changes show the skeleton
                instead of a stale list lingering during the fetch. */}
            <Suspense key={searchKey} fallback={<CompaniesResultsSkeleton />}>
              <CompaniesResults
                q={params.q}
                sector={params.sector}
                country={params.country}
                companyType={params.type as CompanyType | undefined}
                sort={params.sort as CompanySortOption | undefined}
                page={page}
                pageSize={PAGE_SIZE}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
