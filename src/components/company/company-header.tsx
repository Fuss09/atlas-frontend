import { ExternalLink } from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreSummary } from "@/components/shared/score-summary";
import { WatchlistButton } from "@/components/shared/watchlist-button";
import { Badge } from "@/components/ui/badge";
import type { CompanyResponse, OpportunityScoreResponse } from "@/types";

interface CompanyHeaderProps {
  company: CompanyResponse;
  opportunity?: OpportunityScoreResponse;
}

export function CompanyHeader({ company, opportunity }: CompanyHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div className="flex items-start gap-4 min-w-0">
        <CompanyLogo name={company.name} logoUrl={company.logo_url} size="lg" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-h1 text-foreground">{company.name}</h1>
            <WatchlistButton companyId={company.id} isWatched={false} />
          </div>
          <p className="text-body-sm text-muted-foreground mt-0.5">
            {company.ticker && <span className="font-mono">{company.ticker}</span>}
            {company.exchange && <span> · {company.exchange}</span>}
            {company.country && <span> · {company.country}</span>}
          </p>
          <p className="text-body-sm text-muted-foreground">
            {[company.sector, company.industry].filter(Boolean).join(" · ")}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {company.tags?.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="outline" className="text-muted-foreground">
                {tag}
              </Badge>
            ))}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-caption text-primary hover:underline ml-1"
              >
                Website <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {opportunity && (
        <ScoreSummary
          score={opportunity.score}
          conviction={opportunity.conviction}
          delta7d={opportunity.delta_7d}
          confidence={opportunity.confidence}
          updatedAt={opportunity.updated_at}
          size="lg"
          className="shrink-0"
        />
      )}
    </div>
  );
}
