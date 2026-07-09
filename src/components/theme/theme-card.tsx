import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { resolveThemeIcon } from "@/lib/theme-icon";
import type { ThemeListItem } from "@/types";

const MATURITY_LABEL: Record<string, string> = {
  emerging: "Emerging",
  growth: "Growth",
  mature: "Mature",
};

interface ThemeCardProps {
  theme: ThemeListItem;
  variant?: "dashboard" | "list";
  className?: string;
}

export function ThemeCard({ theme, variant = "list", className }: ThemeCardProps) {
  const Icon = resolveThemeIcon(theme.icon);
  const accentColor = theme.color ?? "#6366F1";

  if (variant === "dashboard") {
    return (
      <Link href={`/themes/${theme.slug}`} className="shrink-0">
        <Card
          className={cn(
            "w-52 hover:-translate-y-0.5 transition-all duration-150 border-l-2",
            className,
          )}
          style={{ borderLeftColor: accentColor }}
        >
          <CardContent className="p-4 flex flex-col gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ backgroundColor: `${accentColor}1A` }}
            >
              <Icon className="h-4 w-4" style={{ color: accentColor }} />
            </div>
            <p className="text-body-sm font-semibold text-foreground truncate">{theme.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-caption text-muted-foreground">
                {theme.companies_count} {theme.companies_count === 1 ? "company" : "companies"}
              </span>
              <Badge variant="outline" className="text-muted-foreground">
                {MATURITY_LABEL[theme.maturity_level]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/themes/${theme.slug}`}>
      <Card
        className={cn("hover:-translate-y-0.5 transition-all duration-150 border-l-2", className)}
        style={{ borderLeftColor: accentColor }}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${accentColor}1A` }}
          >
            <Icon className="h-4 w-4" style={{ color: accentColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body font-medium text-foreground truncate">{theme.name}</p>
            <p className="text-caption text-muted-foreground">
              {theme.companies_count} {theme.companies_count === 1 ? "company" : "companies"}
            </p>
          </div>
          <Badge variant="outline" className="text-muted-foreground shrink-0">
            {MATURITY_LABEL[theme.maturity_level]}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
