/**
 * Atlas — Discovery Engine types
 * Mirrors backend/app/schemas/discovery.py and backend/app/models/discovery.py
 */

import type { ISODateString, UUID } from "./api";

export type DiscoverySourceName =
  | "sec"
  | "github"
  | "ycombinator"
  | "crunchbase"
  | "fda"
  | "uspto"
  | "arxiv"
  | "huggingface"
  | "producthunt"
  | "appstore"
  | "googleplay"
  | "pitchbook";

export type JobStatus = "pending" | "running" | "success" | "partial" | "failed";

export interface AvailableSource {
  source: string;
  implemented: boolean;
  description?: string;
}

export interface DiscoveryJobResponse {
  id: UUID;
  source: string;
  status: JobStatus;
  triggered_by: UUID | null;
  started_at: ISODateString | null;
  finished_at: ISODateString | null;
  companies_found: number;
  companies_created: number;
  companies_updated: number;
  companies_skipped: number;
  errors: Array<{ context: string; error: string }> | null;
  created_at: ISODateString;
}

export interface TriggerJobRequest {
  source: string;
  params?: Record<string, unknown>;
}
