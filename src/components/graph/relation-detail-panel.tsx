import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPercent } from "@/lib/format";
import { ENTITY_TYPE_LABELS, RELATION_TYPE_LABELS, type RelationResponse } from "@/types";

interface RelationDetailPanelProps {
  relation: RelationResponse | null;
}

/**
 * Displays type, confidence, weight and provenance for a selected
 * relation — the graph must always be explainable, per validated spec.
 */
export function RelationDetailPanel({ relation }: RelationDetailPanelProps) {
  if (!relation) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full min-h-[200px] items-center justify-center p-6 text-center">
          <p className="text-body-sm text-muted-foreground">
            Select a relation to see how Atlas established this connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Relation Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-caption text-muted-foreground">Connection</p>
          <p className="text-body-sm text-foreground">
            {relation.source_label ?? ENTITY_TYPE_LABELS[relation.source_type]}
            <span className="text-muted-foreground"> — {RELATION_TYPE_LABELS[relation.relation_type]} — </span>
            {relation.target_label ?? ENTITY_TYPE_LABELS[relation.target_type]}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-caption text-muted-foreground">Type</p>
            <Badge variant="outline">{RELATION_TYPE_LABELS[relation.relation_type]}</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-caption text-muted-foreground">Origin</p>
            <Badge variant={relation.is_inferred ? "warning" : "success"}>
              {relation.is_inferred ? "Inferred" : "Confirmed"}
            </Badge>
          </div>
        </div>

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

        <div className="space-y-2">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-mono tabular-nums text-foreground">
              {formatPercent(relation.weight)}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-info"
              style={{ width: `${relation.weight * 100}%` }}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-caption text-muted-foreground">Source</p>
          <p className="text-body-sm text-foreground capitalize">{relation.relation_source}</p>
        </div>

        <div className="space-y-1">
          <p className="text-caption text-muted-foreground">Created</p>
          <p className="text-body-sm text-foreground">{formatDate(relation.created_at, "MMM d, yyyy 'at' HH:mm")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
