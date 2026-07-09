"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Loader2, Search, SearchX } from "lucide-react";
import { eventsApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { EventCard } from "@/components/event/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  EVENT_TYPE_META,
  IMPORTANCE_META,
  type EventListItem,
  type EventType,
  type ImportanceLevel,
  type PaginatedResponse,
} from "@/types";

interface EventsTabProps {
  companyId: string;
  /**
   * Page-1 results already fetched server-side by the parent Server
   * Component (see company-page-content.tsx). Seeds the first page so
   * the tab paints immediately instead of re-fetching data the page
   * already has.
   */
  initialEvents?: PaginatedResponse<EventListItem>;
}

const PAGE_SIZE = 20;

/**
 * The unified company timeline: every EventType Atlas tracks — Funding,
 * SEC filings, FDA approvals, GitHub activity, Acquisitions,
 * Partnerships, Discovery, and more — in one chronological feed,
 * filterable by type and importance, searchable by title/summary,
 * grouped by period (This week / This month / Earlier) the way Linear
 * groups activity logs.
 *
 * "Load more" rather than page-by-page navigation: pages are fetched
 * and appended to a single accumulated list, which is what makes the
 * period grouping actually correct — grouping each page in isolation
 * would let "This week" reappear after "Earlier" on page 2 as soon as
 * the boundary between periods fell mid-page. Filter/search changes
 * reset the accumulated list and start over, via the real server-side
 * ?event_type=/?importance=/?q= filters (GET /events) — search always
 * hits the server, never a client-side filter over already-fetched
 * pages, so a match on a page not yet loaded is never silently missed.
 */
export function EventsTab({ companyId, initialEvents }: EventsTabProps) {
  const [typeFilter, setTypeFilter] = React.useState<EventType | "all">("all");
  const [importanceFilter, setImportanceFilter] = React.useState<ImportanceLevel | "all">("all");
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [page, setPage] = React.useState(1);
  const [accumulated, setAccumulated] = React.useState<EventListItem[]>(initialEvents?.items ?? []);

  const filtersActive = typeFilter !== "all" || importanceFilter !== "all" || debouncedQuery.trim().length > 0;

  // Reset accumulation whenever a filter changes — a fresh query, fresh list.
  React.useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [typeFilter, importanceFilter, debouncedQuery]);

  const params = {
    company_id: companyId,
    event_type: typeFilter === "all" ? undefined : typeFilter,
    importance: importanceFilter === "all" ? undefined : importanceFilter,
    q: debouncedQuery.trim() || undefined,
    page,
    page_size: PAGE_SIZE,
  };

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => eventsApi.list(params),
    placeholderData: (prev) => prev,
    initialData: page === 1 && !filtersActive ? initialEvents : undefined,
  });

  React.useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => {
      if (page === 1) return data.items;
      // Guard against duplicate appends if the query re-fires for the
      // same page (e.g. a refetch) — de-dupe by id rather than assume
      // effect-runs-once.
      const known = new Set(prev.map((e) => e.id));
      const fresh = data.items.filter((e) => !known.has(e.id));
      return [...prev, ...fresh];
    });
  }, [data, page]);

  const hasMore = data ? page * PAGE_SIZE < data.total : false;

  if (isLoading && accumulated.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const groups = groupByPeriod(accumulated);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="h-8 w-48 pl-8 text-body-sm"
          />
        </div>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as EventType | "all")}>
          <SelectTrigger className="h-8 w-44 text-body-sm">
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

        <Select value={importanceFilter} onValueChange={(v) => setImportanceFilter(v as ImportanceLevel | "all")}>
          <SelectTrigger className="h-8 w-36 text-body-sm">
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
      </div>

      {accumulated.length === 0 ? (
        <EmptyState
          icon={filtersActive ? SearchX : Activity}
          title={filtersActive ? "No events match these filters" : "No events recorded yet"}
          description={
            filtersActive
              ? "Try widening your search or clearing a filter."
              : "This company's timeline — discoveries, filings, funding, partnerships and more — will appear here as Atlas collects data."
          }
        />
      ) : (
        <>
          {groups.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide mb-3">
                {group.label}
              </p>
              <div>
                {group.items.map((event) => (
                  <EventCard key={event.id} event={event} variant="timeline" />
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function groupByPeriod(events: EventListItem[]): Array<{ label: string; items: EventListItem[] }> {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thisWeek: EventListItem[] = [];
  const thisMonth: EventListItem[] = [];
  const earlier: EventListItem[] = [];

  for (const event of events) {
    const date = new Date(event.occurred_at);
    if (date >= oneWeekAgo) thisWeek.push(event);
    else if (date >= oneMonthAgo) thisMonth.push(event);
    else earlier.push(event);
  }

  return [
    { label: "This week", items: thisWeek },
    { label: "This month", items: thisMonth },
    { label: "Earlier", items: earlier },
  ].filter((g) => g.items.length > 0);
}
