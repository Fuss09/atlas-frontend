import { Radar } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Sprint 1: structural placeholder. The Discovery Sources endpoint
 * (GET /companies/{id}/sources, Module 04) will be wired in a follow-up
 * sprint alongside the Discovery page data layer.
 */
export function SourcesTab() {
  return (
    <Card>
      <CardContent className="p-0">
        <EmptyState
          icon={Radar}
          title="Source history coming soon"
          description="This tab will show when and how Atlas discovered or enriched this company — SEC, GitHub, Y Combinator, and more."
          className="border-none py-16"
        />
      </CardContent>
    </Card>
  );
}
