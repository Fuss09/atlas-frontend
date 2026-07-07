import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center bg-background">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Compass className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-h2 text-foreground">Page not found</p>
        <p className="text-body-sm text-muted-foreground max-w-sm">
          This page doesn&apos;t exist in Atlas, or may have moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
