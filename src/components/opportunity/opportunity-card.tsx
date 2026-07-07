import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ConvictionLabel } from "@/components/shared/conviction-label";
import { WatchlistButton } from "@/components/shared/watchlist-button";
import { formatDelta } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OpportunityListItem } from "@/types";

interface OpportunityCardProps {
  opportunity: OpportunityListItem;
  rank: number;
  className?: string;
}

export function OpportunityCard({ opportunity, rank, className }: OpportunityCardProps) {
  const hasDelta = opportunity.delta_7d !== null && opportunity.delta_7d !== undefined && opportunity.delta_7d !== 0;
  const isPositive = (opportunity.delta_7d ?? 0) > 0;

  return (
    <Link
      href={`/companies/${opportunity.company_id}`}
      className={cn(
        "flex items-center gap-4 rounded-lg border border-transparent px-3 py-3 hover:border-border hover:bg-secondary/40 transition-colors",
        className,
      )}
    >
      <span className="w-6 shrink-0 text-center text-body-sm font-mono text-muted-foreground tabular-nums">
        {rank}
      </span>

      <CompanyLogo name={opportunity.company_name} logoUrl={opportunity.logo_url} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-body-sm font-medium text-foreground">{opportunity.company_name}</p>
          {opportunity.ticker && (
            <span className="text-caption font-mono text-muted-foreground shrink-0">{opportunity.ticker}</span>
          )}
        </div>
        {opportunity.sector && <p className="text-caption text-muted-foreground truncate">{opportunity.sector}</p>}
      </div>

      {hasDelta && (
        <span
          className={cn(
            "hidden sm:inline-flex items-center gap-1 text-body-sm font-mono tabular-nums shrink-0",
            isPositive ? "text-success" : "text-danger",
          )}
        >
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {formatDelta(opportunity.delta_7d)}
        </span>
      )}

      <div className="hidden md:block shrink-0">
        <ConvictionLabel level={opportunity.conviction} />
      </div>

      <ScoreBadge score={opportunity.score} conviction={opportunity.conviction} size="sm" />

      <WatchlistButton companyId={opportunity.company_id} className="shrink-0" />
    </Link>
  );
}
