"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Waypoints, Search as SearchIcon } from "lucide-react";
import { useCompanyGraph } from "@/hooks/use-graph";
import { GraphCanvas, type GraphCanvasHandle } from "@/components/graph/graph-canvas";
import { GraphControls } from "@/components/graph/graph-controls";
import { GraphSearch } from "@/components/graph/graph-search";
import { RelationDetailPanel } from "@/components/graph/relation-detail-panel";
import { buildGraphData, type GraphEdge, type GraphNode } from "@/lib/graph-data";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import type { CompanyListItem, RelationType } from "@/types";

/**
 * Free-exploration entry point for the Knowledge Graph: no fixed
 * center. Reuses every building block from the company-centered graph
 * (GraphCanvas, GraphControls, GraphSearch, RelationDetailPanel,
 * buildGraphData) rather than duplicating them — the only thing this
 * component owns is "which company is currently centered," which
 * company-graph-shell.tsx doesn't need since its center comes from the
 * URL. Recentering here stays local state rather than a URL navigation
 * (unlike the company page's shell) since there's no natural canonical
 * URL for "exploring starting from X" the way /companies/[slug]/graph
 * is canonical for a specific company's page.
 */
export function FreeGraphExplorer() {
  const router = useRouter();
  const [center, setCenter] = React.useState<CompanyListItem | null>(null);
  const [depth, setDepth] = React.useState<1 | 2 | 3>(1);
  const [selectedEdge, setSelectedEdge] = React.useState<GraphEdge | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = React.useState<string | null>(null);
  const [activeTypes, setActiveTypes] = React.useState<Set<RelationType>>(new Set());
  const canvasRef = React.useRef<GraphCanvasHandle>(null);

  const { data, isLoading, isFetching, error, refetch } = useCompanyGraph(center?.id, depth);

  React.useEffect(() => {
    setSelectedEdge(null);
    setHoveredNodeId(null);
    setActiveTypes(new Set());
  }, [depth, center?.id]);

  const fullGraphData = React.useMemo(() => {
    if (!data || !center) return null;
    return buildGraphData("company", center.id, center.name, data.relations, data.neighbors);
  }, [data, center]);

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
    const centerNode = fullGraphData.nodes.find((n) => n.isCenter);
    const keptNodeIds = new Set<string>(centerNode ? [centerNode.id] : []);
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
    if (node.isCenter || node.entityType !== "company") return;
    // Full page navigation to the canonical company graph page keeps
    // "open this company properly" (with its real breadcrumb, and a
    // server-rendered depth-1 graph) one click away, while staying
    // inside this free-exploration view for quick recentering.
    router.push(`/companies/${node.entityId}/graph`);
  };

  const selectedEdgeEnds = React.useMemo(() => {
    if (!selectedEdge || !fullGraphData) return {};
    const source = fullGraphData.nodes.find((n) => n.id === selectedEdge.source);
    const target = fullGraphData.nodes.find((n) => n.id === selectedEdge.target);
    return { sourceLabel: source?.label, targetLabel: target?.label };
  }, [selectedEdge, fullGraphData]);

  if (!center) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24 text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Waypoints className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-display mb-2">Knowledge Graph</h1>
            <p className="text-body text-muted-foreground max-w-md mx-auto">
              Search for a company to explore its network of suppliers, competitors, partners, and
              investors.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <GraphSearch
            onSelectCompany={setCenter}
            placeholder="Search a company..."
            className="w-full max-w-md"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
      <div className="flex-1 relative min-h-[400px]">
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2">
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
          <GraphSearch onSelectCompany={setCenter} placeholder="Search a different company..." />
        </div>

        {isFetching && (
          <div className="absolute top-16 left-4 z-10 rounded-md border border-border bg-surface/95 backdrop-blur-sm px-2.5 py-1 text-caption text-muted-foreground">
            Updating…
          </div>
        )}

        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-full w-full" />
          </div>
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} className="m-6" />
        ) : !data || data.relations.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="No relationships to visualize yet"
            description={`${center.name} has no known connections in the Knowledge Graph.`}
            className="m-6"
          />
        ) : (
          filteredGraphData && (
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
          )
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
