import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { fetchOpportunities } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

function SectionHeader() {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-h2">Top Opportunities</h2>
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export async function TopOpportunitiesSection() {
  let data;
  try {
    data = await fetchOpportunities({ page: 1, page_size: 5 });
  } catch (err) {
    return (
      <section>
        <SectionHeader />
        <Card>
          <CardContent className="p-2">
            <EmptyState
              variant="error"
              title="Couldn't load opportunities"
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
            <EmptyState
              icon={Target}
              title="No opportunities yet"
              description="Scores appear once companies and events are discovered."
            />
          ) : (
            <div className="space-y-0.5">
              {data.items.map((opp, i) => (
                <OpportunityCard key={opp.company_id} opportunity={opp} rank={i + 1} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export function TopOpportunitiesSkeleton() {
  return (
    <section>
      <SectionHeader />
      <Card>
        <CardContent className="p-2 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
