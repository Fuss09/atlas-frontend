import {
  fetchCompanyBySlug,
  fetchCompanyEvents,
  fetchCompanyOpportunity,
  fetchCompanySources,
  fetchCompanyThemes,
} from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { CompanyHeader } from "@/components/company/company-header";
import { StatBar } from "@/components/company/stat-bar";
import { CompanyTabs } from "@/components/company/company-tabs";
import { OverviewTab } from "@/components/company/tabs/overview-tab";
import { EventsTab } from "@/components/company/tabs/events-tab";
import { ThemesTab } from "@/components/company/tabs/themes-tab";
import { RelationsTab } from "@/components/company/tabs/relations-tab";
import { SourcesTab } from "@/components/company/tabs/sources-tab";
import { EmptyState } from "@/components/shared/empty-state";
import type {
  CompanyDiscoverySource,
  CompanyResponse,
  EventListItem,
  OpportunityScoreResponse,
  PaginatedResponse,
  ThemeListItem,
} from "@/types";
import { notFound } from "next/navigation";

/**
 * Company Detail is now a Server Component: the header, stat bar, and
 * every tab's initial content render fully on the server in one request
 * — no client-side loading flash when arriving from a Dashboard or
 * Companies link (the two primary entry points).
 *
 * Data fetching strategy:
 *   - `company` is fetched first and is load-bearing — a 404 here means
 *     the page genuinely doesn't exist, so we call notFound().
 *   - Opportunity, events, themes, and sources are fetched in parallel
 *     once we have the company id. Each is independently optional: a
 *     failure in any one of them degrades that section gracefully
 *     (via SectionFallback) rather than taking down the whole page —
 *     the same resilience principle used for the Dashboard in Sprint 2.
 *   - Interactive tabs (Events pagination, Relations selection) stay
 *     Client Components, but are seeded with the server-fetched page-1
 *     data so they paint instantly and only hit the network again on
 *     real user interaction (see EventsTab's initialEvents prop).
 *   - CompanyTabs (client) only owns which tab is active — every tab
 *     body below is still a Server Component rendered on the initial
 *     request, just conditionally shown/hidden client-side.
 */
export async function CompanyPageContent({ slug }: { slug: string }) {
  let company: CompanyResponse;
  try {
    company = await fetchCompanyBySlug(slug);
  } catch (err) {
    if (err instanceof ServerApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const [opportunityResult, eventsResult, themesResult, sourcesResult] = await Promise.allSettled([
    fetchCompanyOpportunity(company.id),
    fetchCompanyEvents(company.id, 20),
    fetchCompanyThemes(company.id),
    fetchCompanySources(company.id),
  ]);

  const opportunity: OpportunityScoreResponse | undefined =
    opportunityResult.status === "fulfilled" ? opportunityResult.value : undefined;
  const events: PaginatedResponse<EventListItem> | undefined =
    eventsResult.status === "fulfilled" ? eventsResult.value : undefined;
  const themes: ThemeListItem[] = themesResult.status === "fulfilled" ? themesResult.value : [];
  const sources: CompanyDiscoverySource[] =
    sourcesResult.status === "fulfilled" ? sourcesResult.value : [];

  return (
    <div className="space-y-6">
      <CompanyHeader company={company} opportunity={opportunity} />
      <StatBar company={company} />

      <CompanyTabs
        overview={
          <OverviewTab
            company={company}
            opportunity={opportunity}
            recentEvents={events?.items}
            themes={themes}
            sourcesCount={sources.length}
          />
        }
        events={
          eventsResult.status === "fulfilled" ? (
            <EventsTab companyId={company.id} initialEvents={events} />
          ) : (
            <EmptyState variant="error" title="Couldn't load events" className="py-16" />
          )
        }
        themes={<ThemesTab themes={themes} />}
        relations={<RelationsTab companyId={company.id} companySlug={company.slug} />}
        sources={<SourcesTab sources={sources} />}
      />
    </div>
  );
}
