"use client";

import { useCompanyThemes } from "@/hooks/use-themes";
import { ThemeCard } from "@/components/theme/theme-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Sparkles } from "lucide-react";

export function ThemesTab({ companyId }: { companyId: string }) {
  const { data: themes, isLoading, error, refetch } = useCompanyThemes(companyId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  if (!themes || themes.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Not part of any theme yet"
        description="Themes group companies by investment trend — AI, Robotics, Space, and more."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} variant="list" />
      ))}
    </div>
  );
}
