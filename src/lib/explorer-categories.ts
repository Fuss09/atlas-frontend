import { Cpu, Bot, Rocket, Shield, Lock, Dna, Cloud, Zap, CircuitBoard, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ExplorerCategory {
  slug: string;
  label: string;
  themeSlug: string;
  icon: LucideIcon;
  accent: string;
}

/**
 * The 10 discovery categories from the validated Explorer spec, mapped
 * onto the Theme slugs seeded by Module 03's migration — so each tile
 * links directly to a real, populated theme page.
 */
export const EXPLORER_CATEGORIES: ExplorerCategory[] = [
  { slug: "ai", label: "AI", themeSlug: "artificial-intelligence", icon: Cpu, accent: "#6366F1" },
  { slug: "robotics", label: "Robotics", themeSlug: "robotics-automation", icon: Bot, accent: "#A855F7" },
  { slug: "space", label: "Space", themeSlug: "space", icon: Rocket, accent: "#0EA5E9" },
  { slug: "defense", label: "Defense", themeSlug: "defense-aerospace", icon: Shield, accent: "#64748B" },
  { slug: "cybersecurity", label: "Cybersecurity", themeSlug: "cybersecurity", icon: Lock, accent: "#EF4444" },
  { slug: "biotech", label: "Biotech", themeSlug: "biotechnology", icon: Dna, accent: "#10B981" },
  { slug: "cloud", label: "Cloud", themeSlug: "cloud-computing", icon: Cloud, accent: "#3B82F6" },
  { slug: "quantum", label: "Quantum", themeSlug: "quantum-computing", icon: Zap, accent: "#8B5CF6" },
  { slug: "energy", label: "Energy", themeSlug: "energy-transition", icon: Flame, accent: "#22C55E" },
  { slug: "semiconductors", label: "Semiconductors", themeSlug: "semiconductors", icon: CircuitBoard, accent: "#F59E0B" },
];
