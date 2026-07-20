"use client";

import Link from "next/link";
import { CalendarClock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingCatalysts } from "@/hooks/use-catalysts";
import type { Catalyst } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  clinical_readout: "Clinical readout",
  earnings: "Earnings",
  regulatory_decision: "Regulatory",
  conference: "Conference",
  product_launch: "Launch",
  lockup_expiry: "Lock-up expiry",
  other: "Other",
};

/**
 * Renders the date at its REAL precision: a month-precision date shows
 * "September 2026", never a fabricated "1 Sept". Honest dates only.
 */
function formatExpectedDate(catalyst: Catalyst): string {
  const d = new Date(`${catalyst.expected_date}T00:00:00Z`);
  if (catalyst.date_precision === "day") {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }
  if (catalyst.date_precision === "quarter") {
    return `Q${Math.floor(d.getUTCMonth() / 3) + 1} ${d.getUTCFullYear()}`;
  }
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

function monthKey(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function CatalystsTimeline() {
  const { data, isLoading, isError } = useUpcomingCatalysts(365);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-body font-medium text-foreground">Couldn&apos;t load catalysts</p>
          <p className="text-body-sm text-muted-foreground">The backend may be unreachable. Try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <CalendarClock className="h-8 w-8 text-muted-foreground" />
          <p className="text-body font-medium text-foreground">No upcoming catalysts yet</p>
          <p className="max-w-md text-body-sm text-muted-foreground">
            Run the catalyst sync to pull clinical-trial readout dates, or add
            dated events (earnings, regulatory decisions…) via the API.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Regroupement par mois, l'API renvoie déjà trié chronologiquement
  const groups: { month: string; items: Catalyst[] }[] = [];
  for (const c of data) {
    const key = monthKey(c.expected_date);
    const last = groups[groups.length - 1];
    if (last && last.month === key) {
      last.items.push(c);
    } else {
      groups.push({ month: key, items: [c] });
    }
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.month}>
          <h2 className="text-h3 mb-3 text-muted-foreground">{group.month}</h2>
          <div className="space-y-3">
            {group.items.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{TYPE_LABELS[c.catalyst_type] ?? c.catalyst_type}</Badge>
                      <Link
                        href={`/companies/${c.company.slug}`}
                        className="text-body font-medium text-foreground hover:underline"
                      >
                        {c.company.name}
                      </Link>
                      {c.company.ticker && (
                        <span className="text-caption text-muted-foreground">{c.company.ticker}</span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-body-sm text-muted-foreground">{c.title}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-body-sm font-medium text-foreground">
                      {formatExpectedDate(c)}
                    </span>
                    {c.source_url && (
                      <a
                        href={c.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open source"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
