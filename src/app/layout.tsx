import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: {
    default: "Atlas — Market Intelligence",
    template: "%s · Atlas",
  },
  description:
    "Atlas helps investors discover emerging companies and understand why an opportunity matters — before it becomes obvious.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider delayDuration={300}>
              <ToastProvider>{children}</ToastProvider>
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
