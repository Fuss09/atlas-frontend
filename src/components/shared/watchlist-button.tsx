"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToggleWatchlist, useWatchlistIds } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  companyId: string;
  /** @deprecated state now comes from the watchlist cache; kept for call-site compatibility. */
  isWatched?: boolean;
  size?: "sm" | "default" | "icon";
  className?: string;
}

/**
 * Star toggle backed by the real Watchlist module (Sprint 7).
 *
 * State comes from the shared `watchlist/ids` cache — one request for the
 * whole page, every star derives its own state from the same set, so all
 * instances of the same company stay in sync. Toggling is optimistic: the
 * star flips instantly, and rolls back if the request fails.
 */
export function WatchlistButton({ companyId, size = "icon", className }: WatchlistButtonProps) {
  const { ids } = useWatchlistIds();
  const toggle = useToggleWatchlist();
  const watched = ids.has(companyId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle.mutate({ companyId, watched });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          onClick={handleToggle}
          aria-pressed={watched}
          aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
          className={cn("text-muted-foreground hover:text-warning", watched && "text-warning", className)}
        >
          <Star className={cn("h-4 w-4", watched && "fill-current")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {watched ? "Remove from watchlist" : "Add to watchlist"}
      </TooltipContent>
    </Tooltip>
  );
}
