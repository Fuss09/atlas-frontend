"use client";

import * as React from "react";
import { useCompanyEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/event/event-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Activity } from "lucide-react";
import type { EventListItem } from "@/types";

interface EventsTabProps {
  companyId: string;
}

/**
 * The unified company timeline, per validated spec: a single chronological
 * feed covering Discovery, Funding, FDA, Earnings, Partnerships, Theme
 * additions, Acquisitions, and every other EventType — grouped by period
 * the way Linear groups activity logs.
 */
export function EventsTab({ companyId }: EventsTabProps) {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, error, refetch, isPlaceholderData } = useCompanyEvents(companyId, page);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No events recorded yet"
        description="This company's timeline — discoveries, filings, funding, partnerships and more — will appear here as Atlas collects data."
      />
    );
  }

  const groups = groupByPeriod(data.items);

  return (
    <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
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

      {data.total > data.page_size && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
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
