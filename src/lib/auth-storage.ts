import type { TokenResponse } from "@/types";

const STORAGE_KEY = "atlas_tokens";

export function getStoredTokens(): TokenResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TokenResponse) : null;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: TokenResponse): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
