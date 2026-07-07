"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-config";
import { CommandPaletteTrigger } from "@/components/layout/command-palette";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const COLLAPSE_STORAGE_KEY = "atlas_sidebar_collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200",
        collapsed ? "w-16" : "w-[220px]",
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-14 items-center border-b border-border-subtle", collapsed ? "justify-center px-0" : "px-4")}>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-h3 tracking-tight">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-caption font-bold">
            A
          </div>
          {!collapsed && <span>Atlas</span>}
        </Link>
      </div>

      {/* Search trigger */}
      <div className={cn("py-3", collapsed ? "px-2" : "px-3")}>
        <CommandPaletteTrigger collapsed={collapsed} />
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          const link = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-body-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2.25 : 2} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (collapsed && mounted) {
            return (
              <Tooltip key={item.href} delayDuration={200}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return <React.Fragment key={item.href}>{link}</React.Fragment>;
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border-subtle p-2">
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-body-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
            collapsed && "justify-center px-0",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
