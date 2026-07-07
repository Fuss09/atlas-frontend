"use client";

import { useDiscoverySources, useDiscoveryJobs, useTriggerDiscoveryJob } from "@/hooks/use-discovery";
import { useToast } from "@/components/providers/toast-provider";
import { DiscoveryJobCard } from "@/components/discovery/discovery-job-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Radar, Play } from "lucide-react";

export function DiscoveryContent() {
  const { data: sources, isLoading: sourcesLoading } = useDiscoverySources();
  const { data: jobs, isLoading: jobsLoading, error, refetch } = useDiscoveryJobs();
  const trigger = useTriggerDiscoveryJob();
  const { toast } = useToast();

  const handleTrigger = (source: string) => {
    trigger.mutate(
      { source },
      {
        onSuccess: () => toast({ title: "Job triggered", description: `${source} collector is now running.` }),
        onError: (err) =>
          toast({ title: "Failed to trigger job", description: (err as Error).message, variant: "destructive" }),
      },
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1 mb-1">Discovery</h1>
        <p className="text-body-sm text-muted-foreground">
          Collectors that automatically find and enrich companies across Atlas.
        </p>
      </div>

      <section>
        <h2 className="text-h2 mb-3">Sources</h2>
        {sourcesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sources?.map((source) => (
              <Card key={source.source}>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm font-medium capitalize text-foreground">{source.source}</span>
                    <Badge variant={source.implemented ? "success" : "outline"}>
                      {source.implemented ? "Active" : "Planned"}
                    </Badge>
                  </div>
                  {source.implemented && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="self-start"
                      disabled={trigger.isPending}
                      onClick={() => handleTrigger(source.source)}
                    >
                      <Play className="h-3 w-3" />
                      Run now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-h2 mb-3">Recent Jobs</h2>
        {jobsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : !jobs || jobs.length === 0 ? (
          <EmptyState icon={Radar} title="No discovery jobs yet" description="Trigger a collector above to get started." />
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <DiscoveryJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
