import { Building2, Sparkles, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ENTITY_TYPE_LABELS, type EntityType, type RelationResponse } from "@/types";

const ENTITY_ICONS: Record<EntityType, LucideIcon> = {
  company: Building2,
  theme: Sparkles,
  event: Activity,
  technology: Sparkles,
  person: Building2,
  product: Building2,
  country: Building2,
  fund: Building2,
};

interface RelationCardProps {
  relation: RelationResponse;
  perspectiveId: string;
  onSelect?: (relation: RelationResponse) => void;
  className?: string;
}

/**
 * A single relation row. Clicking selects it for the explainability
 * panel (type, confidence, weight, sources) per validated Graph spec.
 */
export function RelationCard({ relation, perspectiveId, onSelect, className }: RelationCardProps) {
  const isOutgoing = relation.source_id === perspectiveId;
  const otherType = isOutgoing ? relation.target_type : relation.source_type;
  const otherLabel = isOutgoing ? relation.target_label : relation.source_label;
  const Icon = ENTITY_ICONS[otherType] ?? Building2;

  return (
    <button
      onClick={() => onSelect?.(relation)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-left hover:border-border hover:bg-secondary/40 transition-colors",
        className,
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-foreground truncate">{otherLabel ?? "Unknown entity"}</p>
        <p className="text-caption text-muted-foreground">{ENTITY_TYPE_LABELS[otherType]}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {relation.is_inferred && (
          <Badge variant="outline" className="text-muted-foreground">
            Inferred
          </Badge>
        )}
        <span className="text-caption font-mono text-muted-foreground tabular-nums">
          {Math.round(relation.confidence_score * 100)}%
        </span>
      </div>
    </button>
  );
}
