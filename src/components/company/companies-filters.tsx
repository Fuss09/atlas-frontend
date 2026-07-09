"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY_SORT_LABELS, type CompanySortOption } from "@/types";

interface CompaniesFiltersProps {
  sectors: string[];
  countries: string[];
}

const SORT_OPTIONS: CompanySortOption[] = [
  "relevance",
  "market_cap_desc",
  "market_cap_asc",
  "score_desc",
  "score_asc",
  "name_asc",
  "name_desc",
  "founded_desc",
  "recently_updated",
];

/**
 * All filter state lives in the URL (?q=&sector=&country=&type=&sort=&page=),
 * not in local React state — this component only ever reads/writes
 * searchParams. Changing a value here re-renders the Server Component tree
 * for /companies with fresh params; it never fetches or holds company data
 * itself.
 */
export function CompaniesFilters({ sectors, countries }: CompaniesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebouncedValue(query, 300);

  const sector = searchParams.get("sector") ?? undefined;
  const country = searchParams.get("country") ?? undefined;
  const sort = (searchParams.get("sort") as CompanySortOption) ?? "relevance";

  const updateParams = React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      // Any filter change resets pagination — page 2 of a new filter set
      // rarely makes sense and silently returning an empty page is worse.
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // Push the debounced query into the URL once the user stops typing.
  React.useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debouncedQuery !== current) {
      updateParams({ q: debouncedQuery || undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const hasActiveFilters = Boolean(sector || country || (sort && sort !== "relevance"));

  const clearFilters = () => {
    setQuery("");
    router.push(pathname);
  };

  return (
    <aside className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        <label className="text-caption font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <SlidersHorizontal className="h-3 w-3" /> Filters
        </label>

        <Select value={sector ?? "all"} onValueChange={(v) => updateParams({ sector: v === "all" ? undefined : v })}>
          <SelectTrigger>
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
          <SelectTrigger>
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

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2" onClick={clearFilters}>
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-caption font-medium text-muted-foreground uppercase tracking-wide">
          Sort by
        </label>
        <Select value={sort} onValueChange={(v) => updateParams({ sort: v === "relevance" ? undefined : v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {COMPANY_SORT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}

export function CompaniesFiltersSkeleton() {
  return (
    <aside className="space-y-6">
      <Skeleton className="h-9 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
    </aside>
  );
}
