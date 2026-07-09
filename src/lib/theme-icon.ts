import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Resolves a theme's icon name (stored kebab-case on the backend, e.g.
 * "circuit-board", "cpu", "shield" — see Module 03's seed migration) to
 * the matching Lucide component. Falls back to Sparkles for any name
 * that doesn't match a known Lucide export, so a typo or a future icon
 * name Lucide doesn't have never breaks rendering.
 */
export function resolveThemeIcon(name: string | null): LucideIcon {
  if (!name) return Icons.Sparkles;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return (Icons as unknown as Record<string, LucideIcon>)[pascal] ?? Icons.Sparkles;
}
