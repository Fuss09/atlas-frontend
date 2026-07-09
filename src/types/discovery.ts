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

/**
 * Mirrors the exact dict shape returned by
 * GET /companies/{id}/sources (backend/app/api/v1/endpoints/discovery.py,
 * get_company_sources). Note this is a hand-built dict on the backend,
 * not a Pydantic response_model — deliberately narrow to those 6 fields
 * only (no job_id, no raw_data).
 */
export interface CompanyDiscoverySource {
  id: UUID;
  source: string;
  action: "created" | "updated" | "skipped" | string;
  external_id: string | null;
  external_url: string | null;
  created_at: ISODateString;
}
