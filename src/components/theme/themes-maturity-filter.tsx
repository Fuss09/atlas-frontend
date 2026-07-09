"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { MaturityLevel } from "@/types";

const MATURITY_FILTERS: Array<{ value: MaturityLevel | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "emerging", label: "Emerging" },
  { value: "growth", label: "Growth" },
  { value: "mature", label: "Mature" },
];

export function ThemesMaturityFilter({ active }: { active?: MaturityLevel }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {MATURITY_FILTERS.map((f) => {
        const isActive = f.value === "all" ? !active : active === f.value;
        return (
          <button
            key={f.value}
            onClick={() => router.push(f.value === "all" ? pathname : `${pathname}?maturity=${f.value}`)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-body-sm font-medium transition-colors",
              isActive
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
