import { format, formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";

/**
 * Formate un nombre en notation compacte (1.2M, 3.4B) — utilisé pour
 * market cap, revenue, employees. Toujours en base US (Atlas est un
 * outil pensé pour les marchés internationaux, cohérence garantie).
 */
export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formate une capitalisation boursière en USD compact ($3.2B).
 * Le backend stocke market_cap_usd en milliers (voir Module 02 ADR).
 */
export function formatMarketCap(valueInThousands: number | null | undefined): string {
  if (valueInThousands === null || valueInThousands === undefined) return "—";
  const usd = valueInThousands * 1000;
  return `$${formatCompactNumber(usd)}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Date relative courte ("3h ago", "2d ago") — utilisée dans les cartes,
 * timelines, badges de fraîcheur.
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
  } catch {
    return "—";
  }
}

/**
 * Date relative longue, format naturel ("about 2 hours ago") —
 * utilisée dans les tooltips et les vues détaillées.
 */
export function formatRelativeTimeLong(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function formatDate(date: string | Date | null | undefined, pattern = "MMM d, yyyy"): string {
  if (!date) return "—";
  try {
    return format(new Date(date), pattern);
  } catch {
    return "—";
  }
}

/**
 * Formate un score de confiance/pourcentage [0,1] en pourcentage lisible.
 */
export function formatPercent(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formate une variation de score avec signe explicite (+9 / -3).
 * Ne retourne jamais une couleur — le composant appelant décide de l'affichage visuel.
 */
export function formatDelta(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1).replace(/\.0$/, "")}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
