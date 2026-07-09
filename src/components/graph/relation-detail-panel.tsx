import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPercent } from "@/lib/format";
import { ENTITY_TYPE_LABELS, RELATION_TYPE_LABELS } from "@/types";
import type { GraphEdge } from "@/lib/graph-data";

interface RelationDetailPanelProps {
  edge: GraphEdge | null;
  sourceLabel?: string;
  targetLabel?: string;
}

/**
 * Displays type, confidence, weight and provenance for a selected
 * edge — the graph must always be explainable, per the Sprint 3 spec.
 *
 * Depth-1 edges carry a full RelationResponse (relation !== null):
 * every field below is shown. Depth-2/3 edges only carry what
 * NeighborResponse exposes (relation_type + weight, via the BFS
 * traversal) — the panel explains this explicitly rather than
 * pretending to have confidence/source/created_at data it doesn't have.
 */
export function RelationDetailPanel({ edge, sourceLabel, targetLabel }: RelationDetailPanelProps) {
  if (!edge) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full min-h-[200px] items-center justify-center p-6 text-center">
          <p className="text-body-sm text-muted-foreground">
            Select a connection to see how Atlas established this relationship.
          </p>
        </CardContent>
      </Card>
    );
  }

  const relation = edge.relation;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Relation Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-caption text-muted-foreground">Connection</p>
          <p className="text-body-sm text-foreground">
            {relation ? (relation.source_label ?? ENTITY_TYPE_LABELS[relation.source_type]) : sourceLabel}
            <span className="text-muted-foreground">
              {" "}
              — {RELATION_TYPE_LABELS[(relation?.relation_type ?? edge.relation?.relation_type)!]} —{" "}
            </span>
            {relation ? (relation.target_label ?? ENTITY_TYPE_LABELS[relation.target_type]) : targetLabel}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-caption text-muted-foreground">Type</p>
            {relation && <Badge variant="outline">{RELATION_TYPE_LABELS[relation.relation_type]}</Badge>}
          </div>
          {relation && (
            <div className="space-y-1">
              <p className="text-caption text-muted-foreground">Origin</p>
              <Badge variant={relation.is_inferred ? "warning" : "success"}>
                {relation.is_inferred ? "Inferred" : "Confirmed"}
              </Badge>
            </div>
          )}
        </div>

        {relation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-muted-foreground">Confidence score</span>
              <span className="font-mono tabular-nums text-foreground">
                {formatPercent(relation.confidence_score)}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${relation.confidence_score * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-mono tabular-nums text-foreground">{formatPercent(edge.weight)}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-info" style={{ width: `${edge.weight * 100}%` }} />
          </div>
        </div>

        {relation ? (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-caption text-muted-foreground">Source</p>
              <p className="text-body-sm text-foreground capitalize">{relation.relation_source}</p>
            </div>
            <div className="space-y-1">
              <p className="text-caption text-muted-foreground">Created</p>
              <p className="text-body-sm text-foreground">
                {formatDate(relation.created_at, "MMM d, yyyy 'at' HH:mm")}
              </p>
            </div>
          </>
        ) : (
          <>
            <Separator />
            <p className="text-caption text-muted-foreground leading-relaxed">
              This is an indirect connection (depth 2 or 3). Full provenance — confidence, source, and
              creation date — is only available for a company&apos;s direct relationships. Recenter the
              graph on either endpoint to see its direct connections in full detail.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
