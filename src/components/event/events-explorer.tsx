"use client";

import * as React from "react";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/event/event-card";
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
import { Activity } from "lucide-react";
import { EVENT_TYPE_META, IMPORTANCE_META, type EventType, type ImportanceLevel } from "@/types";

export function EventsExplorer() {
  const [eventType, setEventType] = React.useState<EventType | undefined>();
  const [importance, setImportance] = React.useState<ImportanceLevel | undefined>();
  const [page, setPage] = React.useState(1);

  const { data, isLoading, error, refetch, isPlaceholderData } = useEvents({
    event_type: eventType,
    importance,
    page,
    page_size: 20,
  });

  React.useEffect(() => setPage(1), [eventType, importance]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 mb-1">Events</h1>
        <p className="text-body-sm text-muted-foreground">All signals detected across every company in Atlas.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={eventType} onValueChange={(v) => setEventType(v === "all" ? undefined : (v as EventType))}>
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
          value={importance}
          onValueChange={(v) => setImportance(v === "all" ? undefined : (v as ImportanceLevel))}
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
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState icon={Activity} title="No events found" description="Try adjusting your filters." />
      ) : (
        <>
          <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {data.items.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {data.total > data.page_size && (
            <div className="flex items-center justify-center gap-2">
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
        </>
      )}
    </div>
  );
}
