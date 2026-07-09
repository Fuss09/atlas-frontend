import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ConvictionLabel } from "@/components/shared/conviction-label";
import { WatchlistButton } from "@/components/shared/watchlist-button";
import { Badge } from "@/components/ui/badge";
import { formatDelta } from "@/lib/format";
import { cn } from "@/lib/utils";
import { STAGE_META, type OpportunityListItem } from "@/types";

interface OpportunityCardProps {
  opportunity: OpportunityListItem;
  rank: number;
  className?: string;
}

export function OpportunityCard({ opportunity, rank, className }: OpportunityCardProps) {
  const hasDelta = opportunity.delta_7d !== null && opportunity.delta_7d !== undefined && opportunity.delta_7d !== 0;
  const isPositive = (opportunity.delta_7d ?? 0) > 0;
  // company_slug falls back to "" if the underlying company was deleted
  // between score calculation and this read (see backend commit
  // fix(opportunities): expose company_slug) — render as a non-link
  // rather than a broken /companies/ URL in that rare case.
  const href = opportunity.company_slug ? `/companies/${opportunity.company_slug}` : null;

  const content = (
    <>
      <span className="w-6 shrink-0 text-center text-body-sm font-mono text-muted-foreground tabular-nums">
        {rank}
      </span>

      <CompanyLogo name={opportunity.company_name} logoUrl={opportunity.company_logo_url} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-body-sm font-medium text-foreground">{opportunity.company_name}</p>
          {opportunity.company_ticker && (
            <span className="text-caption font-mono text-muted-foreground shrink-0">
              {opportunity.company_ticker}
            </span>
          )}
        </div>
        {opportunity.company_sector && (
          <p className="text-caption text-muted-foreground truncate">{opportunity.company_sector}</p>
        )}
      </div>

      <Badge variant="outline" className="hidden lg:inline-flex text-muted-foreground shrink-0">
        {STAGE_META[opportunity.stage].label}
      </Badge>

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
    </>
  );

  const rowClassName = cn(
    "flex items-center gap-4 rounded-lg border border-transparent px-3 py-3 transition-colors",
    href && "hover:border-border hover:bg-secondary/40",
    className,
  );

  if (!href) {
    return <div className={rowClassName}>{content}</div>;
  }

  return (
    <Link href={href} className={rowClassName}>
      {content}
    </Link>
  );
}
