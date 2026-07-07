import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsContent } from "@/components/settings/settings-content";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <AppShell breadcrumb={[{ label: "Settings" }]}>
      <div className="mx-auto max-w-[700px] px-4 py-6 md:px-6 md:py-8">
        <SettingsContent />
      </div>
    </AppShell>
  );
}
