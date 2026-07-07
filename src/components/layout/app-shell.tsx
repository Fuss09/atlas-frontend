"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/mobile-nav";
import type { BreadcrumbItem } from "@/components/layout/breadcrumb";
import { ErrorBoundary } from "@/components/shared/error-boundary";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
}

export function AppShell({ children, breadcrumb }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
