import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CompaniesExplorer } from "@/components/company/companies-explorer";

export const metadata: Metadata = {
  title: "Companies",
};

export default function CompaniesPage() {
  return (
    <AppShell breadcrumb={[{ label: "Companies" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <CompaniesExplorer />
      </div>
    </AppShell>
  );
}
