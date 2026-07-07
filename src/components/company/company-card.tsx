import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreBadge } from "@/components/shared/score-badge";
import { WatchlistButton } from "@/components/shared/watchlist-button";
import { formatMarketCap } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CompanyListItem } from "@/types";

interface CompanyCardProps {
  company: CompanyListItem;
  variant?: "grid" | "compact";
  className?: string;
}

export function CompanyCard({ company, variant = "grid", className }: CompanyCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/companies/${company.slug}`}>
        <Card className={cn("hover:border-border-subtle hover:-translate-y-0.5 transition-all duration-150", className)}>
          <CardContent className="flex items-center gap-3 p-3">
            <CompanyLogo name={company.name} logoUrl={company.logo_url} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-medium text-foreground">{company.name}</p>
              <p className="truncate text-caption text-muted-foreground">
                {company.ticker ?? company.sector ?? "—"}
              </p>
            </div>
            {company.atlas_score !== null && <ScoreBadge score={company.atlas_score} size="sm" />}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/companies/${company.slug}`} className="group block">
      <Card className={cn("h-full hover:border-border-subtle hover:-translate-y-0.5 transition-all duration-150 relative", className)}>
        <div className="absolute right-2 top-2 z-10">
          <WatchlistButton companyId={company.id} />
        </div>
        <CardContent className="p-4 flex flex-col gap-3 h-full">
          <div className="flex items-start gap-3">
            <CompanyLogo name={company.name} logoUrl={company.logo_url} size="md" />
            <div className="min-w-0 flex-1 pr-6">
              <p className="truncate text-body font-semibold text-foreground">{company.name}</p>
              <p className="text-caption text-muted-foreground">
                {company.ticker ? (
                  <span className="font-mono">{company.ticker}</span>
                ) : (
                  "Private"
                )}
                {company.exchange && <span> · {company.exchange}</span>}
              </p>
            </div>
          </div>

          {company.description_short && (
            <p className="text-body-sm text-muted-foreground line-clamp-2 flex-1">
              {company.description_short}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-wrap gap-1">
              {company.sector && (
                <Badge variant="outline" className="text-muted-foreground">
                  {company.sector}
                </Badge>
              )}
            </div>
            {company.atlas_score !== null && <ScoreBadge score={company.atlas_score} size="sm" />}
          </div>

          {company.market_cap_usd !== null && (
            <p className="text-caption text-muted-foreground font-mono">
              {formatMarketCap(company.market_cap_usd)} market cap
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
