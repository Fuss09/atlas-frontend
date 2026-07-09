import { ThemeCard } from "@/components/theme/theme-card";
import type { ThemeListItem } from "@/types";

export function GroupedThemes({ themes }: { themes: ThemeListItem[] }) {
  const groups = new Map<string, ThemeListItem[]>();
  for (const theme of themes) {
    const key = theme.category ?? "Other";
    const list = groups.get(key) ?? [];
    list.push(theme);
    groups.set(key, list);
  }

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-h2 mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} variant="list" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
