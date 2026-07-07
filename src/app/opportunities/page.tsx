import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { OpportunitiesExplorer } from "@/components/opportunity/opportunities-explorer";

export const metadata: Metadata = {
  title: "Opportunities",
};

export default function OpportunitiesPage() {
  return (
    <AppShell breadcrumb={[{ label: "Opportunities" }]}>
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-6 md:py-8">
        <OpportunitiesExplorer />
      </div>
    </AppShell>
  );
}
