import { AtlasInsight } from "@/components/shared/atlas-insight";
import { ScoreBreakdown } from "@/components/company/score-breakdown";
import { EventCard } from "@/components/event/event-card";
import { ThemeCard } from "@/components/theme/theme-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CompanyResponse, EventListItem, OpportunityScoreResponse, ThemeListItem } from "@/types";

interface OverviewTabProps {
  company: CompanyResponse;
  opportunity?: OpportunityScoreResponse;
  recentEvents?: EventListItem[];
  themes?: ThemeListItem[];
}

export function OverviewTab({ company, opportunity, recentEvents, themes }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {company.description ?? "No description available yet."}
            </p>
          </CardContent>
        </Card>

        {opportunity ? (
          <ScoreBreakdown opportunity={opportunity} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState title="Score not yet computed" className="border-none py-8" />
            </CardContent>
          </Card>
        )}
      </div>

      <AtlasInsight />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Events</CardTitle>
          <Link
            href="#events"
            className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground"
          >
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-2">
          {!recentEvents || recentEvents.length === 0 ? (
            <EmptyState title="No events yet" className="border-none py-8" />
          ) : (
            <div className="space-y-0.5">
              {recentEvents.slice(0, 5).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {themes && themes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} variant="list" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
