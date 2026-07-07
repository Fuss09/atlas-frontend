"use client";

import * as React from "react";
import { ChevronDown, Info, Target } from "lucide-react";
import { useOpportunities } from "@/hooks/use-opportunities";
import { OpportunityCard } from "@/components/opportunity/opportunity-card";
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
import { cn } from "@/lib/utils";

export function OpportunitiesExplorer() {
  const [conviction, setConviction] = React.useState<string | undefined>();
  const [page, setPage] = React.useState(1);
  const [explainerOpen, setExplainerOpen] = React.useState(false);

  const { data, isLoading, isPlaceholderData, error, refetch } = useOpportunities({
    conviction,
    page,
    page_size: 25,
  });

  React.useEffect(() => setPage(1), [conviction]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 mb-1">Opportunities</h1>
        <p className="text-body-sm text-muted-foreground">
          Companies ranked by Atlas Opportunity Score — always explainable, never a black box.
        </p>
      </div>

      <ScoreExplainerBanner open={explainerOpen} onToggle={() => setExplainerOpen((o) => !o)} />

      <div className="flex items-center gap-3">
        <Select value={conviction} onValueChange={(v) => setConviction(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Conviction level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="very_high">Very High</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="very_low">Very Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState icon={Target} title="No opportunities found" />
      ) : (
        <>
          <div
            className={cn(
              "divide-y divide-border-subtle rounded-lg border border-border-subtle transition-opacity",
              isPlaceholderData && "opacity-60",
            )}
          >
            {data.items.map((opp, i) => (
              <OpportunityCard
                key={opp.company_id}
                opportunity={opp}
                rank={(page - 1) * 25 + i + 1}
              />
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

function ScoreExplainerBanner({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-body-sm text-muted-foreground"
      >
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1">
          Score computed from 5 components: Events, Theme Strength, Company Quality, Discovery Signals,
          Market Signals (soon).
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 text-body-sm text-muted-foreground leading-relaxed border-t border-border-subtle mt-0">
          <p className="pt-3">
            Every Opportunity Score breaks down into five weighted components. Each company page shows
            the full breakdown along with the specific positive and negative factors that drove the
            number — nothing is a black box. Market Signals is a reserved component, not yet connected
            to live pricing data.
          </p>
        </div>
      )}
    </div>
  );
}
