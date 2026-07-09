"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompaniesPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

/**
 * Windowed pagination: even with tens of thousands of companies (and
 * therefore thousands of pages), this never renders more than ~7 page
 * buttons — no performance cliff as `totalPages` grows.
 */
export function CompaniesPagination({ currentPage, totalPages, className }: CompaniesPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    router.push(`${pathname}?${next.toString()}`, { scroll: true });
  };

  const pages = buildPageWindow(currentPage, totalPages);

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-body-sm">
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => goToPage(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className="font-mono"
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

function buildPageWindow(current: number, total: number): Array<number | "ellipsis"> {
  const windowSize = 1;
  const pages = new Set<number>([1, total, current]);
  for (let i = 1; i <= windowSize; i++) {
    if (current - i >= 1) pages.add(current - i);
    if (current + i <= total) pages.add(current + i);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(sorted[i]);
  }
  return result;
}
