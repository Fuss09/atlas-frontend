"use client";

import Link from "next/link";
import { EXPLORER_CATEGORIES } from "@/lib/explorer-categories";
import { useThemes } from "@/hooks/use-themes";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Explorer — a discovery-first browsing surface, per validated spec:
 * "navigation proche d'un Netflix ou Spotify". No search required —
 * large category tiles invite browsing. Company counts are fetched
 * live so the page never shows a stale number.
 */
export function ExplorerContent() {
  const { data: themes, isLoading } = useThemes();

  const countFor = (themeSlug: string) => themes?.find((t) => t.slug === themeSlug)?.companies_count;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display mb-2">Explore Atlas</h1>
        <p className="text-body text-muted-foreground max-w-xl">
          Browse the market by category — no search required. Pick a domain and see what Atlas has
          discovered.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {EXPLORER_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const count = countFor(category.themeSlug);

          return (
            <Link
              key={category.slug}
              href={`/themes/${category.themeSlug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-border"
            >
              <div
                className="absolute inset-0 opacity-[0.08] transition-opacity duration-200 group-hover:opacity-[0.14]"
                style={{ background: `radial-gradient(circle at 30% 20%, ${category.accent}, transparent 70%)` }}
              />
              <div className="relative flex h-full flex-col justify-between p-4">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${category.accent}1A` }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color: category.accent }} />
                </div>
                <div>
                  <p className="text-body font-semibold text-foreground">{category.label}</p>
                  {isLoading ? (
                    <Skeleton className="h-3.5 w-20 mt-1" />
                  ) : (
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {count !== undefined ? `${count} companies` : "Explore"}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
