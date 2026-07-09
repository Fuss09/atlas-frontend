import { cn } from "@/lib/utils";
import { CONVICTION_META, type ConvictionLevel } from "@/types";

interface ScoreBadgeProps {
  score: number;
  conviction?: ConvictionLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * Mirrors backend/app/engines/opportunity.py _conviction_from_score
 * exactly — used as a client-side fallback only when a conviction
 * level isn't already provided by the API response.
 */
function convictionFromScore(score: number): ConvictionLevel {
  if (score >= 80) return "very_high";
  if (score >= 60) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

/**
 * The visual anchor of Atlas: a company's Opportunity Score.
 * Color is always paired with the conviction word — per design system
 * principle, color never carries meaning alone.
 */
export function ScoreBadge({ score, conviction, size = "md", showLabel = false, className }: ScoreBadgeProps) {
  const level = conviction ?? convictionFromScore(score);
  const meta = CONVICTION_META[level];

  const colorClass =
    level === "very_high"
      ? "text-success border-success/30 bg-success/10"
      : level === "high"
        ? "text-success border-success/25 bg-success/[0.07]"
        : level === "moderate"
          ? "text-warning border-warning/25 bg-warning/10"
          : "text-muted-foreground border-border bg-secondary";

  const sizeClass =
    size === "lg"
      ? "h-16 w-16 text-h1"
      : size === "sm"
        ? "h-8 w-8 text-body-sm"
        : "h-11 w-11 text-h2";

  return (
    <div className={cn("inline-flex flex-col items-center gap-1.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full border font-mono font-semibold tabular-nums",
          sizeClass,
          colorClass,
        )}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Opportunity score ${score} out of 100, ${meta.label}`}
      >
        {Math.round(score)}
      </div>
      {showLabel && (
        <span className="text-caption text-muted-foreground whitespace-nowrap">{meta.label}</span>
      )}
    </div>
  );
}
