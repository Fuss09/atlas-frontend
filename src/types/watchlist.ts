/**
 * Watchlist types — mirrors app/schemas/watchlist.py exactly.
 */

import type { ISODateString, UUID } from "./api";
import type { CompanyListItem } from "./company";

export interface WatchlistItem {
  id: UUID;
  company_id: UUID;
  notes: string | null;
  created_at: ISODateString;
  company: CompanyListItem;
}

export interface WatchlistIdsResponse {
  company_ids: UUID[];
}

export interface WatchlistAddPayload {
  company_id: UUID;
  notes?: string | null;
}
