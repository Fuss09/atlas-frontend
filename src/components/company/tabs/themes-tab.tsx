import { Sparkles } from "lucide-react";
import { ThemeCard } from "@/components/theme/theme-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ThemeListItem } from "@/types";

interface ThemesTabProps {
  themes: ThemeListItem[];
}

export function ThemesTab({ themes }: ThemesTabProps) {
  if (themes.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Not part of any theme yet"
        description="Themes group companies by investment trend — AI, Robotics, Space, and more."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} variant="list" />
      ))}
    </div>
  );
}
