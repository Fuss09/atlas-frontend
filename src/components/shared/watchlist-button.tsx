"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  companyId: string;
  isWatched?: boolean;
  size?: "sm" | "default" | "icon";
  className?: string;
}

/**
 * Star toggle to add/remove a company from the watchlist.
 *
 * Feature placeholder: no backend endpoint exists yet for watchlists.
 * The button is fully wired for UI state and interaction so it can be
 * connected to a real mutation the moment the Watchlist module ships —
 * no visual or layout changes will be required at that point.
 */
export function WatchlistButton({ companyId: _companyId, isWatched = false, size = "icon", className }: WatchlistButtonProps) {
  const [watched, setWatched] = React.useState(isWatched);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO(watchlist-module): persist via POST /watchlist when the endpoint ships.
    setWatched((prev) => !prev);
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
      <TooltipContent>{watched ? "Remove from watchlist" : "Add to watchlist"}</TooltipContent>
    </Tooltip>
  );
}
