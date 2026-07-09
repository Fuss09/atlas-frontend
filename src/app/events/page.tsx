import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EventsFilters, EventsFiltersSkeleton } from "@/components/event/events-filters";
import { EventsResults, EventsResultsSkeleton } from "@/components/event/events-results";
import type { EventType, ImportanceLevel } from "@/types";

export const metadata: Metadata = {
  title: "Events",
};

interface EventsPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    importance?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

/**
 * Same URL-as-source-of-truth Server Component architecture as
 * Companies/Opportunities: every filter and the current page live in
 * searchParams, EventsResults fetches exactly one page per request.
 * Converted from the Sprint 1 client-only version alongside the
 * Sprint 5 Timeline work, since a fully server-rendered global feed is
 * the same "minimize client JS" principle applied to the one list page
 * that had never been migrated.
 */
export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const searchKey = JSON.stringify(params);

  return (
    <AppShell breadcrumb={[{ label: "Events" }]}>
      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-6 md:py-8 space-y-6">
        <div>
          <h1 className="text-h1 mb-1">Events</h1>
          <p className="text-body-sm text-muted-foreground">
            All signals detected across every company in Atlas — funding, filings, approvals,
            partnerships, and more, in one chronological feed.
          </p>
        </div>

        <Suspense fallback={<EventsFiltersSkeleton />}>
          <EventsFilters />
        </Suspense>

        <Suspense key={searchKey} fallback={<EventsResultsSkeleton />}>
          <EventsResults
            q={params.q}
            eventType={params.type as EventType | undefined}
            importance={params.importance as ImportanceLevel | undefined}
            page={page}
            pageSize={PAGE_SIZE}
          />
        </Suspense>
      </div>
    </AppShell>
  );
}
