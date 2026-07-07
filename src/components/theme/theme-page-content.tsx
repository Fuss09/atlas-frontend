"use client";

import * as React from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useThemeBySlug, useThemeCompanies } from "@/hooks/use-themes";
import { CompanyCard } from "@/components/company/company-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Icons.Sparkles;
  const pascal = name.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return (Icons as unknown as Record<string, LucideIcon>)[pascal] ?? Icons.Sparkles;
}

const MATURITY_LABEL: Record<string, string> = {
  emerging: "Emerging",
  growth: "Growth",
  mature: "Mature",
};

export function ThemePageContent({ slug }: { slug: string }) {
  const [page, setPage] = React.useState(1);
  const { data: theme, isLoading, error, refetch } = useThemeBySlug(slug);
  const { data: companies, isLoading: companiesLoading } = useThemeCompanies(theme?.id, page);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !theme) return <ErrorState error={error} onRetry={refetch} />;

  const Icon = resolveIcon(theme.icon);
  const accentColor = theme.color ?? "#6366F1";

  return (
    <div className="space-y-6">
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

      {companiesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : !companies || companies.items.length === 0 ? (
        <EmptyState title="No companies in this theme yet" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {companies.items.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          {companies.total > companies.page_size && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-body-sm text-muted-foreground px-2">
                Page {page} of {Math.ceil(companies.total / companies.page_size)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(companies.total / companies.page_size)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
