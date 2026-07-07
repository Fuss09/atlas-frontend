/**
 * Atlas — Opportunity Score types
 * Mirrors backend/app/schemas/opportunity.py and backend/app/models/opportunity.py
 */

import type { ISODateString, UUID } from "./api";

export type ConvictionLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export interface ScoreComponent {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  factors: string[];
}

export interface OpportunityScoreResponse {
  company_id: UUID;
  score: number;
  conviction: ConvictionLevel;
  events_score: number;
  theme_strength_score: number;
  company_quality_score: number;
  discovery_signals_score: number;
  market_signals_score: number;
  score_breakdown: Record<string, ScoreComponent>;
  positive_factors: string[];
  negative_factors: string[];
  scoring_version: number;
  events_processed: number;
  is_stale: boolean;
  updated_at: ISODateString;
  /** Present when score history is available (client-side augmentation ready). */
  delta_7d?: number | null;
  confidence?: number | null;
}

export interface OpportunityListItem {
  company_id: UUID;
  company_name: string;
  ticker: string | null;
  sector: string | null;
  logo_url: string | null;
  score: number;
  conviction: ConvictionLevel;
  updated_at: ISODateString;
  delta_7d?: number | null;
}

export const CONVICTION_META: Record<
  ConvictionLevel,
  { label: string; minScore: number }
> = {
  very_low: { label: "Very Low Conviction", minScore: 0 },
  low: { label: "Low Conviction", minScore: 21 },
  moderate: { label: "Moderate Conviction", minScore: 41 },
  high: { label: "High Conviction", minScore: 61 },
  very_high: { label: "Very High Conviction", minScore: 81 },
};
