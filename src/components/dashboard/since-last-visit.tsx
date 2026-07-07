"use client";

import { Building2, TrendingUp, Users, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLastVisit } from "@/hooks/use-last-visit";
import { eventsApi, opportunitiesApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SummaryItem {
  icon: typeof Building2;
  count: number;
  label: string;
}

/**
 * "Since your last visit" — the very first thing the user sees.
 * Answers "what changed" in under 30 seconds: new companies, important
 * events, opportunity score movement, new themes, new partnerships.
 *
 * Backend note: this reads from existing Module 04/05/06 endpoints
 * (events, opportunities) filtered by occurred_after=previousVisit.
 * A future dedicated /dashboard/summary endpoint could consolidate
 * this into a single call — not required for Sprint 1.
 */
export function SinceLastVisit() {
  const { previousVisit, ready } = useLastVisit();

  const isFirstVisit = ready && !previousVisit;

  const { data: newEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["dashboard", "since-visit", "events", previousVisit],
    queryFn: () =>
      eventsApi.list({
        occurred_after: previousVisit ?? undefined,
        importance: undefined,
        page: 1,
        page_size: 50,
      }),
    enabled: ready && !!previousVisit,
  });

  const { data: opportunities, isLoading: oppsLoading } = useQuery({
    queryKey: ["dashboard", "since-visit", "opportunities"],
    queryFn: () => opportunitiesApi.list({ page: 1, page_size: 50 }),
    enabled: ready && !!previousVisit,
  });

  if (!ready || eventsLoading || oppsLoading) {
    return (
      <Card className="border-border-subtle">
        <CardContent className="flex flex-wrap items-center gap-6 py-4">
          <Skeleton className="h-5 w-64" />
        </CardContent>
      </Card>
    );
  }

  if (isFirstVisit) {
    return (
      <Card className="border-border-subtle bg-surface">
        <CardContent className="py-4">
          <p className="text-body text-muted-foreground">
            Welcome to Atlas. This space will summarize what changed each time you come back.
          </p>
        </CardContent>
      </Card>
    );
  }

  const criticalEvents = (newEvents?.items ?? []).filter(
    (e) => e.importance === "critical" || e.importance === "high",
  );
  const newCompaniesCount = (newEvents?.items ?? []).filter(
    (e) => e.event_type === "yc_discovery" || e.event_type === "crunchbase_funding",
  ).length;
  const newPartnerships = (newEvents?.items ?? []).filter((e) => e.event_type === "partnership").length;
  const risingScores = (opportunities?.items ?? []).filter(
    (o) => (o.delta_7d ?? 0) > 0,
  ).length;

  const items: SummaryItem[] = [
    { icon: Building2, count: newCompaniesCount, label: "new companies discovered" },
    { icon: Zap, count: criticalEvents.length, label: "important events" },
    { icon: TrendingUp, count: risingScores, label: "rising opportunity scores" },
    { icon: Users, count: newPartnerships, label: "new partnerships" },
  ];

  const activeItems = items.filter((i) => i.count > 0);

  return (
    <Card className="border-border-subtle bg-surface">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-caption font-medium text-muted-foreground uppercase tracking-wide shrink-0">
            Since your last visit
            {previousVisit && (
              <span className="normal-case font-normal"> · {formatDate(previousVisit, "MMM d, HH:mm")}</span>
            )}
          </span>

          {activeItems.length === 0 ? (
            <span className="text-body-sm text-muted-foreground">Nothing new to report — all quiet.</span>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              {activeItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-1.5 text-body-sm">
                    <Icon className={cn("h-3.5 w-3.5", "text-primary")} />
                    <span className="font-mono font-medium tabular-nums text-foreground">{item.count}</span>
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
