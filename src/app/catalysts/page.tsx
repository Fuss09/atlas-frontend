import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CatalystsTimeline } from "@/components/catalyst/catalysts-timeline";

export const metadata: Metadata = {
  title: "Catalysts",
};

export default function CatalystsPage() {
  return (
    <AppShell breadcrumb={[{ label: "Catalysts" }]}>
      <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-6 md:py-8 space-y-6">
        <div>
          <h1 className="text-h1 mb-1">Catalysts</h1>
          <p className="text-body-sm text-muted-foreground">
            Known future events that could move a company — clinical readouts,
            earnings, regulatory decisions. Dates shown at their real precision.
          </p>
        </div>
        <CatalystsTimeline />
      </div>
    </AppShell>
  );
}
