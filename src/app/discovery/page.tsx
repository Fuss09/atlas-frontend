import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { DiscoveryContent } from "@/components/discovery/discovery-content";

export const metadata: Metadata = {
  title: "Discovery",
};

export default function DiscoveryPage() {
  return (
    <AppShell breadcrumb={[{ label: "Discovery" }]}>
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-6 md:py-8">
        <DiscoveryContent />
      </div>
    </AppShell>
  );
}
