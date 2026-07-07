import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CompanyGraphView } from "@/components/graph/company-graph-view";

export const metadata: Metadata = {
  title: "Relationship Graph",
};

export default async function CompanyGraphPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <AppShell
      breadcrumb={[
        { label: "Companies", href: "/companies" },
        { label: slug, href: `/companies/${slug}` },
        { label: "Graph" },
      ]}
    >
      <CompanyGraphView slug={slug} />
    </AppShell>
  );
}
