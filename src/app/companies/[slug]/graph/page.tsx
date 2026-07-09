import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CompanyGraphShell } from "@/components/graph/company-graph-shell";
import { fetchCompanyBySlug, fetchCompanyGraph } from "@/lib/api/server-data";
import { ServerApiError } from "@/lib/api/server";

interface CompanyGraphPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CompanyGraphPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const company = await fetchCompanyBySlug(slug);
    return { title: `${company.name} — Relationship Graph` };
  } catch {
    return { title: "Relationship Graph" };
  }
}

/**
 * The initial depth-1 graph renders fully server-side — no loading
 * flash arriving from the Relations tab's "View as Graph" link. Depth
 * changes after that are a real client refetch (see CompanyGraphShell),
 * since recomputing the BFS traversal is inherently a live operation
 * the server can't precompute for every possible depth up front.
 */
export default async function CompanyGraphPage({ params }: CompanyGraphPageProps) {
  const { slug } = await params;

  let company;
  try {
    company = await fetchCompanyBySlug(slug);
  } catch (err) {
    if (err instanceof ServerApiError && err.status === 404) notFound();
    throw err;
  }

  let initialGraph;
  try {
    initialGraph = await fetchCompanyGraph(company.id, 1);
  } catch {
    initialGraph = null;
  }

  return (
    <AppShell
      breadcrumb={[
        { label: "Companies", href: "/companies" },
        { label: company.name, href: `/companies/${company.slug}` },
        { label: "Graph" },
      ]}
    >
      <CompanyGraphShell
        centerId={company.id}
        centerSlug={company.slug}
        centerLabel={company.name}
        initialGraph={initialGraph}
      />
    </AppShell>
  );
}
