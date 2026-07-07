"use client";

import { useCompanyBySlug } from "@/hooks/use-companies";
import { useCompanyOpportunity } from "@/hooks/use-opportunities";
import { useCompanyEvents } from "@/hooks/use-events";
import { useCompanyThemes } from "@/hooks/use-themes";
import { CompanyHeader } from "@/components/company/company-header";
import { StatBar } from "@/components/company/stat-bar";
import { OverviewTab } from "@/components/company/tabs/overview-tab";
import { EventsTab } from "@/components/company/tabs/events-tab";
import { ThemesTab } from "@/components/company/tabs/themes-tab";
import { RelationsTab } from "@/components/company/tabs/relations-tab";
import { SourcesTab } from "@/components/company/tabs/sources-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";

export function CompanyPageContent({ slug }: { slug: string }) {
  const { data: company, isLoading, error, refetch } = useCompanyBySlug(slug);
  const { data: opportunity } = useCompanyOpportunity(company?.id);
  const { data: recentEvents } = useCompanyEvents(company?.id, 1);
  const { data: themes } = useCompanyThemes(company?.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-14 w-14 rounded-md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !company) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <CompanyHeader company={company} opportunity={opportunity} />
      <StatBar company={company} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events" id="events">
            Events
          </TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            company={company}
            opportunity={opportunity}
            recentEvents={recentEvents?.items}
            themes={themes}
          />
        </TabsContent>

        <TabsContent value="events">
          <EventsTab companyId={company.id} />
        </TabsContent>

        <TabsContent value="themes">
          <ThemesTab companyId={company.id} />
        </TabsContent>

        <TabsContent value="relations">
          <RelationsTab companyId={company.id} companySlug={company.slug} />
        </TabsContent>

        <TabsContent value="sources">
          <SourcesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
