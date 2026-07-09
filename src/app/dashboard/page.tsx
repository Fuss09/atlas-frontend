import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SinceLastVisit } from "@/components/dashboard/since-last-visit";
import {
  TopOpportunitiesSection,
  TopOpportunitiesSkeleton,
} from "@/components/dashboard/top-opportunities-section";
import {
  LatestDiscoveriesSection,
  LatestDiscoveriesSkeleton,
} from "@/components/dashboard/latest-discoveries-section";
import { PopularThemesSection, PopularThemesSkeleton } from "@/components/dashboard/popular-themes-section";
import { LatestEventsSection, LatestEventsSkeleton } from "@/components/dashboard/latest-events-section";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Dashboard is a Server Component: every section below fetches its own
 * data on the server (see lib/api/server-data.ts) and streams in via its
 * own <Suspense> boundary. A slow or failing section — e.g. Discovery
 * jobs — never blocks the rest of the page from painting.
 *
 * SinceLastVisit is the one Client Component here: it depends on
 * localStorage (the user's last-visit timestamp), which only exists in
 * the browser.
 */
export default function DashboardPage() {
  return (
    <AppShell breadcrumb={[{ label: "Dashboard" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 space-y-8">
        <SinceLastVisit />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<TopOpportunitiesSkeleton />}>
            <TopOpportunitiesSection />
          </Suspense>
          <Suspense fallback={<LatestDiscoveriesSkeleton />}>
            <LatestDiscoveriesSection />
          </Suspense>
        </div>

        <Suspense fallback={<PopularThemesSkeleton />}>
          <PopularThemesSection />
        </Suspense>

        <Suspense fallback={<LatestEventsSkeleton />}>
          <LatestEventsSection />
        </Suspense>
      </div>
    </AppShell>
  );
}
