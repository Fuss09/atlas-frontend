import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { EventsExplorer } from "@/components/event/events-explorer";

export const metadata: Metadata = {
  title: "Events",
};

export default function EventsPage() {
  return (
    <AppShell breadcrumb={[{ label: "Events" }]}>
      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-6 md:py-8">
        <EventsExplorer />
      </div>
    </AppShell>
  );
}
