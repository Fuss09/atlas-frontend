import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Atlas Insight — reserved slot for AI-generated company analysis.
 *
 * Feature placeholder: no AI analysis pipeline exists yet (planned for
 * a future Intelligence module). This block establishes the permanent
 * location and visual identity for that feature on the Company Page,
 * so its future arrival requires no layout changes.
 */
export function AtlasInsight() {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle>Atlas Insight</CardTitle>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          Coming soon
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-body-sm text-muted-foreground leading-relaxed">
          Atlas Insight will surface AI-generated analysis for this company — synthesizing
          recent events, theme momentum, and relational signals into a clear narrative,
          always sourced back to the underlying data. No black boxes, ever.
        </p>
      </CardContent>
    </Card>
  );
}
