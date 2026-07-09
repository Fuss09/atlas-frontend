"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
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
import { EVENT_TYPE_META, IMPORTANCE_META } from "@/types";

/**
 * URL-driven filters for the global Events feed — same architecture as
 * CompaniesFilters (Sprint 2) and OpportunitiesFilters (Sprint 4): this
 * component only ever reads/writes searchParams, EventsResults (the
 * Server Component) owns the actual data fetch.
 */
export function EventsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebouncedValue(query, 300);

  const type = searchParams.get("type") ?? undefined;
  const importance = searchParams.get("importance") ?? undefined;

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

  React.useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debouncedQuery !== current) {
      updateParams({ q: debouncedQuery || undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const hasActiveFilters = Boolean(type || importance);

  const clearFilters = () => {
    setQuery("");
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="h-9 w-56 pl-8"
        />
      </div>

      <Select value={type ?? "all"} onValueChange={(v) => updateParams({ type: v === "all" ? undefined : v })}>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Event type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {Object.entries(EVENT_TYPE_META).map(([key, meta]) => (
            <SelectItem key={key} value={key}>
              {meta.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={importance ?? "all"}
        onValueChange={(v) => updateParams({ importance: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Importance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          {Object.entries(IMPORTANCE_META).map(([key, meta]) => (
            <SelectItem key={key} value={key}>
              {meta.label}
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
  );
}

export function EventsFiltersSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-9 w-52" />
      <Skeleton className="h-9 w-44" />
    </div>
  );
}
