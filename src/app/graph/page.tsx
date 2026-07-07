import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { GraphExplorer } from "@/components/graph/graph-explorer";

export const metadata: Metadata = {
  title: "Graph",
};

export default function GraphPage() {
  return (
    <AppShell breadcrumb={[{ label: "Graph" }]}>
      <GraphExplorer />
    </AppShell>
  );
}
