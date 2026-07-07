import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ThemePageContent } from "@/components/theme/theme-page-content";

export const metadata: Metadata = {
  title: "Theme",
};

export default async function ThemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <AppShell breadcrumb={[{ label: "Themes", href: "/themes" }, { label: slug }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <ThemePageContent slug={slug} />
      </div>
    </AppShell>
  );
}
