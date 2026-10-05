import type { TokenResponse } from "@/types";

const STORAGE_KEY = "atlas_tokens";
const ACCESS_COOKIE = "atlas_access";

// Miroir du jeton d'accès dans un cookie, pour que les Server Components
// (serverGet) puissent l'envoyer au backend. Le jeton de refresh reste
// uniquement dans localStorage.
function writeAccessCookie(token: string | null): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  if (token) {
    document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`;
  } else {
    document.cookie = `${ACCESS_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0${secure}`;
  }
}

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
  writeAccessCookie(tokens.access_token);
}

export function clearStoredTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  writeAccessCookie(null);
}
