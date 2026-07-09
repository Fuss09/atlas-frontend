import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { fetchRecentDiscoveries } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/format";

const STATUS_VARIANT: Record<string, "success" | "danger" | "info" | "warning" | "default"> = {
  success: "success",
  failed: "danger",
  running: "info",
  partial: "warning",
  pending: "default",
};

function SectionHeader() {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-h2">Latest Discoveries</h2>
      <Link
        href="/discovery"
        className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export async function LatestDiscoveriesSection() {
  let jobs;
  try {
    jobs = await fetchRecentDiscoveries(4);
  } catch (err) {
    return (
      <section>
        <SectionHeader />
        <Card>
          <CardContent className="p-4">
            <EmptyState
              variant="error"
              title="Couldn't load discovery activity"
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
        <CardContent className="p-4">
          {jobs.length === 0 ? (
            <EmptyState
              icon={Radar}
              title="No discovery jobs yet"
              description="Trigger a collector from the Discovery page to get started."
            />
          ) : (
            <div className="divide-y divide-border-subtle">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-body-sm font-medium capitalize text-foreground">{job.source}</span>
                    <Badge variant={STATUS_VARIANT[job.status] ?? "default"} className="capitalize">
                      {job.status}
                    </Badge>
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
  );
}

export function LatestDiscoveriesSkeleton() {
  return (
    <section>
      <SectionHeader />
      <Card>
        <CardContent className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
