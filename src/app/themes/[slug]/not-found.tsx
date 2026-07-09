import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function ThemeNotFound() {
  return (
    <AppShell breadcrumb={[{ label: "Themes", href: "/themes" }, { label: "Not Found" }]}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <EmptyState
          icon={Sparkles}
          title="Theme not found"
          description="This theme doesn't exist in Atlas, or the link may be out of date."
          action={
            <Button asChild className="mt-1">
              <Link href="/themes">Browse all themes</Link>
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
