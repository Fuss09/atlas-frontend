import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /**
   * "empty" (default): neutral, muted icon tint — nothing went wrong,
   * there's just nothing here yet. "error": danger-tinted icon
   * background, defaults to AlertTriangle when no icon is given.
   * Server Component-safe either way (no hooks) — used identically by
   * Server Components (Dashboard sections, *Results components) and
   * Client Components (tabs, filters).
   */
  variant?: "empty" | "error";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "empty",
  className,
}: EmptyStateProps) {
  const ResolvedIcon = Icon ?? (variant === "error" ? AlertTriangle : undefined);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 px-6 text-center",
        className,
      )}
    >
      {ResolvedIcon && (
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            variant === "error" ? "bg-danger/10" : "bg-secondary",
          )}
        >
          <ResolvedIcon
            className={cn("h-5 w-5", variant === "error" ? "text-danger" : "text-muted-foreground")}
          />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-body font-medium text-foreground">{title}</p>
        {description && <p className="text-body-sm text-muted-foreground max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
