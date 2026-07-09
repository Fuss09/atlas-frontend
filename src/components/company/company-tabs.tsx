"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompanyTabsProps {
  overview: React.ReactNode;
  events: React.ReactNode;
  themes: React.ReactNode;
  relations: React.ReactNode;
  sources: React.ReactNode;
}

/**
 * Thin client boundary around Radix Tabs so the active tab can be
 * controlled — specifically so "See all events" / "See all sources"
 * links inside the (server-rendered) Overview tab can jump straight to
 * the right tab instead of a dead `href="#events"` anchor, which Radix
 * Tabs doesn't respond to.
 *
 * All five tab bodies are passed in as props from the Server Component
 * tree in company-page-content.tsx, so this wrapper adds zero
 * client-side data fetching of its own — only UI state.
 */
export function CompanyTabs({ overview, events, themes, relations, sources }: CompanyTabsProps) {
  const [active, setActive] = React.useState("overview");
  const [visited, setVisited] = React.useState<Set<string>>(new Set(["overview"]));

  const switchTab = React.useCallback((tab: string) => {
    setActive(tab);
    setVisited((prev) => (prev.has(tab) ? prev : new Set(prev).add(tab)));
  }, []);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-tab-switch]");
      if (target) {
        e.preventDefault();
        const tab = target.getAttribute("data-tab-switch");
        if (tab) switchTab(tab);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [switchTab]);

  return (
    <Tabs value={active} onValueChange={switchTab}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="themes">Themes</TabsTrigger>
        <TabsTrigger value="relations">Relations</TabsTrigger>
        <TabsTrigger value="sources">Sources</TabsTrigger>
      </TabsList>

      {/* Radix TabsContent unmounts inactive panels by default, which
          would discard EventsTab's pagination state (or re-trigger
          RelationsTab's graph fetch) every time the user switches away
          and back. Instead: mount a tab body the first time it's
          visited, then keep it alive — visibility toggles with a class,
          but only tabs the user has actually opened do any fetching. */}
      <div className="mt-4">
        <div className={active === "overview" ? "block animate-fade-in" : "hidden"}>{overview}</div>
        {visited.has("events") && (
          <div className={active === "events" ? "block animate-fade-in" : "hidden"}>{events}</div>
        )}
        {visited.has("themes") && (
          <div className={active === "themes" ? "block animate-fade-in" : "hidden"}>{themes}</div>
        )}
        {visited.has("relations") && (
          <div className={active === "relations" ? "block animate-fade-in" : "hidden"}>{relations}</div>
        )}
        {visited.has("sources") && (
          <div className={active === "sources" ? "block animate-fade-in" : "hidden"}>{sources}</div>
        )}
      </div>
    </Tabs>
  );
}
