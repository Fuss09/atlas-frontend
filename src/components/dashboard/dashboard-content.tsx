"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useThemes } from "@/hooks/use-themes";
import { useEvents } from "@/hooks/use-events";
import { useOpportunities } from "@/hooks/use-opportunities";
import { useDiscoveryJobs } from "@/hooks/use-discovery";
import { ThemeCard } from "@/components/theme/theme-card";
import { EventCard } from "@/components/event/event-card";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { Sparkles, Radar, Target } from "lucide-react";

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-h2">{title}</h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export function DashboardContent() {
  return (
    <>
      <TopOpportunitiesAndDiscovery />
      <ThemesRow />
      <RecentEventsRow />
    </>
  );
}

function TopOpportunitiesAndDiscovery() {
  const { data: opportunities, isLoading, error, refetch } = useOpportunities({
    page: 1,
    page_size: 5,
  });
  const { data: jobs, isLoading: jobsLoading } = useDiscoveryJobs();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section>
        <SectionHeader title="Top Opportunities" href="/opportunities" />
        <Card>
          <CardContent className="p-2">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : error ? (
              <ErrorState error={error} onRetry={refetch} compact />
            ) : !opportunities || opportunities.items.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No opportunities yet"
                description="Scores appear once companies and events are discovered."
                className="border-none py-10"
              />
            ) : (
              <div className="space-y-0.5">
                {opportunities.items.map((opp, i) => (
                  <OpportunityCard key={opp.company_id} opportunity={opp} rank={i + 1} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionHeader title="Discovery Activity" href="/discovery" />
        <Card>
          <CardContent className="p-4">
            {jobsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !jobs || jobs.length === 0 ? (
              <EmptyState
                icon={Radar}
                title="No discovery jobs yet"
                description="Trigger a collector from the Discovery page to get started."
                className="border-none py-10"
              />
            ) : (
              <div className="divide-y divide-border-subtle">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-body-sm font-medium capitalize text-foreground">{job.source}</span>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="flex items-center gap-3 text-caption text-muted-foreground shrink-0">
                      <span className="font-mono">{job.companies_found} found</span>
                      <span>{formatRelativeTime(job.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "success" ? "success" : status === "failed" ? "danger" : status === "running" ? "info" : "default";
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}

function ThemesRow() {
  const { data: themes, isLoading, error, refetch } = useThemes();

  return (
    <section>
      <SectionHeader title="Themes" href="/themes" />
      {isLoading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-52 shrink-0" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} compact />
      ) : !themes || themes.length === 0 ? (
        <EmptyState icon={Sparkles} title="No themes yet" className="py-10" />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {themes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} variant="dashboard" />
          ))}
        </div>
      )}
    </section>
  );
}

function RecentEventsRow() {
  const { data: events, isLoading, error, refetch } = useEvents({ page: 1, page_size: 10 });

  return (
    <section>
      <SectionHeader title="Recent Activity" href="/events" />
      <Card>
        <CardContent className="p-2">
          {isLoading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} compact />
          ) : !events || events.items.length === 0 ? (
            <EmptyState title="No events yet" className="border-none py-10" />
          ) : (
            <div className="space-y-0.5">
              {events.items.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
