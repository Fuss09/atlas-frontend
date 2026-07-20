/**
 * Catalyst types — mirrors app/schemas/catalyst.py exactly.
 */

import type { ISODateString, UUID } from "./api";

export type CatalystType =
  | "clinical_readout"
  | "earnings"
  | "regulatory_decision"
  | "conference"
  | "product_launch"
  | "lockup_expiry"
  | "other";

export type DatePrecision = "day" | "month" | "quarter";

export interface CatalystCompanyRef {
  id: UUID;
  name: string;
  slug: string;
  ticker: string | null;
  sector: string | null;
}

export interface Catalyst {
  id: UUID;
  company_id: UUID;
  catalyst_type: CatalystType | string;
  title: string;
  description: string | null;
  expected_date: string; // ISO date (YYYY-MM-DD)
  date_precision: DatePrecision | string;
  status: string;
  source: string;
  source_url: string | null;
  created_at: ISODateString;
  company: CatalystCompanyRef;
}
