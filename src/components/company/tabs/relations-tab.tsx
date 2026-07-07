"use client";

import * as React from "react";
import Link from "next/link";
import { Waypoints } from "lucide-react";
import { useCompanyGraph } from "@/hooks/use-graph";
import { RelationCard } from "@/components/graph/relation-card";
import { RelationDetailPanel } from "@/components/graph/relation-detail-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { RELATION_TYPE_LABELS, type RelationResponse, type RelationType } from "@/types";

interface RelationsTabProps {
  companyId: string;
  companySlug: string;
}

export function RelationsTab({ companyId, companySlug }: RelationsTabProps) {
  const { data, isLoading, error, refetch } = useCompanyGraph(companyId, 1);
  const [selected, setSelected] = React.useState<RelationResponse | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  if (!data || data.relations.length === 0) {
    return (
      <EmptyState
        icon={Waypoints}
        title="No known relations yet"
        description="Atlas will surface competitors, suppliers, partners and investors here as the Knowledge Graph grows."
      />
    );
  }

  const grouped = groupByType(data.relations);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-muted-foreground">
          {data.relations_count} {data.relations_count === 1 ? "relation" : "relations"}
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/companies/${companySlug}/graph`}>
            <Waypoints className="h-3.5 w-3.5" />
            View as Graph
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {grouped.map((group) => (
            <div key={group.type}>
              <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {RELATION_TYPE_LABELS[group.type]}
              </p>
              <div className="space-y-0.5">
                {group.items.map((relation) => (
                  <RelationCard
                    key={relation.id}
                    relation={relation}
                    perspectiveId={companyId}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block sticky top-20 self-start">
          <RelationDetailPanel relation={selected} />
        </div>
      </div>
    </div>
  );
}

function groupByType(
  relations: RelationResponse[],
): Array<{ type: RelationType; items: RelationResponse[] }> {
  const map = new Map<RelationType, RelationResponse[]>();
  for (const r of relations) {
    const list = map.get(r.relation_type) ?? [];
    list.push(r);
    map.set(r.relation_type, list);
  }
  return Array.from(map.entries()).map(([type, items]) => ({ type, items }));
}
