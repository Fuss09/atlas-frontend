import {
  LayoutDashboard,
  Building2,
  Sparkles,
  Target,
  Star,
  Activity,
  Compass,
  Waypoints,
  Radar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explorer", href: "/explorer", icon: Compass },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Themes", href: "/themes", icon: Sparkles },
  { label: "Opportunities", href: "/opportunities", icon: Target },
  { label: "Watchlist", href: "/watchlist", icon: Star },
  { label: "Events", href: "/events", icon: Activity },
  { label: "Graph", href: "/graph", icon: Waypoints },
  { label: "Discovery", href: "/discovery", icon: Radar },
];
