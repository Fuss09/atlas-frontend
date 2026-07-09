"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Waypoints } from "lucide-react";
import { useCompanyGraph } from "@/hooks/use-graph";
import { GraphCanvas, type GraphCanvasHandle } from "@/components/graph/graph-canvas";
import { GraphControls } from "@/components/graph/graph-controls";
import { GraphSearch } from "@/components/graph/graph-search";
import { RelationDetailPanel } from "@/components/graph/relation-detail-panel";
import { buildGraphData, type GraphEdge, type GraphNode } from "@/lib/graph-data";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import type { CompanyGraphResponse, CompanyListItem, RelationType } from "@/types";

interface CompanyGraphShellProps {
  centerId: string;
  centerSlug: string;
  centerLabel: string;
  initialGraph: CompanyGraphResponse | null;
}

/**
 * Orchestrates the full interactive graph experience for a company:
 * data fetching (depth changes trigger a real refetch — see
 * useCompanyGraph), the canvas, the control bar (depth/filter/zoom),
 * search-to-recenter, and the detail panel.
 *
 * Recentering navigates to /companies/[slug]/graph for the target
 * company rather than mutating local state — consistent with the
 * URL-as-source-of-truth discipline used everywhere else in Atlas
 * (Companies, Opportunities, Themes filters), and it means the graph
 * view for any company is always a real, shareable, bookmarkable URL.
 * Only depth and the relation-type filter stay as local UI state,
 * since they're view preferences rather than navigable content.
 */
export function CompanyGraphShell({ centerId, centerSlug, centerLabel, initialGraph }: CompanyGraphShellProps) {
  const router = useRouter();
  const [depth, setDepth] = React.useState<1 | 2 | 3>(1);
  const [selectedEdge, setSelectedEdge] = React.useState<GraphEdge | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = React.useState<string | null>(null);
  const [activeTypes, setActiveTypes] = React.useState<Set<RelationType>>(new Set());
  const canvasRef = React.useRef<GraphCanvasHandle>(null);

  const { data, isLoading, isFetching, error, refetch } = useCompanyGraph(
    centerId,
    depth,
    initialGraph ?? undefined,
  );

  // Reset transient UI state on depth change or when the center company
  // itself changes (navigating here for a different company).
  React.useEffect(() => {
    setSelectedEdge(null);
    setHoveredNodeId(null);
    setActiveTypes(new Set());
  }, [depth, centerId]);

  const fullGraphData = React.useMemo(() => {
    if (!data) return null;
    return buildGraphData("company", centerId, centerLabel, data.relations, data.neighbors);
  }, [data, centerId, centerLabel]);

  const availableTypes = React.useMemo(() => {
    if (!fullGraphData) return [];
    const types = new Set<RelationType>();
    for (const edge of fullGraphData.edges) {
      if (edge.relation) types.add(edge.relation.relation_type);
    }
    return Array.from(types);
  }, [fullGraphData]);

  const filteredGraphData = React.useMemo(() => {
    if (!fullGraphData) return null;
    if (activeTypes.size === 0) return fullGraphData;
    const keptEdges = fullGraphData.edges.filter(
      (e) => !e.relation || activeTypes.has(e.relation.relation_type),
    );
    const keptNodeIds = new Set<string>([fullGraphData.nodes.find((n) => n.isCenter)!.id]);
    for (const e of keptEdges) {
      keptNodeIds.add(e.source);
      keptNodeIds.add(e.target);
    }
    return {
      nodes: fullGraphData.nodes.filter((n) => keptNodeIds.has(n.id)),
      edges: keptEdges,
    };
  }, [fullGraphData, activeTypes]);

  const toggleType = (type: RelationType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleRecenter = (node: GraphNode) => {
    if (node.isCenter) return;
    if (node.entityType === "company") {
      router.push(`/companies/${node.entityId}/graph`);
    }
    // Non-company nodes (themes, events, ...) don't have a graph view of
    // their own yet — recentering is a no-op for them rather than a
    // broken navigation, until those entity types get their own pages.
  };

  const handleSelectFromSearch = (company: CompanyListItem) => {
    router.push(`/companies/${company.slug}/graph`);
  };

  const selectedEdgeEnds = React.useMemo(() => {
    if (!selectedEdge || !fullGraphData) return {};
    const source = fullGraphData.nodes.find((n) => n.id === selectedEdge.source);
    const target = fullGraphData.nodes.find((n) => n.id === selectedEdge.target);
    return { sourceLabel: source?.label, targetLabel: target?.label };
  }, [selectedEdge, fullGraphData]);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[calc(100vh-7rem)] w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} className="m-6" />;
  }

  if (!data || data.relations.length === 0) {
    return (
      <EmptyState
        icon={Waypoints}
        title="No relationships to visualize yet"
        description={`${centerLabel} has no known connections in the Knowledge Graph.`}
        className="m-6"
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
      <div className="flex-1 relative min-h-[400px]">
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/companies/${centerSlug}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface/95 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Back to ${centerLabel}`}
              title={`Back to ${centerLabel}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <GraphControls
              depth={depth}
              onDepthChange={setDepth}
              activeTypes={activeTypes}
              onToggleType={toggleType}
              onResetTypes={() => setActiveTypes(new Set())}
              onZoomIn={() => canvasRef.current?.zoomIn()}
              onZoomOut={() => canvasRef.current?.zoomOut()}
              onResetView={() => canvasRef.current?.resetView()}
              availableTypes={availableTypes}
            />
          </div>
          <GraphSearch onSelectCompany={handleSelectFromSearch} placeholder="Jump to a company..." />
        </div>

        {isFetching && (
          <div className="absolute top-16 left-4 z-10 rounded-md border border-border bg-surface/95 backdrop-blur-sm px-2.5 py-1 text-caption text-muted-foreground">
            Updating…
          </div>
        )}

        {filteredGraphData && (
          <GraphCanvas
            ref={canvasRef}
            data={filteredGraphData}
            selectedEdgeId={selectedEdge?.id ?? null}
            hoveredNodeId={hoveredNodeId}
            onSelectEdge={setSelectedEdge}
            onHoverNode={setHoveredNodeId}
            onRecenter={handleRecenter}
            className="h-full w-full"
          />
        )}
      </div>

      <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-border p-4 overflow-y-auto">
        <RelationDetailPanel
          edge={selectedEdge}
          sourceLabel={selectedEdgeEnds.sourceLabel}
          targetLabel={selectedEdgeEnds.targetLabel}
        />
      </div>
    </div>
  );
}
