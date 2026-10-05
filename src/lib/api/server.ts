import "server-only";
import { cookies } from "next/headers";

/**
 * Server-side fetch layer for Atlas API calls made from Server Components.
 *
 * Deliberately separate from `lib/api/client.ts` (the Axios instance used
 * by Client Components + TanStack Query):
 *   - No localStorage/token-refresh logic — meaningless on the server.
 *     The access token itself does reach here, via a mirror cookie
 *     (`atlas_access`, written by `lib/auth-storage.ts` alongside
 *     localStorage) that `cookies()` can read; refresh still only
 *     happens client-side.
 *   - Uses Next.js's extended `fetch` so we get built-in request
 *     deduplication and cache control per call (`next: { revalidate }`),
 *     which is what actually makes Server Components fast — Axios has no
 *     equivalent hook into the Next.js fetch cache.
 *   - Every call point sets its own `revalidate`/`tags` deliberately;
 *     nothing here defaults to full static caching, since Atlas data
 *     (scores, events, discovery jobs) is live and changes continuously.
 *
 * Only used for public, read-only endpoints. Authenticated/mutating calls
 * stay in Client Components via the existing Axios client.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export class ServerApiError extends Error {
  status: number | null;
  code: string;

  constructor(message: string, status: number | null, code = "SERVER_FETCH_ERROR") {
    super(message);
    this.name = "ServerApiError";
    this.status = status;
    this.code = code;
  }
}

interface ServerFetchOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Seconds before Next.js revalidates this request in the background. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via revalidateTag(). */
  tags?: string[];
}

function buildUrl(path: string, params?: ServerFetchOptions["params"]): string {
  const url = new URL(`${API_BASE_URL}${API_PREFIX}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * GET helper for Server Components. Throws `ServerApiError` on failure —
 * callers render an inline empty/error state rather than crashing the
 * whole page, since a Dashboard section failing shouldn't take down the
 * others.
 */
export async function serverGet<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);
  const token = (await cookies()).get("atlas_access")?.value;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers,
      // Un utilisateur connecté ne doit jamais partager de cache avec les
      // autres requêtes — seules les requêtes anonymes passent par le
      // cache Next.js (revalidate/tags).
      ...(token
        ? { cache: "no-store" as const }
        : {
            next: {
              revalidate: options.revalidate ?? 30,
              tags: options.tags,
            },
          }),
    });
  } catch {
    throw new ServerApiError("Cannot reach Atlas API.", null, "NETWORK_ERROR");
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.error?.message ?? message;
    } catch {
      // Response body wasn't JSON — keep the generic message.
    }
    throw new ServerApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
