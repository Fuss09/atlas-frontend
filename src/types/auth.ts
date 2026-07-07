/**
 * Atlas — Auth & User types
 * Mirrors backend/app/schemas/user.py and backend/app/models/user.py
 */

import type { ISODateString, UUID } from "./api";

export type UserRole = "user" | "analyst" | "admin";
export type AuthProvider = "local" | "google" | "github";

export interface User {
  id: UUID;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  auth_provider: AuthProvider;
  avatar_url: string | null;
  preferred_language: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
