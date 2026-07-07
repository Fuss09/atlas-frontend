import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OpportunityScoreResponse } from "@/types";

const COMPONENT_LABELS: Record<string, string> = {
  events_score: "Events",
  theme_strength_score: "Theme Strength",
  company_quality_score: "Company Quality",
  discovery_signals_score: "Discovery Signals",
  market_signals_score: "Market Signals",
};

interface ScoreBreakdownProps {
  opportunity: OpportunityScoreResponse;
}

export function ScoreBreakdown({ opportunity }: ScoreBreakdownProps) {
  const components = [
    { key: "events_score", value: opportunity.events_score },
    { key: "theme_strength_score", value: opportunity.theme_strength_score },
    { key: "company_quality_score", value: opportunity.company_quality_score },
    { key: "discovery_signals_score", value: opportunity.discovery_signals_score },
    { key: "market_signals_score", value: opportunity.market_signals_score },
  ];

  const isMarketSignalsStub = opportunity.market_signals_score === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {components.map(({ key, value }) => {
            const isStub = key === "market_signals_score";
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-foreground">{COMPONENT_LABELS[key]}</span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {isStub && isMarketSignalsStub ? "Not yet connected" : `${Math.round(value)}/100`}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full bg-primary transition-all duration-400",
                      isStub && isMarketSignalsStub && "bg-muted-foreground/30",
                    )}
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
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
      </CardContent>
    </Card>
  );
}
