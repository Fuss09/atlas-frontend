import Link from "next/link";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

/**
 * Triggered by CompanyPageContent's notFound() call when a slug doesn't
 * match any company. Keeps the full AppShell (sidebar, header, search)
 * rather than falling back to the bare global not-found.tsx — a dead
 * link shouldn't strand the user without navigation.
 */
export default function CompanyNotFound() {
  return (
    <AppShell breadcrumb={[{ label: "Companies", href: "/companies" }, { label: "Not Found" }]}>
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
        <EmptyState
          icon={Search}
          title="Company not found"
          description="This company doesn't exist in Atlas, or the link may be out of date."
          action={
            <Button asChild className="mt-1">
              <Link href="/companies">Browse all companies</Link>
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
