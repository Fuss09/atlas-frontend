import { Info } from "lucide-react";

/**
 * Explains how the Opportunity Score is composed. Uses a native
 * <details>/<summary> disclosure rather than client-side React state —
 * this is purely presentational, so there's no reason to ship JS for it.
 */
export function ScoreExplainerBanner() {
  return (
    <details className="group rounded-lg border border-border-subtle bg-surface">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-sm text-muted-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        <Info className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1">
          Score computed from 5 components: Events, Theme Strength, Company Quality, Discovery Signals,
          Market Signals (soon).
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="px-4 pb-4 text-body-sm text-muted-foreground leading-relaxed border-t border-border-subtle">
        <p className="pt-3">
          Every Opportunity Score breaks down into five weighted components. Each company page shows
          the full breakdown along with the specific positive and negative factors that drove the
          number — nothing is a black box. Market Signals is a reserved component, not yet connected
          to live pricing data.
        </p>
      </div>
    </details>
  );
}
