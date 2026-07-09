import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { fetchPopularThemes } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { ThemeCard } from "@/components/theme/theme-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

function SectionHeader() {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-h2">Popular Themes</h2>
      <Link
        href="/themes"
        className="inline-flex items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        View all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export async function PopularThemesSection() {
  let themes;
  try {
    themes = await fetchPopularThemes(8);
  } catch (err) {
    return (
      <section>
        <SectionHeader />
        <EmptyState
          variant="error"
          title="Couldn't load themes"
          description={err instanceof ServerApiError ? err.message : undefined}
        />
      </section>
    );
  }

  return (
    <section>
      <SectionHeader />
      {themes.length === 0 ? (
        <EmptyState icon={Sparkles} title="No themes yet" />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {themes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} variant="dashboard" />
          ))}
        </div>
      )}
    </section>
  );
}

export function PopularThemesSkeleton() {
  return (
    <section>
      <SectionHeader />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-52 shrink-0" />
        ))}
      </div>
    </section>
  );
}
