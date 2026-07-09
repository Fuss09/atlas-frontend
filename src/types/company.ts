/**
 * Atlas — Company types
 * Mirrors backend/app/schemas/company.py and backend/app/models/company.py
 */

import type { ISODateString, UUID } from "./api";

export type CompanyType = "public" | "private" | "etf" | "spac";
export type CompanyStatus = "active" | "inactive" | "acquired" | "bankrupt" | "merged";

export interface CompanyListItem {
  id: UUID;
  name: string;
  slug: string;
  ticker: string | null;
  exchange: string | null;
  company_type: CompanyType;
  status: CompanyStatus;
  sector: string | null;
  country: string;
  market_cap_usd: number | null;
  employees: number | null;
  atlas_score: number | null;
  is_featured: boolean;
  logo_url: string | null;
  description_short: string | null;
  tags: string[] | null;
  updated_at: ISODateString;
}

export interface CompanyResponse {
  id: UUID;
  name: string;
  slug: string;
  legal_name: string | null;
  ticker: string | null;
  isin: string | null;
  exchange: string | null;
  cusip: string | null;
  company_type: CompanyType;
  status: CompanyStatus;
  sector: string | null;
  industry: string | null;
  sic_code: string | null;
  country: string;
  country_name: string | null;
  headquarters_city: string | null;
  headquarters_state: string | null;
  description: string | null;
  description_short: string | null;
  website: string | null;
  logo_url: string | null;
  founded_year: number | null;
  ipo_date: string | null;
  market_cap_usd: number | null;
  employees: number | null;
  revenue_usd: number | null;
  atlas_score: number | null;
  is_featured: boolean;
  tags: string[] | null;
  data_sources: Record<string, unknown> | null;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export type CompanySortOption =
  | "relevance"
  | "name_asc"
  | "name_desc"
  | "market_cap_desc"
  | "market_cap_asc"
  | "score_desc"
  | "score_asc"
  | "founded_desc"
  | "recently_updated";

export const COMPANY_SORT_LABELS: Record<CompanySortOption, string> = {
  relevance: "Most relevant",
  name_asc: "Name (A–Z)",
  name_desc: "Name (Z–A)",
  market_cap_desc: "Market cap (high to low)",
  market_cap_asc: "Market cap (low to high)",
  score_desc: "Atlas score (high to low)",
  score_asc: "Atlas score (low to high)",
  founded_desc: "Recently founded",
  recently_updated: "Recently updated",
};

export interface CompanySearchParams {
  q?: string;
  sector?: string;
  industry?: string;
  country?: string;
  company_type?: CompanyType;
  exchange?: string;
  is_featured?: boolean;
  min_market_cap?: number;
  max_market_cap?: number;
  min_atlas_score?: number;
  sort?: CompanySortOption;
  page?: number;
  page_size?: number;
}

export interface CompanyCreate {
  name: string;
  slug?: string;
  legal_name?: string;
  ticker?: string;
  isin?: string;
  exchange?: string;
  company_type?: CompanyType;
  status?: CompanyStatus;
  sector?: string;
  industry?: string;
  country: string;
  country_name?: string;
  headquarters_city?: string;
  headquarters_state?: string;
  description?: string;
  description_short?: string;
  website?: string;
  founded_year?: number;
  market_cap_usd?: number;
  employees?: number;
  revenue_usd?: number;
  tags?: string[];
}

export type CompanyUpdate = Partial<CompanyCreate> & { is_featured?: boolean };
