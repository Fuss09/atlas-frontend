"use client";

import * as React from "react";
import { useThemes } from "@/hooks/use-themes";
import { ThemeCard } from "@/components/theme/theme-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import type { MaturityLevel, ThemeListItem } from "@/types";

const MATURITY_FILTERS: Array<{ value: MaturityLevel | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "emerging", label: "Emerging" },
  { value: "growth", label: "Growth" },
  { value: "mature", label: "Mature" },
];

export function ThemesExplorer() {
  const [maturity, setMaturity] = React.useState<MaturityLevel | "all">("all");
  const { data: themes, isLoading, error, refetch } = useThemes(
    maturity === "all" ? undefined : { maturity_level: maturity },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {MATURITY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setMaturity(f.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-body-sm font-medium transition-colors",
              maturity === f.value
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !themes || themes.length === 0 ? (
        <EmptyState icon={Sparkles} title="No themes found" />
      ) : (
        <GroupedThemes themes={themes} />
      )}
    </div>
  );
}

function GroupedThemes({ themes }: { themes: ThemeListItem[] }) {
  const groups = new Map<string, ThemeListItem[]>();
  for (const theme of themes) {
    const key = theme.category ?? "Other";
    const list = groups.get(key) ?? [];
    list.push(theme);
    groups.set(key, list);
  }

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-h2 mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} variant="list" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
