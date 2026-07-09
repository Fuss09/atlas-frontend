import Link from "next/link";
import { fetchThemes } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { resolveThemeIcon } from "@/lib/theme-icon";
import { EmptyState } from "@/components/shared/empty-state";
import { Compass } from "lucide-react";
import type { ThemeListItem } from "@/types";

/**
 * The 10 categories called out in the Sprint 4 brief, expressed purely
 * as the theme slugs seeded by Module 03's migration — no labels,
 * colors, or icons duplicated here. Every visual property (name, color,
 * icon, company count) is read from the real ThemeListItem the backend
 * returns; this array only decides *which* themes get featured tiles on
 * Explorer and in what order.
 */
const FEATURED_THEME_SLUGS = [
  "artificial-intelligence",
  "quantum-computing",
  "biotechnology",
  "defense-aerospace",
  "space",
  "energy-transition",
  "semiconductors",
  "robotics-automation",
  "cloud-computing",
  "cybersecurity",
];

/**
 * Explorer — a discovery-first browsing surface: large category tiles
 * invite browsing without requiring the user to know what to search
 * for. Server Component: the full theme list (with live company counts)
 * is fetched once on the server, then filtered/ordered against
 * FEATURED_THEME_SLUGS — no client-side loading state, no stale counts.
 */
export async function ExplorerContent() {
  let themes: ThemeListItem[];
  try {
    themes = await fetchThemes();
  } catch (err) {
    return (
      <EmptyState
        variant="error"
        title="Couldn't load categories"
        description={err instanceof ServerApiError ? err.message : undefined}
        className="py-24"
      />
    );
  }

  const themesBySlug = new Map(themes.map((t) => [t.slug, t]));
  const featured = FEATURED_THEME_SLUGS.map((slug) => themesBySlug.get(slug)).filter(
    (t): t is ThemeListItem => t !== undefined,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display mb-2">Explore Atlas</h1>
        <p className="text-body text-muted-foreground max-w-xl">
          Browse the market by category — no search required. Pick a domain and see what Atlas has
          discovered.
        </p>
      </div>

      {featured.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No categories available yet"
          description="Themes will appear here once Atlas has discovered companies to group."
          className="py-24"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featured.map((theme) => (
            <CategoryTile key={theme.id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryTile({ theme }: { theme: ThemeListItem }) {
  const Icon = resolveThemeIcon(theme.icon);
  const accent = theme.color ?? "#6366F1";

  return (
    <Link
      href={`/themes/${theme.slug}`}
      className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-border"
    >
      <div
        className="absolute inset-0 opacity-[0.08] transition-opacity duration-200 group-hover:opacity-[0.14]"
        style={{ background: `radial-gradient(circle at 30% 20%, ${accent}, transparent 70%)` }}
      />
      <div className="relative flex h-full flex-col justify-between p-4">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md"
          style={{ backgroundColor: `${accent}1A` }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-body font-semibold text-foreground">{theme.name}</p>
          <p className="text-caption text-muted-foreground mt-0.5">
            {theme.companies_count} {theme.companies_count === 1 ? "company" : "companies"}
          </p>
        </div>
      </div>
    </Link>
  );
}
