import { Badge } from "@/components/ui/badge";
import { CONVICTION_META, type ConvictionLevel } from "@/types";
import { cn } from "@/lib/utils";

interface ConvictionLabelProps {
  level: ConvictionLevel;
  className?: string;
}

const VARIANT_MAP: Record<ConvictionLevel, "success" | "warning" | "default" | "danger"> = {
  very_high: "success",
  high: "success",
  moderate: "warning",
  low: "default",
  very_low: "danger",
};

export function ConvictionLabel({ level, className }: ConvictionLabelProps) {
  return (
    <Badge variant={VARIANT_MAP[level]} className={cn(className)}>
      {CONVICTION_META[level].label}
    </Badge>
  );
}
