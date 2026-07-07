import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ExplorerContent } from "@/components/explorer/explorer-content";

export const metadata: Metadata = {
  title: "Explorer",
};

export default function ExplorerPage() {
  return (
    <AppShell breadcrumb={[{ label: "Explorer" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <ExplorerContent />
      </div>
    </AppShell>
  );
}
