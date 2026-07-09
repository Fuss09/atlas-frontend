import { Building2 } from "lucide-react";
import { fetchThemeCompanies } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { CompanyCard } from "@/components/company/company-card";
import { CompaniesPagination } from "@/components/company/companies-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

interface ThemeCompaniesResultsProps {
  themeId: string;
  page: number;
  pageSize: number;
}

/**
 * Mirrors CompaniesResults from Sprint 2 — same server-fetch-one-page,
 * windowed-pagination pattern, scoped to a single theme. Reuses
 * CompaniesPagination as-is since pagination UX shouldn't differ
 * between "all companies" and "companies in this theme".
 */
export async function ThemeCompaniesResults({ themeId, page, pageSize }: ThemeCompaniesResultsProps) {
  let data;
  try {
    data = await fetchThemeCompanies(themeId, page, pageSize);
  } catch (err) {
    return (
      <EmptyState
        variant="error"
        title="Couldn't load companies"
        description={err instanceof ServerApiError ? err.message : undefined}
        className="py-20"
      />
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No companies in this theme yet"
        description="Atlas will add companies here as they're discovered and associated with this theme."
        className="py-20"
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.items.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {totalPages > 1 && (
        <CompaniesPagination currentPage={page} totalPages={totalPages} className="mt-8" />
      )}
    </>
  );
}

export function ThemeCompaniesResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  );
}
