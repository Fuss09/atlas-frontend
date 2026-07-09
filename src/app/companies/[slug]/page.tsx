import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CompanyPageContent } from "@/components/company/company-page-content";
import { fetchCompanyBySlug } from "@/lib/api/server-data";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const company = await fetchCompanyBySlug(slug);
    const classification = [company.sector, company.industry].filter(Boolean).join(" · ");
    const description = company.description_short ?? (classification || undefined);
    return {
      title: company.ticker ? `${company.name} (${company.ticker})` : company.name,
      description,
    };
  } catch {
    // Metadata is best-effort — if the fetch fails here, the page body's
    // own fetch will still run and handle the error (including 404)
    // properly. Falling back to a generic title just avoids a broken tab.
    return { title: "Company" };
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  // Next.js dedupes identical fetch() calls (same URL + options) within a
  // single request — this and CompanyPageContent's own fetchCompanyBySlug
  // call below resolve to one actual network request, not two.
  const company = await fetchCompanyBySlugSafe(slug);

  return (
    <AppShell
      breadcrumb={[
        { label: "Companies", href: "/companies" },
        { label: company?.name ?? slug },
      ]}
    >
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
        <CompanyPageContent slug={slug} />
      </div>
    </AppShell>
  );
}

/**
 * Best-effort fetch for the breadcrumb label only — swallows errors so a
 * transient failure here never blocks the page shell from rendering.
 * CompanyPageContent performs its own authoritative fetch (with proper
 * 404 handling via notFound()) for the actual page body.
 */
async function fetchCompanyBySlugSafe(slug: string) {
  try {
    return await fetchCompanyBySlug(slug);
  } catch {
    return null;
  }
}
