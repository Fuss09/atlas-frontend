/**
 * Atlas — Theme types
 * Mirrors backend/app/schemas/theme.py and backend/app/models/theme.py
 */

import type { ISODateString, UUID } from "./api";

export type MaturityLevel = "emerging" | "growth" | "mature";

export interface ThemeListItem {
  id: UUID;
  name: string;
  slug: string;
  category: string | null;
  maturity_level: MaturityLevel;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  companies_count: number;
}

export interface ThemeResponse {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  maturity_level: MaturityLevel;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  companies_count: number;
}

export interface ThemeCreate {
  name: string;
  slug?: string;
  description?: string;
  category?: string;
  maturity_level?: MaturityLevel;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

export type ThemeUpdate = Partial<ThemeCreate>;
