import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { SinceLastVisit } from "@/components/dashboard/since-last-visit";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <AppShell breadcrumb={[{ label: "Dashboard" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8 space-y-8">
        <SinceLastVisit />
        <DashboardContent />
      </div>
    </AppShell>
  );
}
