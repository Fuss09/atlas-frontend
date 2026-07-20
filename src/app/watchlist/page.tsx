import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { WatchlistContent } from "@/components/watchlist/watchlist-content";

export const metadata: Metadata = {
  title: "Watchlist",
};

export default function WatchlistPage() {
  return (
    <AppShell breadcrumb={[{ label: "Watchlist" }]}>
      <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-6 md:py-8 space-y-6">
        <div>
          <h1 className="text-h1 mb-1">Watchlist</h1>
          <p className="text-body-sm text-muted-foreground">
            Companies you follow — starred from anywhere in Atlas.
          </p>
        </div>
        <WatchlistContent />
      </div>
    </AppShell>
  );
}
