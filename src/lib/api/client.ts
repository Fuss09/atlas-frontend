import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorBody, TokenResponse } from "@/types";
import { getStoredTokens, setStoredTokens, clearStoredTokens } from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor : attach access token ────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getStoredTokens();
  if (tokens?.access_token) {
    config.headers.Authorization = `Bearer ${tokens.access_token}`;
  }
  return config;
});

// ── Response interceptor : normalize errors + refresh token on 401 ───────────

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Normalized error shape thrown by every apiClient call.
 * Every part of the UI can rely on `.message` and `.code` existing,
 * regardless of whether the backend, network, or validation failed.
 */
export class ApiError extends Error {
  code: string;
  status: number | null;
  details?: Record<string, unknown>;

  constructor(message: string, code: string, status: number | null, details?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Network / no response at all (backend down, CORS, offline)
    if (!error.response) {
      return Promise.reject(
        new ApiError(
          "Cannot reach Atlas API. Check your connection or try again shortly.",
          "NETWORK_ERROR",
          null,
        ),
      );
    }

    const status = error.response.status;
    const body = error.response.data;

    // Attempt a silent token refresh exactly once per request on 401
    if (status === 401 && original && !original._retry && !original.url?.includes("/auth/")) {
      const tokens = getStoredTokens();
      if (!tokens?.refresh_token) {
        clearStoredTokens();
        return Promise.reject(toApiError(status, body));
      }

      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post<TokenResponse>(
          `${API_BASE_URL}${API_PREFIX}/auth/refresh`,
          { refresh_token: tokens.refresh_token },
        );
        setStoredTokens(data);
        isRefreshing = false;
        onRefreshed(data.access_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original);
      } catch {
        isRefreshing = false;
        clearStoredTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(toApiError(status, body));
      }
    }

    return Promise.reject(toApiError(status, body));
  },
);

function toApiError(status: number, body: ApiErrorBody | undefined): ApiError {
  if (body?.error) {
    return new ApiError(body.error.message, body.error.code, status, body.error.details);
  }
  return new ApiError("Something went wrong. Please try again.", "UNKNOWN_ERROR", status);
}
