import { Github, Landmark, Rocket, Database, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCE_META: Record<string, { label: string; icon: LucideIcon }> = {
  sec: { label: "SEC EDGAR", icon: Landmark },
  github: { label: "GitHub", icon: Github },
  ycombinator: { label: "Y Combinator", icon: Rocket },
  crunchbase: { label: "Crunchbase", icon: Database },
  fda: { label: "FDA", icon: Landmark },
  uspto: { label: "USPTO", icon: Landmark },
  arxiv: { label: "arXiv", icon: Database },
  huggingface: { label: "Hugging Face", icon: Database },
  producthunt: { label: "Product Hunt", icon: Rocket },
  appstore: { label: "App Store", icon: Database },
  googleplay: { label: "Google Play", icon: Database },
  pitchbook: { label: "PitchBook", icon: Database },
  manual: { label: "Manual entry", icon: Database },
};

interface SourceBadgeProps {
  source: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Renders a discovery source (sec, github, ycombinator, ...) with a
 * consistent icon + human label everywhere it appears — Sources tab,
 * Discovery page, and any future component that needs to attribute
 * data to its origin.
 */
export function SourceBadge({ source, className, iconClassName }: SourceBadgeProps) {
  const meta = SOURCE_META[source] ?? { label: source, icon: Database };
  const Icon = meta.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Icon className={cn("h-3.5 w-3.5 text-muted-foreground", iconClassName)} />
      {meta.label}
    </span>
  );
}

export function sourceLabel(source: string): string {
  return SOURCE_META[source]?.label ?? source;
}
