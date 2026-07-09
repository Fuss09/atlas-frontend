import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchRecentEvents } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { EventCard } from "@/components/event/event-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

function SectionHeader() {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-h2">Latest Events</h2>
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export async function LatestEventsSection() {
  let data;
  try {
    data = await fetchRecentEvents(10);
  } catch (err) {
    return (
      <section>
        <SectionHeader />
        <Card>
          <CardContent className="p-2">
            <EmptyState
              variant="error"
              title="Couldn't load recent activity"
              description={err instanceof ServerApiError ? err.message : undefined}
            />
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader />
      <Card>
        <CardContent className="p-2">
          {data.items.length === 0 ? (
            <EmptyState title="No events yet" />
          ) : (
            <div className="space-y-0.5">
              {data.items.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export function LatestEventsSkeleton() {
  return (
    <section>
      <SectionHeader />
      <Card>
        <CardContent className="p-2 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
