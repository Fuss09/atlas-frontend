"use client";

import * as React from "react";
import Link from "next/link";
import { Waypoints, Search, SearchX, ArrowUpDown } from "lucide-react";
import { useCompanyGraph } from "@/hooks/use-graph";
import { RelationCard } from "@/components/graph/relation-card";
import { RelationDetailPanel } from "@/components/graph/relation-detail-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { GraphEdge } from "@/lib/graph-data";
import {
  RELATION_CATEGORY_LABELS,
  RELATION_TYPE_CATEGORY,
  RELATION_TYPE_LABELS,
  type RelationCategory,
  type RelationResponse,
  type RelationType,
} from "@/types";

interface RelationsTabProps {
  companyId: string;
  companySlug: string;
}

type SortOption = "confidence_desc" | "weight_desc" | "name_asc" | "recent";

const SORT_LABELS: Record<SortOption, string> = {
  confidence_desc: "Confidence (high to low)",
  weight_desc: "Weight (high to low)",
  name_asc: "Name (A–Z)",
  recent: "Recently added",
};

/**
 * The Relations tab: every direct connection Atlas has established for
 * this company, with intelligent grouping (by what the relationship
 * *means* — market position, business, ownership, theme membership —
 * rather than a flat list of 11 raw relation types), search, sort, and
 * type filtering. Every row shows a visual weight bar and numeric
 * confidence; selecting one opens the same explainability panel used
 * by the full graph view, so switching between the tab and "View as
 * Graph" feels like one continuous experience rather than two
 * different tools.
 */
export function RelationsTab({ companyId, companySlug }: RelationsTabProps) {
  const { data, isLoading, error, refetch } = useCompanyGraph(companyId, 1);
  const [selected, setSelected] = React.useState<RelationResponse | null>(null);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const [typeFilter, setTypeFilter] = React.useState<RelationType | "all">("all");
  const [sort, setSort] = React.useState<SortOption>("confidence_desc");

  const relations = React.useMemo(() => data?.relations ?? [], [data]);

  const availableTypes = React.useMemo(() => {
    const types = new Set<RelationType>();
    for (const r of relations) types.add(r.relation_type);
    return Array.from(types);
  }, [relations]);

  const filtered = React.useMemo(() => {
    let result = relations;

    if (typeFilter !== "all") {
      result = result.filter((r) => r.relation_type === typeFilter);
    }

    if (debouncedQuery.trim().length > 0) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter((r) => {
        const isOutgoing = r.source_id === companyId;
        const label = (isOutgoing ? r.target_label : r.source_label) ?? "";
        return label.toLowerCase().includes(q);
      });
    }

    const sorted = [...result];
    switch (sort) {
      case "weight_desc":
        sorted.sort((a, b) => b.weight - a.weight);
        break;
      case "name_asc":
        sorted.sort((a, b) => {
          const aOut = a.source_id === companyId;
          const bOut = b.source_id === companyId;
          const aLabel = (aOut ? a.target_label : a.source_label) ?? "";
          const bLabel = (bOut ? b.target_label : b.source_label) ?? "";
          return aLabel.localeCompare(bLabel);
        });
        break;
      case "recent":
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        sorted.sort((a, b) => b.confidence_score - a.confidence_score);
    }
    return sorted;
  }, [relations, typeFilter, debouncedQuery, sort, companyId]);

  const grouped = React.useMemo(() => groupByCategory(filtered), [filtered]);

  const selectedEdge: GraphEdge | null = selected
    ? {
        id: selected.id,
        source: `${selected.source_type}:${selected.source_id}`,
        target: `${selected.target_type}:${selected.target_id}`,
        relation: selected,
        weight: selected.weight,
        confidence: selected.confidence_score,
      }
    : null;

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

  if (relations.length === 0) {
    return (
      <EmptyState
        icon={Waypoints}
        title="No known relations yet"
        description="Atlas will surface competitors, suppliers, partners and investors here as the Knowledge Graph grows."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-muted-foreground">
          {data!.relations_count} {data!.relations_count === 1 ? "relation" : "relations"}
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/companies/${companySlug}/graph`}>
            <Waypoints className="h-3.5 w-3.5" />
            View as Graph
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search relations..."
            className="h-8 w-52 pl-8 text-body-sm"
          />
        </div>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as RelationType | "all")}>
          <SelectTrigger className="h-8 w-44 text-body-sm">
            <SelectValue placeholder="Relation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {RELATION_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="h-8 w-52 text-body-sm">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <SelectItem key={option} value={option}>
                {SORT_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No relations match these filters"
          description="Try a different search term or clear the type filter."
          className="py-12"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            {grouped.map((group) => (
              <div key={group.category}>
                <p className="text-caption font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {RELATION_CATEGORY_LABELS[group.category]}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((relation) => (
                    <RelationCard
                      key={relation.id}
                      relation={relation}
                      perspectiveId={companyId}
                      isSelected={selected?.id === relation.id}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block sticky top-20 self-start">
            <RelationDetailPanel edge={selectedEdge} />
          </div>
        </div>
      )}
    </div>
  );
}

function groupByCategory(
  relations: RelationResponse[],
): Array<{ category: RelationCategory; items: RelationResponse[] }> {
  const map = new Map<RelationCategory, RelationResponse[]>();
  for (const r of relations) {
    const category = RELATION_TYPE_CATEGORY[r.relation_type];
    const list = map.get(category) ?? [];
    list.push(r);
    map.set(category, list);
  }
  // Fixed display order, not insertion order, so the tab reads
  // consistently across every company rather than shuffling by
  // whichever category happened to appear first in the data.
  const order: RelationCategory[] = ["market_position", "business", "ownership", "membership"];
  return order
    .filter((c) => map.has(c))
    .map((category) => ({ category, items: map.get(category)! }));
}
