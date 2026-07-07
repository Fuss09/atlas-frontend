/**
 * Atlas — Event types
 * Mirrors backend/app/schemas/event.py and backend/app/models/event.py
 */

import type { ISODateString, UUID } from "./api";

export type EventType =
  | "news"
  | "earnings"
  | "sec_filing"
  | "insider_buy"
  | "insider_sell"
  | "fda_approval"
  | "fda_rejection"
  | "clinical_trial"
  | "product_launch"
  | "partnership"
  | "acquisition"
  | "funding"
  | "patent"
  | "github_activity"
  | "yc_discovery"
  | "crunchbase_funding";

export type ImportanceLevel = "low" | "medium" | "high" | "critical";

export interface EventListItem {
  id: UUID;
  company_id: UUID;
  event_type: EventType;
  importance: ImportanceLevel;
  title: string;
  occurred_at: ISODateString;
  source: string;
  confidence_score: number;
  is_processed: boolean;
}

export interface EventResponse {
  id: UUID;
  company_id: UUID;
  event_type: EventType;
  importance: ImportanceLevel;
  title: string;
  summary: string | null;
  occurred_at: ISODateString;
  expires_at: ISODateString | null;
  source: string;
  source_url: string | null;
  source_id: string | null;
  confidence_score: number;
  sentiment_score: number | null;
  is_processed: boolean;
  processing_version: number | null;
  created_at: ISODateString;
  updated_at: ISODateString;
  score_boost: number;
}

export interface EventStatsResponse {
  company_id: UUID;
  total_events: number;
  unprocessed_events: number;
  by_type: Record<string, number>;
  by_importance: Record<string, number>;
  latest_occurred_at: ISODateString | null;
  estimated_score_boost: number;
}

export interface EventSearchParams {
  company_id?: UUID;
  event_type?: EventType;
  importance?: ImportanceLevel;
  source?: string;
  is_processed?: boolean;
  occurred_after?: string;
  occurred_before?: string;
  page?: number;
  page_size?: number;
}

/** Metadata driving icon + label for each event type across the whole UI. */
export const EVENT_TYPE_META: Record<
  EventType,
  { label: string; sentiment: "positive" | "negative" | "neutral" }
> = {
  news: { label: "News", sentiment: "neutral" },
  earnings: { label: "Earnings", sentiment: "neutral" },
  sec_filing: { label: "SEC Filing", sentiment: "neutral" },
  insider_buy: { label: "Insider Buy", sentiment: "positive" },
  insider_sell: { label: "Insider Sell", sentiment: "negative" },
  fda_approval: { label: "FDA Approval", sentiment: "positive" },
  fda_rejection: { label: "FDA Rejection", sentiment: "negative" },
  clinical_trial: { label: "Clinical Trial", sentiment: "neutral" },
  product_launch: { label: "Product Launch", sentiment: "positive" },
  partnership: { label: "Partnership", sentiment: "positive" },
  acquisition: { label: "Acquisition", sentiment: "positive" },
  funding: { label: "Funding", sentiment: "positive" },
  patent: { label: "Patent", sentiment: "positive" },
  github_activity: { label: "GitHub Activity", sentiment: "neutral" },
  yc_discovery: { label: "YC Discovery", sentiment: "positive" },
  crunchbase_funding: { label: "Crunchbase Funding", sentiment: "positive" },
};

export const IMPORTANCE_META: Record<ImportanceLevel, { label: string }> = {
  low: { label: "Low" },
  medium: { label: "Medium" },
  high: { label: "High" },
  critical: { label: "Critical" },
};
