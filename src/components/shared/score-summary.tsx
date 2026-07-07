import { TrendingDown, TrendingUp } from "lucide-react";
import { ScoreBadge } from "./score-badge";
import { formatDelta, formatPercent, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ConvictionLevel } from "@/types";

interface ScoreSummaryProps {
  score: number;
  conviction: ConvictionLevel;
  delta7d?: number | null;
  confidence?: number | null;
  updatedAt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Full opportunity score summary, per validated spec:
 *   82
 *   +9 this week
 *   Confidence 91%
 *   Updated 2h ago
 */
export function ScoreSummary({
  score,
  conviction,
  delta7d,
  confidence,
  updatedAt,
  size = "lg",
  className,
}: ScoreSummaryProps) {
  const hasDelta = delta7d !== null && delta7d !== undefined && delta7d !== 0;
  const isPositive = (delta7d ?? 0) > 0;

  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <ScoreBadge score={score} conviction={conviction} size={size} showLabel />

      <div className="flex flex-col items-center gap-1 text-caption">
        {hasDelta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              isPositive ? "text-success" : "text-danger",
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatDelta(delta7d)} this week
          </span>
        )}
        {confidence !== null && confidence !== undefined && (
          <span className="text-muted-foreground">Confidence {formatPercent(confidence)}</span>
        )}
        <span className="text-muted-foreground">Updated {formatRelativeTime(updatedAt)}</span>
      </div>
    </div>
  );
}
