import { Badge } from "@/components/ui/badge";
import { IMPORTANCE_META, type ImportanceLevel } from "@/types";

const VARIANT_MAP: Record<ImportanceLevel, "danger" | "warning" | "info" | "default"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "default",
};

export function ImportanceBadge({ level }: { level: ImportanceLevel }) {
  return <Badge variant={VARIANT_MAP[level]}>{IMPORTANCE_META[level].label}</Badge>;
}
