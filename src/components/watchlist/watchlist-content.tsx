"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { CompanyCard } from "@/components/company/company-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/hooks/use-watchlist";

/**
 * Client component: the watchlist is the most mutation-heavy view in the
 * app (stars toggle from every page), so it reads from the same React
 * Query cache the buttons write to — removals here or anywhere else are
 * reflected without a reload.
 */
export function WatchlistContent() {
  const { data, isLoading, isError } = useWatchlist();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-body font-medium text-foreground">Couldn&apos;t load your watchlist</p>
          <p className="text-body-sm text-muted-foreground">The backend may be unreachable. Try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Star className="h-8 w-8 text-muted-foreground" />
          <p className="text-body font-medium text-foreground">Your watchlist is empty</p>
          <p className="max-w-md text-body-sm text-muted-foreground">
            Star any company to follow it here. The star button lives on every company card and page header.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/companies">Browse companies</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-body-sm text-muted-foreground">
        {data.length} {data.length === 1 ? "company" : "companies"} watched
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <CompanyCard key={item.id} company={item.company} />
        ))}
      </div>
    </div>
  );
}
