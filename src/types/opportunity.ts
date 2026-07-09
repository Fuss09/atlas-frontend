/**
 * Atlas — Opportunity Score types
 * Mirrors backend/app/schemas/opportunity.py and backend/app/engines/opportunity.py
 */

import type { ISODateString, UUID } from "./api";

/**
 * Matches app/engines/opportunity.py ConvictionLevel exactly — note
 * there is no "very_low" on the backend, only these four levels.
 */
export type ConvictionLevel = "low" | "moderate" | "high" | "very_high";

/**
 * Matches app/engines/opportunity.py OpportunityStage — the market's
 * discovery stage for this opportunity, distinct from conviction (the
 * score's confidence level).
 */
export type OpportunityStage = "early" | "acceleration" | "confirmation" | "mature";

/**
 * Matches backend/app/schemas/opportunity.py ScoreComponentSchema exactly.
 * value is nullable — a component with is_connected=false (e.g. Market
 * Signals, not wired to live pricing data yet) has value=null rather
 * than a fake 0.
 */
export interface ScoreComponent {
  name: string;
  value: number | null;
  weight: number;
  is_connected: boolean;
  positive_factors: string[];
  negative_factors: string[];
}

/**
 * Matches backend/app/schemas/opportunity.py OpportunityScoreResponse
 * exactly. Note: components is a dict keyed by component id (e.g.
 * "events", "theme_strength", "company_quality", "discovery_signals",
 * "market_signals") — there are no flat events_score/theme_strength_score
 * fields on the backend; those were a Sprint 1/2 assumption that never
 * matched the real API and is corrected here.
 */
export interface OpportunityScoreResponse {
  id: UUID;
  company_id: UUID;
  score: number;
  conviction: ConvictionLevel;
  stage: OpportunityStage;
  stage_rationale: string;
  components: Record<string, ScoreComponent>;
  positive_factors: string[];
  negative_factors: string[];
  scoring_version: number;
  calculated_at: ISODateString;
  /** Present when score history is available (client-side augmentation ready). */
  delta_7d?: number | null;
  confidence?: number | null;
}

/**
 * Matches the real GET /opportunities response item exactly
 * (backend/app/schemas/opportunity.py OpportunityListItem) — field
 * names are prefixed company_* on the backend, not flattened.
 */
export interface OpportunityListItem {
  company_id: UUID;
  company_name: string;
  company_slug: string;
  company_ticker: string | null;
  company_sector: string | null;
  company_country: string | null;
  company_logo_url: string | null;
  score: number;
  conviction: ConvictionLevel;
  stage: OpportunityStage;
  calculated_at: ISODateString;
  /** Present when score history is available (client-side augmentation ready). */
  delta_7d?: number | null;
}

export type OpportunitySortOption = "score_desc" | "score_asc" | "name_asc" | "recently_calculated";

export const OPPORTUNITY_SORT_LABELS: Record<OpportunitySortOption, string> = {
  score_desc: "Score (high to low)",
  score_asc: "Score (low to high)",
  name_asc: "Name (A–Z)",
  recently_calculated: "Recently calculated",
};

export interface OpportunitySearchParams {
  min_score?: number;
  conviction?: ConvictionLevel;
  stage?: OpportunityStage;
  sector?: string;
  country?: string;
  theme_id?: UUID;
  sort?: OpportunitySortOption;
  page?: number;
  page_size?: number;
}

export const CONVICTION_META: Record<
  ConvictionLevel,
  { label: string; minScore: number }
> = {
  low: { label: "Low Conviction", minScore: 0 },
  moderate: { label: "Moderate Conviction", minScore: 41 },
  high: { label: "High Conviction", minScore: 61 },
  very_high: { label: "Very High Conviction", minScore: 81 },
};

export const STAGE_META: Record<OpportunityStage, { label: string; description: string }> = {
  early: { label: "Early", description: "Still under the radar — signals are just emerging." },
  acceleration: { label: "Accelerating", description: "Signals are multiplying over a recent period." },
  confirmation: { label: "Confirmed", description: "A sustained volume of signals confirms the trend." },
  mature: { label: "Mature", description: "The market has already priced this in." },
};
