import { Activity, SearchX } from "lucide-react";
import { fetchEvents } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { EventCard } from "@/components/event/event-card";
import { CompaniesPagination } from "@/components/company/companies-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { EventType, ImportanceLevel } from "@/types";

interface EventsResultsProps {
  q?: string;
  eventType?: EventType;
  importance?: ImportanceLevel;
  page: number;
  pageSize: number;
}

/**
 * Same server-fetch-one-page pattern as CompaniesResults/
 * OpportunitiesResults: one page of the global feed per request,
 * windowed pagination reused as-is.
 */
export async function EventsResults({ q, eventType, importance, page, pageSize }: EventsResultsProps) {
  let data;
  try {
    data = await fetchEvents({
      q,
      event_type: eventType,
      importance,
      page,
      page_size: pageSize,
    });
  } catch (err) {
    return (
      <EmptyState
        variant="error"
        title="Couldn't load events"
        description={err instanceof ServerApiError ? err.message : undefined}
        className="py-20"
      />
    );
  }

  const hasFilters = Boolean(q || eventType || importance);

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={hasFilters ? SearchX : Activity}
        title={hasFilters ? "No events match these filters" : "No events yet"}
        description={hasFilters ? "Try widening your search or clearing a filter." : undefined}
        className="py-20"
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));

  return (
    <>
      <p className="text-body-sm text-muted-foreground">
        {data.total.toLocaleString("en-US")} {data.total === 1 ? "event" : "events"}
      </p>

      <div>
        {data.items.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {totalPages > 1 && <CompaniesPagination currentPage={page} totalPages={totalPages} />}
    </>
  );
}

export function EventsResultsSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-24" />
      <div className="space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </>
  );
}
