import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeHeader } from "@/components/theme/theme-header";
import { ThemeCompaniesResults, ThemeCompaniesResultsSkeleton } from "@/components/theme/theme-companies-results";
import { fetchThemeBySlug } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { notFound } from "next/navigation";

interface ThemeDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: ThemeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const theme = await fetchThemeBySlug(slug);
    return { title: theme.name, description: theme.description ?? undefined };
  } catch {
    return { title: "Theme" };
  }
}

const PAGE_SIZE = 24;

export default async function ThemeDetailPage({ params, searchParams }: ThemeDetailPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let theme;
  try {
    theme = await fetchThemeBySlug(slug);
  } catch (err) {
    if (err instanceof ServerApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <AppShell breadcrumb={[{ label: "Themes", href: "/themes" }, { label: theme.name }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 space-y-6">
        <ThemeHeader theme={theme} />

        <Suspense key={`${theme.id}-${page}`} fallback={<ThemeCompaniesResultsSkeleton />}>
          <ThemeCompaniesResults themeId={theme.id} page={page} pageSize={PAGE_SIZE} />
        </Suspense>
      </div>
    </AppShell>
  );
}
