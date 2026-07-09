import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { FreeGraphExplorer } from "@/components/graph/free-graph-explorer";

export const metadata: Metadata = {
  title: "Graph",
};

export default function GraphPage() {
  return (
    <AppShell breadcrumb={[{ label: "Graph" }]}>
      <FreeGraphExplorer />
    </AppShell>
  );
}
