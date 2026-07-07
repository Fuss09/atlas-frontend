"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  count?: number;
  className?: string;
}

/**
 * Notification bell in the header.
 *
 * Feature placeholder: no notifications backend exists yet.
 * Renders the bell with an optional unread-count dot so the header
 * layout is final — wiring a real dropdown/feed later is additive,
 * not a redesign.
 */
export function NotificationBell({ count = 0, className }: NotificationBellProps) {
  const hasUnread = count > 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative text-muted-foreground hover:text-foreground", className)}
          aria-label={hasUnread ? `${count} unread notifications` : "Notifications"}
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Notifications</TooltipContent>
    </Tooltip>
  );
}
