"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Building2, Sparkles, Target, Activity, Waypoints, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { companiesApi, themesApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function CommandPaletteTrigger({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 text-body-sm text-muted-foreground transition-colors hover:border-border-subtle hover:bg-secondary",
          collapsed && "justify-center px-0",
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">Search</span>
            <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
          </>
        )}
      </button>
      <CommandPaletteDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function CommandPaletteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const router = useRouter();

  // Reset on close so re-opening never briefly flashes a stale query's results.
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const isSearching = debouncedQuery.trim().length > 1;

  const { data: companies, isFetching: companiesLoading } = useQuery({
    queryKey: ["cmdk", "companies", debouncedQuery],
    queryFn: () => companiesApi.list({ q: debouncedQuery, page: 1, page_size: 5 }),
    enabled: isSearching,
  });

  // Themes have no backend text-search endpoint (GET /themes only
  // filters by category/maturity_level) — but Atlas seeds a bounded set
  // of themes (a few dozen at most, by design of the product), so
  // fetching the full list once and filtering client-side is the right
  // tradeoff here. This does NOT generalize to companies, which can
  // reach tens of thousands of rows — that search always hits the
  // paginated, server-side ?q= endpoint above.
  const { data: allThemes, isFetching: themesLoading } = useQuery({
    queryKey: ["cmdk", "themes-all"],
    queryFn: () => themesApi.list(),
    enabled: isSearching,
    staleTime: 5 * 60 * 1000,
  });
  const themes = React.useMemo(() => {
    if (!allThemes || !isSearching) return [];
    const q = debouncedQuery.toLowerCase();
    return allThemes.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 5);
  }, [allThemes, debouncedQuery, isSearching]);

  const isLoading = isSearching && (companiesLoading || themesLoading);
  const hasResults = (companies?.items.length ?? 0) > 0 || themes.length > 0;

  const go = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 top-[20%] translate-y-0">
        <Command shouldFilter={false} className="overflow-hidden rounded-lg">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search companies, themes..."
              className="flex h-12 w-full bg-transparent py-3 text-body outline-none placeholder:text-muted-foreground"
            />
            {isLoading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
          </div>
          <Command.List className="max-h-96 overflow-y-auto p-2">
            {!isSearching ? (
              <div className="py-8 text-center text-body-sm text-muted-foreground">Type to search Atlas.</div>
            ) : isLoading && !hasResults ? (
              <div className="py-8 text-center text-body-sm text-muted-foreground">Searching…</div>
            ) : !hasResults ? (
              <Command.Empty className="py-8 text-center text-body-sm text-muted-foreground">
                No results found.
              </Command.Empty>
            ) : null}

            {companies && companies.items.length > 0 && (
              <Command.Group
                heading="Companies"
                className="px-2 py-1.5 text-caption font-medium text-muted-foreground [&_[cmdk-group-items]]:mt-1"
              >
                {companies.items.map((c) => (
                  <Command.Item
                    key={c.id}
                    onSelect={() => go(`/companies/${c.slug}`)}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm cursor-pointer aria-selected:bg-secondary"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate">{c.name}</span>
                    {c.ticker && (
                      <span className="text-caption font-mono text-muted-foreground shrink-0">{c.ticker}</span>
                    )}
                  </Command.Item>
                ))}
                {companies.total > companies.items.length && (
                  <Command.Item
                    onSelect={() => go(`/companies?q=${encodeURIComponent(debouncedQuery)}`)}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm cursor-pointer text-muted-foreground aria-selected:bg-secondary"
                  >
                    <Search className="h-4 w-4 shrink-0" />
                    See all {companies.total} results for &ldquo;{debouncedQuery}&rdquo;
                  </Command.Item>
                )}
              </Command.Group>
            )}

            {themes.length > 0 && (
              <Command.Group
                heading="Themes"
                className="px-2 py-1.5 text-caption font-medium text-muted-foreground [&_[cmdk-group-items]]:mt-1"
              >
                {themes.map((t) => (
                  <Command.Item
                    key={t.id}
                    onSelect={() => go(`/themes/${t.slug}`)}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm cursor-pointer aria-selected:bg-secondary"
                  >
                    <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate">{t.name}</span>
                    <span className="text-caption text-muted-foreground shrink-0">
                      {t.companies_count} {t.companies_count === 1 ? "company" : "companies"}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group
              heading="Jump to"
              className="px-2 py-1.5 text-caption font-medium text-muted-foreground [&_[cmdk-group-items]]:mt-1"
            >
              <Command.Item
                onSelect={() => go("/explorer")}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm cursor-pointer aria-selected:bg-secondary"
              >
                <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
                Explorer
              </Command.Item>
              <Command.Item
                onSelect={() => go("/opportunities")}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm cursor-pointer aria-selected:bg-secondary"
              >
                <Target className="h-4 w-4 text-muted-foreground shrink-0" />
                Opportunities
              </Command.Item>
              <Command.Item
                onSelect={() => go("/events")}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm cursor-pointer aria-selected:bg-secondary"
              >
                <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                Events
              </Command.Item>
              <Command.Item
                onSelect={() => go("/graph")}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm cursor-pointer aria-selected:bg-secondary"
              >
                <Waypoints className="h-4 w-4 text-muted-foreground shrink-0" />
                Graph
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
