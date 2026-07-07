import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CompanyPageContent } from "@/components/company/company-page-content";

export const metadata: Metadata = {
  title: "Company",
};

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <AppShell breadcrumb={[{ label: "Companies", href: "/companies" }, { label: slug }]}>
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
        <CompanyPageContent slug={slug} />
      </div>
    </AppShell>
  );
}
