import "server-only";
import { serverGet } from "./server";
import type {
  CompanyDiscoverySource,
  CompanyGraphResponse,
  CompanyListItem,
  CompanyResponse,
  CompanySearchParams,
  DiscoveryJobResponse,
  EventListItem,
  EventSearchParams,
  OpportunityListItem,
  OpportunityScoreResponse,
  OpportunitySearchParams,
  PaginatedResponse,
  ThemeListItem,
  ThemeResponse,
} from "@/types";

/**
 * Server Component data fetchers. Each function owns its cache policy —
 * short revalidate windows for anything that changes with Discovery/Event
 * activity, since a stale Dashboard is worse than an extra backend hit.
 */

export async function fetchCompanies(
  params: CompanySearchParams,
): Promise<PaginatedResponse<CompanyListItem>> {
  return serverGet<PaginatedResponse<CompanyListItem>>("/companies", {
    params: {
      q: params.q,
      sector: params.sector,
      country: params.country,
      company_type: params.company_type,
      sort: params.sort,
      page: params.page,
      page_size: params.page_size,
    },
    revalidate: 30,
    tags: ["companies"],
  });
}

export async function fetchSectors(): Promise<string[]> {
  return serverGet<string[]>("/companies/sectors", { revalidate: 300, tags: ["companies"] });
}

export async function fetchCountries(): Promise<string[]> {
  return serverGet<string[]>("/companies/countries", { revalidate: 300, tags: ["companies"] });
}

/**
 * General-purpose opportunities fetcher backing both the Dashboard's
 * "Top Opportunities" (called with just a page_size) and the full
 * Opportunities page (called with the complete filter set: conviction,
 * stage, sector, country, theme_id, min_score).
 */
export async function fetchOpportunities(
  params: OpportunitySearchParams,
): Promise<PaginatedResponse<OpportunityListItem>> {
  return serverGet<PaginatedResponse<OpportunityListItem>>("/opportunities", {
    params: {
      min_score: params.min_score,
      conviction: params.conviction,
      stage: params.stage,
      sector: params.sector,
      country: params.country,
      theme_id: params.theme_id,
      sort: params.sort,
      page: params.page,
      page_size: params.page_size,
    },
    revalidate: 15,
    tags: ["opportunities"],
  });
}

/**
 * General-purpose events fetcher backing both the global /events page
 * (full filter set: type, importance, text search) and the Dashboard's
 * "Latest Events" section (just a page_size, via fetchRecentEvents
 * below) — same pattern as fetchOpportunities/fetchCompanies.
 */
export async function fetchEvents(
  params: EventSearchParams,
): Promise<PaginatedResponse<EventListItem>> {
  return serverGet<PaginatedResponse<EventListItem>>("/events", {
    params: {
      company_id: params.company_id,
      event_type: params.event_type,
      importance: params.importance,
      source: params.source,
      is_processed: params.is_processed,
      q: params.q,
      page: params.page,
      page_size: params.page_size,
    },
    revalidate: 15,
    tags: ["events"],
  });
}

export async function fetchRecentEvents(limit = 10): Promise<PaginatedResponse<EventListItem>> {
  return fetchEvents({ page: 1, page_size: limit });
}

export async function fetchPopularThemes(limit = 8): Promise<ThemeListItem[]> {
  const themes = await serverGet<ThemeListItem[]>("/themes", {
    revalidate: 60,
    tags: ["themes"],
  });
  return [...themes].sort((a, b) => b.companies_count - a.companies_count).slice(0, limit);
}

export async function fetchThemes(params?: {
  category?: string;
  maturity_level?: string;
}): Promise<ThemeListItem[]> {
  return serverGet<ThemeListItem[]>("/themes", {
    params,
    revalidate: 60,
    tags: ["themes"],
  });
}

export async function fetchThemeBySlug(slug: string): Promise<ThemeResponse> {
  return serverGet<ThemeResponse>(`/themes/by-slug/${slug}`, {
    revalidate: 30,
    tags: ["themes"],
  });
}

export async function fetchThemeCompanies(
  themeId: string,
  page = 1,
  page_size = 24,
): Promise<PaginatedResponse<CompanyListItem>> {
  return serverGet<PaginatedResponse<CompanyListItem>>(`/themes/${themeId}/companies`, {
    params: { page, page_size },
    revalidate: 30,
    tags: ["companies", "themes"],
  });
}

export async function fetchThemeCategories(): Promise<string[]> {
  return serverGet<string[]>("/themes/categories", { revalidate: 300, tags: ["themes"] });
}

export async function fetchRecentDiscoveries(limit = 5): Promise<DiscoveryJobResponse[]> {
  const jobs = await serverGet<DiscoveryJobResponse[]>("/discovery/jobs", {
    revalidate: 15,
    tags: ["discovery"],
  });
  return jobs.slice(0, limit);
}

// ── Company Detail page ─────────────────────────────────────────────────────

export async function fetchCompanyBySlug(slug: string): Promise<CompanyResponse> {
  return serverGet<CompanyResponse>(`/companies/by-slug/${slug}`, {
    revalidate: 30,
    tags: ["companies"],
  });
}

/**
 * The backend computes the score on demand if none exists yet
 * (OpportunityScoreService.get_or_compute), so this should basically
 * always resolve. Still wrapped by the caller in a try/catch — a
 * company with too little signal to score shouldn't be able to take
 * down the whole page.
 */
export async function fetchCompanyOpportunity(companyId: string): Promise<OpportunityScoreResponse> {
  return serverGet<OpportunityScoreResponse>(`/companies/${companyId}/opportunity`, {
    revalidate: 30,
    tags: ["opportunities"],
  });
}

/**
 * Fetches a company's events via the general-purpose /events endpoint
 * (company_id filter) rather than /companies/{id}/events — the latter
 * has no type/importance filtering, while /events supports the full
 * EventSearchParams contract. Using the same endpoint server-side that
 * EventsTab uses client-side (see components/company/tabs/events-tab.tsx)
 * means the server-prefetched page becomes a real cache hit for the
 * client's first query instead of a mismatched shape it has to discard.
 */
export async function fetchCompanyEvents(
  companyId: string,
  limit = 5,
): Promise<PaginatedResponse<EventListItem>> {
  return serverGet<PaginatedResponse<EventListItem>>("/events", {
    params: { company_id: companyId, page: 1, page_size: limit },
    revalidate: 15,
    tags: ["events"],
  });
}

export async function fetchCompanyThemes(companyId: string): Promise<ThemeListItem[]> {
  return serverGet<ThemeListItem[]>(`/companies/${companyId}/themes`, {
    revalidate: 60,
    tags: ["themes"],
  });
}

/**
 * GET /companies/{id}/sources — Module 04 provenance history.
 * No explicit revalidate override needed beyond the default; discovery
 * provenance is written once per collector run and essentially never
 * changes for a given source record, but a 30s window keeps it aligned
 * with the rest of the page rather than special-casing it.
 */
export async function fetchCompanySources(companyId: string): Promise<CompanyDiscoverySource[]> {
  return serverGet<CompanyDiscoverySource[]>(`/companies/${companyId}/sources`, {
    revalidate: 30,
    tags: ["discovery"],
  });
}

// ── Knowledge Graph ─────────────────────────────────────────────────────────

export async function fetchCompanyGraph(
  companyId: string,
  depth = 1,
): Promise<CompanyGraphResponse> {
  return serverGet<CompanyGraphResponse>(`/companies/${companyId}/graph`, {
    params: { depth },
    revalidate: 30,
    tags: ["graph"],
  });
}
