import { Radar, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/discovery/source-badge";
import { formatDate, formatRelativeTime } from "@/lib/format";
import type { CompanyDiscoverySource } from "@/types";

const ACTION_VARIANT: Record<string, "success" | "info" | "default"> = {
  created: "success",
  updated: "info",
  skipped: "default",
};

const ACTION_LABEL: Record<string, string> = {
  created: "Company created",
  updated: "Data enriched",
  skipped: "Skipped (duplicate)",
};

interface SourcesTabProps {
  sources: CompanyDiscoverySource[];
}

/**
 * Server-safe presentational component — receives its data as props from
 * the Server Component tree (see company-page-content.tsx), no hooks.
 * Answers "where did this data come from?" per the Sprint 3 spec: every
 * row traces back to a real collector run with a timestamp and, where
 * available, a link to the original external source.
 */
export function SourcesTab({ sources }: SourcesTabProps) {
  if (sources.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            icon={Radar}
            title="No source history yet"
            description="This company hasn't been discovered or enriched by a collector yet."
            className="border-none py-16"
          />
        </CardContent>
      </Card>
    );
  }

  // Most recent first — matches the timeline convention used elsewhere in the app.
  const sorted = [...sources].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <Card>
      <CardContent className="p-2">
        <div className="divide-y divide-border-subtle">
          {sorted.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 py-3 px-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge source={entry.source} className="text-body-sm font-medium text-foreground" />
                  <Badge variant={ACTION_VARIANT[entry.action] ?? "default"}>
                    {ACTION_LABEL[entry.action] ?? entry.action}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1 text-caption text-muted-foreground">
                  <span title={formatDate(entry.created_at, "MMM d, yyyy 'at' HH:mm")}>
                    {formatRelativeTime(entry.created_at)}
                  </span>
                  {entry.external_id && (
                    <>
                      <span>·</span>
                      <span className="font-mono">{entry.external_id}</span>
                    </>
                  )}
                </div>
              </div>
              {entry.external_url && (
                <a
                  href={entry.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-caption text-primary hover:underline shrink-0"
                >
                  View source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
