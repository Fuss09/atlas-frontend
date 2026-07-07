"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Atlas route error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
            <AlertOctagon className="h-6 w-6 text-danger" />
          </div>
          <div className="space-y-1">
            <p className="text-h2 text-foreground">Something went wrong</p>
            <p className="text-body-sm text-muted-foreground max-w-sm">
              Atlas hit an unexpected error loading this page.
            </p>
          </div>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
