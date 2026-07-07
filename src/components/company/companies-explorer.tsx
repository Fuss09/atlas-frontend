"use client";

import * as React from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCompanies, useSectors, useCountries } from "@/hooks/use-companies";
import { CompanyCard } from "@/components/company/company-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Search, SlidersHorizontal, Building2 } from "lucide-react";
import type { CompanySearchParams } from "@/types";

export function CompaniesExplorer() {
  const [query, setQuery] = React.useState("");
  const [sector, setSector] = React.useState<string | undefined>();
  const [country, setCountry] = React.useState<string | undefined>();
  const [page, setPage] = React.useState(1);

  const debouncedQuery = useDebouncedValue(query, 250);
  const { data: sectors } = useSectors();
  const { data: countries } = useCountries();

  const params: CompanySearchParams = {
    q: debouncedQuery || undefined,
    sector,
    country,
    page,
    page_size: 20,
  };

  const { data, isLoading, isPlaceholderData, error, refetch } = useCompanies(params);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQuery, sector, country]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      {/* Filters sidebar */}
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

        <div className="space-y-1.5">
          <label className="text-caption font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" /> Filters
          </label>

          <Select value={sector} onValueChange={(v) => setSector(v === "all" ? undefined : v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {sectors?.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={country} onValueChange={(v) => setCountry(v === "all" ? undefined : v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries?.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(sector || country) && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-muted-foreground"
              onClick={() => {
                setSector(undefined);
                setCountry(undefined);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-body-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${data?.total ?? 0} companies`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
            >
              {data.items.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {data.total > data.page_size && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-body-sm text-muted-foreground px-2">
                  Page {page} of {Math.ceil(data.total / data.page_size)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(data.total / data.page_size)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
