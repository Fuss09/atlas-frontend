"use client";

import { NotificationBell } from "@/components/shared/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { BreadcrumbItem } from "@/components/layout/breadcrumb";
import { Breadcrumb } from "@/components/layout/breadcrumb";

interface HeaderProps {
  breadcrumb?: BreadcrumbItem[];
}

export function Header({ breadcrumb }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav />
        {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} className="truncate" />}
      </div>
      <div className="flex items-center gap-1">
        <NotificationBell count={0} />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
