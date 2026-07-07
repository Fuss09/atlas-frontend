"use client";

import * as React from "react";
import { Search, Waypoints } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCompanies } from "@/hooks/use-companies";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { CompanyCard } from "@/components/company/company-card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Free-exploration entry point for the Knowledge Graph.
 * Sprint 1: search a company to jump into its centered graph view
 * (/companies/:slug/graph). A default "most connected entities" view
 * is deferred to Sprint 6 alongside the full graph rendering engine.
 */
export function GraphExplorer() {
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query, 250);
  const { data, isLoading } = useCompanies({ q: debounced, page: 1, page_size: 12 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24 text-center space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Waypoints className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-display mb-2">Knowledge Graph</h1>
          <p className="text-body text-muted-foreground max-w-md mx-auto">
            Search for a company to explore its network of suppliers, competitors, partners, and
            investors.
          </p>
        </div>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search a company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-11"
          autoFocus
        />
      </div>

      {debounced.length > 1 && (
        <div className="text-left">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <EmptyState title="No companies found" className="border-none" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.items.map((company) => (
                <CompanyCard key={company.id} company={company} variant="compact" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
