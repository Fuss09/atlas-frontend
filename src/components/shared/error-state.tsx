"use client";

import { AlertTriangle, RefreshCcw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * Renders a consistent error UI for any failed query across the app.
 * Distinguishes network errors from API errors for a clearer message.
 */
export function ErrorState({ error, onRetry, className, compact = false }: ErrorStateProps) {
  const isNetwork = error instanceof ApiError && error.code === "NETWORK_ERROR";
  const message =
    error instanceof ApiError ? error.message : "Something went wrong while loading this data.";

  const Icon = isNetwork ? WifiOff : AlertTriangle;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 text-body-sm text-muted-foreground py-4", className)}>
        <Icon className="h-4 w-4 text-danger shrink-0" />
        <span>{message}</span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="h-6 px-2">
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 px-6 text-center",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10">
        <Icon className="h-5 w-5 text-danger" />
      </div>
      <div className="space-y-1">
        <p className="text-body font-medium text-foreground">
          {isNetwork ? "Connection lost" : "Couldn't load this data"}
        </p>
        <p className="text-body-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCcw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
