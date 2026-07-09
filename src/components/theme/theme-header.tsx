import { Badge } from "@/components/ui/badge";
import { resolveThemeIcon } from "@/lib/theme-icon";
import type { ThemeResponse } from "@/types";

const MATURITY_LABEL: Record<string, string> = {
  emerging: "Emerging",
  growth: "Growth",
  mature: "Mature",
};

export function ThemeHeader({ theme }: { theme: ThemeResponse }) {
  const Icon = resolveThemeIcon(theme.icon);
  const accentColor = theme.color ?? "#6366F1";

  return (
    <div className="flex items-start gap-4 rounded-lg border border-border-subtle bg-surface p-5">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${accentColor}1A` }}
      >
        <Icon className="h-6 w-6" style={{ color: accentColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-h1">{theme.name}</h1>
          <Badge variant="outline">{MATURITY_LABEL[theme.maturity_level]}</Badge>
        </div>
        {theme.description && (
          <p className="text-body-sm text-muted-foreground mt-1 max-w-2xl">{theme.description}</p>
        )}
        <p className="text-caption text-muted-foreground mt-2">
          {theme.companies_count} {theme.companies_count === 1 ? "company" : "companies"}
        </p>
      </div>
    </div>
  );
}
