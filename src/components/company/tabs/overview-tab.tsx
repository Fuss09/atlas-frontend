import { AtlasInsight } from "@/components/shared/atlas-insight";
import { ScoreBreakdown } from "@/components/company/score-breakdown";
import { EventCard } from "@/components/event/event-card";
import { ThemeCard } from "@/components/theme/theme-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Radar, ArrowRight } from "lucide-react";
import type { CompanyResponse, EventListItem, OpportunityScoreResponse, ThemeListItem } from "@/types";

interface OverviewTabProps {
  company: CompanyResponse;
  opportunity?: OpportunityScoreResponse;
  recentEvents?: EventListItem[];
  themes?: ThemeListItem[];
  sourcesCount: number;
}

/**
 * Overview is the front door of the Company Page — it should answer, in
 * one screen: why is this interesting (ScoreBreakdown), what recently
 * happened (Recent Events), what is it connected to (Themes), and where
 * does the data come from (Sources summary, linking to the full tab).
 *
 * "See all" links here switch tabs via [data-tab-switch] rather than
 * anchor hrefs, since Radix Tabs doesn't respond to URL fragments — see
 * CompanyTabs for the click-delegation that makes this work without
 * turning this component itself into a Client Component.
 */
export function OverviewTab({ company, opportunity, recentEvents, themes, sourcesCount }: OverviewTabProps) {
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
              <EmptyState
                title="Score not yet computed"
                description="Atlas calculates a score once it has enough events and signals for this company."
                className="border-none py-8"
              />
            </CardContent>
          </Card>
        )}
      </div>

      <AtlasInsight />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Events</CardTitle>
          <button
            type="button"
            data-tab-switch="events"
            className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See all <ArrowRight className="h-3.5 w-3.5" />
          </button>
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Themes</CardTitle>
            {themes.length > 4 && (
              <button
                type="button"
                data-tab-switch="themes"
                className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                See all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.slice(0, 4).map((theme) => (
                <ThemeCard key={theme.id} theme={theme} variant="list" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary shrink-0">
              <Radar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-body-sm text-foreground">
                {sourcesCount === 0
                  ? "No source history yet"
                  : `Tracked from ${sourcesCount} data ${sourcesCount === 1 ? "source" : "sources"}`}
              </p>
              <p className="text-caption text-muted-foreground">
                Every fact in Atlas traces back to where it came from.
              </p>
            </div>
          </div>
          <button
            type="button"
            data-tab-switch="sources"
            className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            View sources <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
