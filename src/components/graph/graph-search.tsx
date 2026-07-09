"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { companiesApi } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CompanyListItem } from "@/types";

interface GraphSearchProps {
  onSelectCompany: (company: CompanyListItem) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Company search box for the graph, used both to pick the initial
 * center on /graph (free exploration) and to jump straight to a
 * different company without leaving the graph view. Hits the real
 * paginated ?q= endpoint — same search-server-side discipline as
 * everywhere else in Atlas, never a client-side filter over "all
 * companies".
 */
export function GraphSearch({ onSelectCompany, placeholder, className }: GraphSearchProps) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const debounced = useDebouncedValue(query, 250);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isSearching = debounced.trim().length > 1;
  const { data, isFetching } = useQuery({
    queryKey: ["graph-search", debounced],
    queryFn: () => companiesApi.list({ q: debounced, page: 1, page_size: 8 }),
    enabled: isSearching,
  });

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (company: CompanyListItem) => {
    onSelectCompany(company);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder ?? "Search a company..."}
          className="h-8 w-56 bg-surface/95 backdrop-blur-sm pl-8 text-body-sm"
        />
        {isFetching && (
          <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && isSearching && (
        <div className="absolute top-full mt-1 w-full rounded-md border border-border bg-popover shadow-elevated overflow-hidden z-20">
          {!data || data.items.length === 0 ? (
            <p className="px-3 py-2.5 text-body-sm text-muted-foreground">
              {isFetching ? "Searching…" : "No companies found."}
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto py-1">
              {data.items.map((company) => (
                <li key={company.id}>
                  <button
                    onClick={() => select(company)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm hover:bg-secondary transition-colors"
                  >
                    <span className="flex-1 truncate">{company.name}</span>
                    {company.ticker && (
                      <span className="text-caption font-mono text-muted-foreground shrink-0">
                        {company.ticker}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
