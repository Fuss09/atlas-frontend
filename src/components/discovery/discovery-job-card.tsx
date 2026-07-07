import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DiscoveryJobResponse } from "@/types";

const STATUS_VARIANT: Record<string, "success" | "danger" | "info" | "warning" | "default"> = {
  success: "success",
  failed: "danger",
  running: "info",
  partial: "warning",
  pending: "default",
};

export function DiscoveryJobCard({ job }: { job: DiscoveryJobResponse }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-body-sm font-medium capitalize text-foreground">{job.source}</p>
            <Badge variant={STATUS_VARIANT[job.status] ?? "default"} className="capitalize">
              {job.status}
            </Badge>
          </div>
          <p className="text-caption text-muted-foreground mt-1">
            Triggered {formatRelativeTime(job.created_at)}
          </p>
          {job.errors && job.errors.length > 0 && (
            <p className="text-caption text-danger mt-1">
              {job.errors.length} error{job.errors.length > 1 ? "s" : ""} encountered
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 text-caption text-muted-foreground shrink-0">
          <Stat label="Found" value={job.companies_found} />
          <Stat label="Created" value={job.companies_created} highlight />
          <Stat label="Updated" value={job.companies_updated} />
          <Stat label="Skipped" value={job.companies_skipped} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className={cn("font-mono font-medium tabular-nums", highlight ? "text-success" : "text-foreground")}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wide">{label}</p>
    </div>
  );
}
