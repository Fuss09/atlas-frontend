import { Building2, Sparkles, Activity, Cpu, User, Package, Globe, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ENTITY_TYPE_LABELS, type EntityType, type RelationResponse } from "@/types";

const ENTITY_ICONS: Record<EntityType, LucideIcon> = {
  company: Building2,
  theme: Sparkles,
  event: Activity,
  technology: Cpu,
  person: User,
  product: Package,
  country: Globe,
  fund: Landmark,
};

interface RelationCardProps {
  relation: RelationResponse;
  perspectiveId: string;
  isSelected?: boolean;
  onSelect?: (relation: RelationResponse) => void;
  className?: string;
}

/**
 * A single relation row: entity, confidence (numeric + a visual weight
 * bar so relative strength reads at a glance across a list, not just
 * one relation at a time in the detail panel), and inferred/confirmed
 * origin. Clicking selects it for the explainability panel.
 */
export function RelationCard({ relation, perspectiveId, isSelected, onSelect, className }: RelationCardProps) {
  const isOutgoing = relation.source_id === perspectiveId;
  const otherType = isOutgoing ? relation.target_type : relation.source_type;
  const otherLabel = isOutgoing ? relation.target_label : relation.source_label;
  const Icon = ENTITY_ICONS[otherType] ?? Building2;

  return (
    <button
      onClick={() => onSelect?.(relation)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
        isSelected
          ? "border-primary/30 bg-primary/5"
          : "border-transparent hover:border-border hover:bg-secondary/40",
        className,
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-foreground truncate">{otherLabel ?? "Unknown entity"}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1 w-16 rounded-full bg-secondary overflow-hidden shrink-0">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${relation.weight * 100}%` }}
              aria-hidden
            />
          </div>
          <p className="text-caption text-muted-foreground">{ENTITY_TYPE_LABELS[otherType]}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {relation.is_inferred && (
          <Badge variant="outline" className="text-muted-foreground">
            Inferred
          </Badge>
        )}
        <span className="text-caption font-mono text-muted-foreground tabular-nums">
          {Math.round(relation.confidence_score * 100)}% confidence
        </span>
      </div>
    </button>
  );
}
