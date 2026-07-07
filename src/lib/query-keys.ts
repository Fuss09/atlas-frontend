/**
 * Centralized query keys — every hook references these, never inline arrays.
 * Keeps cache invalidation predictable across the whole app.
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  companies: {
    all: ["companies"] as const,
    list: (params: unknown) => ["companies", "list", params] as const,
    detail: (id: string) => ["companies", "detail", id] as const,
    bySlug: (slug: string) => ["companies", "slug", slug] as const,
    featured: (limit: number) => ["companies", "featured", limit] as const,
    sectors: ["companies", "sectors"] as const,
    countries: ["companies", "countries"] as const,
  },
  themes: {
    all: ["themes"] as const,
    list: (params: unknown) => ["themes", "list", params] as const,
    detail: (id: string) => ["themes", "detail", id] as const,
    bySlug: (slug: string) => ["themes", "slug", slug] as const,
    categories: ["themes", "categories"] as const,
    companies: (themeId: string, page: number) => ["themes", themeId, "companies", page] as const,
    forCompany: (companyId: string) => ["companies", companyId, "themes"] as const,
  },
  events: {
    all: ["events"] as const,
    list: (params: unknown) => ["events", "list", params] as const,
    detail: (id: string) => ["events", "detail", id] as const,
    types: ["events", "types"] as const,
    forCompany: (companyId: string, page: number) => ["companies", companyId, "events", page] as const,
    statsForCompany: (companyId: string) => ["companies", companyId, "events", "stats"] as const,
  },
  opportunities: {
    all: ["opportunities"] as const,
    list: (params: unknown) => ["opportunities", "list", params] as const,
    forCompany: (companyId: string) => ["companies", companyId, "opportunity"] as const,
  },
  graph: {
    relations: (params: unknown) => ["graph", "relations", params] as const,
    relation: (id: string) => ["graph", "relation", id] as const,
    stats: ["graph", "stats"] as const,
    forCompany: (companyId: string, depth: number) => ["companies", companyId, "graph", depth] as const,
  },
  discovery: {
    sources: ["discovery", "sources"] as const,
    jobs: ["discovery", "jobs"] as const,
    job: (id: string) => ["discovery", "job", id] as const,
  },
};
