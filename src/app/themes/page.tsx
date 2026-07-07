import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ThemesExplorer } from "@/components/theme/themes-explorer";

export const metadata: Metadata = {
  title: "Themes",
};

export default function ThemesPage() {
  return (
    <AppShell breadcrumb={[{ label: "Themes" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <ThemesExplorer />
      </div>
    </AppShell>
  );
}
