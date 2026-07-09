import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ThemesMaturityFilter } from "@/components/theme/themes-maturity-filter";
import { GroupedThemes } from "@/components/theme/grouped-themes";
import { fetchThemes } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { EmptyState } from "@/components/shared/empty-state";
import { Sparkles } from "lucide-react";
import type { MaturityLevel } from "@/types";

export const metadata: Metadata = {
  title: "Themes",
};

interface ThemesPageProps {
  searchParams: Promise<{ maturity?: string }>;
}

export default async function ThemesPage({ searchParams }: ThemesPageProps) {
  const { maturity } = await searchParams;
  const validMaturity = ["emerging", "growth", "mature"].includes(maturity ?? "")
    ? (maturity as MaturityLevel)
    : undefined;

  let themes;
  try {
    themes = await fetchThemes(validMaturity ? { maturity_level: validMaturity } : undefined);
  } catch (err) {
    return (
      <AppShell breadcrumb={[{ label: "Themes" }]}>
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
          <EmptyState
            variant="error"
            title="Couldn't load themes"
            description={err instanceof ServerApiError ? err.message : undefined}
            className="py-24"
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumb={[{ label: "Themes" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 space-y-6">
        <ThemesMaturityFilter active={validMaturity} />

        {themes.length === 0 ? (
          <EmptyState icon={Sparkles} title="No themes found" className="py-24" />
        ) : (
          <GroupedThemes themes={themes} />
        )}
      </div>
    </AppShell>
  );
}
