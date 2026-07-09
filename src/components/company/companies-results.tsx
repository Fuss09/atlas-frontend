import { SearchX } from "lucide-react";
import { fetchCompanies } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";
import { CompanyCard } from "@/components/company/company-card";
import { CompaniesPagination } from "@/components/company/companies-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { CompanySortOption, CompanyType } from "@/types";

interface CompaniesResultsProps {
  q?: string;
  sector?: string;
  country?: string;
  companyType?: CompanyType;
  sort?: CompanySortOption;
  page: number;
  pageSize: number;
}

export async function CompaniesResults({
  q,
  sector,
  country,
  companyType,
  sort,
  page,
  pageSize,
}: CompaniesResultsProps) {
  let data;
  try {
    data = await fetchCompanies({
      q,
      sector,
      country,
      company_type: companyType,
      sort,
      page,
      page_size: pageSize,
    });
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

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-body-sm text-muted-foreground">
          {data.total.toLocaleString("en-US")} {data.total === 1 ? "company" : "companies"}
        </p>
      </div>

      {data.items.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No companies found"
          description="Try adjusting your search or filters."
          className="py-20"
        />
      ) : (
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
      )}
    </>
  );
}

export function CompaniesResultsSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </>
  );
}
