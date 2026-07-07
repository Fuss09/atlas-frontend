"use client";

import * as React from "react";
import { useCompanyBySlug } from "@/hooks/use-companies";
import { useCompanyGraph } from "@/hooks/use-graph";
import { RelationDetailPanel } from "@/components/graph/relation-detail-panel";
import { SimpleGraphCanvas } from "@/components/graph/simple-graph-canvas";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Waypoints } from "lucide-react";
import type { RelationResponse } from "@/types";

/**
 * Company-centered graph view.
 *
 * Sprint 1 note: renders a simplified radial SVG layout (see
 * SimpleGraphCanvas) rather than a full force-directed physics engine.
 * The interaction model (select node → recenter, select edge → detail
 * panel) matches the validated spec; the rendering engine itself is
 * upgraded in Sprint 6 without changing this page's structure or data
 * contracts.
 */
export function CompanyGraphView({ slug }: { slug: string }) {
  const { data: company, isLoading: companyLoading } = useCompanyBySlug(slug);
  const [depth, setDepth] = React.useState(1);
  const { data, isLoading, error, refetch } = useCompanyGraph(company?.id, depth);
  const [selected, setSelected] = React.useState<RelationResponse | null>(null);

  if (companyLoading || isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !company) return <ErrorState error={error} onRetry={refetch} className="m-6" />;

  if (!data || data.relations.length === 0) {
    return (
      <EmptyState
        icon={Waypoints}
        title="No relationships to visualize yet"
        description={`${company.name} has no known connections in the Knowledge Graph.`}
        className="m-6"
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {[1, 2, 3].map((d) => (
            <button
              key={d}
              onClick={() => setDepth(d)}
              className={`h-8 w-8 rounded-md border text-body-sm font-medium transition-colors ${
                depth === d
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <SimpleGraphCanvas
          centerLabel={company.name}
          relations={data.relations}
          centerId={company.id}
          onSelectRelation={setSelected}
        />
      </div>
      <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-border p-4">
        <RelationDetailPanel relation={selected} />
      </div>
    </div>
  );
}
