import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OpportunityScoreResponse } from "@/types";

/**
 * Human labels for known component ids. Falls back to a capitalized
 * version of the raw key for any component the backend adds later —
 * this list intentionally isn't exhaustive so new components never
 * render blank.
 */
const COMPONENT_LABELS: Record<string, string> = {
  events: "Events",
  theme_strength: "Theme Strength",
  company_quality: "Company Quality",
  discovery_signals: "Discovery Signals",
  market_signals: "Market Signals",
};

function labelFor(key: string): string {
  return COMPONENT_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ScoreBreakdownProps {
  opportunity: OpportunityScoreResponse;
}

/**
 * Renders the exact backend contract: opportunity.components is a dict
 * keyed by component id, each with its own value (nullable when
 * is_connected is false — e.g. Market Signals isn't wired to live
 * pricing data yet). The backend also aggregates the overall positive/
 * negative factors at the top level (opportunity.positive_factors /
 * negative_factors) — used directly here rather than re-deriving them
 * from per-component lists, since the backend's aggregation is the
 * source of truth for "what matters most" ordering.
 */
export function ScoreBreakdown({ opportunity }: ScoreBreakdownProps) {
  const entries = Object.entries(opportunity.components);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {entries.map(([key, component]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-foreground">{labelFor(key)}</span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {component.is_connected && component.value !== null
                    ? `${Math.round(component.value)}/100`
                    : "Not yet connected"}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full bg-primary transition-all duration-400",
                    !component.is_connected && "bg-muted-foreground/30",
                  )}
                  style={{ width: `${Math.min(component.value ?? 0, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {(opportunity.positive_factors.length > 0 || opportunity.negative_factors.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
            {opportunity.positive_factors.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide">
                  Positive factors
                </p>
                <ul className="space-y-1">
                  {opportunity.positive_factors.slice(0, 3).map((factor, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-body-sm text-foreground">
                      <Check className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {opportunity.negative_factors.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide">
                  Negative factors
                </p>
                <ul className="space-y-1">
                  {opportunity.negative_factors.slice(0, 3).map((factor, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-body-sm text-foreground">
                      <X className="h-3.5 w-3.5 text-danger shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-border-subtle">
          <p className="text-caption text-muted-foreground">{opportunity.stage_rationale}</p>
        </div>
      </CardContent>
    </Card>
  );
}
