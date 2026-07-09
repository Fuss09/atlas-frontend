"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONVICTION_META,
  OPPORTUNITY_SORT_LABELS,
  STAGE_META,
  type ConvictionLevel,
  type OpportunitySortOption,
  type OpportunityStage,
  type ThemeListItem,
} from "@/types";

interface OpportunitiesFiltersProps {
  sectors: string[];
  countries: string[];
  themes: ThemeListItem[];
}

const CONVICTION_OPTIONS: ConvictionLevel[] = ["very_high", "high", "moderate", "low"];
const STAGE_OPTIONS: OpportunityStage[] = ["early", "acceleration", "confirmation", "mature"];
const SORT_OPTIONS: OpportunitySortOption[] = ["score_desc", "score_asc", "name_asc", "recently_calculated"];
const MIN_SCORE_OPTIONS = [0, 40, 60, 80];

/**
 * All filter state lives in the URL, same architecture as
 * CompaniesFilters (Sprint 2) — this component only ever reads/writes
 * searchParams, never holds result data itself.
 */
export function OpportunitiesFilters({ sectors, countries, themes }: OpportunitiesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const conviction = searchParams.get("conviction") ?? undefined;
  const stage = searchParams.get("stage") ?? undefined;
  const sector = searchParams.get("sector") ?? undefined;
  const country = searchParams.get("country") ?? undefined;
  const theme = searchParams.get("theme") ?? undefined;
  const minScore = searchParams.get("min_score") ?? undefined;
  const sort = (searchParams.get("sort") as OpportunitySortOption) ?? "score_desc";

  const updateParams = React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const hasActiveFilters = Boolean(conviction || stage || sector || country || theme || minScore);

  const clearFilters = () => router.push(pathname);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

        <Select value={conviction ?? "all"} onValueChange={(v) => updateParams({ conviction: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Conviction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All conviction levels</SelectItem>
            {CONVICTION_OPTIONS.map((level) => (
              <SelectItem key={level} value={level}>
                {CONVICTION_META[level].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stage ?? "all"} onValueChange={(v) => updateParams({ stage: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {STAGE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {STAGE_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sector ?? "all"} onValueChange={(v) => updateParams({ sector: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {sectors.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={country ?? "all"} onValueChange={(v) => updateParams({ country: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={theme ?? "all"} onValueChange={(v) => updateParams({ theme: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All themes</SelectItem>
            {themes.map((t) => (
              <SelectItem key={t.id} value={t.slug}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={minScore ?? "0"}
          onValueChange={(v) => updateParams({ min_score: v === "0" ? undefined : v })}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Min score" />
          </SelectTrigger>
          <SelectContent>
            {MIN_SCORE_OPTIONS.map((score) => (
              <SelectItem key={score} value={String(score)}>
                {score === 0 ? "Any score" : `Score ≥ ${score}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center justify-end">
        <Select value={sort} onValueChange={(v) => updateParams({ sort: v === "score_desc" ? undefined : v })}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {OPPORTUNITY_SORT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function OpportunitiesFiltersSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-40" />
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-9 w-56" />
      </div>
    </div>
  );
}
